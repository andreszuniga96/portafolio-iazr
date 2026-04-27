import React, { useEffect, useRef, useCallback, useMemo } from 'react';

const DEFAULT_INNER_GRADIENT = 'linear-gradient(145deg,#FFFFFF1a 0%,#F59E0B22 100%)';

const clamp = (v: number, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v: number, p = 3) => parseFloat(v.toFixed(p));
const adjust = (v: number, fMin: number, fMax: number, tMin: number, tMax: number) =>
  round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

// Inject keyframes once
if (typeof document !== 'undefined' && !document.getElementById('pc-kf')) {
  const s = document.createElement('style');
  s.id = 'pc-kf';
  s.textContent = `@keyframes pc-holo-bg{0%{background-position:0 var(--background-y),0 0,center}100%{background-position:0 var(--background-y),90% 90%,center}}`;
  document.head.appendChild(s);
}

interface ProfileCardProps {
  avatarUrl?: string;
  name?: string;
  title?: string;
  handle?: string;
  status?: string;
  contactText?: string;
  onContactClick?: () => void;
  innerGradient?: string;
  className?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  avatarUrl = '', name = 'Ivan Zuñiga', title = 'Full-Stack & AI Engineer',
  handle = 'iazr', status = 'Disponible ✓', contactText = 'Contactar',
  onContactClick, innerGradient, className = '',
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const cardStyle = useMemo(() => ({
    '--inner-gradient': innerGradient ?? DEFAULT_INNER_GRADIENT,
    '--behind-glow-color': 'rgba(255,255,255,0.5)',
    '--behind-glow-size': '50%',
    '--pointer-x': '50%', '--pointer-y': '50%',
    '--pointer-from-center': '0', '--pointer-from-top': '0.5', '--pointer-from-left': '0.5',
    '--card-opacity': '0', '--rotate-x': '0deg', '--rotate-y': '0deg',
    '--background-x': '50%', '--background-y': '50%', '--card-radius': '30px',
    '--sunpillar-1': 'hsl(21,100%,57%)', '--sunpillar-2': 'hsl(38,92%,50%)',
    '--sunpillar-3': 'hsl(270,80%,60%)', '--sunpillar-4': 'hsl(200,90%,60%)',
    '--sunpillar-5': 'hsl(21,100%,57%)', '--sunpillar-6': 'hsl(38,92%,50%)',
    '--sunpillar-clr-1': 'var(--sunpillar-1)', '--sunpillar-clr-2': 'var(--sunpillar-2)',
    '--sunpillar-clr-3': 'var(--sunpillar-3)', '--sunpillar-clr-4': 'var(--sunpillar-4)',
    '--sunpillar-clr-5': 'var(--sunpillar-5)', '--sunpillar-clr-6': 'var(--sunpillar-6)',
  }), [innerGradient]);

  const setVars = useCallback((x: number, y: number) => {
    const shell = shellRef.current, wrap = wrapRef.current;
    if (!shell || !wrap) return;
    const w = shell.clientWidth || 1, h = shell.clientHeight || 1;
    const px = clamp((100/w)*x), py = clamp((100/h)*y);
    const cx = px - 50, cy = py - 50;
    [['--pointer-x',`${px}%`],['--pointer-y',`${py}%`],['--background-x',`${adjust(px,0,100,35,65)}%`],
     ['--background-y',`${adjust(py,0,100,35,65)}%`],['--pointer-from-center',`${clamp(Math.hypot(py-50,px-50)/50,0,1)}`],
     ['--pointer-from-top',`${py/100}`],['--pointer-from-left',`${px/100}`],
     ['--rotate-x',`${round(-(cx/5))}deg`],['--rotate-y',`${round(cy/4)}deg`]
    ].forEach(([k,v]) => wrap.style.setProperty(k as string, v as string));
  }, []);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const onMove = (e: PointerEvent) => {
      const rect = shell.getBoundingClientRect();
      setVars(e.clientX - rect.left, e.clientY - rect.top);
    };
    const onEnter = () => shell.classList.add('active');
    const onLeave = () => { shell.classList.remove('active'); setVars(shell.clientWidth/2, shell.clientHeight/2); };
    shell.addEventListener('pointerenter', onEnter);
    shell.addEventListener('pointermove', onMove);
    shell.addEventListener('pointerleave', onLeave);
    return () => { shell.removeEventListener('pointerenter', onEnter); shell.removeEventListener('pointermove', onMove); shell.removeEventListener('pointerleave', onLeave); };
  }, [setVars]);

  const cr = '30px';
  const shineStyle: React.CSSProperties = {
    animation: 'pc-holo-bg 18s linear infinite', mixBlendMode: 'color-dodge',
    filter: 'brightness(0.66) contrast(1.33) saturate(0.33) opacity(0.5)',
    transform: 'translate3d(0,0,1px)', overflow: 'hidden', zIndex: 3,
    gridArea: '1/-1', borderRadius: cr, pointerEvents: 'none',
    backgroundSize: 'cover', backgroundPosition: 'center',
    backgroundImage: `repeating-linear-gradient(0deg,var(--sunpillar-clr-1) 5%,var(--sunpillar-clr-2) 10%,var(--sunpillar-clr-3) 15%,var(--sunpillar-clr-4) 20%,var(--sunpillar-clr-5) 25%,var(--sunpillar-clr-6) 30%,var(--sunpillar-clr-1) 35%),repeating-linear-gradient(-45deg,#0e152e 0%,hsl(180,10%,60%) 3.8%,hsl(180,29%,66%) 4.5%,hsl(180,10%,60%) 5.2%,#0e152e 10%,#0e152e 12%),radial-gradient(farthest-corner circle at var(--pointer-x) var(--pointer-y),hsla(0,0%,0%,0.1) 12%,hsla(0,0%,0%,0.15) 20%,hsla(0,0%,0%,0.25) 120%)`,
  };
  const glareStyle: React.CSSProperties = {
    transform: 'translate3d(0,0,1.1px)', overflow: 'hidden', zIndex: 4,
    backgroundImage: `radial-gradient(farthest-corner circle at var(--pointer-x) var(--pointer-y),hsl(248,25%,80%) 12%,hsla(207,40%,30%,0.8) 90%)`,
    mixBlendMode: 'overlay', filter: 'brightness(0.8) contrast(1.2)',
    gridArea: '1/-1', borderRadius: cr, pointerEvents: 'none',
  };

  return (
    <div ref={wrapRef} className={`relative touch-none ${className}`.trim()}
      style={{ perspective: '500px', transform: 'translate3d(0,0,0.1px)', ...cardStyle } as React.CSSProperties}>
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: `radial-gradient(circle at var(--pointer-x) var(--pointer-y), var(--behind-glow-color) 0%, transparent var(--behind-glow-size))`, filter: 'blur(50px)' }} />
      <div ref={shellRef} className="relative z-[1]">
        <section className="grid relative overflow-hidden"
          style={{ height:'80svh', maxHeight:'540px', aspectRatio:'0.718', borderRadius:cr, background:'rgba(0,0,0,0.9)', backfaceVisibility:'hidden',
            boxShadow:'rgba(0,0,0,0.8) calc((var(--pointer-from-left)*10px)-3px) calc((var(--pointer-from-top)*20px)-6px) 20px -5px',
            transition:'transform 1s ease', transform:'translateZ(0) rotateX(0deg) rotateY(0deg)' }}
          onMouseEnter={e => { e.currentTarget.style.transition='none'; e.currentTarget.style.transform='translateZ(0) rotateX(var(--rotate-y)) rotateY(var(--rotate-x))'; }}
          onMouseLeave={e => { e.currentTarget.style.transition='transform 1s ease'; e.currentTarget.style.transform='translateZ(0) rotateX(0deg) rotateY(0deg)'; }}>
          <div className="absolute inset-0" style={{ backgroundImage:'var(--inner-gradient)', backgroundColor:'rgba(0,0,0,0.9)', borderRadius:cr, display:'grid', gridArea:'1/-1' }}>
            <div style={shineStyle} />
            <div style={glareStyle} />
            <div className="overflow-visible" style={{ mixBlendMode:'luminosity', transform:'translateZ(2px)', gridArea:'1/-1', borderRadius:cr, pointerEvents:'none' }}>
              {avatarUrl && <img className="w-full absolute left-1/2 bottom-[-1px]" src={avatarUrl} alt={`${name} avatar`} loading="lazy"
                style={{ transformOrigin:'50% 100%', transform:'translateX(calc(-50% + (var(--pointer-from-left) - 0.5)*6px)) translateZ(0)', borderRadius:cr }} />}
              <div className="absolute z-[2] flex items-center justify-between backdrop-blur-[30px] border border-white/10"
                style={{ bottom:'20px', left:'20px', right:'20px', background:'rgba(255,255,255,0.1)', borderRadius:'16px', padding:'12px 14px' }}>
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-semibold text-white/90">@{handle}</div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /><div className="text-xs text-white/60">{status}</div></div>
                </div>
                <button className="border border-white/10 rounded-lg px-4 py-2 text-xs font-semibold text-white/90 hover:border-white/40 hover:-translate-y-px transition-all"
                  onClick={onContactClick} type="button">{contactText}</button>
              </div>
            </div>
            <div className="max-h-full overflow-hidden text-center relative z-[5]"
              style={{ transform:'translate3d(calc(var(--pointer-from-left)*-6px + 3px),calc(var(--pointer-from-top)*-6px + 3px),0.1px)', mixBlendMode:'luminosity', gridArea:'1/-1', borderRadius:cr, pointerEvents:'none' }}>
              <div className="w-full absolute flex flex-col" style={{ top:'3em' }}>
                <h3 className="font-semibold m-0" style={{ fontSize:'min(5svh,3em)', backgroundImage:'linear-gradient(to bottom,#fff,#FFFFFF)', backgroundSize:'1em 1.5em', WebkitTextFillColor:'transparent', backgroundClip:'text', WebkitBackgroundClip:'text' }}>
                  {name}
                </h3>
                <p className="font-semibold whitespace-nowrap mx-auto w-min" style={{ position:'relative', top:'-12px', fontSize:'16px', margin:'0 auto', backgroundImage:'linear-gradient(to bottom,#fff,#F59E0B)', WebkitTextFillColor:'transparent', backgroundClip:'text', WebkitBackgroundClip:'text' }}>
                  {title}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default React.memo(ProfileCard);
