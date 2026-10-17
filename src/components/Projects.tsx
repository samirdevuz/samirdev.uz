import { content } from '../content'
import { SectionHead } from './SectionHead'
import './Projects.css'

export function Projects({ num }: { num: string }) {
  return (
    <section className="section" id="projects">
      <div className="container">
        <SectionHead num={num} label="projects" />
        <ul className="projects">
          {content.projects.map((p, i) => {
            const live = p.status === 'Live'
            const inner = (
              <>
                <div className="project__top">
                  <span className={`project__status mono${live ? ' is-live' : ''}`}>
                    <span className="project__dot" aria-hidden="true" />
                    {p.status}
                  </span>
                  {p.href && <span className="mono project__url">{p.href.replace(/^https?:\/\//, '')} ↗</span>}
                </div>
                <h3 className="project__name">{p.name}</h3>
                <p className="project__text">{p.text}</p>
                <div className="project__tags">
                  {p.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </>
            )
            return (
              <li key={p.name} className="reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                {p.href ? (
                  <a className="project is-link" href={p.href} target="_blank" rel="noreferrer">
                    {inner}
                  </a>
                ) : (
                  <div className="project is-wip">{inner}</div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
