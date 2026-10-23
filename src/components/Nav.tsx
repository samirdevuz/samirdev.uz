import { useEffect, useState } from 'react'
import { content } from '../content'
import './Nav.css'

const links = [
  { href: '#about', label: 'about' },
  { href: '#projects', label: 'projects' },
  { href: '#stack', label: 'stack' },
  { href: '#contact', label: 'contact' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <div className="container nav__inner">
        <a href="#top" className="nav__handle">
          {content.handle}
          <span className="nav__caret">_</span>
        </a>
        <nav className="nav__links" aria-label="Primary">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="link-underline">
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
