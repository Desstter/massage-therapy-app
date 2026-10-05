import { useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { Maximize2, Rotate3D } from 'lucide-react'
import { cn } from '../../../utils/cn'
import type { PathwayModel } from '../../../data/pathwayModels'

interface ClinicalPathway3DProps {
  pathways: PathwayModel[]
  colors: Map<string, string>
  activeId: string | null
  selectedId: string | null
  onHover: (id: string | null) => void
  onSelect: (id: string) => void
  kind: 'fascia' | 'nerve'
  lang: string
}

function alignAtlasGeometry(mesh: THREE.Mesh, geometry: THREE.BufferGeometry) {
  geometry.computeBoundingBox()
  const center = geometry.boundingBox?.getCenter(new THREE.Vector3())
  if (center) mesh.rotation.x = Math.abs(center.z) > Math.abs(center.y) ? 0 : -Math.PI / 2
}

export function ClinicalPathway3D({
  pathways,
  colors,
  activeId,
  selectedId,
  onHover,
  onSelect,
  kind,
  lang,
}: ClinicalPathway3DProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const pathwayMeshesRef = useRef(new Map<string, THREE.Mesh[]>())
  const onHoverRef = useRef(onHover)
  const onSelectRef = useRef(onSelect)
  const [ready, setReady] = useState(false)
  const [view, setView] = useState<'anterior' | 'posterior'>(() => {
    const initial = pathways.find((pathway) => pathway.id === selectedId)
    return initial?.preferredView ?? 'anterior'
  })
  const initialViewRef = useRef(view)

  useEffect(() => {
    onHoverRef.current = onHover
    onSelectRef.current = onSelect
  }, [onHover, onSelect])

  const setCameraView = useCallback((nextView: 'anterior' | 'posterior') => {
    setView(nextView)
    const camera = cameraRef.current
    const controls = controlsRef.current
    if (!camera || !controls) return
    camera.position.set(0, .05, nextView === 'anterior' ? 11.5 : -11.5)
    controls.target.set(0, 0, 0)
    controls.update()
  }, [])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2('#08111c', .025)
    const camera = new THREE.PerspectiveCamera(30, 1, .01, 100)
    camera.position.set(0, .05, initialViewRef.current === 'anterior' ? 11.5 : -11.5)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.AgXToneMapping
    renderer.toneMappingExposure = 1.1
    mount.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enablePan = false
    controls.minDistance = 6
    controls.maxDistance = 17
    controls.rotateSpeed = .6
    controls.target.set(0, 0, 0)
    controlsRef.current = controls

    scene.add(new THREE.HemisphereLight('#c8e6ff', '#29151b', 2.2))
    const key = new THREE.DirectionalLight('#fff1df', 3.2)
    key.position.set(-4, 6, 5)
    scene.add(key)
    const rim = new THREE.DirectionalLight(kind === 'nerve' ? '#9874ff' : '#3ee1ce', 2.5)
    rim.position.set(4, 1, -5)
    scene.add(rim)

    const bodyRoot = new THREE.Group()
    const modelGroup = new THREE.Group()
    bodyRoot.add(modelGroup)
    scene.add(bodyRoot)

    const loader = new PLYLoader()
    const loadBodyPart = (path: string) => new Promise<void>((resolve) => {
      loader.load(path, (loaded) => {
        const geometry = mergeVertices(loaded, .0001)
        geometry.computeVertexNormals()
        const material = new THREE.MeshPhysicalMaterial({
          color: kind === 'nerve' ? '#5e6672' : '#72534e',
          roughness: .78,
          transparent: true,
          opacity: kind === 'nerve' ? .22 : .28,
          depthWrite: false,
          side: THREE.DoubleSide,
        })
        const mesh = new THREE.Mesh(geometry, material)
        alignAtlasGeometry(mesh, geometry)
        modelGroup.add(mesh)
        resolve()
      }, undefined, () => resolve())
    })

    Promise.all([
      loadBodyPart('/anatomy/models/context-muscles.ply'),
      loadBodyPart('/anatomy/models/context-face.ply'),
    ]).then(() => {
      if (!modelGroup.children.length) return
      modelGroup.rotation.x = -Math.PI / 2
      modelGroup.updateMatrixWorld(true)
      const firstBox = new THREE.Box3().setFromObject(modelGroup)
      const scale = 5.65 / firstBox.getSize(new THREE.Vector3()).y
      modelGroup.scale.setScalar(scale)
      modelGroup.updateMatrixWorld(true)
      const center = new THREE.Box3().setFromObject(modelGroup).getCenter(new THREE.Vector3())
      bodyRoot.position.sub(center)
      setReady(true)
    })

    const pathwayMeshes = pathwayMeshesRef.current
    pathways.forEach((pathway) => {
      const meshes: THREE.Mesh[] = []
      pathway.routes.forEach((route) => {
        if (route.length < 2) return
        const curve = new THREE.CatmullRomCurve3(route.map(([x, y, z]) => new THREE.Vector3(x, y, z)), false, 'centripetal')
        const geometry = new THREE.TubeGeometry(curve, Math.max(32, route.length * 16), kind === 'nerve' ? .025 : .035, 8, false)
        const material = new THREE.MeshStandardMaterial({
          color: colors.get(pathway.id) ?? '#f59e0b',
          emissive: colors.get(pathway.id) ?? '#f59e0b',
          emissiveIntensity: .8,
          transparent: true,
          opacity: .32,
          depthTest: false,
        })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.renderOrder = 4
        mesh.userData.pathwayId = pathway.id
        meshes.push(mesh)
        scene.add(mesh)
      })

      pathway.entrapmentPoints?.forEach(([x, y, z]) => {
        const geometry = new THREE.SphereGeometry(.055, 18, 18)
        const material = new THREE.MeshStandardMaterial({
          color: '#fb7185',
          emissive: '#be123c',
          emissiveIntensity: 1.2,
          transparent: true,
          opacity: .3,
          depthTest: false,
        })
        const marker = new THREE.Mesh(geometry, material)
        marker.position.set(x, y, z)
        marker.renderOrder = 5
        marker.userData.pathwayId = pathway.id
        marker.userData.entrapment = true
        meshes.push(marker)
        scene.add(marker)
      })
      pathwayMeshes.set(pathway.id, meshes)
    })

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let lastHovered: string | null = null
    const hitPathway = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const meshes = [...pathwayMeshes.values()].flat()
      return raycaster.intersectObjects(meshes, false)[0]?.object.userData.pathwayId as string | undefined
    }
    const onPointerMove = (event: PointerEvent) => {
      const id = hitPathway(event) ?? null
      if (id !== lastHovered) {
        lastHovered = id
        onHoverRef.current(id)
      }
      renderer.domElement.style.cursor = id ? 'pointer' : 'grab'
    }
    const onPointerLeave = () => {
      lastHovered = null
      onHoverRef.current(null)
    }
    const onClick = (event: PointerEvent) => {
      const id = hitPathway(event)
      if (id) onSelectRef.current(id)
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
    const observer = new ResizeObserver(resize)
    observer.observe(mount)
    resize()

    let frame = 0
    const clock = new THREE.Clock()
    const animate = () => {
      frame = requestAnimationFrame(animate)
      controls.update()
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 3.2) * .12
      pathwayMeshes.forEach((meshes) => meshes.forEach((mesh) => {
        if (mesh.userData.entrapment) mesh.scale.setScalar(pulse)
      }))
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      controls.dispose()
      renderer.dispose()
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave)
      renderer.domElement.removeEventListener('click', onClick)
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return
        object.geometry.dispose()
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach((material) => material.dispose())
      })
      pathwayMeshes.clear()
      mount.removeChild(renderer.domElement)
    }
  }, [colors, kind, pathways])

  useEffect(() => {
    pathwayMeshesRef.current.forEach((meshes, id) => {
      const selected = id === selectedId
      const active = id === activeId
      meshes.forEach((mesh) => {
        const material = mesh.material as THREE.MeshStandardMaterial
        material.opacity = mesh.userData.entrapment
          ? selected ? .95 : active ? .7 : .24
          : selected ? 1 : active ? .82 : selectedId ? .12 : .3
        material.emissiveIntensity = selected ? 1.8 : active ? 1.25 : .65
      })
    })
  }, [activeId, ready, selectedId])

  return (
    <div className="relative h-full min-h-[500px] overflow-hidden rounded-2xl border border-bg-border bg-[#08111c]">
      <div className="absolute inset-0 anatomy-grid" />
      <div ref={mountRef} className="absolute inset-0" />

      {!ready && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-[#08111c]/92">
          <div className="text-center">
            <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-transparent border-t-amber-400 border-r-cyan-400" />
            <p className="text-xs text-gray-400">{lang === 'es' ? 'Preparando atlas clínico 3D' : 'Preparing clinical 3D atlas'}</p>
          </div>
        </div>
      )}

      <div className="absolute left-3 top-3 z-10 flex rounded-xl border border-white/10 bg-[#0b121d]/90 p-1 backdrop-blur-md">
        {(['anterior', 'posterior'] as const).map((side) => (
          <button
            key={side}
            onClick={() => setCameraView(side)}
            className={cn('rounded-lg px-3 py-1.5 text-[11px] font-medium transition', view === side ? 'bg-amber-500/20 text-amber-300' : 'text-gray-500 hover:text-gray-200')}
          >
            {side === 'anterior' ? (lang === 'es' ? 'Anterior' : 'Anterior') : (lang === 'es' ? 'Posterior' : 'Posterior')}
          </button>
        ))}
      </div>

      <button
        onClick={() => setCameraView(view)}
        title={lang === 'es' ? 'Restablecer vista' : 'Reset view'}
        className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-[#0b121d]/90 text-gray-400 backdrop-blur-md hover:text-white"
      >
        <Maximize2 className="h-4 w-4" />
      </button>

      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 rounded-xl border border-white/10 bg-[#0b121d]/82 px-3 py-2 text-[11px] text-gray-400 backdrop-blur-md">
        <Rotate3D className="h-3.5 w-3.5 text-amber-300" />
        <span>{lang === 'es' ? 'Arrastra para rotar · selecciona una vía' : 'Drag to rotate · select a pathway'}</span>
      </div>
    </div>
  )
}
