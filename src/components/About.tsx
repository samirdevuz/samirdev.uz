import { content } from '../content'
import { SectionHead } from './SectionHead'
import './About.css'

export function About({ num }: { num: string }) {
  const { about } = content
  return (
    <section className="section" id="about">
      <div className="container">
        <SectionHead num={num} label="about" />
        <div className="about__grid">
          <h2 className="h2 reveal">{about.quote}</h2>
          <div className="about__body">
            {about.paragraphs.map((p, i) => (
              <p key={i} className="reveal">
                {p}
              </p>
            ))}
          </div>
        </div>
        <dl className="about__stats">
          {about.stats.map((s, i) => (
            <div key={s.label} className="about__stat reveal" style={{ transitionDelay: `${i * 0.06}s` }}>
              <dt className="label">{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
