import { content } from '../content'
import { Block } from './Block'
import './Contact.css'

export function Contact() {
  const { contact } = content
  return (
    <Block id="contact" label="Contact">
      <p className="contact__title reveal">{contact.title}</p>
      <a href={`mailto:${contact.email}`} className="contact__email reveal">
        <span className="link-underline">{contact.email}</span> <span className="contact__arrow">→</span>
      </a>
    </Block>
  )
}

export function Footer() {
  const { contact } = content
  const columns = [
    {
      title: 'Site',
      links: [
        { label: 'About', href: '#about' },
        { label: 'Projects', href: '#projects' },
        { label: 'Stack', href: '#stack' },
      ],
    },
    {
      title: 'Social',
      links: contact.socials.map((s) => ({ label: s.label, href: s.href })),
    },
    {
      title: 'Contact',
      links: [{ label: contact.email, href: `mailto:${contact.email}` }],
    },
  ]

  return (
    <footer className="footer">
      <div className="footer__top mono">
        <div className="footer__brand">
          <strong>{content.name}</strong>
          <span>
            © {new Date().getFullYear()} · {content.footerNote}
          </span>
        </div>
        {columns.map((col) => (
          <nav className="footer__col" key={col.title} aria-label={col.title}>
            <h3>{col.title}</h3>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="footer__rule mono">
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  )
}
