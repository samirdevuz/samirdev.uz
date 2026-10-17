import { content } from '../content'
import { SectionHead } from './SectionHead'
import './Journey.css'

export function Journey({ num }: { num: string }) {
  const items = content.journey
  return (
    <section className="section">
      <div className="container">
        <SectionHead num={num} label="journey" />
        <ol className="track" style={{ ['--count' as string]: items.length }}>
          {items.map((item, i) => (
            <li key={item.year} className="track__item reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
              <span className="track__year">{item.year}</span>
              <div className="track__rail" aria-hidden="true">
                <span className="track__node" />
              </div>
              <div className="track__body">
                <div className="track__head">
                  <h3>{item.title}</h3>
                  <span className="tag">{item.role}</span>
                </div>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
