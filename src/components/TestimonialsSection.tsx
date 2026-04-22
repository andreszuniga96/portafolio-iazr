import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Carlos Santamaria",
    role: "Decano Ingeniería UTP",
    text: "La capacidad de Ivan para conectar conceptos complejos de IA con aplicaciones prácticas ha transformado nuestros programas de maestría.",
    initials: "CS"
  },
  {
    name: "Maria Fernanda López",
    role: "Directora Parquesoft",
    text: "Una consultoría excepcional. La estructuración técnica que realizó para nuestros proyectos MGA garantizó la aprobación de recursos clave.",
    initials: "ML"
  },
  {
    name: "Andres Felipe Muñoz",
    role: "CEO Dozurcol",
    text: "Su enfoque en desarrollo Full-Stack nos permitió lanzar nuestra plataforma MVP en tiempo récord con una arquitectura extremadamente robusta.",
    initials: "AM"
  },
  {
    name: "Ing. Juliana Vega",
    role: "Líder de Infraestructura Nariño",
    text: "El nivel de hardening y auditoría de seguridad aplicado a nuestros servidores de preconteo nos dio total tranquilidad durante la jornada electoral.",
    initials: "JV"
  },
  {
    name: "Equipo Zolaris",
    role: "Directiva",
    text: "Ivan ha llevado nuestra visión tecnológica al siguiente nivel, integrando IA predictiva directamente en el corazón de nuestra plataforma IoT.",
    initials: "Z"
  }
];

// Duplicate for marquee infinite effect
const duplicatedTestimonials = [...testimonials, ...testimonials];

const TestimonialsSection = () => {
  return (
    <section className="relative py-24 md:py-32 bg-background border-y border-stroke/50 overflow-hidden">
      
      {/* Gradients */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 relative z-20 mb-16">
        <div className="text-center">
          <span className="text-sm font-outfit text-primary font-bold uppercase tracking-[0.2em] block mb-4">
            Testimonios
          </span>
          <h2 className="text-4xl md:text-5xl text-foreground font-display">
            Lo que dicen <em className="italic text-muted-foreground font-light">Colegas & Clientes</em>
          </h2>
        </div>
      </div>

      <div className="relative flex overflow-x-hidden group">
        <motion.div
          className="flex whitespace-nowrap gap-6 px-3"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 40,
          }}
        >
          {duplicatedTestimonials.map((testimonial, i) => (
            <div 
              key={i} 
              className="glass relative w-[320px] md:w-[400px] p-8 rounded-3xl shrink-0 flex flex-col justify-between whitespace-normal bg-surface/30 border border-stroke/50 group-hover:pause"
            >
              <Quote className="w-8 h-8 text-primary/40 mb-6 absolute top-6 right-6" />
              <p className="text-lg md:text-xl font-display text-foreground leading-relaxed mb-8 pr-6">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full border border-stroke bg-background flex items-center justify-center text-primary font-outfit font-bold shadow-inner">
                  {testimonial.initials}
                </div>
                <div>
                  <h4 className="text-sm font-outfit font-bold text-foreground">{testimonial.name}</h4>
                  <p className="text-xs font-outfit text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

    </section>
  );
};

export default TestimonialsSection;
