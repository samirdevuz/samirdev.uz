// Lost Map — a hand-drawn trail card: a dotted path leaves home, loops back on
// itself like someone who took a wrong turn, and ends at a "you are here" pin.
// The compass, of course, has no idea either.

const HILLS = [
  'M182 104 C180 56 222 34 264 38 C306 42 336 76 330 116 C324 156 290 176 250 172 C210 168 184 150 182 104 Z',
  'M205 105 C205 70 235 55 262 58 C292 61 312 85 308 112 C304 140 280 156 252 152 C224 148 205 135 205 105 Z',
  'M222 106 C222 84 240 74 258 76 C278 78 292 92 289 110 C286 128 270 137 253 135 C236 133 222 124 222 106 Z',
  'M240 106 C240 95 249 90 258 91 C268 92 274 99 272 108 C270 117 262 121 254 120 C246 119 240 115 240 106 Z',
  'M6 58 C10 18 58 2 98 14 C134 25 142 64 120 92 C98 120 46 122 24 104 C10 92 4 76 6 58 Z',
  'M22 60 C25 34 60 22 90 31 C116 39 122 66 106 86 C90 106 52 108 34 94 C24 86 20 74 22 60 Z',
  'M42 62 C45 45 64 38 83 44 C99 49 103 64 93 76 C83 88 60 89 50 81 C43 76 41 70 42 62 Z',
]

const TRAIL =
  'M66 204 C104 196 116 160 148 168 C184 178 176 222 212 218 C252 213 240 160 206 150 C174 141 166 188 198 194 C236 201 262 170 270 142 C277 118 288 104 306 98'

export function LostMap({ className }: { className?: string }) {
  return (
    <figure className={`map${className ? ` ${className}` : ''}`}>
      <div className="map__bar mono">
        <span>samirdev.uz / map</span>
        <span className="muted">40.84° N · 68.66° E</span>
      </div>

      <svg viewBox="0 0 360 260" className="map__svg" role="img" aria-label="A dotted trail that leaves home, loops around and ends at a pin marked you are here">
        <defs>
          <mask id="map-reveal">
            <path d={TRAIL} pathLength={1} className="map__reveal" />
          </mask>
        </defs>

        <g className="map__hills">
          {HILLS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>

        <path d={TRAIL} className="map__trail" mask="url(#map-reveal)" />

        <a href="/" className="map__home">
          <title>Back home</title>
          <path d="M45 222 V209 L56 199 L67 209 V222 Z" className="map__house" />
          <path d="M53 222 V214 H59 V222" className="map__door" />
          <text x="56" y="240" textAnchor="middle" className="map__label">
            / home
          </text>
        </a>

        <g className="map__pin">
          <ellipse cx="306" cy="98" rx="10" ry="3.5" className="map__pulse" />
          <g className="map__drop">
            <path d="M306 97 C306 97 290 80 290 70 A16 16 0 0 1 322 70 C322 80 306 97 306 97 Z" />
            <text x="306" y="76.5" textAnchor="middle">
              ?
            </text>
          </g>
          <text x="284" y="64" textAnchor="end" className="map__label">
            you are here
          </text>
          <text x="284" y="77" textAnchor="end" className="map__label map__label--muted">
            (probably)
          </text>
        </g>

        <g className="map__compass" transform="translate(324 222)">
          <circle r="17" />
          <text y="-21" textAnchor="middle" className="map__label">
            N
          </text>
          <g className="map__needle">
            <path d="M0 -12 L3.5 0 L0 12 L-3.5 0 Z" />
            <path d="M0 -12 L3.5 0 L-3.5 0 Z" className="map__needle-n" />
          </g>
        </g>
      </svg>

      <figcaption className="map__bar mono">
        <span className="muted">scale 1 : ∞</span>
        <span className="muted">status: off the map</span>
      </figcaption>
    </figure>
  )
}
