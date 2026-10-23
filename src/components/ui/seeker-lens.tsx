// Seeker Lens — the "0" of the 404: a magnifying glass with an eye inside.
// The eye follows the pointer, scans side to side when the pointer rests,
// blinks now and then, and squints when poked. Static under reduced motion.

import { useEffect, useId, useRef, useState } from 'react'

// Almond outline of the eye, centred on the glass (42, 42).
const EYE = 'M25 42 Q42 25 59 42 Q42 59 25 42 Z'
const GRID = Array.from({ length: 13 }, (_, i) => 6 + i * 6)

export function SeekerLens({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const pupilRef = useRef<SVGGElement>(null)
  const gridRef = useRef<SVGGElement>(null)
  const [poked, setPoked] = useState(false)
  const id = useId()
  const glassClip = `${id}-glass`
  const eyeClip = `${id}-eye`

  useEffect(() => {
    const svg = svgRef.current
    const pupil = pupilRef.current
    const grid = gridRef.current
    if (!svg || !pupil || !grid) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let target = { x: 0, y: 0 }
    const pos = { x: 0, y: 0 }
    let lastMove = -Infinity
    let frame = 0

    const onMove = (e: PointerEvent) => {
      const r = svg.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width * 0.42)
      const dy = e.clientY - (r.top + r.height * 0.42)
      const d = Math.hypot(dx, dy) || 1
      const reach = Math.min(1, d / 220)
      target = { x: (dx / d) * reach, y: (dy / d) * reach }
      lastMove = performance.now()
    }

    const tick = (now: number) => {
      // Resting pointer: look around, like someone searching a room.
      if (now - lastMove > 2400) {
        const t = now / 1000
        target = { x: Math.sin(t * 0.8) * 0.95, y: Math.sin(t * 1.9) * 0.4 }
      }
      pos.x += (target.x - pos.x) * 0.12
      pos.y += (target.y - pos.y) * 0.12
      pupil.setAttribute('transform', `translate(${(pos.x * 8).toFixed(2)} ${(pos.y * 4.5).toFixed(2)})`)
      grid.setAttribute('transform', `translate(${(-pos.x * 5).toFixed(2)} ${(-pos.y * 5).toFixed(2)})`)
      svg.style.setProperty('--tilt', `${(pos.x * 7).toFixed(2)}deg`)
      frame = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    frame = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  const poke = () => {
    setPoked(true)
    window.setTimeout(() => setPoked(false), 650)
  }

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 100 100"
      className={`lens${poked ? ' lens--poked' : ''}${className ? ` ${className}` : ''}`}
      aria-hidden="true"
      onClick={poke}
    >
      <defs>
        <clipPath id={glassClip}>
          <circle cx="42" cy="42" r="24.5" />
        </clipPath>
        <clipPath id={eyeClip}>
          <path d={EYE} />
        </clipPath>
      </defs>

      <g className="lens__body">
        <circle cx="42" cy="42" r="30" className="lens__glass" />

        <g clipPath={`url(#${glassClip})`}>
          {/* Graph paper under the glass, drifting against the eye for depth */}
          <g ref={gridRef} className="lens__grid">
            {GRID.map((v) => (
              <g key={v}>
                <line x1={v} y1="0" x2={v} y2="84" />
                <line x1="0" y1={v} x2="84" y2={v} />
              </g>
            ))}
          </g>

          <g className="lens__eye">
            <path d={EYE} className="lens__sclera" />
            <g clipPath={`url(#${eyeClip})`}>
              <g ref={pupilRef}>
                <circle cx="42" cy="42" r="8.5" className="lens__iris" />
                <circle cx="42" cy="42" r="4.2" className="lens__pupil" />
                <circle cx="44.9" cy="39.1" r="1.8" className="lens__glint" />
              </g>
            </g>
            <path d={EYE} className="lens__lid" />
          </g>

          <path d="M26 34 A18 18 0 0 1 36 24.5" className="lens__glare" />
        </g>

        <line x1="64" y1="64" x2="88" y2="88" className="lens__handle" />
        <line x1="80" y1="80" x2="88" y2="88" className="lens__grip" />
        <circle cx="42" cy="42" r="30" className="lens__ring" />
      </g>
    </svg>
  )
}
