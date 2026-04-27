'use client';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface CardData {
  name: string;
}

interface FlowProps extends React.HTMLAttributes<HTMLDivElement> {
  vertical?: boolean;
  repeat?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  applyMask?: boolean;
  duration?: number;
}

const Flow = ({
  children,
  vertical = false,
  repeat = 4,
  pauseOnHover = false,
  reverse = false,
  className,
  applyMask = true,
  duration = 30,
  ...props
}: FlowProps) => (
  <div
    {...props}
    style={{ '--duration': `${duration}s` } as React.CSSProperties}
    className={cn(
      'group relative flex h-full w-full overflow-hidden p-1 gap-3',
      vertical ? 'flex-col' : 'flex-row',
      className,
    )}
  >
    {Array.from({ length: repeat }).map((_, index) => (
      <div
        key={`item-${index}`}
        className={cn('flex shrink-0 gap-3', {
          'group-hover:paused': pauseOnHover,
          'direction-reverse': reverse,
          'animate-canopy-horizontal flex-row': !vertical,
          'animate-canopy-vertical flex-col': vertical,
        })}
      >
        {children}
      </div>
    ))}
    {applyMask && (
      <div
        className={cn(
          'pointer-events-none absolute inset-0 z-10 h-full w-full',
          vertical
            ? 'bg-gradient-to-b from-background via-transparent to-background'
            : 'bg-gradient-to-r from-background via-transparent to-background',
        )}
      />
    )}
  </div>
);

const FlipCard = ({
  card,
  className,
  colorClass,
  backColorClass,
}: {
  card: CardData;
  className?: string;
  colorClass: string;
  backColorClass: string;
}) => {
  const [flip, setFlip] = useState(false);

  return (
    <div
      className={cn('h-16 w-36 shrink-0 cursor-pointer', className)}
      onMouseEnter={() => setFlip(true)}
      onMouseLeave={() => setFlip(false)}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className="relative h-full w-full"
        animate={{ rotateX: flip ? 180 : 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <motion.div
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div
            className={cn(
              'h-full w-full border-2 border-white/20 rounded-xl flex items-center justify-center px-3',
              colorClass,
            )}
          >
            <span className="text-white font-bold text-sm tracking-wide font-poppins">
              {card.name}
            </span>
          </div>
        </motion.div>

        {/* Back */}
        <motion.div
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateX(180deg)',
          }}
        >
          <div
            className={cn(
              'h-full w-full border-2 border-white/20 rounded-xl flex items-center justify-center px-3',
              backColorClass,
            )}
          >
            <span className="text-white font-bold text-xs tracking-widest uppercase font-poppins">
              {card.name}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const FlipFlow = ({
  data,
  className,
  cardClassName,
  colors = [
    'bg-gradient-to-br from-orange-500 to-orange-700',
    'bg-gradient-to-br from-purple-500 to-purple-700',
    'bg-gradient-to-br from-blue-500 to-blue-700',
    'bg-gradient-to-br from-emerald-500 to-emerald-700',
    'bg-gradient-to-br from-amber-400 to-amber-600',
    'bg-gradient-to-br from-red-500 to-red-700',
  ],
  backColors = [
    'bg-gradient-to-br from-amber-600 to-orange-800',
    'bg-gradient-to-br from-indigo-500 to-purple-800',
    'bg-gradient-to-br from-cyan-500 to-blue-700',
    'bg-gradient-to-br from-teal-400 to-emerald-700',
    'bg-gradient-to-br from-orange-400 to-amber-700',
    'bg-gradient-to-br from-pink-500 to-red-700',
  ],
}: {
  data: CardData[];
  className?: string;
  cardClassName?: string;
  colors?: string[];
  backColors?: string[];
}) => (
  <div className={cn('w-full overflow-hidden', className)}>
    {[false, true, false].map((reverse, index) => (
      <Flow
        key={`flow-${index}`}
        reverse={reverse}
        pauseOnHover
        applyMask
        repeat={6}
        duration={28}
      >
        {data.map((card, j) => (
          <FlipCard
            key={`${card.name}-${j}`}
            card={card}
            className={cardClassName}
            colorClass={colors[j % colors.length]}
            backColorClass={backColors[j % backColors.length]}
          />
        ))}
      </Flow>
    ))}
  </div>
);

export { FlipFlow };
export type { CardData as FlipCardData };
