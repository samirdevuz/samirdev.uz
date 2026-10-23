// Topo Field — an animated topographic backdrop: a faint 48px grid plus
// ultra-thin contour lines drawn from 2D simplex noise, drifting slowly.
//
// Shader adapted from TopoField in MengTo/threeui (MIT). The original ships the
// effect as a sandboxed iframe around a full demo page (Tailwind CDN, GSAP,
// Iconify); here it is a single WebGL canvas, rendered with a transparent
// background so the host page's own --bg shows through in both themes.
//
// One file, React only. Pauses while offscreen and draws a single still frame
// under prefers-reduced-motion.

import { useEffect, useRef, useState, type CSSProperties } from "react"

type TopoFieldMode = "dark" | "light"

export type TopoFieldProps = {
  /** "auto" follows data-theme on <html>, then prefers-color-scheme. */
  mode?: TopoFieldMode | "auto"
  /** Animation speed multiplier. */
  speed?: number
  /** Stretches/compresses the noise field driving the contour bands. */
  length?: number
  /** Multiplies the number of contour bands (visual density of lines). */
  density?: number
  /** Overall strength of the lines, 0–1. */
  opacity?: number
  className?: string
  style?: CSSProperties
}

const VERTEX = `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`

const FRAGMENT = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_dpr;
uniform float u_noiseScale;
uniform float u_bands;
uniform vec3 u_ink;
uniform float u_gridAlpha;
uniform float u_topoAlpha;
uniform float u_topoWidth;

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5; vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox; m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g; g.x = a0.x * x0.x + h.x * x0.y; g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  st.x *= u_resolution.x / u_resolution.y;

  // 1px physical grid
  float gridSize = 48.0 * u_dpr;
  vec2 gridFract = fract(gl_FragCoord.xy / gridSize);
  float lineThickness = 1.0 / gridSize;
  float grid = step(1.0 - lineThickness, gridFract.x) + step(1.0 - lineThickness, gridFract.y);
  grid = clamp(grid, 0.0, 1.0) * u_gridAlpha;

  // Ultra-thin contour lines
  vec2 noisePos = st * u_noiseScale + vec2(u_time * 0.015, u_time * 0.025);
  float n = snoise(noisePos) * 0.5 + 0.5;
  float tri = abs(fract(n * u_bands) - 0.5) * 2.0;
  float topo = smoothstep(u_topoWidth, 0.0, tri) * u_topoAlpha;

  float a = clamp(grid + topo, 0.0, 1.0);
  gl_FragColor = vec4(u_ink * a, a); // premultiplied
}
`

// Per-theme ink and line strengths, tuned against the site's --bg in each theme.
const LOOK: Record<TopoFieldMode, { ink: [number, number, number]; grid: number; topo: number; width: number }> = {
  dark: { ink: [1, 1, 1], grid: 0.07, topo: 0.4, width: 0.02 },
  light: { ink: [0.12, 0.14, 0.2], grid: 0.07, topo: 0.4, width: 0.03 },
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function readAutomaticMode(): TopoFieldMode {
  if (typeof document === "undefined") return "dark"
  const declared = document.documentElement.dataset.theme
  if (declared === "light" || declared === "dark") return declared
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function useResolvedMode(mode: TopoFieldMode | "auto") {
  const [auto, setAuto] = useState<TopoFieldMode>(readAutomaticMode)

  useEffect(() => {
    if (mode !== "auto") return
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const update = () => setAuto(readAutomaticMode())
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] })
    media.addEventListener("change", update)
    update()
    return () => {
      observer.disconnect()
      media.removeEventListener("change", update)
    }
  }, [mode])

  return mode === "auto" ? auto : mode
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  return shader
}

export default function TopoField({
  mode = "auto",
  speed = 1,
  length = 1,
  density = 1,
  opacity = 1,
  className,
  style,
}: TopoFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const resolvedMode = useResolvedMode(mode)

  // Live knobs read by the render loop without restarting it.
  const knobs = useRef({ speed: 1, length: 1, density: 1, opacity: 1, mode: resolvedMode })
  // Redraws a still frame when knobs change while the loop is paused.
  const redraw = useRef<() => void>(() => {})

  useEffect(() => {
    knobs.current = {
      speed: clamp(speed, 0, 3),
      length: clamp(length, 0.35, 2.5),
      density: clamp(density, 0.25, 2.5),
      opacity: clamp(opacity, 0, 1),
      mode: resolvedMode,
    }
    redraw.current()
  }, [speed, length, density, opacity, resolvedMode])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext("webgl", { alpha: true, antialias: false, depth: false, premultipliedAlpha: true })
    if (!gl) return

    const program = gl.createProgram()!
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX))
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT))
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, "a_position")
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const u = (name: string) => gl.getUniformLocation(program, name)
    const uResolution = u("u_resolution")
    const uTime = u("u_time")
    const uDpr = u("u_dpr")
    const uNoiseScale = u("u_noiseScale")
    const uBands = u("u_bands")
    const uInk = u("u_ink")
    const uGridAlpha = u("u_gridAlpha")
    const uTopoAlpha = u("u_topoAlpha")
    const uTopoWidth = u("u_topoWidth")

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uResolution, canvas.width, canvas.height)
      gl.uniform1f(uDpr, dpr)
    }
    const resizeObserver = new ResizeObserver(() => {
      resize()
      if (!running) draw()
    })
    resizeObserver.observe(canvas)
    resize()

    let time = 0
    let last = performance.now()
    let frame = 0
    let running = false
    let visible = true
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")

    const draw = () => {
      const k = knobs.current
      const look = LOOK[k.mode]
      gl.uniform1f(uTime, time)
      gl.uniform1f(uNoiseScale, 1.4 * k.length)
      gl.uniform1f(uBands, 10 * k.density)
      gl.uniform3f(uInk, look.ink[0], look.ink[1], look.ink[2])
      gl.uniform1f(uGridAlpha, look.grid * k.opacity)
      gl.uniform1f(uTopoAlpha, look.topo * k.opacity)
      gl.uniform1f(uTopoWidth, look.width)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    const tick = (now: number) => {
      time += ((now - last) / 1000) * knobs.current.speed
      last = now
      draw()
      frame = requestAnimationFrame(tick)
    }

    const sync = () => {
      const shouldRun = visible && !reducedMotion.matches
      if (shouldRun && !running) {
        running = true
        last = performance.now()
        frame = requestAnimationFrame(tick)
      } else if (!shouldRun && running) {
        running = false
        cancelAnimationFrame(frame)
      }
      if (!running) draw()
    }

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    intersection.observe(canvas)
    redraw.current = () => {
      if (!running) draw()
    }
    reducedMotion.addEventListener("change", sync)
    sync()

    return () => {
      cancelAnimationFrame(frame)
      redraw.current = () => {}
      resizeObserver.disconnect()
      intersection.disconnect()
      reducedMotion.removeEventListener("change", sync)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ display: "block", width: "100%", height: "100%", pointerEvents: "none", ...style }}
    />
  )
}
