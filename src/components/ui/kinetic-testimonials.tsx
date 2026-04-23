import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Testimonial {
  name: string;
  handle: string;
  review: string;
  avatar?: string;
  initials: string;
}

interface TestimonialWithId extends Testimonial {
  uniqueId: string;
}

interface KineticTestimonialProps {
  testimonials: Testimonial[];
  columns?: number;
  speed?: number;
  containerHeight?: number;
}

const gradients = [
  'from-orange-500 via-amber-500 to-yellow-400',
  'from-purple-500 via-violet-500 to-indigo-400',
  'from-blue-500 via-cyan-500 to-teal-400',
  'from-emerald-500 via-green-500 to-teal-400',
  'from-rose-500 via-pink-500 to-fuchsia-400',
  'from-amber-500 via-orange-500 to-red-400',
];

const TestimonialCard = React.memo(
  ({ testimonial, index }: { testimonial: Testimonial; index: number }) => {
    const [isHovered, setIsHovered] = useState(false);
    const gradientClass = gradients[index % gradients.length];

    return (
      <div
        className="w-full mb-3 shrink-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`relative overflow-hidden rounded-2xl border transition-all duration-300 pointer-events-none ${
            isHovered
              ? 'border-transparent shadow-2xl'
              : 'border-white/8 bg-white/[0.025]'
          }`}
        >
          {isHovered && (
            <div
              className={`absolute inset-0 bg-gradient-to-b ${gradientClass} z-0`}
              style={{
                maskImage: 'linear-gradient(to bottom, transparent 30%, black 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 30%, black 100%)',
              }}
            />
          )}
          <div className="p-4 relative z-10">
            <p className="text-xs md:text-sm mb-3 leading-relaxed font-poppins text-white/70">
              "{testimonial.review}"
            </p>
            <div className="flex items-center gap-2.5">
              <Avatar className="w-8 h-8 shrink-0">
                {testimonial.avatar && (
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                )}
                <AvatarFallback
                  className="text-[10px] font-bold"
                  style={{ background: 'rgba(255,107,43,0.15)', color: '#FF6B2B' }}
                >
                  {testimonial.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className={`font-semibold text-xs font-poppins truncate ${isHovered ? 'text-white' : 'text-white/80'}`}>
                  {testimonial.name}
                </p>
                <p className={`text-[10px] font-poppins truncate ${isHovered ? 'text-white/80' : 'text-white/35'}`}>
                  {testimonial.handle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
TestimonialCard.displayName = 'TestimonialCard';

const KineticTestimonial: React.FC<KineticTestimonialProps> = ({
  testimonials,
  columns = 3,
  speed = 1,
  containerHeight = 600,
}) => {
  const [actualColumns, setActualColumns] = useState(columns);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 480) setActualColumns(1);
      else if (w < 768) setActualColumns(2);
      else setActualColumns(columns);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [columns]);

  const createColumns = useCallback(
    (numCols: number): TestimonialWithId[][] => {
      if (!testimonials.length) return [];
      return Array.from({ length: numCols }, (_, colIdx) => {
        const col: TestimonialWithId[] = Array.from({ length: 8 }, (__, j) => {
          const tIdx = (colIdx * 3 + j * 2) % testimonials.length;
          return { ...testimonials[tIdx], uniqueId: `${colIdx}-${j}-${tIdx}` };
        });
        return [...col, ...col]; // duplicate for infinite
      });
    },
    [testimonials],
  );

  const columnsData = useMemo(() => createColumns(actualColumns), [createColumns, actualColumns]);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: containerHeight }}
    >
      {/* Fade masks */}
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

      <div className="flex gap-3 h-full px-2">
        {columnsData.map((col, colIdx) => {
          const moveUp = colIdx % 2 === 0;
          const duration = (35 + colIdx * 5) / speed;
          return (
            <div key={colIdx} className="flex-1 overflow-hidden relative">
              <div
                className={`flex flex-col ${moveUp ? 'animate-scroll-up' : 'animate-scroll-down'}`}
                style={{ animationDuration: `${duration}s` }}
              >
                {col.map((t, i) => (
                  <TestimonialCard
                    key={`${t.uniqueId}-${i}`}
                    testimonial={t}
                    index={colIdx * 3 + i}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KineticTestimonial;
