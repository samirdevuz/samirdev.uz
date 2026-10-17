import { content } from '../content'
import { SectionHead } from './SectionHead'
import './Now.css'

export function Now({ num }: { num: string }) {
  const { now } = content
  return (
    <section className="section" id="now">
      <div className="container">
        <SectionHead num={num} label="now" />
        <div className="now reveal">
          <p className="now__prompt mono">
            <span className="now__ps">~/{now.project.toLowerCase()} $</span> npm run build
            <span className="now__cursor" aria-hidden="true" />
          </p>
          <h2 className="h2 now__title">{now.title}</h2>
          <p className="now__text">{now.text}</p>
          <a href={`mailto:${content.contact.email}`} className="btn now__btn">
            {now.cta} <span className="arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
