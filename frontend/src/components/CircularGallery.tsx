import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';
import { useEffect, useRef } from 'react';

type GL = Renderer['gl'];

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: number;
  return function(this: any, ...args: Parameters<T>) {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1: number, p2: number, t: number): number { return p1 + (p2 - p1) * t; }

function getFontSize(font: string): number {
  const match = font.match(/(\d+)px/);
  return match ? parseInt(match[1], 10) : 30;
}

function createTextTexture(gl: GL, text: string, font = 'bold 30px monospace', color = 'white') {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  ctx.font = font;
  const metrics = ctx.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const fontSize = getFontSize(font);
  canvas.width = textWidth + 20;
  canvas.height = Math.ceil(fontSize * 1.2) + 20;
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

class Title {
  mesh!: Mesh;
  constructor({ gl, plane, text, textColor = '#FFFFFF', font = '30px sans-serif' }: any) {
    const { texture, width, height } = createTextTexture(gl, text, font, textColor);
    const geometry = new Plane(gl);
    const program = new Program(gl, {
      vertex: `attribute vec3 position;attribute vec2 uv;uniform mat4 modelViewMatrix;uniform mat4 projectionMatrix;varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragment: `precision highp float;uniform sampler2D tMap;varying vec2 vUv;void main(){vec4 c=texture2D(tMap,vUv);if(c.a<0.1)discard;gl_FragColor=c;}`,
      uniforms: { tMap: { value: texture } }, transparent: true,
    });
    this.mesh = new Mesh(gl, { geometry, program });
    const aspect = width / height, th = plane.scale.y * 0.15;
    this.mesh.scale.set(th * aspect, th, 1);
    this.mesh.position.y = -plane.scale.y * 0.5 - th * 0.5 - 0.05;
    this.mesh.setParent(plane);
  }
}

class Media {
  extra = 0; plane!: Mesh; program!: Program; title!: Title;
  scale!: number; padding!: number; width!: number; widthTotal!: number; x!: number;
  speed = 0; isBefore = false; isAfter = false;

  constructor(private opts: any) {
    this.createShader(); this.createMesh(); this.createTitle(); this.onResize();
  }

  createShader() {
    const texture = new Texture(this.opts.gl, { generateMipmaps: true });
    this.program = new Program(this.opts.gl, {
      depthTest: false, depthWrite: false,
      vertex: `precision highp float;attribute vec3 position;attribute vec2 uv;uniform mat4 modelViewMatrix;uniform mat4 projectionMatrix;uniform float uTime;uniform float uSpeed;varying vec2 vUv;void main(){vUv=uv;vec3 p=position;p.z=(sin(p.x*4.+uTime)*1.5+cos(p.y*2.+uTime)*1.5)*(0.1+uSpeed*0.5);gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
      fragment: `precision highp float;uniform vec2 uImageSizes;uniform vec2 uPlaneSizes;uniform sampler2D tMap;uniform float uBorderRadius;varying vec2 vUv;float rSDF(vec2 p,vec2 b,float r){vec2 d=abs(p)-b;return length(max(d,vec2(0.)))+min(max(d.x,d.y),0.)-r;}void main(){vec2 ratio=vec2(min((uPlaneSizes.x/uPlaneSizes.y)/(uImageSizes.x/uImageSizes.y),1.),min((uPlaneSizes.y/uPlaneSizes.x)/(uImageSizes.y/uImageSizes.x),1.));vec2 uv=vec2(vUv.x*ratio.x+(1.-ratio.x)*0.5,vUv.y*ratio.y+(1.-ratio.y)*0.5);vec4 color=texture2D(tMap,uv);float d=rSDF(vUv-0.5,vec2(0.5-uBorderRadius),uBorderRadius);float alpha=1.-smoothstep(-0.002,0.002,d);gl_FragColor=vec4(color.rgb,alpha);}`,
      uniforms: { tMap:{value:texture}, uPlaneSizes:{value:[0,0]}, uImageSizes:{value:[0,0]}, uSpeed:{value:0}, uTime:{value:100*Math.random()}, uBorderRadius:{value:this.opts.borderRadius||0} },
      transparent: true,
    });
    const img = new Image(); img.crossOrigin = 'anonymous'; img.src = this.opts.image;
    img.onload = () => { texture.image = img; this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight]; };
  }

  createMesh() { this.plane = new Mesh(this.opts.gl, { geometry: this.opts.geometry, program: this.program }); this.plane.setParent(this.opts.scene); }
  createTitle() { this.title = new Title({ gl:this.opts.gl, plane:this.plane, text:this.opts.text, textColor:this.opts.textColor, font:this.opts.font }); }

  update(scroll: { current: number; last: number }, direction: 'right'|'left') {
    this.plane.position.x = this.x - scroll.current - this.extra;
    const x = this.plane.position.x, H = this.opts.viewport.width / 2;
    if (this.opts.bend === 0) { this.plane.position.y = 0; this.plane.rotation.z = 0; }
    else {
      const B = Math.abs(this.opts.bend), R = (H*H + B*B) / (2*B), ex = Math.min(Math.abs(x), H);
      const arc = R - Math.sqrt(R*R - ex*ex);
      if (this.opts.bend > 0) { this.plane.position.y = -arc; this.plane.rotation.z = -Math.sign(x)*Math.asin(ex/R); }
      else { this.plane.position.y = arc; this.plane.rotation.z = Math.sign(x)*Math.asin(ex/R); }
    }
    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;
    const po = this.plane.scale.x/2, vo = this.opts.viewport.width/2;
    this.isBefore = this.plane.position.x + po < -vo;
    this.isAfter = this.plane.position.x - po > vo;
    if (direction === 'right' && this.isBefore) { this.extra -= this.widthTotal; this.isBefore = this.isAfter = false; }
    if (direction === 'left' && this.isAfter) { this.extra += this.widthTotal; this.isBefore = this.isAfter = false; }
  }

  onResize({ screen, viewport }: { screen?: any; viewport?: any } = {}) {
    if (screen) this.opts.screen = screen;
    if (viewport) { this.opts.viewport = viewport; }
    this.scale = this.opts.screen.height / 1500;
    this.plane.scale.y = (this.opts.viewport.height * (900*this.scale)) / this.opts.screen.height;
    this.plane.scale.x = (this.opts.viewport.width * (700*this.scale)) / this.opts.screen.width;
    this.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.padding = 2; this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.opts.length; this.x = this.width * this.opts.index;
  }
}

class App {
  container: HTMLElement; scroll: any; raf = 0; renderer!: Renderer; gl!: GL;
  camera!: Camera; scene!: Transform; planeGeometry!: Plane; medias: Media[] = [];
  screen!: any; viewport!: any; isDown = false; start = 0; scrollSpeed: number;
  onCheckDebounce!: () => void;
  // Stored bound handlers for proper cleanup
  _onResize!: () => void;
  _onWheel!: (e: any) => void;
  _onMouseDown!: (e: any) => void;
  _onMouseMove!: (e: any) => void;
  _onMouseUp!: () => void;
  _onTouchStart!: (e: any) => void;
  _onTouchMove!: (e: any) => void;
  _onTouchEnd!: () => void;


  constructor(container: HTMLElement, opts: any) {
    this.container = container;
    this.scrollSpeed = opts.scrollSpeed ?? 2;
    this.scroll = { ease: opts.scrollEase ?? 0.05, current: 0, target: 0, last: 0 };
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200);
    this.renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio||1,2) });
    this.gl = this.renderer.gl; this.gl.clearColor(0,0,0,0);
    container.appendChild(this.renderer.gl.canvas as HTMLCanvasElement);
    this.camera = new Camera(this.gl); this.camera.fov = 45; this.camera.position.z = 20;
    this.scene = new Transform();
    this.onResize();
    this.planeGeometry = new Plane(this.gl, { heightSegments: 50, widthSegments: 100 });
    this.createMedias(opts);
    this.update();
    // Global: resize + wheel (passive, don't block scroll)
    this._onResize = this.onResize.bind(this);
    this._onWheel = this.onWheel.bind(this);
    this._onMouseDown = this.onTouchDown.bind(this);
    this._onMouseMove = this.onTouchMove.bind(this);
    this._onMouseUp = this.onTouchUp.bind(this);
    this._onTouchStart = this.onTouchDown.bind(this);
    this._onTouchMove = this.onTouchMove.bind(this);
    this._onTouchEnd = this.onTouchUp.bind(this);
    window.addEventListener('resize', this._onResize);
    // Wheel on container (not window) so other sections can scroll
    container.addEventListener('wheel', this._onWheel, { passive: true });
    // Mouse drag on container
    container.addEventListener('mousedown', this._onMouseDown);
    window.addEventListener('mousemove', this._onMouseMove);
    window.addEventListener('mouseup', this._onMouseUp);
    // Touch drag scoped to the container — does NOT block page scroll
    container.addEventListener('touchstart', this._onTouchStart, { passive: true });
    container.addEventListener('touchmove', this._onTouchMove, { passive: true });
    container.addEventListener('touchend', this._onTouchEnd, { passive: true });
  }

  createMedias(opts: any) {
    const items = opts.items?.length ? opts.items : [
      { image:'https://picsum.photos/seed/1/800/600?grayscale', text:'Bridge' },
      { image:'https://picsum.photos/seed/2/800/600?grayscale', text:'Desk Setup' },
      { image:'https://picsum.photos/seed/3/800/600?grayscale', text:'Waterfall' },
      { image:'https://picsum.photos/seed/4/800/600?grayscale', text:'Strawberries' },
      { image:'https://picsum.photos/seed/5/800/600?grayscale', text:'Deep Diving' },
      { image:'https://picsum.photos/seed/16/800/600?grayscale', text:'Train Track' },
    ];
    const all = [...items, ...items];
    this.medias = all.map((data, index) => new Media({
      geometry: this.planeGeometry, gl: this.gl, image: data.image, index, length: all.length,
      renderer: this.renderer, scene: this.scene, screen: this.screen, text: data.text,
      viewport: this.viewport, bend: opts.bend ?? 3, textColor: opts.textColor ?? '#FFFFFF',
      borderRadius: opts.borderRadius ?? 0.05, font: opts.font ?? 'bold 30px sans-serif',
    }));
  }

  onTouchDown(e: any) { this.isDown = true; this.scroll.position = this.scroll.current; this.start = e.touches?.[0]?.clientX ?? e.clientX; }
  onTouchMove(e: any) {
    if (!this.isDown) return;
    const x = e.touches?.[0]?.clientX ?? e.clientX;
    this.scroll.target = (this.scroll.position ?? 0) + (this.start - x) * (this.scrollSpeed * 0.025);
  }
  onTouchUp() { this.isDown = false; this.onCheck(); }
  onWheel(e: any) {
    const delta = e.deltaY || e.wheelDelta || e.detail;
    this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.onCheckDebounce();
  }
  onCheck() {
    if (!this.medias?.[0]) return;
    const w = this.medias[0].width, idx = Math.round(Math.abs(this.scroll.target)/w);
    const item = w * idx; this.scroll.target = this.scroll.target < 0 ? -item : item;
  }
  onResize() {
    this.screen = { width: this.container.clientWidth, height: this.container.clientHeight };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.screen.width / this.screen.height });
    const fov = (this.camera.fov * Math.PI) / 180, h = 2 * Math.tan(fov/2) * this.camera.position.z;
    this.viewport = { width: h * this.camera.aspect, height: h };
    this.medias?.forEach(m => m.onResize({ screen: this.screen, viewport: this.viewport }));
  }
  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const dir = this.scroll.current > this.scroll.last ? 'right' : 'left';
    this.medias?.forEach(m => m.update(this.scroll, dir));
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = requestAnimationFrame(this.update.bind(this));
  }
  destroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('mouseup', this._onMouseUp);
    this.container.removeEventListener('wheel', this._onWheel);
    this.container.removeEventListener('mousedown', this._onMouseDown);
    this.container.removeEventListener('touchstart', this._onTouchStart);
    this.container.removeEventListener('touchmove', this._onTouchMove);
    this.container.removeEventListener('touchend', this._onTouchEnd);
    const c = this.renderer.gl.canvas as HTMLCanvasElement;
    c.parentNode?.removeChild(c);
  }
}

interface CircularGalleryProps {
  items?: { image: string; text: string }[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  scrollSpeed?: number;
  scrollEase?: number;
}

export default function CircularGallery({ items, bend=3, textColor='#FFFFFF', borderRadius=0.05, font='bold 30px sans-serif', scrollSpeed=2, scrollEase=0.05 }: CircularGalleryProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const app = new App(ref.current, { items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase });
    return () => app.destroy();
  }, [items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase]);
  return <div className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing" ref={ref} />;
}
