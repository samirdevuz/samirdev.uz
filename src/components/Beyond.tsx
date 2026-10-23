import { content } from '../content'
import { Block } from './Block'
import './Beyond.css'

export function Beyond() {
  return (
    <Block label="Beyond products">
      <ul className="beyond">
        {content.explorations.map((e) => (
          <li key={e.title} className="reveal">
            <span className={`beyond__when mono${e.when === 'Now' ? ' is-now' : ''}`}>{e.when}</span>
            <span className="beyond__title">{e.title}</span>
            <span className="beyond__text">{e.text}</span>
          </li>
        ))}
      </ul>
    </Block>
  )
}
