import { useEffect, useRef } from 'react'
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  IcosahedronGeometry,
  Mesh,
  NormalBlending,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from 'three'
import { NOISE_GLSL } from './noise'

/**
 * Hero centrepiece: a slowly breathing orb whose surface is drawn with
 * topographic contour lines, orbited by a sparse ring of dust.
 *
 * Deliberately plain three.js rather than a React renderer — one scene, one
 * loop, nothing to reconcile. The component is lazy-loaded after first paint
 * so none of this sits on the LCP path, and the loop stops whenever the hero
 * is off screen or the tab is hidden.
 */

const ORB_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  uniform float uFreq;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vNoise;
  ${NOISE_GLSL}

  float field(vec3 p) {
    return snoise(p * uFreq + vec3(0.0, uTime * 0.18, uTime * 0.11))
         + 0.35 * snoise(p * uFreq * 2.3 - uTime * 0.12);
  }

  vec3 displace(vec3 p) {
    return p + normal * field(p) * uAmp;
  }

  void main() {
    // Rebuild the normal from two neighbouring displaced points, so the
    // lighting follows the moving surface rather than the base sphere.
    vec3 t = normalize(cross(normal, abs(normal.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
    vec3 b = normalize(cross(normal, t));
    float e = 0.012;
    vec3 p0 = displace(position);
    vec3 p1 = displace(position + t * e);
    vec3 p2 = displace(position + b * e);
    vec3 n = normalize(cross(p1 - p0, p2 - p0));
    if (dot(n, normal) < 0.0) n = -n;

    vNoise = field(position);
    vec4 mv = modelViewMatrix * vec4(p0, 1.0);
    vNormal = normalize(normalMatrix * n);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`

const ORB_FRAGMENT = /* glsl */ `
  uniform vec3 uInk;
  uniform vec3 uBase;
  uniform vec3 uShade;
  uniform vec3 uSky;
  uniform float uTime;
  uniform float uLines;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vNoise;

  void main() {
    vec3 n = normalize(vNormal);
    vec3 l = normalize(vec3(-0.55, 0.75, 0.6));
    float diff = clamp(dot(n, l) * 0.5 + 0.5, 0.0, 1.0);
    float fres = pow(1.0 - clamp(dot(n, vView), 0.0, 1.0), 2.6);

    vec3 col = mix(uShade, uBase, smoothstep(0.1, 0.95, diff));
    col = mix(col, uSky, fres * 0.85);

    // Contour lines: thin, anti-aliased isolines of the noise field.
    float v = vNoise * uLines;
    float w = fwidth(v) * 1.1;
    float line = 1.0 - smoothstep(0.0, w, abs(fract(v) - 0.5) - (0.5 - w));
    col = mix(col, uInk, line * 0.22 * (0.4 + diff));

    gl_FragColor = vec4(col, 1.0);
  }
`

const DUST_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uPixel;
  attribute float aSeed;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    float a = uTime * (0.04 + aSeed * 0.05);
    float c = cos(a), s = sin(a);
    p.xz = mat2(c, -s, s, c) * p.xz;
    p.y += sin(uTime * 0.6 + aSeed * 40.0) * 0.04;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uPixel * (1.2 + aSeed * 2.2) * (3.2 / -mv.z);
    vAlpha = 0.25 + 0.75 * fract(aSeed * 13.7);
  }
`

const DUST_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, a * vAlpha * uOpacity);
  }
`

const readRGB = (styles, name) => {
  const [r, g, b] = styles.getPropertyValue(name).trim().split(/\s+/).map(Number)
  return new Color(r / 255, g / 255, b / 255)
}

export default function HeroScene({ onReady }) {
  const host = useRef(null)

  useEffect(() => {
    const el = host.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const small = window.innerWidth < 768

    let renderer
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch {
      return // No WebGL: the CSS wash behind stays as the atmosphere.
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75))
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    const scene = new Scene()
    const camera = new PerspectiveCamera(32, 1, 0.1, 50)
    camera.position.set(0, 0, 6.4)

    const rig = new Group()
    scene.add(rig)

    const orbUniforms = {
      uTime: { value: 0 },
      uAmp: { value: 0.14 },
      uFreq: { value: 0.9 },
      uLines: { value: 9 },
      uInk: { value: new Color() },
      uBase: { value: new Color() },
      uShade: { value: new Color() },
      uSky: { value: new Color() },
    }
    const orb = new Mesh(
      new IcosahedronGeometry(1, small || coarse ? 48 : 96),
      new ShaderMaterial({
        uniforms: orbUniforms,
        vertexShader: ORB_VERTEX,
        fragmentShader: ORB_FRAGMENT,
      })
    )
    rig.add(orb)

    // Dust: points scattered in a flattened shell around the orb.
    const COUNT = small ? 420 : 900
    const pos = new Float32Array(COUNT * 3)
    const seed = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      const r = 1.55 + Math.pow(Math.random(), 1.6) * 1.9
      const th = Math.random() * Math.PI * 2
      const y = (Math.random() - 0.5) * 0.9 * (r - 1)
      pos[i * 3] = Math.cos(th) * r
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = Math.sin(th) * r
      seed[i] = Math.random()
    }
    const dustGeo = new BufferGeometry()
    dustGeo.setAttribute('position', new BufferAttribute(pos, 3))
    dustGeo.setAttribute('aSeed', new BufferAttribute(seed, 1))
    const dustUniforms = {
      uTime: { value: 0 },
      uPixel: { value: renderer.getPixelRatio() },
      uColor: { value: new Color() },
      uOpacity: { value: 0.55 },
    }
    const dustMat = new ShaderMaterial({
      uniforms: dustUniforms,
      vertexShader: DUST_VERTEX,
      fragmentShader: DUST_FRAGMENT,
      transparent: true,
      depthWrite: false,
    })
    const dust = new Points(dustGeo, dustMat)
    dust.rotation.z = 0.28
    rig.add(dust)

    // Theme: every colour comes from the same CSS tokens the page uses.
    const applyTheme = () => {
      const s = getComputedStyle(document.documentElement)
      const dark = s.getPropertyValue('color-scheme').trim() === 'dark'
      const ink = readRGB(s, '--c-ink')
      const bone = readRGB(s, '--c-bone')
      const sand = readRGB(s, '--c-sand')
      const sky = readRGB(s, '--c-sky')
      orbUniforms.uInk.value.copy(ink)
      orbUniforms.uSky.value.copy(sky)
      if (dark) {
        orbUniforms.uBase.value.copy(sand).lerp(ink, 0.18)
        orbUniforms.uShade.value.copy(bone).lerp(sand, 0.2)
        dustMat.blending = AdditiveBlending
        dustUniforms.uColor.value.copy(ink)
      } else {
        orbUniforms.uBase.value.copy(bone).lerp(new Color(1, 1, 1), 0.55)
        orbUniforms.uShade.value.copy(sand).lerp(ink, 0.12)
        dustMat.blending = NormalBlending
        dustUniforms.uColor.value.copy(ink)
      }
      dustMat.needsUpdate = true
    }
    applyTheme()
    const themeObserver = new MutationObserver(applyTheme)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', applyTheme)

    // Sizing follows the host box, not the window.
    const resize = () => {
      const { width, height } = el.getBoundingClientRect()
      if (!width || !height) return
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      // Keep the orb a constant share of the shorter side.
      camera.position.z = width < height ? 6.4 * (height / width) * 0.9 : 6.4
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    // Pointer and scroll feed targets; the loop eases toward them.
    const target = { x: 0, y: 0 }
    const eased = { x: 0, y: 0, scroll: 0 }
    const onMove = (e) => {
      target.x = e.clientX / window.innerWidth - 0.5
      target.y = e.clientY / window.innerHeight - 0.5
    }
    if (!coarse) window.addEventListener('pointermove', onMove, { passive: true })

    let visible = true
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
    })
    io.observe(el)

    let raf = 0
    let last = performance.now()
    let time = Math.random() * 20

    const frame = (now) => {
      raf = 0
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      time += dt

      const scroll = Math.min(window.scrollY / (window.innerHeight || 1), 1.2)
      const k = 1 - Math.pow(0.001, dt) // frame-rate independent easing
      eased.x += (target.x - eased.x) * k * 0.9
      eased.y += (target.y - eased.y) * k * 0.9
      eased.scroll += (scroll - eased.scroll) * k * 1.4

      orbUniforms.uTime.value = time
      dustUniforms.uTime.value = time
      orbUniforms.uAmp.value = 0.14 + eased.scroll * 0.2
      orbUniforms.uFreq.value = 0.9 + eased.scroll * 0.5

      orb.rotation.y = time * 0.07 + eased.x * 0.9
      orb.rotation.x = eased.y * 0.6
      rig.rotation.y = eased.x * 0.35
      rig.rotation.x = eased.y * 0.2 + eased.scroll * 0.5
      rig.position.y = eased.scroll * 0.9
      rig.scale.setScalar(1 + eased.scroll * 0.25)
      dust.rotation.y = -eased.scroll * 1.2

      renderer.render(scene, camera)
      if (!reduced && visible && !document.hidden) raf = requestAnimationFrame(frame)
    }

    function start() {
      if (raf || reduced) return
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
    const onVisibility = () => !document.hidden && visible && start()
    document.addEventListener('visibilitychange', onVisibility)

    // Reduced motion still gets the object — as a single still frame.
    if (reduced) frame(performance.now())
    else start()
    onReady?.()

    return () => {
      if (raf) cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      themeObserver.disconnect()
      mq.removeEventListener('change', applyTheme)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', onVisibility)
      orb.geometry.dispose()
      orb.material.dispose()
      dustGeo.dispose()
      dustMat.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [onReady])

  return <div ref={host} aria-hidden="true" className="absolute inset-0 [&>canvas]:h-full [&>canvas]:w-full" />
}
