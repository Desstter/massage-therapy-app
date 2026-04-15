import { useMemo } from 'react'
import { useBodyMap } from '../../../hooks/useBodyMap'
import { MUSCLES } from '../../../data/muscles'
import type { BodyLayer } from '../../../types/app.types'

// Anterior muscle path data — anatomically representative shapes
const ANTERIOR_PATHS: Record<string, string> = {
  'scm':
    'M 194 140 C 190 152 186 164 182 174 L 186 177 C 190 167 194 155 198 143 Z ' +
    'M 226 140 C 230 152 234 164 238 174 L 234 177 C 230 167 226 155 222 143 Z',
  'pec-major':
    'M 150 190 C 142 202 140 224 146 248 C 155 268 172 276 192 276 L 192 224 C 175 220 162 212 150 190 Z ' +
    'M 270 190 C 278 202 280 224 274 248 C 265 268 248 276 228 276 L 228 224 C 245 220 258 212 270 190 Z',
  'pec-minor':
    'M 165 200 C 170 196 178 196 185 200 L 184 228 C 176 230 168 228 165 224 Z ' +
    'M 255 200 C 250 196 242 196 235 200 L 236 228 C 244 230 252 228 255 224 Z',
  'serratus-anterior':
    'M 144 232 C 140 248 141 264 144 278 L 152 275 C 149 262 149 247 152 232 Z ' +
    'M 276 232 C 280 248 279 264 276 278 L 268 275 C 271 262 271 247 268 232 Z',
  'deltoid-anterior':
    'M 130 182 C 116 190 110 210 116 232 C 122 244 135 250 148 246 C 158 240 162 228 160 214 C 158 200 150 186 138 182 Z',
  'deltoid-middle':
    'M 280 182 C 294 190 300 210 294 232 C 288 244 275 250 262 246 C 252 240 248 228 250 214 C 252 200 260 186 272 182 Z',
  'biceps-brachii':
    'M 116 242 C 110 266 108 298 114 326 C 120 336 133 338 142 330 C 150 320 150 290 148 258 C 144 236 126 232 116 242 Z ' +
    'M 294 242 C 300 266 302 298 296 326 C 290 336 277 338 268 330 C 260 320 260 290 262 258 C 266 236 284 232 294 242 Z',
  'brachialis':
    'M 112 318 C 108 342 110 364 116 378 C 122 386 134 386 140 378 C 144 364 144 342 142 322 Z ' +
    'M 298 318 C 302 342 300 364 294 378 C 288 386 276 386 270 378 C 266 364 266 342 268 322 Z',
  'wrist-flexors':
    'M 108 380 C 104 404 106 432 110 452 C 114 460 122 460 126 452 C 128 432 128 404 126 382 Z ' +
    'M 302 380 C 306 404 304 432 300 452 C 296 460 288 460 284 452 C 282 432 282 404 284 382 Z',
  'rectus-abdominis':
    'M 183 282 C 181 308 181 334 183 358 C 186 364 194 364 196 358 C 198 334 198 308 196 282 Z ' +
    'M 224 282 C 226 308 226 334 224 358 C 221 364 213 364 211 358 C 209 334 209 308 211 282 Z',
  'external-oblique':
    'M 148 264 C 144 284 144 308 148 334 C 152 348 160 358 172 360 L 180 284 C 168 278 157 272 148 264 Z ' +
    'M 262 264 C 266 284 266 308 262 334 C 258 348 250 358 238 360 L 230 284 C 242 278 253 272 262 264 Z',
  'iliopsoas':
    'M 183 386 C 180 400 180 418 183 432 C 188 438 196 438 200 432 C 202 418 202 400 200 386 Z ' +
    'M 227 386 C 230 400 230 418 227 432 C 222 438 214 438 210 432 C 208 418 208 400 210 386 Z',
  'tfl':
    'M 160 440 C 154 460 154 482 160 498 C 166 506 176 506 180 498 C 182 482 182 460 178 440 Z ' +
    'M 250 440 C 256 460 256 482 250 498 C 244 506 234 506 230 498 C 228 482 228 460 232 440 Z',
  'adductors':
    'M 193 444 C 190 478 190 514 194 548 C 198 556 212 556 216 548 C 220 514 220 478 217 444 Z',
  'rectus-femoris':
    'M 165 444 C 159 492 159 544 165 578 C 172 588 184 590 190 582 C 196 570 196 518 193 466 C 190 448 174 440 165 444 Z ' +
    'M 245 444 C 251 492 251 544 245 578 C 238 588 226 590 220 582 C 214 570 214 518 217 466 C 220 448 236 440 245 444 Z',
  'vastus-medialis':
    'M 175 510 C 170 540 170 566 178 580 C 186 590 196 588 200 578 C 200 554 198 526 194 504 Z ' +
    'M 235 510 C 240 540 240 566 232 580 C 224 590 214 588 210 578 C 210 554 212 526 216 504 Z',
  'vastus-lateralis':
    'M 155 460 C 148 490 148 524 156 554 C 162 566 172 568 178 560 C 178 530 176 498 172 466 Z ' +
    'M 255 460 C 262 490 262 524 254 554 C 248 566 238 568 232 560 C 232 530 234 498 238 466 Z',
  'tibialis-anterior':
    'M 172 612 C 168 648 168 684 173 710 C 178 718 188 718 192 710 C 196 684 196 648 192 614 Z ' +
    'M 238 612 C 242 648 242 684 237 710 C 232 718 222 718 218 710 C 214 684 214 648 218 614 Z',
}

const POSTERIOR_PATHS: Record<string, string> = {
  'trap-upper':
    'M 164 152 C 176 144 194 140 210 140 C 226 140 244 144 256 152 C 264 162 264 178 256 187 C 244 194 228 194 210 194 C 192 194 176 194 164 187 C 156 178 156 162 164 152 Z',
  'trap-middle':
    'M 150 202 C 165 194 188 190 210 192 C 232 190 255 194 270 202 L 267 228 C 250 236 230 238 210 238 C 190 238 170 236 153 228 Z',
  'trap-lower':
    'M 156 228 C 172 224 192 222 210 222 C 228 222 248 224 264 228 L 260 262 C 244 268 228 270 210 270 C 192 270 176 268 160 262 Z',
  'lats':
    'M 140 248 C 134 278 136 320 142 358 C 150 376 164 384 178 380 C 184 350 184 314 182 274 C 180 252 165 244 140 248 Z ' +
    'M 280 248 C 286 278 284 320 278 358 C 270 376 256 384 242 380 C 236 350 236 314 238 274 C 240 252 255 244 280 248 Z',
  'rhomboid-major':
    'M 166 218 C 178 212 194 210 210 212 C 226 210 242 212 254 218 L 250 248 C 238 254 226 256 210 256 C 194 256 182 254 170 248 Z',
  'rhomboid-minor':
    'M 170 200 C 182 196 196 194 210 196 C 224 194 238 196 250 200 L 248 214 C 238 218 226 218 210 218 C 194 218 182 218 172 214 Z',
  'erector-spinae':
    'M 188 262 C 184 314 184 376 188 424 C 192 434 200 434 204 424 C 206 376 206 314 202 262 Z ' +
    'M 222 262 C 226 314 226 376 222 424 C 218 434 210 434 206 424 C 204 376 204 314 208 262 Z',
  'quadratus-lumborum':
    'M 177 356 C 173 374 173 392 178 406 C 184 412 192 412 196 406 C 199 392 199 374 196 356 Z ' +
    'M 233 356 C 237 374 237 392 232 406 C 226 412 218 412 214 406 C 211 392 211 374 214 356 Z',
  'multifidus':
    'M 196 268 C 194 314 194 372 197 420 C 200 428 210 428 213 420 C 216 372 216 314 214 268 Z',
  'glute-max':
    'M 155 418 C 146 442 146 470 156 492 C 166 510 184 518 202 518 C 220 518 238 510 248 492 C 258 470 258 442 249 418 Z',
  'glute-med':
    'M 157 408 C 150 425 151 444 158 458 C 168 468 183 472 196 468 C 204 458 208 445 206 432 C 203 418 195 408 184 405 Z ' +
    'M 263 408 C 270 425 269 444 262 458 C 252 468 237 472 224 468 C 216 458 212 445 214 432 C 217 418 225 408 236 405 Z',
  'piriformis':
    'M 170 424 C 180 420 196 420 210 422 C 224 420 240 420 250 424 L 247 440 C 236 444 224 444 210 444 C 196 444 184 444 173 440 Z',
  'hamstrings':
    'M 162 476 C 155 518 155 562 162 592 C 168 606 182 608 190 598 C 196 572 197 528 192 478 Z ' +
    'M 248 476 C 255 518 255 562 248 592 C 242 606 228 608 220 598 C 214 572 213 528 218 478 Z',
  'gastrocnemius':
    'M 163 600 C 156 636 157 670 164 694 C 170 706 182 708 190 700 C 196 678 196 644 192 606 Z ' +
    'M 247 600 C 254 636 253 670 246 694 C 240 706 228 708 220 700 C 214 678 214 644 218 606 Z',
  'soleus':
    'M 165 688 C 161 712 162 738 167 754 C 173 762 183 762 188 754 C 192 738 192 712 190 690 Z ' +
    'M 245 688 C 249 712 248 738 243 754 C 237 762 227 762 222 754 C 218 738 218 712 220 690 Z',
  'peroneals':
    'M 248 608 C 254 636 254 665 250 686 C 245 694 236 694 232 686 C 230 662 230 634 234 610 Z',
  'deltoid-posterior':
    'M 140 182 C 128 192 122 212 128 234 C 135 246 148 250 160 244 C 166 234 166 218 162 206 Z ' +
    'M 280 182 C 292 192 298 212 292 234 C 285 246 272 250 260 244 C 254 234 254 218 258 206 Z',
  'supraspinatus':
    'M 156 182 C 168 176 188 174 206 176 C 208 171 210 168 210 168 L 212 176 C 230 174 250 176 264 182 L 264 200 C 250 196 230 194 210 196 C 190 194 170 196 156 200 Z',
  'infraspinatus':
    'M 152 202 C 166 196 188 194 210 196 C 232 194 254 196 268 202 L 266 228 C 252 234 232 236 210 236 C 188 236 168 234 154 228 Z',
  'teres-minor':
    'M 152 228 C 164 224 178 222 188 224 L 186 244 C 176 246 164 244 153 240 Z ' +
    'M 268 228 C 256 224 242 222 232 224 L 234 244 C 244 246 256 244 267 240 Z',
  'triceps-brachii':
    'M 112 244 C 106 278 108 318 115 344 C 121 354 134 356 142 346 C 148 320 148 280 144 246 Z ' +
    'M 298 244 C 304 278 302 318 295 344 C 289 354 276 356 268 346 C 262 320 262 280 266 246 Z',
  'wrist-extensors':
    'M 110 358 C 105 384 107 412 112 432 C 116 440 124 440 128 432 C 130 412 130 384 128 360 Z ' +
    'M 300 358 C 305 384 303 412 298 432 C 294 440 286 440 282 432 C 280 412 280 384 282 360 Z',
}

const LAYER_COLORS: Record<BodyLayer, string> = {
  superficial:  '#b0b8c8',
  intermediate: '#7eb0d8',
  deep:         '#9b8ed4',
}

function getMuscleColor(state: 'default' | 'hovered' | 'selected', layer: BodyLayer): string {
  if (state === 'selected') return '#f59e0b'
  if (state === 'hovered')  return '#fbbf24'
  return LAYER_COLORS[layer]
}

interface BodyMapSVGProps {
  side: 'anterior' | 'posterior'
}

export function BodyMapSVG({ side }: BodyMapSVGProps) {
  const {
    handleMuscleClick,
    handleMuscleEnter,
    handleMuscleLeave,
    getMuscleState,
    hoveredMuscleId,
    selectedMuscleId,
  } = useBodyMap()

  const paths = side === 'anterior' ? ANTERIOR_PATHS : POSTERIOR_PATHS

  const muscleInfo = useMemo(
    () => new Map(MUSCLES.map((m) => [m.id, { name: m.name, layer: m.layer }])),
    [],
  )

  const activeMuscleId = selectedMuscleId ?? hoveredMuscleId
  const activeMuscleLabel = activeMuscleId
    ? (muscleInfo.get(activeMuscleId)?.name ?? null)
    : null

  return (
    <svg
      viewBox="0 0 420 860"
      className="w-full h-full"
      style={{ maxHeight: '780px' }}
      aria-label={`${side} body map`}
    >
      <defs>
        {/* Subtle radial gradient for muscle depth */}
        <radialGradient id="muscleDepth" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.06" />
        </radialGradient>

        {/* Glow filter for hover/selected */}
        <filter id="muscleGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Body silhouette gradient */}
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4a5568" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#2d3748" stopOpacity="0.10" />
        </linearGradient>
      </defs>

      {/* ── Body Silhouette ── */}
      <g fill="url(#bodyGrad)" stroke="#4a5568" strokeWidth="0.5" strokeOpacity="0.3">
        {/* Head */}
        <ellipse cx="210" cy="88" rx="44" ry="52" />
        {/* Neck */}
        <path d="M 196 138 C 195 148 195 158 196 168 L 224 168 C 225 158 225 148 224 138 Z" />
        {/* Torso */}
        {side === 'anterior' ? (
          <path d="M 155 170 C 133 180 122 200 120 240 C 118 280 122 330 130 375 C 138 400 155 414 176 418 L 244 418 C 265 414 282 400 290 375 C 298 330 302 280 300 240 C 298 200 287 180 265 170 Z" />
        ) : (
          <path d="M 158 170 C 136 180 125 202 123 242 C 121 282 125 334 133 378 C 141 402 158 416 178 420 L 242 420 C 262 416 279 402 287 378 C 295 334 299 282 297 242 C 295 202 284 180 262 170 Z" />
        )}
        {/* Left upper arm */}
        <path d="M 100 178 C 92 192 90 220 92 258 C 94 292 100 318 108 338 C 115 350 125 352 132 344 C 136 328 138 302 136 268 C 134 234 130 204 122 184 Z" />
        {/* Right upper arm */}
        <path d="M 320 178 C 328 192 330 220 328 258 C 326 292 320 318 312 338 C 305 350 295 352 288 344 C 284 328 282 302 284 268 C 286 234 290 204 298 184 Z" />
        {/* Left forearm */}
        <path d="M 100 348 C 94 368 92 396 94 424 C 96 444 104 458 112 458 C 120 458 126 444 128 424 C 130 396 130 368 126 350 Z" />
        {/* Right forearm */}
        <path d="M 320 348 C 326 368 328 396 326 424 C 324 444 316 458 308 458 C 300 458 294 444 292 424 C 290 396 290 368 294 350 Z" />
        {/* Left hand */}
        <ellipse cx="111" cy="480" rx="18" ry="26" />
        {/* Right hand */}
        <ellipse cx="309" cy="480" rx="18" ry="26" />
        {/* Pelvis */}
        <path d="M 160 416 C 142 424 136 444 140 468 L 280 468 C 284 444 278 424 260 416 Z" />
        {/* Left thigh */}
        <path d="M 155 462 C 148 498 147 542 152 580 C 156 604 168 616 180 616 C 192 616 202 604 205 580 C 208 542 206 498 200 462 Z" />
        {/* Right thigh */}
        <path d="M 265 462 C 272 498 273 542 268 580 C 264 604 252 616 240 616 C 228 616 218 604 215 580 C 212 542 214 498 220 462 Z" />
        {/* Left lower leg */}
        <path d="M 156 616 C 150 648 150 686 156 718 C 161 736 172 744 182 742 C 194 740 202 730 205 714 C 209 682 208 646 204 616 Z" />
        {/* Right lower leg */}
        <path d="M 264 616 C 270 648 270 686 264 718 C 259 736 248 744 238 742 C 226 740 218 730 215 714 C 211 682 212 646 216 616 Z" />
        {/* Left foot */}
        <ellipse cx="181" cy="754" rx="26" ry="14" transform="rotate(-5 181 754)" />
        {/* Right foot */}
        <ellipse cx="239" cy="754" rx="26" ry="14" transform="rotate(5 239 754)" />
      </g>

      {/* ── Muscle Paths ── */}
      {Object.entries(paths).map(([muscleId, pathData]) => {
        const state   = getMuscleState(muscleId)
        const info    = muscleInfo.get(muscleId)
        const layer   = info?.layer ?? 'superficial'
        const color   = getMuscleColor(state, layer)
        const opacity = state === 'default' ? 0.62 : 0.92
        const isActive = state !== 'default'

        return (
          <path
            key={muscleId}
            d={pathData}
            fill={color}
            fillOpacity={opacity}
            stroke={isActive ? '#f59e0b' : 'rgba(255,255,255,0.08)'}
            strokeWidth={state === 'selected' ? 1.5 : isActive ? 0.8 : 0.5}
            filter={isActive ? 'url(#muscleGlow)' : undefined}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleMuscleClick(muscleId)}
            onMouseEnter={() => handleMuscleEnter(muscleId)}
            onMouseLeave={handleMuscleLeave}
          >
            {info && <title>{info.name}</title>}
          </path>
        )
      })}

      {/* ── Muscle name label ── */}
      {activeMuscleLabel && (
        <g>
          <rect
            x="85" y="820" width="250" height="30"
            rx="15"
            fill="#0f1520"
            fillOpacity="0.92"
            stroke="#f59e0b"
            strokeWidth="1"
          />
          <text
            x="210" y="835"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="13"
            fontWeight="500"
            fontFamily="Cormorant Garamond, Georgia, serif"
            letterSpacing="0.5"
            fill="#fbbf24"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            {activeMuscleLabel}
          </text>
        </g>
      )}
    </svg>
  )
}
