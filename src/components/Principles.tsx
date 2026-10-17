import { content } from '../content'
import { SectionHead } from './SectionHead'
import './Principles.css'

export function Principles({ num }: { num: string }) {
  return (
    <section className="section">
      <div className="container">
        <SectionHead num={num} label="how i work" />
        <ol className="principles">
          {content.principles.map((p, i) => (
            <li key={p.title} className="principle reveal">
              <span className="principle__num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="principle__title">{p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
