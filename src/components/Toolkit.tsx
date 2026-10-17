import { content } from '../content'
import { SectionHead } from './SectionHead'
import './Toolkit.css'

export function Toolkit({ num }: { num: string }) {
  return (
    <section className="section">
      <div className="container">
        <SectionHead num={num} label="beyond products" />
        <div className="toolkit">
          <div className="toolkit__intro reveal">
            <h2 className="h2">Curious about most corners of IT.</h2>
            <div className="toolkit__langs">
              <span className="label">Languages</span>
              <div>
                {content.languages.map((l) => (
                  <span key={l} className="toolkit__lang">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <ul className="toolkit__list">
            {content.explorations.map((e, i) => (
              <li key={e.title} className="reveal" style={{ transitionDelay: `${i * 0.06}s` }}>
                <span className="mono toolkit__idx">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{e.title}</h3>
                  <p>{e.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
