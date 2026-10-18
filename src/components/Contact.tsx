import { content } from '../content'
import { SectionHead } from './SectionHead'
import HalftoneWordmarkFooter from './ui/halftone-wordmark-footer'
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
  const { contact } = content
  return (
    <HalftoneWordmarkFooter
      wordmark="samir"
      label={content.name}
      meta={`© ${new Date().getFullYear()} · ${content.footerNote}`}
      columns={[
        {
          title: 'Site',
          links: [
            { label: 'About', href: '#about' },
            { label: 'Projects', href: '#projects' },
            { label: 'Now', href: '#now' },
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
      ]}
      palette={{ background: '#15171d', ink: '#eef0f4', warm: '#c9f05b' }}
      fontFamily="'Bricolage Grotesque', system-ui, sans-serif"
      monoFamily="'JetBrains Mono', ui-monospace, 'Cascadia Code', monospace"
      height="clamp(440px, 52vw, 600px)"
    />
  )
}
