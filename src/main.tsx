import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/global.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Hide the intro loader once it has been on screen for ~0.5s.
const LOADER_MS = 500
const loader = document.getElementById('loader')
if (loader) {
  const wait = Math.max(0, LOADER_MS - performance.now())
  setTimeout(() => {
    loader.classList.add('is-done')
    // Remove after the fade; the timeout covers tabs where transitionend never fires.
    setTimeout(() => loader.remove(), 400)
  }, wait)
}
