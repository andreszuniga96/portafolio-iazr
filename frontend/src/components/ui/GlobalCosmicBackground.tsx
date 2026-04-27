import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * GlobalCosmicBackground — Espacial Minimalista
 * ────────────────────────────────────────────────────────────────
 * Capa WebGL persistente fija detrás de todas las secciones.
 * - Starfield 3D con parallax por scroll
 * - Cosmic dust en lentas órbitas
 * - Nebula glow que cambia tono según la sección visible (color hue)
 *
 * Performance:
 * - Una sola escena Three.js, un solo render loop
 * - Pause cuando la pestaña está oculta (visibilitychange)
 * - DPR limitado a 1.5 para móviles
 */
const GlobalCosmicBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // ── Renderer + Scene + Camera ────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2200);
    camera.position.z = 600;

    // ── Starfield ────────────────────────────────────────────────
    const STAR_COUNT = 1800;
    const starsGeom = new THREE.BufferGeometry();
    const starPositions = new Float32Array(STAR_COUNT * 3);
    const starColors = new Float32Array(STAR_COUNT * 3);
    const starSizes = new Float32Array(STAR_COUNT);

    const c1 = new THREE.Color("#C7D2FE"); // moon
    const c2 = new THREE.Color("#A8B5E5"); // moon-soft
    const c3 = new THREE.Color("#FFFFFF"); // white core

    for (let i = 0; i < STAR_COUNT; i++) {
      const idx = i * 3;
      // Distribute stars in a large sphere around camera
      const radius = 200 + Math.random() * 1700;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[idx + 0] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[idx + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[idx + 2] = radius * Math.cos(phi);

      // Color: 70% white-icy, 25% moon-light, 5% violet accent
      const r = Math.random();
      const col = r < 0.7 ? c3 : r < 0.95 ? c1 : c2;
      starColors[idx + 0] = col.r;
      starColors[idx + 1] = col.g;
      starColors[idx + 2] = col.b;

      // Size: most are tiny, a few are bigger
      starSizes[i] = Math.random() < 0.92 ? Math.random() * 1.2 + 0.4 : Math.random() * 2 + 1.6;
    }
    starsGeom.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starsGeom.setAttribute("color",    new THREE.BufferAttribute(starColors, 3));
    starsGeom.setAttribute("aSize",    new THREE.BufferAttribute(starSizes, 1));

    // Custom shader for soft circular stars with glow
    const starsMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:   { value: 0 },
        uPxRatio: { value: renderer.getPixelRatio() },
      },
      vertexShader: /* glsl */`
        attribute float aSize;
        varying vec3 vColor;
        varying float vSize;
        uniform float uTime;
        uniform float uPxRatio;
        void main() {
          vColor = color;
          vSize = aSize;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          // Twinkle: subtle size oscillation
          float twinkle = 0.85 + 0.15 * sin(uTime * 1.6 + position.x * 0.04 + position.y * 0.03);
          gl_PointSize = aSize * uPxRatio * 1.6 * twinkle * (300.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */`
        varying vec3 vColor;
        varying float vSize;
        void main() {
          vec2 c = gl_PointCoord - vec2(0.5);
          float d = length(c);
          // Smooth circular alpha with subtle halo
          float core = smoothstep(0.5, 0.0, d);
          float halo = smoothstep(0.5, 0.15, d) * 0.35;
          float a = core + halo;
          if (a < 0.02) discard;
          gl_FragColor = vec4(vColor, a);
        }
      `,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(starsGeom, starsMat);
    scene.add(stars);

    // ── Cosmic dust (slow orbiting nebula particles) ─────────────
    const DUST_COUNT = 240;
    const dustGeom = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(DUST_COUNT * 3);
    const dustColors = new Float32Array(DUST_COUNT * 3);
    const dustSizes = new Float32Array(DUST_COUNT);

    const dColA = new THREE.Color("#7C66FF"); // cosmic violet
    const dColB = new THREE.Color("#C7D2FE"); // moon

    for (let i = 0; i < DUST_COUNT; i++) {
      const idx = i * 3;
      const r = 80 + Math.random() * 600;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      dustPositions[idx + 0] = r * Math.sin(p) * Math.cos(t);
      dustPositions[idx + 1] = r * Math.sin(p) * Math.sin(t);
      dustPositions[idx + 2] = r * Math.cos(p);
      const c = Math.random() < 0.5 ? dColA : dColB;
      dustColors[idx + 0] = c.r;
      dustColors[idx + 1] = c.g;
      dustColors[idx + 2] = c.b;
      dustSizes[i] = 8 + Math.random() * 24;
    }
    dustGeom.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    dustGeom.setAttribute("color",    new THREE.BufferAttribute(dustColors, 3));
    dustGeom.setAttribute("aSize",    new THREE.BufferAttribute(dustSizes, 1));

    const dustMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uPxRatio: { value: renderer.getPixelRatio() } },
      vertexShader: /* glsl */`
        attribute float aSize;
        varying vec3 vColor;
        uniform float uTime;
        uniform float uPxRatio;
        void main() {
          vColor = color;
          vec3 pos = position;
          float a = uTime * 0.04;
          float ca = cos(a), sa = sin(a);
          // Slow rotation around Y axis
          pos.xz = mat2(ca, -sa, sa, ca) * pos.xz;
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = aSize * uPxRatio * (300.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */`
        varying vec3 vColor;
        void main() {
          vec2 c = gl_PointCoord - vec2(0.5);
          float d = length(c);
          float a = smoothstep(0.5, 0.0, d) * 0.18;
          if (a < 0.005) discard;
          gl_FragColor = vec4(vColor, a);
        }
      `,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeom, dustMat);
    scene.add(dust);

    // ── Nebula glow (faint sphere as soft fog) ───────────────────
    const nebula = new THREE.Mesh(
      new THREE.SphereGeometry(1700, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x1a1d2e,
        side: THREE.BackSide,
        transparent: true,
        opacity: 0.25,
      })
    );
    scene.add(nebula);

    // ── State for parallax ───────────────────────────────────────
    let scrollY = window.scrollY;
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    const onScroll = () => { scrollY = window.scrollY; };
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    let isHidden = false;
    const onVisibility = () => { isHidden = document.hidden; };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    // ── Animate ──────────────────────────────────────────────────
    const clock = new THREE.Clock();
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      if (isHidden) return;
      const t = clock.getElapsedTime();

      // Parallax: smooth follow mouse + scroll (vertical drift)
      targetX += (mouseX * 30 - targetX) * 0.04;
      targetY += (mouseY * 18 - targetY) * 0.04;
      camera.position.x = targetX;
      camera.position.y = targetY + scrollY * 0.025;
      camera.lookAt(0, scrollY * 0.025, 0);

      starsMat.uniforms.uTime.value = t;
      dustMat.uniforms.uTime.value = t;
      stars.rotation.y = t * 0.008;
      stars.rotation.x = t * 0.003;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      starsGeom.dispose();
      starsMat.dispose();
      dustGeom.dispose();
      dustMat.dispose();
      (nebula.geometry as THREE.BufferGeometry).dispose();
      (nebula.material as THREE.Material).dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
};

export default GlobalCosmicBackground;
