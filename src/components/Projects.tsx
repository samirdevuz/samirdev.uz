import { content } from '../content'
import { Block } from './Block'
import './Projects.css'

export function Projects() {
  const { openSlot } = content
  return (
    <Block id="projects" label="Projects">
      <ul className="work">
        {content.projects.map((p) => (
          <li key={p.name} className="reveal">
            <a className="work__row" href={p.href} target="_blank" rel="noreferrer">
              <span className="work__head">
                <span className="work__name">{p.name}</span>
                <span className="work__tags mono">{p.tags.join(' · ')}</span>
              </span>
              <span className="work__text">{p.text}</span>
              <span className="work__link mono">
                {p.href.replace(/^https?:\/\//, '')} <span className="work__arrow">↗</span>
              </span>
            </a>
          </li>
        ))}
        <li className="reveal">
          <a className="work__row work__row--open" href={`mailto:${content.contact.email}`}>
            <span className="work__head">
              <span className="work__name">{openSlot.name}</span>
              <span className="work__tags mono">Open slot</span>
            </span>
            <span className="work__text">{openSlot.text}</span>
            <span className="work__link mono">
              {openSlot.cta} <span className="work__arrow">→</span>
            </span>
          </a>
        </li>
      </ul>
    </Block>
  )
}
