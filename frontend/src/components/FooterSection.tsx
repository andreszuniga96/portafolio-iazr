import { useRef } from "react";
import { Youtube, Linkedin, Github, Instagram, Mail, ArrowUpRight, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import LogoLoop from "@/components/LogoLoop";
import OrbitalLogo from "@/components/ui/OrbitalLogo";

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
    { label: "GitHub", href: "https://github.com/iazr-dev", external: true },
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

const techLogos = [
  { src: '', alt: 'React' }, { src: '', alt: 'Next.js' }, { src: '', alt: 'Python' },
  { src: '', alt: 'Node.js' }, { src: '', alt: 'TailwindCSS' }, { src: '', alt: 'Three.js' },
  { src: '', alt: 'AWS' }, { src: '', alt: 'PostgreSQL' }, { src: '', alt: 'LangChain' },
  { src: '', alt: 'n8n' }, { src: '', alt: 'Supabase' }, { src: '', alt: 'Vercel' },
];

const techLogoNodes = techLogos.map(t => ({
  node: (
    <span className="text-sm font-outfit font-semibold px-2" style={{ color: 'rgba(240,237,232,0.35)' }}>
      {t.alt}
    </span>
  )
}));

const FooterSection = () => {

  return (
    <section id="contact"
      className="relative pt-20 md:pt-28 pb-8 md:pb-10 overflow-hidden border-t"
      style={{ background: "transparent", borderTop: "1px solid rgba(199,210,254,0.10)" }}
    >
      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "rgba(124,58,237,0.08)" }} />

      {/* LogoLoop tech strip */}
      <div className="mb-16 md:mb-24 py-4 border-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
        <LogoLoop
          logos={techLogoNodes}
          speed={60}
          direction="left"
          pauseOnHover
          logoHeight={20}
          gap={24}
        />
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">

          {/* Col 1: Brand */}
          <div className="lg:col-span-1">
            {/* Logo — OrbitalLogo Espacial Minimalista */}
            <div className="flex items-center gap-3 mb-5">
              <OrbitalLogo size={40} />
              <div>
                <p className="font-poppins font-bold tracking-widest uppercase text-sm" style={{ color: "#F5F7FF" }}>IAZR</p>
                <p className="text-[10px] font-poppins" style={{ color: "#A7ADBF" }}>Ivan Zuñiga</p>
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
                { icon: <Github className="w-4 h-4" />, href: "https://github.com/iazr-dev", label: "GitHub" },
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
              style={{ color: "#FFFFFF" }}>Servicios</p>
            <ul className="space-y-3">
              {footerLinks.servicios.map(l => (
                <li key={l.label}>
                  <a href={l.href}
                    className="text-sm font-poppins transition-colors flex items-center gap-1.5 group"
                    style={{ color: "rgba(240,237,232,0.45)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#f0ede8")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,237,232,0.45)")}>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white">›</span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Recursos */}
          <div>
            <p className="text-[10px] font-poppins uppercase tracking-[0.28em] font-bold mb-5"
              style={{ color: "#FFFFFF" }}>Recursos</p>
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
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white">›</span>
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
              style={{ color: "#FFFFFF" }}>Contacto</p>
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
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white">›</span>
                    {l.label}
                    {l.external && <ArrowUpRight className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity" />}
                  </a>
                </li>
              ))}
            </ul>

            {/* WhatsApp CTA */}
            <motion.a
              href="https://wa.me/573229132643?text=Hola%20IAZR%20%F0%9F%91%8B%2C%20vi%20tu%20portafolio%20y%20quiero%20hablar%20de%20un%20proyecto."
              target="_blank" rel="noreferrer"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="mt-6 w-full py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-poppins font-semibold uppercase tracking-wider transition-all"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", color: "#FFFFFF" }}
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
            <div className="h-px w-16 rounded-full" style={{ background: "linear-gradient(90deg, #FFFFFF, transparent)" }} />
            <p className="text-[11px] font-poppins" style={{ color: "#8a857c" }}>
              © {new Date().getFullYear()} IAZR · Hecho en Colombia 🇨🇴 · React + GSAP + Three.js
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

      {/* ── IAZR Outline Brand Closing ── */}
      <div className="overflow-hidden border-t border-white/5 mt-0">
        <motion.p
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
          style={{
            fontSize: "clamp(5rem, 22vw, 18rem)",
            WebkitTextStroke: "1.5px rgba(124,58,237,0.25)",
            color: "transparent",
            fontFamily: "var(--font-modern)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            textAlign: "center",
            lineHeight: 0.9,
            paddingBottom: "0.1em",
            userSelect: "none",
            pointerEvents: "none",
            display: "block",
          }}
        >
          IAZR
        </motion.p>
      </div>
    </section>

  );
};

export default FooterSection;
