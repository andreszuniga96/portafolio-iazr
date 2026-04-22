import { useEffect, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Optimized "appear on scroll" — uses opacity + Y only, no blur filter.
 * Blur on scroll animations kills GPU compositing. Removed for smooth 60fps.
 */
export const useAppearOnScroll = (containerRef?: RefObject<HTMLElement>) => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const targets = containerRef?.current
        ? containerRef.current.querySelectorAll(".reveal-text")
        : document.querySelectorAll(".reveal-text");

      targets.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // Stagger sibling .reveal-stagger groups
      const groups = containerRef?.current
        ? containerRef.current.querySelectorAll(".reveal-stagger")
        : document.querySelectorAll(".reveal-stagger");

      groups.forEach((group) => {
        const children = group.children;
        gsap.fromTo(
          children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.07,
            ease: "power3.out",
            scrollTrigger: {
              trigger: group,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, containerRef?.current ?? document.body);

    return () => ctx.revert();
  }, []);
};
