import { content } from '../content'
import { SectionHead } from './SectionHead'
import './Contact.css'

export function Contact({ num }: { num: string }) {
  const { contact } = content
  return (
    <section className="section contact" id="contact">
      <div className="container">
        <SectionHead num={num} label="contact" />
        <h2 className="display contact__title reveal">{contact.title}</h2>
        <a href={`mailto:${contact.email}`} className="contact__email link-underline reveal">
          {contact.email}
        </a>
        <ul className="contact__socials reveal">
          {contact.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer">
                <span>{s.label}</span>
                <span className="mono contact__handle">{s.handle} ↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner mono">
        <span>
          © {new Date().getFullYear()} {content.name}
        </span>
        <span>{content.footerNote}</span>
      </div>
    </footer>
  )
}
