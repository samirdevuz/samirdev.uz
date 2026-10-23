import { useReveal } from './hooks/useReveal'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Projects } from './components/Projects'
import { Beyond } from './components/Beyond'
import { Stack } from './components/Stack'
import { Contact, Footer } from './components/Contact'

export default function App() {
  useReveal()
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Beyond />
        <Stack />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
