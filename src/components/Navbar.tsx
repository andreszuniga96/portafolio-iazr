import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Instagram, Linkedin, Github } from "lucide-react";

const navLinks = [
  { name: "Servicios",   href: "#servicios",   id: "servicios" },
  { name: "Proyectos",   href: "#proyectos",   id: "proyectos" },
  { name: "Oferta",      href: "#pricing",     id: "pricing" },
  { name: "Credibilidad", href: "#about",      id: "about" },
  { name: "FAQ",         href: "#faq",         id: "faq" },
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
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-3 sm:pt-5 px-3 sm:px-4 pointer-events-none transition-all duration-300">
      {/* ── Desktop/Mobile Pill ── */}
      <div
        ref={navRef}
        className={`pointer-events-auto liquid-glass-strong inline-flex items-center rounded-full px-2 py-1.5 sm:py-2 transition-all duration-500 max-w-[calc(100vw-24px)] ${
          isScrolled ? "shadow-[0_8px_40px_rgba(0,0,0,0.5)] scale-[0.97]" : "scale-100"
        }`}
      >
        {/* Logo */}
        <a href="/" className="flex items-center px-3 sm:px-4 group flex-shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center bg-background group-hover:shadow-[0_0_12px_rgba(124,102,255,0.4)] transition-all duration-300 flex-shrink-0"
            style={{ borderColor: "rgba(124,102,255,0.45)" }}>
            <span className="font-display italic text-xs sm:text-sm text-white">I</span>
          </div>
          <div className="ml-2 sm:ml-3 overflow-hidden hidden xs:block">
            <span className="font-outfit font-semibold text-white tracking-widest uppercase text-xs sm:text-sm block leading-tight">
              IAZR
            </span>
          </div>
        </a>

        {/* Divider */}
        <div className="hidden md:block w-px h-6 bg-white/8 mx-2 flex-shrink-0" />

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-0.5 px-1 relative" aria-label="Navegación principal">
          {/* Active Pill Indicator */}
          {activeSection && (
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 h-8 rounded-full bg-white/15 border border-white/20/30"
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
              className={`relative z-10 text-xs font-outfit px-4 py-2 rounded-full transition-colors duration-200 uppercase tracking-wider ${
                activeSection === link.id ? "text-white font-semibold" : "text-white/50 hover:text-white"
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
            className="btn-glow flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-outfit font-semibold text-xs tracking-wider uppercase hover:brightness-110 active:scale-95 transition-all"
          >
            Hablemos <span className="text-[10px]">↗</span>
          </a>
        </div>

        {/* Mobile toggle — min 44x44px touch target */}
        <button
          className="md:hidden flex items-center justify-center min-w-[44px] min-h-[44px] text-white/70 hover:text-white ml-auto transition-colors rounded-full"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav-menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-menu"
            role="navigation"
            aria-label="Menú móvil"
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="absolute top-[68px] sm:top-[76px] left-3 right-3 sm:left-4 sm:right-4 liquid-glass-strong rounded-3xl p-4 sm:p-5 pointer-events-auto flex flex-col gap-0.5 md:hidden border border-white/8"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`text-sm font-outfit min-h-[48px] flex items-center justify-center px-4 py-3 rounded-xl transition-colors uppercase tracking-wider text-center ${
                  activeSection === link.id
                    ? "text-white bg-white/10 font-semibold"
                    : "text-white/70 hover:text-white hover:bg-white/8"
                }`}
                onClick={(e) => handleNavClick(e, link.id)}
              >
                {link.name}
              </motion.a>
            ))}

            {/* Redes sociales */}
            <div className="flex items-center justify-center gap-4 py-3 mt-1 border-t border-white/8">
              <a href="https://www.linkedin.com/in/iazr96/" target="_blank" rel="noreferrer"
                aria-label="LinkedIn de Ivan Zuñiga"
                className="w-11 h-11 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                <Linkedin size={18} />
              </a>
              <a href="https://www.instagram.com/iazr96/" target="_blank" rel="noreferrer"
                aria-label="Instagram de Ivan Zuñiga"
                className="w-11 h-11 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                <Instagram size={18} />
              </a>
              <a href="https://github.com/andreszuniga96" target="_blank" rel="noreferrer"
                aria-label="GitHub de Ivan Zuñiga"
                className="w-11 h-11 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                <Github size={18} />
              </a>
            </div>

            <motion.a
              href="https://wa.me/573229132643?text=Hola%20Ivan%20%F0%9F%91%8B%2C%20vi%20tu%20portafolio%20y%20quiero%20contactarte."
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.04 + 0.05 }}
              className="mt-2 px-6 py-4 rounded-2xl bg-primary text-primary-foreground font-outfit font-semibold text-center text-sm tracking-wider uppercase hover:brightness-110 active:scale-95 transition-all min-h-[52px] flex items-center justify-center"
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
