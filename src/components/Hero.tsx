import { content } from '../content'
import TopoField from './ui/topo-field'
import './Hero.css'

export function Hero() {
  const { headline } = content
  const facts = [
    ['Name', content.name],
    ['Role', content.role],
    ['Based in', content.location],
    ['Building since', content.since],
  ]

  return (
    <section className="hero" id="top">
      <TopoField className="hero__topo" />
      <div className="container">
        <p className="hero__status mono reveal">
          <span className="hero__dot" aria-hidden="true" />
          {content.status}
        </p>
        <h1 className="display hero__title reveal">
          {headline.before} <span className="mark">{headline.mark}</span> {headline.after}
        </h1>

        <div className="hero__bottom reveal">
          <p className="hero__intro">{content.intro}</p>
          <div className="hero__cta">
            <a href={`mailto:${content.contact.email}`} className="hero__primary">
              Write to me <span className="hero__arrow">→</span>
            </a>
            <a href="#projects" className="hero__secondary">
              See projects
            </a>
          </div>
        </div>

        <dl className="hero__facts reveal">
          {facts.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
