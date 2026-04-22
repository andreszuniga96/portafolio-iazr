import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useInView } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Award, Cloud, ShieldCheck, Database } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const skillData = [
  { subject: 'Desarrollo Full-Stack', A: 95 },
  { subject: 'Inteligencia Artificial', A: 85 },
  { subject: 'Cloud & DevOps', A: 80 },
  { subject: 'Ciberseguridad', A: 75 },
  { subject: 'Data Analytics', A: 90 },
  { subject: 'Gestión MGA', A: 80 },
];

const technicalSkills = [
  { name: "React / Node.js", level: 95 },
  { name: "Python / IA", level: 85 },
  { name: "SQL / NoSQL", level: 90 },
  { name: "Linux / Infra", level: 80 },
];

const certifications = [
  { name: "Google Developer / Cloud", icon: <Cloud /> },
  { name: "Microsoft Azure", icon: <Database /> },
  { name: "Huawei ICT Academy", icon: <ShieldCheck /> },
  { name: "UNIR España", icon: <Award /> },
];

const SkillBar = ({ name, level }: { name: string, level: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="mb-6">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-outfit text-foreground">{name}</span>
        <span className="text-xs font-outfit text-muted-foreground">{level}%</span>
      </div>
      <div className="h-2 w-full bg-surface rounded-full overflow-hidden border border-stroke/30">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full accent-gradient rounded-full"
          style={{ boxShadow: "0 0 10px rgba(77,164,255,0.5)" }}
        />
      </div>
    </div>
  );
};

const ExplorationsSection = () => {
  const chartRef = useRef(null);
  const isChartInView = useInView(chartRef, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="relative py-24 md:py-32 bg-background border-y border-stroke/50">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        
        <div className="text-center mb-16 md:mb-24">
          <span className="text-sm font-outfit text-primary font-bold uppercase tracking-[0.2em] block mb-4">
            Ecosistema Técnico
          </span>
          <h2 className="text-4xl md:text-6xl text-foreground font-display">
            Habilidades & <em className="italic text-muted-foreground font-light">Credenciales</em>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
          
          {/* Left Column: Certifications & Progress Bars */}
          <div>
            <h3 className="text-2xl font-display text-foreground mb-8 border-b border-stroke/50 pb-4">
              Dominios Técnicos Principales
            </h3>
            
            <div className="mb-12">
              {technicalSkills.map((skill, i) => (
                <SkillBar key={i} name={skill.name} level={skill.level} />
              ))}
            </div>

            <h3 className="text-xl font-display text-foreground mb-6">
              Certificaciones Destacadas
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {certifications.map((cert, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass p-4 rounded-xl border border-stroke flex items-center gap-3 hover:border-primary/50 transition-colors"
                >
                  <div className="text-primary">{cert.icon}</div>
                  <span className="text-xs font-outfit font-medium text-foreground">{cert.name}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Radar Chart */}
          <div className="relative aspect-square md:aspect-auto md:h-[500px]" ref={chartRef}>
             <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
             {isChartInView && (
               <ResponsiveContainer width="100%" height="100%">
                 <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                   <PolarGrid stroke="rgba(255,255,255,0.1)" />
                   <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12, fontFamily: 'Outfit' }} />
                   <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                   <Radar
                     name="Expertise"
                     dataKey="A"
                     stroke="#4da4ff"
                     fill="#4da4ff"
                     fillOpacity={0.4}
                     isAnimationActive={true}
                     animationBegin={200}
                     animationDuration={1500}
                     animationEasing="ease-out"
                   />
                 </RadarChart>
               </ResponsiveContainer>
             )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default ExplorationsSection;
