import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Instagram, Linkedin, Github } from "lucide-react";
import { Link } from "react-router-dom";

const navLinks = [
  { name: "Servicios",   href: "#servicios",   id: "servicios" },
  { name: "Proyectos",   href: "#proyectos",   id: "proyectos" },
  { name: "Precios",     href: "#pricing",     id: "pricing" },
  { name: "Proceso",     href: "#proceso",     id: "proceso" },
  { name: "Sobre mi",   href: "#about",       id: "about" },
  { name: "Experiencia", href: "#experiencia", id: "experiencia" },
  { name: "Contacto",    href: "#contact",     id: "contact" },
];

const Navbar = () => {
  const [isScrolled,      setIsScrolled]      = useState(false);
  const [mobileMenuOpen,  setMobileMenuOpen]  = useState(false);
  const [activeSection,   setActiveSection]   = useState<string>("");
  const [indicatorStyle,  setIndicatorStyle]  = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  /* ── Scroll detection ── */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Scrollspy: IntersectionObserver ── */
  useEffect(() => {
    const tryObserve = () => {
      const sections = navLinks
        .map(l => document.getElementById(l.id))
        .filter(Boolean) as HTMLElement[];

      if (sections.length === 0) {
        // Retry if sections not yet mounted
        setTimeout(tryObserve, 300);
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.filter(e => e.isIntersecting);
          if (visible.length > 0) {
            const top = visible.reduce((a, b) =>
              a.boundingClientRect.top > b.boundingClientRect.top ? b : a
            );
            setActiveSection(top.target.id);
          }
        },
        { rootMargin: "-15% 0px -75% 0px", threshold: 0 }
      );
      sections.forEach(s => observer.observe(s));
      return () => observer.disconnect();
    };

    const cleanup = tryObserve();
    return () => { if (cleanup) cleanup(); };
  }, []);

  /* ── Smooth scroll on link click ── */
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileMenuOpen(false);
  };

  /* ── Active indicator position ── */
  useEffect(() => {
    if (!activeSection) return;
    const el = linkRefs.current[activeSection];
    if (!el) return;
    setIndicatorStyle({
      left: el.offsetLeft,
      width: el.offsetWidth,
    });
  }, [activeSection]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-5 px-4 pointer-events-none transition-all duration-300">
      {/* ── Desktop Pill ── */}
      <div
        ref={navRef}
        className={`pointer-events-auto liquid-glass-strong inline-flex items-center rounded-full px-2 py-2 transition-all duration-500 ${
          isScrolled ? "shadow-[0_8px_40px_rgba(0,0,0,0.5)] scale-[0.97]" : "scale-100"
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center px-4 group flex-shrink-0">
          <div className="w-8 h-8 rounded-full border border-primary/50 flex items-center justify-center bg-black group-hover:border-primary group-hover:shadow-[0_0_12px_rgba(255,107,43,0.4)] transition-all duration-300">
            <span className="font-display italic text-sm text-primary">I</span>
          </div>
          <div className="ml-3 overflow-hidden">
            <span className="font-poppins font-semibold text-white tracking-widest uppercase text-sm block leading-tight">
              IAZR
            </span>
            <span className="font-poppins text-[9px] text-white/30 tracking-wider block leading-tight -mt-0.5 max-w-0 group-hover:max-w-xs overflow-hidden whitespace-nowrap transition-all duration-500">
              Ivan Zuñiga
            </span>
          </div>
        </Link>

        {/* Divider */}
        <div className="hidden md:block w-px h-6 bg-white/8 mx-2 flex-shrink-0" />

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-0.5 px-1 relative">
          {/* Active Pill Indicator */}
          {activeSection && (
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 h-8 rounded-full bg-primary/15 border border-primary/30"
              animate={indicatorStyle}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              style={{ zIndex: 0 }}
            />
          )}
          {navLinks.map((link) => (
            <a
              key={link.name}
              ref={(el) => { linkRefs.current[link.id] = el; }}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.id)}
              className={`relative z-10 text-xs font-poppins px-4 py-2 rounded-full transition-colors duration-200 uppercase tracking-wider ${
                activeSection === link.id ? "text-primary font-semibold" : "text-white/50 hover:text-white"
              }`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Divider */}
        <div className="hidden md:block w-px h-6 bg-white/8 mx-2 flex-shrink-0" />

        {/* Desktop CTA */}
        <div className="hidden md:block pl-1 flex-shrink-0">
          <a
            href="https://wa.me/573229132643?text=Hola%20Ivan%20%F0%9F%91%8B%2C%20vi%20tu%20portafolio%20y%20quiero%20contactarte."
            target="_blank"
            rel="noreferrer"
            className="btn-glow flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-black font-sora font-semibold text-xs tracking-wider uppercase hover:brightness-110 active:scale-95 transition-all"
          >
            Hablemos <span className="text-[10px]">↗</span>
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-white/70 hover:text-white ml-auto transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Cerrar menu" : "Abrir menu"}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="absolute top-[76px] left-4 right-4 liquid-glass-strong rounded-3xl p-5 pointer-events-auto flex flex-col gap-1 md:hidden border border-white/8"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`text-sm font-poppins px-4 py-3 rounded-xl transition-colors uppercase tracking-wider text-center ${
                  activeSection === link.id
                    ? "text-primary bg-primary/10 font-semibold"
                    : "text-white/70 hover:text-white hover:bg-white/8"
                }`}
                onClick={(e) => handleNavClick(e, link.id)}
              >
                {link.name}
              </motion.a>
            ))}

            {/* Redes sociales */}
            <div className="flex items-center justify-center gap-3 py-3 mt-1 border-t border-white/8">
              <a href="https://www.linkedin.com/in/iazr96/" target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white/40 hover:text-primary hover:bg-primary/10 transition-all">
                <Linkedin size={16} />
              </a>
              <a href="https://www.instagram.com/iazr96/" target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white/40 hover:text-primary hover:bg-primary/10 transition-all">
                <Instagram size={16} />
              </a>
              <a href="https://github.com/andreszuniga96" target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white/40 hover:text-primary hover:bg-primary/10 transition-all">
                <Github size={16} />
              </a>
            </div>

            <motion.a
              href="https://wa.me/573229132643?text=Hola%20Ivan%20%F0%9F%91%8B%2C%20vi%20tu%20portafolio%20y%20quiero%20contactarte."
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.05 + 0.05 }}
              className="mt-2 px-6 py-4 rounded-2xl bg-primary text-black font-sora font-semibold text-center text-sm tracking-wider uppercase hover:brightness-110 active:scale-95 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Hablemos ↗
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
