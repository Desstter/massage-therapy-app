import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { Layers3, Maximize2, MousePointer2, Rotate3D } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MUSCLES } from '../../../data/muscles'
import { MUSCLE_MODELS } from '../../../data/muscleModels'
import { useAnatomyStore } from '../../../store/anatomyStore'
import { loc } from '../../../utils/localize'
import { cn } from '../../../utils/cn'
import type { BodyLayer } from '../../../types/app.types'

interface Anatomy3DViewerProps {
  side: 'anterior' | 'posterior'
}

interface HoverLabel {
  x: number
  y: number
  muscleId: string
}

type LayerMode = 'all' | BodyLayer

const BASE_COLORS: Record<BodyLayer, THREE.ColorRepresentation> = {
  superficial: '#b94f43',
  intermediate: '#a5414c',
  deep: '#71364d',
}

const ACTIVE_COLOR = new THREE.Color('#ffb11b')
const HOVER_COLOR = new THREE.Color('#e87957')

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

/**
 * BodyParts3D derivatives are not all exported in the same source frame:
 * most meshes are already Y-up, while a few structures remain Z-up. Detect
 * the vertical axis from their atlas-space bounds before applying the shared
 * scene rotation so every structure keeps its anatomical registration.
 */
function alignAtlasGeometry(mesh: THREE.Mesh, geometry: THREE.BufferGeometry) {
  geometry.computeBoundingBox()
  const center = geometry.boundingBox?.getCenter(new THREE.Vector3())
  if (!center) return

  const isSourceZUp = Math.abs(center.z) > Math.abs(center.y)
  mesh.rotation.x = isSourceZUp ? 0 : -Math.PI / 2
}

export function Anatomy3DViewer({ side }: Anatomy3DViewerProps) {
  const { i18n } = useTranslation()
  const lang = i18n.language as 'en' | 'es'
  const mountRef = useRef<HTMLDivElement>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const initialLangRef = useRef(lang)
  const initialSideRef = useRef(side)
  const meshMapRef = useRef(new Map<string, THREE.Mesh[]>())
  const allMeshesRef = useRef<THREE.Mesh[]>([])
  const contextMeshesRef = useRef<THREE.Mesh[]>([])
  const cameraFrameRef = useRef<number | null>(null)

  const {
    selectedMuscleId,
    hoveredMuscleId,
    selectMuscle,
    setHoveredMuscle,
  } = useAnatomyStore()

  const [loadProgress, setLoadProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const [failedCount, setFailedCount] = useState(0)
  const [hoverLabel, setHoverLabel] = useState<HoverLabel | null>(null)
  const [layerMode, setLayerMode] = useState<LayerMode>('all')
  const [isolate, setIsolate] = useState(false)

  const muscleById = useMemo(() => new Map(MUSCLES.map((muscle) => [muscle.id, muscle])), [])

  const setCameraView = useCallback((nextSide: 'anterior' | 'posterior', immediate = false) => {
    const camera = cameraRef.current
    const controls = controlsRef.current
    if (!camera || !controls) return

    if (cameraFrameRef.current) cancelAnimationFrame(cameraFrameRef.current)
    const start = camera.position.clone()
    const distance = Math.max(start.length(), 17.5)
    // BodyParts3D's anterior surface faces the positive Three.js Z axis after normalization.
    const destination = new THREE.Vector3(0, 0.15, nextSide === 'anterior' ? distance : -distance)

    if (immediate) {
      camera.position.copy(destination)
      controls.target.set(0, 0, 0)
      controls.update()
      return
    }

    const startedAt = performance.now()
    const animateCamera = (now: number) => {
      const t = Math.min((now - startedAt) / 620, 1)
      camera.position.lerpVectors(start, destination, easeInOut(t))
      camera.lookAt(controls.target)
      controls.update()
      if (t < 1) cameraFrameRef.current = requestAnimationFrame(animateCamera)
    }
    cameraFrameRef.current = requestAnimationFrame(animateCamera)
  }, [])

  useEffect(() => {
    setCameraView(side)
  }, [side, setCameraView])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const meshMap = meshMapRef.current
    scene.fog = new THREE.FogExp2('#09101a', 0.032)

    const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 100)
    camera.position.set(0, 0.15, 17.5)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.AgXToneMapping
    renderer.toneMappingExposure = 1.12
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.domElement.setAttribute('aria-label', initialLangRef.current === 'es' ? 'Modelo anatómico muscular 3D interactivo' : 'Interactive 3D muscular anatomy model')
    mount.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.075
    controls.enablePan = false
    controls.minDistance = 5.2
    controls.maxDistance = 23
    controls.rotateSpeed = 0.65
    controls.zoomSpeed = 0.75
    controls.target.set(0, 0, 0)
    controlsRef.current = controls

    scene.add(new THREE.HemisphereLight('#d6e8ff', '#381b18', 1.9))
    const keyLight = new THREE.DirectionalLight('#fff2e4', 3.4)
    keyLight.position.set(-4, 5, -5)
    keyLight.castShadow = true
    scene.add(keyLight)
    const rimLight = new THREE.DirectionalLight('#5ea8c9', 2.2)
    rimLight.position.set(4, 2, 5)
    scene.add(rimLight)
    const fillLight = new THREE.DirectionalLight('#ff7f64', 1.0)
    fillLight.position.set(0, -2, -4)
    scene.add(fillLight)

    const bodyRoot = new THREE.Group()
    const modelGroup = new THREE.Group()
    bodyRoot.add(modelGroup)
    scene.add(bodyRoot)

    const plyLoader = new PLYLoader()
    let completed = 0
    let failed = 0
    const loadPromises: Promise<void>[] = []
    const totalModelLoads = MUSCLE_MODELS.length + 2

    MUSCLE_MODELS.forEach(({ muscleId, structures }) => {
      const layer = muscleById.get(muscleId)?.layer ?? 'superficial'
      loadPromises.push(new Promise<void>((resolve) => {
        plyLoader.load(
          `/anatomy/clinical/${muscleId}.ply`,
          (loadedGeometry) => {
            const geometry = mergeVertices(loadedGeometry, 0.0001)
            geometry.computeVertexNormals()
            const material = new THREE.MeshPhysicalMaterial({
              color: BASE_COLORS[layer],
              roughness: 0.62,
              metalness: 0,
              clearcoat: 0.16,
              clearcoatRoughness: 0.72,
              side: THREE.DoubleSide,
            })
            const mesh = new THREE.Mesh(geometry, material)
            alignAtlasGeometry(mesh, geometry)
            mesh.castShadow = true
            mesh.receiveShadow = true
            mesh.userData.muscleId = muscleId
            mesh.userData.layer = layer
            mesh.userData.structureCount = structures.length
            meshMap.set(muscleId, [mesh])
            allMeshesRef.current.push(mesh)
            modelGroup.add(mesh)
            completed += 1
            setLoadProgress(Math.round((completed / totalModelLoads) * 100))
            resolve()
          },
          undefined,
          () => {
            failed += 1
            completed += 1
            setFailedCount(failed)
            setLoadProgress(Math.round((completed / totalModelLoads) * 100))
            resolve()
          },
        )
      }))
    })

    const queueContextModel = (path: string) => loadPromises.push(new Promise<void>((resolve) => {
      plyLoader.load(
        path,
        (loadedGeometry) => {
          const geometry = mergeVertices(loadedGeometry, 0.0001)
          geometry.computeVertexNormals()
          const material = new THREE.MeshPhysicalMaterial({
            color: '#8d3f3b',
            roughness: 0.72,
            clearcoat: 0.08,
            clearcoatRoughness: 0.8,
            side: THREE.DoubleSide,
          })
          const contextMesh = new THREE.Mesh(geometry, material)
          alignAtlasGeometry(contextMesh, geometry)
          contextMesh.castShadow = true
          contextMesh.receiveShadow = true
          contextMeshesRef.current.push(contextMesh)
          modelGroup.add(contextMesh)
          completed += 1
          setLoadProgress(Math.round((completed / totalModelLoads) * 100))
          resolve()
        },
        undefined,
        () => {
          failed += 1
          completed += 1
          setFailedCount(failed)
          setLoadProgress(Math.round((completed / totalModelLoads) * 100))
          resolve()
        },
      )
    }))
    queueContextModel('/anatomy/models/context-muscles.ply')
    queueContextModel('/anatomy/models/context-face.ply')

    Promise.all(loadPromises).then(() => {
      if (!modelGroup.children.length) return

      // Convert the now-aligned atlas frame into the Y-up web scene, then
      // normalize it without changing the relative position of any structure.
      modelGroup.rotation.x = -Math.PI / 2
      modelGroup.updateMatrixWorld(true)
      const firstBox = new THREE.Box3().setFromObject(modelGroup)
      const firstSize = firstBox.getSize(new THREE.Vector3())
      const scale = 5.65 / firstSize.y
      modelGroup.scale.setScalar(scale)
      modelGroup.updateMatrixWorld(true)
      const box = new THREE.Box3().setFromObject(modelGroup)
      const center = box.getCenter(new THREE.Vector3())
      bodyRoot.position.sub(center)
      bodyRoot.updateMatrixWorld(true)
      setReady(true)
      setCameraView(initialSideRef.current, true)
    })

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let lastHoveredId: string | null = null

    const getHit = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      return raycaster.intersectObjects(allMeshesRef.current, false).find((hit) => hit.object.visible)
    }

    const onPointerMove = (event: PointerEvent) => {
      const hit = getHit(event)
      const muscleId = (hit?.object.userData.muscleId as string | undefined) ?? null
      if (muscleId !== lastHoveredId) {
        lastHoveredId = muscleId
        setHoveredMuscle(muscleId)
      }
      renderer.domElement.style.cursor = muscleId ? 'pointer' : 'grab'
      setHoverLabel(muscleId ? { x: event.clientX, y: event.clientY, muscleId } : null)
    }

    const onPointerLeave = () => {
      lastHoveredId = null
      setHoveredMuscle(null)
      setHoverLabel(null)
    }

    const onClick = (event: PointerEvent) => {
      const hit = getHit(event)
      const muscleId = hit?.object.userData.muscleId as string | undefined
      if (muscleId) {
        const currentSelected = useAnatomyStore.getState().selectedMuscleId
        selectMuscle(currentSelected === muscleId ? null : muscleId)
      }
    }

    renderer.domElement.addEventListener('pointermove', onPointerMove)
    renderer.domElement.addEventListener('pointerleave', onPointerLeave)
    renderer.domElement.addEventListener('click', onClick)

    const resize = () => {
      if (!mount.clientWidth || !mount.clientHeight) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)
    resize()

    let animationFrame = 0
    const animate = () => {
      animationFrame = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationFrame)
      if (cameraFrameRef.current) cancelAnimationFrame(cameraFrameRef.current)
      resizeObserver.disconnect()
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave)
      renderer.domElement.removeEventListener('click', onClick)
      controls.dispose()
      renderer.dispose()
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return
        object.geometry.dispose()
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach((material) => material.dispose())
      })
      mount.removeChild(renderer.domElement)
      meshMap.clear()
      allMeshesRef.current = []
      contextMeshesRef.current = []
    }
  }, [muscleById, selectMuscle, setCameraView, setHoveredMuscle])

  useEffect(() => {
    contextMeshesRef.current.forEach((mesh) => {
      mesh.visible = layerMode === 'all' && !isolate
    })
    allMeshesRef.current.forEach((mesh) => {
      const muscleId = mesh.userData.muscleId as string
      const layer = mesh.userData.layer as BodyLayer
      const material = mesh.material as THREE.MeshPhysicalMaterial
      const isSelected = selectedMuscleId === muscleId
      const isHovered = hoveredMuscleId === muscleId
      const layerVisible = layerMode === 'all' || layerMode === layer
      const isolateVisible = !isolate || !selectedMuscleId || isSelected

      mesh.visible = layerVisible && isolateVisible
      material.color.copy(isSelected ? ACTIVE_COLOR : isHovered ? HOVER_COLOR : new THREE.Color(BASE_COLORS[layer]))
      material.emissive.set(isSelected ? '#6f3200' : isHovered ? '#35100b' : '#130606')
      material.emissiveIntensity = isSelected ? 0.52 : isHovered ? 0.25 : 0.12
      material.roughness = isSelected ? 0.48 : 0.62
      material.needsUpdate = true
    })
  }, [hoveredMuscleId, isolate, layerMode, selectedMuscleId])

  const resetView = () => setCameraView(side)
  const hoverMuscle = hoverLabel ? muscleById.get(hoverLabel.muscleId) : null

  return (
    <div className="relative w-full h-full min-h-[460px] overflow-hidden rounded-[inherit] bg-[#09101a]">
      <div className="absolute inset-0 anatomy-grid" />
      <div ref={mountRef} className="absolute inset-0" />

      {!ready && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#09101a]/94 backdrop-blur-sm">
          <div className="relative w-20 h-20 mb-5">
            <div className="absolute inset-0 rounded-full border border-rose-300/15" />
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-rose-400 border-r-amber-400 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-rose-100">{loadProgress}%</div>
          </div>
          <p className="text-sm font-medium text-gray-200">
            {lang === 'es' ? 'Preparando atlas anatómico' : 'Preparing anatomy atlas'}
          </p>
          <p className="mt-1.5 text-xs text-gray-500">
            {lang === 'es' ? 'Sistema muscular completo · 405 estructuras' : 'Complete muscular system · 405 structures'}
          </p>
        </div>
      )}

      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1 rounded-xl border border-white/10 bg-[#0b121d]/88 p-1 shadow-xl backdrop-blur-md">
          {(['all', 'superficial', 'intermediate', 'deep'] as LayerMode[]).map((layer) => (
            <button
              key={layer}
              onClick={() => setLayerMode(layer)}
              className={cn(
                'px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors',
                layerMode === layer ? 'bg-rose-500/20 text-rose-200' : 'text-gray-500 hover:text-gray-200',
              )}
            >
              {layer === 'all'
                ? (lang === 'es' ? 'Todas' : 'All')
                : layer === 'superficial'
                  ? (lang === 'es' ? 'Superficial' : 'Superficial')
                  : layer === 'intermediate'
                    ? (lang === 'es' ? 'Intermedia' : 'Intermediate')
                    : (lang === 'es' ? 'Profunda' : 'Deep')}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        <button
          onClick={resetView}
          title={lang === 'es' ? 'Restablecer vista' : 'Reset view'}
          className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-[#0b121d]/88 text-gray-400 shadow-xl backdrop-blur-md transition hover:text-white"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => setIsolate((value) => !value)}
          disabled={!selectedMuscleId}
          title={lang === 'es' ? 'Aislar músculo' : 'Isolate muscle'}
          className={cn(
            'grid h-9 w-9 place-items-center rounded-xl border bg-[#0b121d]/88 shadow-xl backdrop-blur-md transition',
            isolate && selectedMuscleId ? 'border-amber-400/50 text-amber-300' : 'border-white/10 text-gray-400 hover:text-white',
            !selectedMuscleId && 'opacity-35 cursor-not-allowed',
          )}
        >
          <Layers3 className="w-4 h-4" />
        </button>
      </div>

      {hoverLabel && hoverMuscle && (
        <div
          className="fixed z-50 pointer-events-none rounded-lg border border-rose-200/20 bg-[#090e17]/95 px-3 py-2 shadow-2xl backdrop-blur-md"
          style={{ left: hoverLabel.x + 14, top: hoverLabel.y + 14 }}
        >
          <p className="text-xs font-semibold text-white">{loc(hoverMuscle, 'name', lang)}</p>
          <p className="mt-0.5 text-[10px] italic text-gray-400">{hoverMuscle.latinName}</p>
        </div>
      )}

      <div className="absolute bottom-3 left-3 right-3 z-10 flex items-end justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0b121d]/78 px-3 py-2 text-[11px] text-gray-400 backdrop-blur-md">
          <Rotate3D className="w-3.5 h-3.5 text-rose-300" />
          <span>{lang === 'es' ? 'Arrastra para rotar · rueda para acercar' : 'Drag to rotate · scroll to zoom'}</span>
          <span className="hidden xl:inline text-gray-700">|</span>
          <MousePointer2 className="hidden xl:block w-3.5 h-3.5 text-amber-300" />
          <span className="hidden xl:inline">{lang === 'es' ? 'Selecciona un músculo' : 'Select a muscle'}</span>
        </div>
        <div className="text-right text-[9px] leading-relaxed text-gray-600">
          <p>BodyParts3D · DBCLS</p>
          <p>CC BY-SA 2.1 JP</p>
          {failedCount > 0 && <p className="text-amber-500/70">{failedCount} mesh unavailable</p>}
        </div>
      </div>
    </div>
  )
}
