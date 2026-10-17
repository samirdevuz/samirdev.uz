import { useReveal } from './hooks/useReveal'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Projects } from './components/Projects'
import { Now } from './components/Now'
import { Toolkit } from './components/Toolkit'
import { Principles } from './components/Principles'
import { Journey } from './components/Journey'
import { Contact, Footer } from './components/Contact'

export default function App() {
  useReveal()
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About num="01" />
        <Projects num="02" />
        <Now num="03" />
        <Toolkit num="04" />
        <Principles num="05" />
        <Journey num="06" />
        <Contact num="07" />
      </main>
      <Footer />
    </>
  )
}
