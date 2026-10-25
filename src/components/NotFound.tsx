import GradientASCII from './ui/gradient-ascii'
import './NotFound.css'

export function NotFound() {
  return (
    <main className="nf">
      <GradientASCII className="nf__sky" shape="horizon" cellSize={16} glow={0.3} />
      <div className="nf__center">
        <h1 className="nf__code">404</h1>
        <p className="nf__text mono">Not found</p>
        <a href="/" className="nf__home mono link-underline">
          ← home
        </a>
      </div>
    </main>
  )
}
