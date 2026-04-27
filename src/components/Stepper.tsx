import React, { useState, Children, useRef, useLayoutEffect, HTMLAttributes, ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  backButtonText?: string;
  nextButtonText?: string;
  disableStepIndicators?: boolean;
}

export default function Stepper({
  children, initialStep = 1, onStepChange = () => {}, onFinalStepCompleted = () => {},
  backButtonText = 'Anterior', nextButtonText = 'Continuar', disableStepIndicators = false, ...rest
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0);
  const stepsArray = Children.toArray(children);
  const total = stepsArray.length;
  const isCompleted = currentStep > total;
  const isLast = currentStep === total;

  const update = (step: number) => {
    setCurrentStep(step);
    if (step > total) onFinalStepCompleted(); else onStepChange(step);
  };

  const back = () => { if (currentStep > 1) { setDirection(-1); update(currentStep - 1); } };
  const next = () => { if (!isLast) { setDirection(1); update(currentStep + 1); } };
  const complete = () => { setDirection(1); update(total + 1); };

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center p-4" {...rest}>
      <div className="mx-auto w-full max-w-2xl rounded-3xl shadow-xl" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
        {/* Step indicators */}
        <div className="flex w-full items-center p-6">
          {stepsArray.map((_, index) => {
            const step = index + 1;
            const isNotLast = index < total - 1;
            return (
              <React.Fragment key={step}>
                <StepIndicator step={step} currentStep={currentStep} disabled={disableStepIndicators}
                  onClick={n => { setDirection(n > currentStep ? 1 : -1); update(n); }} />
                {isNotLast && <StepConnector complete={currentStep > step} />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Content */}
        <StepContent isCompleted={isCompleted} currentStep={currentStep} direction={direction} className="px-8">
          {stepsArray[currentStep - 1]}
        </StepContent>

        {/* Footer */}
        {!isCompleted && (
          <div className="px-8 pb-8">
            <div className={`mt-8 flex ${currentStep !== 1 ? 'justify-between' : 'justify-end'}`}>
              {currentStep !== 1 && (
                <button onClick={back} className="px-3 py-1.5 text-sm text-white/40 hover:text-white/70 transition-colors rounded cursor-pointer">
                  {backButtonText}
                </button>
              )}
              <button onClick={isLast ? complete : next}
                className="flex items-center justify-center rounded-full py-2 px-5 text-sm font-semibold tracking-tight text-black transition-all hover:brightness-110 active:scale-95 cursor-pointer"
                style={{ background: 'linear-gradient(90deg, #FFFFFF, #F59E0B)' }}>
                {isLast ? '¡Listo!' : nextButtonText}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepContent({ isCompleted, currentStep, direction, children, className = '' }: {
  isCompleted: boolean; currentStep: number; direction: number; children: ReactNode; className?: string;
}) {
  const [height, setHeight] = useState(0);
  return (
    <motion.div style={{ position: 'relative', overflow: 'hidden' }} animate={{ height: isCompleted ? 0 : height }} transition={{ type: 'spring', duration: 0.4 }} className={className}>
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition key={currentStep} direction={direction} onHeight={h => setHeight(h)}>
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SlideTransition({ children, direction, onHeight }: { children: ReactNode; direction: number; onHeight: (h: number) => void; }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => { if (ref.current) onHeight(ref.current.offsetHeight); }, [children, onHeight]);
  return (
    <motion.div ref={ref} custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit"
      transition={{ duration: 0.35 }} style={{ position: 'absolute', left: 0, right: 0, top: 0 }}>
      {children}
    </motion.div>
  );
}

const stepVariants: Variants = {
  enter: (d: number) => ({ x: d >= 0 ? '-100%' : '100%', opacity: 0 }),
  center: { x: '0%', opacity: 1 },
  exit: (d: number) => ({ x: d >= 0 ? '50%' : '-50%', opacity: 0 }),
};

export function Step({ children }: { children: ReactNode }) {
  return <div className="py-4">{children}</div>;
}

function StepIndicator({ step, currentStep, disabled, onClick }: { step: number; currentStep: number; disabled: boolean; onClick: (n: number) => void; }) {
  const status = currentStep === step ? 'active' : currentStep < step ? 'inactive' : 'complete';
  return (
    <motion.div onClick={() => !disabled && onClick(step)} animate={status} initial={false}
      className={disabled ? 'pointer-events-none' : 'cursor-pointer'}>
      <motion.div variants={{
        inactive: { backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' },
        active: { backgroundColor: '#FFFFFF', color: '#FFFFFF' },
        complete: { backgroundColor: '#FFFFFF', color: '#FFFFFF' },
      }} transition={{ duration: 0.3 }}
        className="flex h-8 w-8 items-center justify-center rounded-full font-semibold text-sm">
        {status === 'complete' ? <CheckIcon /> : status === 'active' ? <div className="h-3 w-3 rounded-full bg-black" /> : step}
      </motion.div>
    </motion.div>
  );
}

function StepConnector({ complete }: { complete: boolean }) {
  return (
    <div className="relative mx-2 h-0.5 flex-1 overflow-hidden rounded" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <motion.div className="absolute left-0 top-0 h-full" initial={false}
        animate={{ width: complete ? '100%' : 0, backgroundColor: complete ? '#FFFFFF' : 'transparent' }}
        transition={{ duration: 0.4 }} />
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4 text-black" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.1, duration: 0.3 }}
        strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
