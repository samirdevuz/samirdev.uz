import { content } from '../content'
import { Block } from './Block'

export function About() {
  const { about } = content
  return (
    <Block id="about" label="About">
      <p className="lead reveal">{about.lead}</p>
      <p className="muted reveal" style={{ maxWidth: '60ch', marginTop: 20 }}>
        {about.text}
      </p>
    </Block>
  )
}
