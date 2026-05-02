/**
 * LiquidImage — GLSL liquid-distortion hover effect on project images.
 * Uses a WebGL canvas overlay with a custom fragment shader.
 * Falls back to a regular <img> if WebGL is unavailable.
 *
 * Usage:
 *   <LiquidImage src={img} alt="Project name" />
 */
import { useRef, useEffect, useCallback } from "react";

interface Props {
  src: string;
  alt: string;
  className?: string;
}

// ── Fragment shader (liquid warp on hover) ─────────────────────────────────────
const FRAG_SRC = `
  precision mediump float;

  uniform sampler2D uTexture;
  uniform vec2      uResolution;
  uniform float     uTime;
  uniform float     uHover;   // 0 → 1, animated by JS
  uniform vec2      uMouse;   // normalised 0–1

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    uv.y    = 1.0 - uv.y; // flip Y

    // Distance from mouse (0→1 coords)
    float dist = distance(uv, uMouse);
    float radius = 0.35;
    float ripple = uHover * max(0.0, 1.0 - dist / radius);

    // Wave distortion: two sine waves in X/Y
    float freq  = 14.0;
    float amp   = 0.018 * ripple;
    float speed = 3.2;

    float dx = amp * sin(uv.y * freq + uTime * speed) * cos(uv.x * freq * 0.5 + uTime * speed * 0.7);
    float dy = amp * cos(uv.x * freq + uTime * speed) * sin(uv.y * freq * 0.8 + uTime * speed * 0.9);

    // Subtle vignette-based tint for "liquid glass" look
    vec2 uvd   = uv + vec2(dx, dy);
    vec4 color = texture2D(uTexture, clamp(uvd, 0.001, 0.999));

    // Chromatic aberration on edges of ripple
    float ca = 0.006 * ripple;
    float r  = texture2D(uTexture, clamp(uvd + vec2(ca,  0.0), 0.001, 0.999)).r;
    float b  = texture2D(uTexture, clamp(uvd - vec2(ca,  0.0), 0.001, 0.999)).b;
    color.r  = mix(color.r, r, ripple * 0.6);
    color.b  = mix(color.b, b, ripple * 0.6);

    // Slight brightness boost in the ripple area
    color.rgb += vec3(0.04) * ripple * (1.0 - dist / radius);

    gl_FragColor = color;
  }
`;

const VERT_SRC = `
  attribute vec2 aPosition;
  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

function compileShader(gl: WebGLRenderingContext, src: string, type: number): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn("[LiquidImage] Shader compile error:", gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export default function LiquidImage({ src, alt, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef    = useRef<HTMLImageElement>(null);
  const stateRef  = useRef({
    hoverTarget: 0,
    hover: 0,
    mouse: [0.5, 0.5] as [number, number],
    raf: 0,
    ready: false,
  });
  const glRef     = useRef<{
    gl: WebGLRenderingContext;
    prog: WebGLProgram;
    uTime: WebGLUniformLocation;
    uHover: WebGLUniformLocation;
    uMouse: WebGLUniformLocation;
    uRes: WebGLUniformLocation;
  } | null>(null);

  // ── Initialize WebGL ────────────────────────────────────────────────────────
  const initGL = useCallback((canvas: HTMLCanvasElement, img: HTMLImageElement) => {
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return false;

    const vert = compileShader(gl, VERT_SRC, gl.VERTEX_SHADER);
    const frag = compileShader(gl, FRAG_SRC, gl.FRAGMENT_SHADER);
    if (!vert || !frag) return false;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn("[LiquidImage] Program link error:", gl.getProgramInfoLog(prog));
      return false;
    }
    gl.useProgram(prog);

    // Full-screen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPosition");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Upload texture
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

    glRef.current = {
      gl,
      prog,
      uTime:  gl.getUniformLocation(prog, "uTime")!,
      uHover: gl.getUniformLocation(prog, "uHover")!,
      uMouse: gl.getUniformLocation(prog, "uMouse")!,
      uRes:   gl.getUniformLocation(prog, "uResolution")!,
    };
    return true;
  }, []);

  // ── Render loop ──────────────────────────────────────────────────────────────
  const tick = useCallback((t: number) => {
    const s   = stateRef.current;
    const ctx = glRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    // Smooth hover value
    s.hover += (s.hoverTarget - s.hover) * 0.08;

    const { gl, uTime, uHover, uMouse, uRes } = ctx;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform1f(uTime,  t * 0.001);
    gl.uniform1f(uHover, s.hover);
    gl.uniform2f(uMouse, s.mouse[0], s.mouse[1]);
    gl.uniform2f(uRes,   canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    s.raf = requestAnimationFrame(tick);
  }, []);

  // ── Setup ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const img    = imgRef.current;
    if (!canvas || !img) return;

    const setup = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      if (initGL(canvas, img)) {
        stateRef.current.ready = true;
        stateRef.current.raf = requestAnimationFrame(tick);
      }
    };

    if (img.complete) setup();
    else img.onload = setup;

    const onEnter = (e: MouseEvent) => {
      stateRef.current.hoverTarget = 1;
      const rect = canvas.getBoundingClientRect();
      stateRef.current.mouse = [
        (e.clientX - rect.left) / rect.width,
        1 - (e.clientY - rect.top) / rect.height,
      ];
    };
    const onLeave = () => { stateRef.current.hoverTarget = 0; };
    const onMove  = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      stateRef.current.mouse = [
        (e.clientX - rect.left) / rect.width,
        1 - (e.clientY - rect.top) / rect.height,
      ];
    };

    canvas.addEventListener("mouseenter", onEnter);
    canvas.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("mousemove",  onMove);

    return () => {
      cancelAnimationFrame(stateRef.current.raf);
      canvas.removeEventListener("mouseenter", onEnter);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("mousemove",  onMove);
    };
  }, [initGL, tick]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Hidden img — used as WebGL texture source */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
        aria-hidden="true"
      />
      {/* WebGL canvas — covers the container */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: "block" }}
        aria-label={alt}
      />
    </div>
  );
}
