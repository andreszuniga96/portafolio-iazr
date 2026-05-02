import { useEffect, useState } from "react";

/**
 * ScrollProgress — thin aurora gradient bar along the top edge
 * that fills as the user scrolls through the page.
 * Zero layout impact: fixed, pointer-events none, z-index 9999.
 */
const ScrollProgress = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setWidth(pct);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // init
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="scroll-progress-bar"
      style={{ width: `${width}%` }}
      aria-hidden="true"
      role="presentation"
    />
  );
};

export default ScrollProgress;
