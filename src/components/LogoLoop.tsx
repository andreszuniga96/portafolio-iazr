import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type LogoItem =
  | { node: React.ReactNode; href?: string; title?: string; ariaLabel?: string; }
  | { src: string; alt?: string; href?: string; title?: string; width?: number; height?: number; };

export interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number;
  direction?: 'left' | 'right';
  width?: number | string;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  fadeOut?: boolean;
  scaleOnHover?: boolean;
  className?: string;
}

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(' ');

const LogoLoop = React.memo<LogoLoopProps>(({
  logos, speed = 80, direction = 'left', width = '100%', logoHeight = 32, gap = 40,
  pauseOnHover = true, scaleOnHover = false, className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<HTMLUListElement>(null);
  const [seqWidth, setSeqWidth] = useState(0);
  const [copyCount, setCopyCount] = useState(2);
  const [isHovered, setIsHovered] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  const targetVelocity = useMemo(() => {
    return Math.abs(speed) * (direction === 'left' ? 1 : -1);
  }, [speed, direction]);

  const updateDimensions = useCallback(() => {
    const cw = containerRef.current?.clientWidth ?? 0;
    const sw = seqRef.current?.getBoundingClientRect().width ?? 0;
    if (sw > 0) {
      setSeqWidth(Math.ceil(sw));
      setCopyCount(Math.max(2, Math.ceil(cw / sw) + 2));
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    const obs = new ResizeObserver(updateDimensions);
    if (containerRef.current) obs.observe(containerRef.current);
    if (seqRef.current) obs.observe(seqRef.current);
    return () => obs.disconnect();
  }, [logos, gap, logoHeight, updateDimensions]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || seqWidth === 0) return;

    const animate = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.max(0, ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      const target = isHovered && pauseOnHover ? 0 : targetVelocity;
      const k = 1 - Math.exp(-dt / 0.25);
      velocityRef.current += (target - velocityRef.current) * k;
      let next = ((offsetRef.current + velocityRef.current * dt) % seqWidth + seqWidth) % seqWidth;
      offsetRef.current = next;
      track.style.transform = `translate3d(${-next}px,0,0)`;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); lastTsRef.current = null; };
  }, [targetVelocity, seqWidth, isHovered, pauseOnHover]);

  const renderItem = useCallback((item: LogoItem, key: React.Key) => {
    const isNode = 'node' in item;
    const inner = isNode
      ? <span className="inline-flex items-center">{(item as any).node}</span>
      : <img className={cx('block object-contain pointer-events-none', scaleOnHover && 'transition-transform duration-300 group-hover/item:scale-110')}
          src={(item as any).src} alt={(item as any).alt ?? ''} width={(item as any).width} height={(item as any).height}
          style={{ height: logoHeight, width: 'auto' }} loading="lazy" draggable={false} />;

    const wrapped = (item as any).href
      ? <a className="inline-flex items-center no-underline hover:opacity-80 transition-opacity" href={(item as any).href} target="_blank" rel="noreferrer">{inner}</a>
      : inner;

    return (
      <li key={key} className={cx('flex-none leading-[1]', scaleOnHover && 'group/item')} style={{ marginRight: gap }}>
        {wrapped}
      </li>
    );
  }, [logoHeight, gap, scaleOnHover]);

  return (
    <div ref={containerRef} className={cx('relative overflow-x-hidden', className)} style={{ width }}
      onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div ref={trackRef} className="flex" style={{ willChange: 'transform' }}>
        {Array.from({ length: copyCount }, (_, ci) => (
          <ul key={ci} className="flex items-center flex-shrink-0" role="list" aria-hidden={ci > 0}
            ref={ci === 0 ? seqRef : undefined} style={{ padding: 0, margin: 0, listStyle: 'none' }}>
            {logos.map((item, idx) => renderItem(item, `${ci}-${idx}`))}
          </ul>
        ))}
      </div>
    </div>
  );
});

LogoLoop.displayName = 'LogoLoop';
export default LogoLoop;
