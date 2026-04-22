import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Optimized immersive scroll hook.
 * Uses opacity + translateY only (no blur filter) to avoid GPU overload.
 */
export const useImmersiveScroll = () => {
  useEffect(() => {
    const sections = document.querySelectorAll("section");

    sections.forEach((section, i) => {
      if (i === 0) return; // skip hero

      gsap.fromTo(
        section,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 90%",
            end: "top 55%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);
};
