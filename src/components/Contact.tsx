import { content } from '../content'
import { Block } from './Block'
import HalftoneWordmarkFooter from './ui/halftone-wordmark-footer'
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
      ]}
      palette={{ background: '#15171d', ink: '#eef0f4', warm: '#c9f05b' }}
      fontFamily="'Geist', system-ui, sans-serif"
      monoFamily="'Geist Mono', ui-monospace, 'Cascadia Code', monospace"
      height="clamp(440px, 52vw, 600px)"
    />
  )
}
