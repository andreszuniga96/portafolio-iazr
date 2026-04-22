import { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import Navbar from "./Navbar";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const roles = ["Full-Stack", "Mentor", "Innovador", "Estratega IA"];
const VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260227_042027_c4b2f2ea-1c7c-4d6e-9e3d-81a78063703f.mp4";

function MouseParticles() {
  const count = 3000;
  const mesh = useRef<THREE.Points>(null);
  const light = useRef<THREE.PointLight>(null);
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    return positions;
  }, [count]);

  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.001;
      mesh.current.rotation.y += 0.002;
    }
    if (light.current) {
      light.current.position.x = gsap.utils.interpolate(light.current.position.x, mouse.current.x * 5, 0.1);
      light.current.position.y = gsap.utils.interpolate(light.current.position.y, mouse.current.y * 5, 0.1);
    }
    state.camera.position.x = gsap.utils.interpolate(state.camera.position.x, mouse.current.x * 0.5, 0.05);
    state.camera.position.y = gsap.utils.interpolate(state.camera.position.y, mouse.current.y * 0.5, 0.05);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <pointLight ref={light} color="#4da4ff" intensity={3} distance={5} />
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesPosition.length / 3}
            array={particlesPosition}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.03} color="#ffffff" transparent opacity={0.4} sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>
    </>
  );
}

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setRoleIndex((i) => (i + 1) % roles.length), 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".name-reveal", { opacity: 0, y: 50, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, delay: 0.2 });
      tl.fromTo(
        ".blur-in",
        { opacity: 0, filter: "blur(10px)", y: 20 },
        { opacity: 1, filter: "blur(0px)", y: 0, duration: 1, stagger: 0.15 },
        "-=0.7"
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="inicio" className="relative h-screen w-full overflow-hidden bg-background">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          src={VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-background/90" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* 3D WebGL Particles */}
      <div className="absolute inset-0 mix-blend-screen pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <MouseParticles />
        </Canvas>
      </div>

      <Navbar />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 mt-10">
        <span className="blur-in text-xs font-outfit text-primary font-bold uppercase tracking-[0.4em] mb-6">
          PORTAFOLIO DE SERVICIOS
        </span>

        <h1 className="name-reveal text-6xl md:text-8xl lg:text-9xl font-display italic leading-[0.9] tracking-tight text-foreground mb-6 glitch-text p-2">
          Ivan Andres
          <br />
          Zuniga
        </h1>

        <div className="h-8 mb-4">
          <p className="blur-in text-lg md:text-xl text-muted-foreground">
            {" "}
            <span key={roleIndex} className="font-outfit font-medium text-accent animate-role-fade-in inline-block">
              {roles[roleIndex]}
            </span>
          </p>
        </div>

        <p className="blur-in text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 glass p-4 rounded-xl leading-relaxed">
          Director de Innovación & Mentor Tech. Transformando la industria a través del desarrollo Full-Stack, Inteligencia Artificial y metodologías activas.
        </p>

        <div className="blur-in flex flex-col sm:flex-row gap-4">
          <a
            href="https://wa.me/573229132643"
            target="_blank"
            rel="noreferrer"
            className="group relative rounded-full text-sm font-outfit font-semibold px-8 py-4 bg-primary text-background hover:scale-105 transition-all shadow-[0_0_20px_rgba(77,164,255,0.4)] hover:shadow-[0_0_30px_rgba(77,164,255,0.6)]"
          >
            Iniciar Proyecto en WhatsApp
          </a>
          <a
            href="#servicios"
            className="group relative rounded-full text-sm font-outfit font-semibold px-8 py-4 border border-stroke/50 bg-background/50 backdrop-blur-md text-foreground hover:bg-secondary/50 transition-all hover:scale-105"
          >
            Explorar Servicios
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-xs font-outfit text-muted-foreground uppercase tracking-[0.2em] mb-1">SCROLL</span>
        <div className="w-[2px] h-12 bg-stroke/50 relative overflow-hidden rounded-full">
          <div className="absolute w-full h-4 accent-gradient animate-scroll-down rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
