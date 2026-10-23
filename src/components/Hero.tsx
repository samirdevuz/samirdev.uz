import { content } from '../content'
import TopoField from './ui/topo-field'
import './Hero.css'

export function Hero() {
  const { headline } = content
  const facts = [
    ['name', content.name],
    ['role', content.role],
    ['based', content.location],
    ['since', content.about.stats[0].value],
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

        <div className="hero__bottom">
          <div className="reveal">
            <p className="hero__intro">{content.intro}</p>
            <div className="hero__cta">
              <a href={`mailto:${content.contact.email}`} className="btn btn-solid">
                Write to me <span className="arrow">→</span>
              </a>
              <a href="#about" className="btn btn-ghost">
                About me
              </a>
            </div>
          </div>

          <dl className="hero__card mono reveal">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
