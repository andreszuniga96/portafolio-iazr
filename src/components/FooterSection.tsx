import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Youtube, Linkedin, Github, Instagram, Mail, ArrowUpRight, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const marqueeText = "INGENIERÍA · INTELIGENCIA ARTIFICIAL · INNOVACIÓN · FULL-STACK · IA · COLOMBIA · ";

const footerLinks = {
  servicios: [
    { label: "Desarrollo Web",    href: "#servicios" },
    { label: "IA & Automatización", href: "#servicios" },
    { label: "Mentoría 1 a 1",   href: "#servicios" },
    { label: "Ciberseguridad",   href: "#servicios" },
    { label: "Analítica de Datos", href: "#servicios" },
    { label: "Formulación MGA",  href: "#servicios" },
  ],
  recursos: [
    { label: "GitHub", href: "https://github.com/andreszuniga96", external: true },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/iazr96/", external: true },
    { label: "Instagram", href: "https://www.instagram.com/iazr96/", external: true },
    { label: "Portafolio Web", href: "#home", external: false },
  ],
  contacto: [
    { label: "WhatsApp directo", href: "https://wa.me/573229132643", external: true },
    { label: "LinkedIn DM", href: "https://www.linkedin.com/in/iazr96/", external: true },
    { label: "Instagram DM", href: "https://www.instagram.com/iazr96/", external: true },
    { label: "Cotizar proyecto", href: "#contact", external: false },
  ],
};

const FooterSection = () => {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!marqueeRef.current) return;
    gsap.to(marqueeRef.current, {
      xPercent: -50,
      duration: 35,
      ease: "none",
      repeat: -1,
    });
  }, []);

  return (
    <section id="contact"
      className="relative pt-20 md:pt-28 pb-8 md:pb-10 overflow-hidden border-t"
      style={{ backgroundColor: "#0c0c0e", borderColor: "rgba(42,39,36,0.6)" }}
    >
      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "rgba(255,107,43,0.04)" }} />

      {/* Marquee */}
      <div className="overflow-hidden mb-16 md:mb-24 select-none pointer-events-none">
        <div ref={marqueeRef} className="whitespace-nowrap flex">
          <span className="text-[4rem] md:text-[7rem] lg:text-[9rem] leading-none font-display"
            style={{ color: "rgba(240,237,232,0.04)" }}>
            {marqueeText.repeat(6)}
          </span>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">

          {/* Col 1: Brand */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full border flex items-center justify-center"
                style={{ borderColor: "rgba(255,107,43,0.4)", background: "rgba(255,107,43,0.08)" }}>
                <span className="font-display italic text-primary text-lg">I</span>
              </div>
              <div>
                <p className="font-poppins font-bold tracking-widest uppercase text-sm" style={{ color: "#f0ede8" }}>IAZR</p>
                <p className="text-[10px] font-poppins" style={{ color: "#8a857c" }}>Ivan Zuñiga</p>
              </div>
            </div>

            <p className="text-sm font-poppins leading-relaxed mb-6" style={{ color: "rgba(240,237,232,0.45)" }}>
              Ingeniería Full-Stack, Inteligencia Artificial y Mentoría Tecnológica desde Colombia para el mundo.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[
                { icon: <Linkedin className="w-4 h-4" />, href: "https://www.linkedin.com/in/iazr96/", label: "LinkedIn" },
                { icon: <Instagram className="w-4 h-4" />, href: "https://www.instagram.com/iazr96/", label: "Instagram" },
                { icon: <Github className="w-4 h-4" />, href: "https://github.com/andreszuniga96", label: "GitHub" },
                { icon: <Youtube className="w-4 h-4" />, href: "#", label: "YouTube" },
              ].map(({ icon, href, label }) => (
                <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  whileHover={{ y: -2, scale: 1.1 }} whileTap={{ scale: 0.93 }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#8a857c" }}
                  aria-label={label}
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Col 2: Servicios */}
          <div>
            <p className="text-[10px] font-poppins uppercase tracking-[0.28em] font-bold mb-5"
              style={{ color: "#FF6B2B" }}>Servicios</p>
            <ul className="space-y-3">
              {footerLinks.servicios.map(l => (
                <li key={l.label}>
                  <a href={l.href}
                    className="text-sm font-poppins transition-colors flex items-center gap-1.5 group"
                    style={{ color: "rgba(240,237,232,0.45)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#f0ede8")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,237,232,0.45)")}>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">›</span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Recursos */}
          <div>
            <p className="text-[10px] font-poppins uppercase tracking-[0.28em] font-bold mb-5"
              style={{ color: "#FF6B2B" }}>Recursos</p>
            <ul className="space-y-3">
              {footerLinks.recursos.map(l => (
                <li key={l.label}>
                  <a href={l.href}
                    target={l.external ? "_blank" : undefined}
                    rel={l.external ? "noopener noreferrer" : undefined}
                    className="text-sm font-poppins transition-colors flex items-center gap-1.5 group"
                    style={{ color: "rgba(240,237,232,0.45)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#f0ede8")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,237,232,0.45)")}>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">›</span>
                    {l.label}
                    {l.external && <ArrowUpRight className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contacto */}
          <div>
            <p className="text-[10px] font-poppins uppercase tracking-[0.28em] font-bold mb-5"
              style={{ color: "#FF6B2B" }}>Contacto</p>
            <ul className="space-y-3">
              {footerLinks.contacto.map(l => (
                <li key={l.label}>
                  <a href={l.href}
                    target={l.external ? "_blank" : undefined}
                    rel={l.external ? "noopener noreferrer" : undefined}
                    className="text-sm font-poppins transition-colors flex items-center gap-1.5 group"
                    style={{ color: "rgba(240,237,232,0.45)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#f0ede8")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,237,232,0.45)")}>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">›</span>
                    {l.label}
                    {l.external && <ArrowUpRight className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity" />}
                  </a>
                </li>
              ))}
            </ul>

            {/* WhatsApp CTA */}
            <motion.a
              href="https://wa.me/573229132643?text=Hola%20Ivan%20Zu%C3%B1iga%20%F0%9F%91%8B%2C%20vi%20tu%20portafolio%20y%20quiero%20hablar%20de%20un%20proyecto."
              target="_blank" rel="noreferrer"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="mt-6 w-full py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-poppins font-semibold uppercase tracking-wider transition-all"
              style={{ background: "rgba(255,107,43,0.1)", border: "1px solid rgba(255,107,43,0.25)", color: "#FF6B2B" }}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Hablemos ahora ↗
            </motion.a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: "rgba(42,39,36,0.8)" }}>
          <div className="flex items-center gap-3">
            {/* Gradient separator line */}
            <div className="h-px w-16 rounded-full" style={{ background: "linear-gradient(90deg, #FF6B2B, transparent)" }} />
            <p className="text-[11px] font-poppins" style={{ color: "#8a857c" }}>
              © {new Date().getFullYear()} Ivan Zuñiga · IAZR · Hecho en Colombia 🇨🇴 · React + GSAP + Three.js
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"
              style={{ boxShadow: "0 0 8px rgba(34,197,94,0.6)" }} />
            <span className="text-[11px] font-poppins" style={{ color: "#8a857c" }}>
              Disponible para nuevos proyectos
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterSection;
