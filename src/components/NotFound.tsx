import { useEffect, useState } from 'react'
import { content } from '../content'
import { LostMap } from './ui/lost-map'
import { SeekerLens } from './ui/seeker-lens'
import TopoField from './ui/topo-field'
import './Nav.css'
import './Hero.css'
import './NotFound.css'

// Places a mistyped path most likely meant, for the "did you mean" hint.
const PLACES = [
  { key: 'home', label: '/', href: '/' },
  { key: 'index', label: '/', href: '/' },
  { key: 'about', label: '/about', href: '/#about' },
  { key: 'projects', label: '/projects', href: '/#projects' },
  { key: 'work', label: '/projects', href: '/#projects' },
  { key: 'stack', label: '/stack', href: '/#stack' },
  { key: 'contact', label: '/contact', href: '/#contact' },
  ...content.projects.map((p) => ({
    key: p.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
    label: p.name,
    href: p.href,
  })),
]

const TRY = [
  { href: '/', path: '/', text: 'Start over' },
  { href: '/#about', path: '/about', text: 'Who I am' },
  { href: '/#projects', path: '/projects', text: 'What I build' },
  { href: '/#contact', path: '/contact', text: 'Say hello' },
]

function distance(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0]
    row[0] = i
    for (let j = 1; j <= b.length; j++) {
      const next = row[j]
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1))
      prev = next
    }
  }
  return row[b.length]
}

function readPath() {
  const raw = window.location.pathname
  if (raw === '/404' || raw === '/404.html') return '/this-page'
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

function guess(path: string) {
  const words = path.toLowerCase().split(/[/\-_.\s]+/).filter(Boolean)
  let best: (typeof PLACES)[number] | null = null
  let bestScore = Infinity
  for (const word of words) {
    for (const place of PLACES) {
      const d = distance(word, place.key)
      if (d <= Math.max(1, Math.floor(place.key.length / 3)) && d < bestScore) {
        best = place
        bestScore = d
      }
    }
  }
  return best
}

const shorten = (s: string, max = 34) => (s.length > max ? `${s.slice(0, max - 1)}…` : s)

function Terminal({ path }: { path: string }) {
  const command = `find ${shorten(path)}`
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [typed, setTyped] = useState(reduced ? command.length : 0)
  const done = typed >= command.length

  useEffect(() => {
    if (done) return
    const t = window.setTimeout(() => setTyped((n) => n + 1), typed === 0 ? 600 : 38 + Math.random() * 50)
    return () => window.clearTimeout(t)
  }, [typed, done])

  return (
    <div className="term mono" aria-label={`find ${path}: no such page, 0 results`}>
      <div className="term__bar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span>~/samirdev.uz</span>
      </div>
      <div className="term__body" aria-hidden="true">
        <p>
          <span className="term__prompt">$</span> {command.slice(0, typed)}
          {!done && <span className="term__caret">▍</span>}
        </p>
        {done && (
          <>
            <p className="term__out">searching every page… and under the sofa</p>
            <p className="term__out term__out--late">
              <span className="term__miss">0 results.</span> this page is not here.
            </p>
            <p className="term__out term__out--later">
              <span className="term__prompt">$</span> <span className="term__caret">▍</span>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export function NotFound() {
  const [path] = useState(readPath)
  const hint = guess(path)
  const report = `mailto:${content.contact.email}?subject=${encodeURIComponent(`Broken link: ${path}`)}`

  return (
    <div className="nf">
      <TopoField className="nf__topo" />

      <header className="nav">
        <div className="container nav__inner">
          <a href="/" className="nav__handle">
            {content.handle}
            <span className="nav__caret">_</span>
          </a>
          <nav className="nav__links" aria-label="Primary">
            <a href="/" className="link-underline">
              home
            </a>
          </nav>
        </div>
      </header>

      <main className="container nf__main">
        <div className="nf__grid">
          <div className="nf__copy">
            <p className="hero__status mono nf__rise">
              <span className="hero__dot nf__dot" aria-hidden="true" />
              Error 404 · searching…
            </p>

            <p className="nf__code nf__rise" aria-label="404">
              <span aria-hidden="true">4</span>
              <SeekerLens className="nf__lens" />
              <span aria-hidden="true">4</span>
            </p>

            <h1 className="nf__title nf__rise">
              Hmm, what are you <span className="mark">looking for</span>?
            </h1>
            <p className="nf__intro nf__rise">
              Whatever used to live here has moved out. Maybe the link is old, maybe it was a typo, or maybe it just
              wandered off the map.
            </p>

            <Terminal path={path} />

            <div className="hero__cta nf__cta nf__rise">
              <a href="/" className="hero__primary">
                Take me home <span className="hero__arrow">→</span>
              </a>
              {hint ? (
                <a href={hint.href} className="hero__secondary">
                  Did you mean <span className="nf__hint">{hint.label}</span>?
                </a>
              ) : (
                <a href={report} className="hero__secondary">
                  Report a broken link
                </a>
              )}
            </div>
          </div>

          <LostMap className="nf__map nf__rise" />
        </div>

        <nav className="nf__try nf__rise" aria-label="Places that do exist">
          {TRY.map((t) => (
            <a key={t.path} href={t.href}>
              <span className="mono">{t.path}</span>
              <span className="nf__try-text">
                {t.text} <span className="nf__try-arrow">→</span>
              </span>
            </a>
          ))}
        </nav>
      </main>

      <footer className="container nf__foot mono">
        <span>
          © {new Date().getFullYear()} · {content.footerNote}
        </span>
        <span>
          lost? <a href={`mailto:${content.contact.email}`} className="link-underline">{content.contact.email}</a>
        </span>
      </footer>
    </div>
  )
}
