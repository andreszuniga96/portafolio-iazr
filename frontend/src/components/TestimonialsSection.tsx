import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import KineticTestimonial from "@/components/ui/kinetic-testimonials";

const testimonials = [
  {
    name: "Dr. Carlos Santamaria",
    handle: "Decano Ingeniería · UTP",
    review: "La capacidad de IAZR para conectar conceptos complejos de IA con aplicaciones prácticas ha transformado nuestros programas de maestría.",
    initials: "CS",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&auto=format",
  },
  {
    name: "Maria Fernanda López",
    handle: "Directora · Parquesoft",
    review: "Una consultoría excepcional. La estructuración técnica que realizó para nuestros proyectos MGA garantizó la aprobación de recursos clave.",
    initials: "ML",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&q=80&auto=format",
  },
  {
    name: "Andres Felipe Muñoz",
    handle: "CEO · Dozurcol",
    review: "Su enfoque en desarrollo Full-Stack nos permitió lanzar nuestra plataforma MVP en tiempo récord con una arquitectura extremadamente robusta.",
    initials: "AM",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80&auto=format",
  },
  {
    name: "Ing. Juliana Vega",
    handle: "Líder Infraestructura · Nariño",
    review: "El nivel de hardening y auditoría de seguridad aplicado a nuestros servidores de preconteo nos dio total tranquilidad durante la jornada electoral.",
    initials: "JV",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=80&auto=format",
  },
  {
    name: "Equipo Zolaris",
    handle: "Directiva · Zolaris Platform",
    review: "IAZR llevó nuestra visión tecnológica al siguiente nivel, integrando IA predictiva directamente en el corazón de nuestra plataforma IoT.",
    initials: "Z",
    avatar: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=80&q=80&auto=format",
  },
];

const TestimonialsSection = () => {
  const titleWords = "Lo que dicen Colegas & Clientes".split(" ");

  return (
    <section className="relative py-24 md:py-32 bg-background border-y border-stroke/50 overflow-hidden">

      {/* Header */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 relative z-20 mb-12">
        <div className="text-center">
          <span className="text-sm font-outfit text-white font-bold uppercase tracking-[0.2em] block mb-4">
            Testimonios
          </span>
          <h2 className="text-4xl md:text-5xl text-foreground font-display">
            {titleWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, filter: "blur(6px)", y: 10 }}
                whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07, ease: "easeOut" }}
                className={`mr-2 inline-block ${i > 2 ? "italic text-muted-foreground font-light" : ""}`}
              >
                {word}
              </motion.span>
            ))}
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-4 text-sm font-outfit text-muted-foreground max-w-md mx-auto"
          >
            Clientes, colegas y estudiantes que han transformado su visión tecnológica
          </motion.p>
        </div>
      </div>

      {/* Kinetic Testimonials */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="w-full"
      >
        <KineticTestimonial
          testimonials={testimonials}
          columns={3}
          speed={1}
          containerHeight={560}
        />
      </motion.div>

      {/* Bottom quote accent */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 relative z-20 mt-10 text-center">
        <Quote className="w-6 h-6 text-white/30 mx-auto" />
      </div>
    </section>
  );
};

export default TestimonialsSection;
