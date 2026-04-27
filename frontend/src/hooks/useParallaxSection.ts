import { useEffect, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxLayer {
  selector: string;
  yPercent: number;
  xPercent?: number;
  scale?: [number, number];
}

/**
 * Applies multi-layer parallax to elements within a section.
 * Each layer moves at a different speed as the user scrolls,
 * creating a cinematic depth-of-field effect.
 */
export const useParallaxSection = (
  sectionRef: RefObject<HTMLElement>,
  layers: ParallaxLayer[]
) => {
  useEffect(() => {
    if (!sectionRef.current) return;

    const triggers: ReturnType<typeof ScrollTrigger.create>[] = [];

    layers.forEach(({ selector, yPercent, xPercent = 0, scale }) => {
      const elements = sectionRef.current!.querySelectorAll(selector);
      if (!elements.length) return;

      const fromVars: gsap.TweenVars = { yPercent: 0, xPercent: 0 };
      const toVars: gsap.TweenVars = {
        yPercent,
        xPercent,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      };

      if (scale) {
        fromVars.scale = scale[0];
        toVars.scale = scale[1];
      }

      gsap.fromTo(elements, fromVars, toVars);
    });

    return () => {
      triggers.forEach((t) => t.kill());
      ScrollTrigger.getAll()
        .filter((t) => t.vars.trigger === sectionRef.current)
        .forEach((t) => t.kill());
    };
  }, []);
};
