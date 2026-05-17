"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Float, Environment, PerspectiveCamera, Stars, RoundedBox } from "@react-three/drei";
import * as THREE from "three";


function LuxuryBottle() {
  const bottleRef = useRef<THREE.Group>(null);

  return (
    <Float
      speed={2}
      rotationIntensity={0.8}
      floatIntensity={0.6}
      floatingRange={[-0.2, 0.2]}
    >
      <group ref={bottleRef} position={[0, 0.1, 0]} rotation={[0.2, 0.1, 0.1]} scale={0.8}>
        {/* Black Glass Body - Smoother, no gold edges */}
        <group>
          <RoundedBox args={[1.4, 2.4, 0.9]} radius={0.3} smoothness={10} castShadow>
            <meshPhysicalMaterial
              color="#000000"
              transmission={0.3}
              thickness={2}
              roughness={0.02}
              ior={1.5}
              envMapIntensity={2}
              clearcoat={1}
              transparent
              opacity={0.85}
            />
          </RoundedBox>

          {/* Inner Deep Red Liquid */}
          <RoundedBox args={[1.2, 1.8, 0.7]} radius={0.1} smoothness={10} position={[0, -0.1, 0]}>
            <meshPhysicalMaterial
              color="#8b0000"
              emissive="#200000"
              emissiveIntensity={0.5}
              transmission={0.1}
              roughness={0.1}
              opacity={0.95}
              transparent
            />
          </RoundedBox>
        </group>

        {/* Golden Neck */}
        <mesh position={[0, 1.3, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.3, 32]} />
          <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
        </mesh>

        {/* Round Golden Cap */}
        <mesh position={[0, 1.6, 0]} castShadow>
          <sphereGeometry args={[0.35, 64, 64]} />
          <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.05} />
        </mesh>

        {/* Minimalist TIF Label - Now Dark and elegant, no white box */}
        <mesh position={[0, -0.2, 0.46]}>
          <planeGeometry args={[0.6, 0.4]} />
          <meshStandardMaterial color="#000000" metalness={1} roughness={0} />
        </mesh>
      </group>
    </Float>
  );
}

function RealisticPerfumeBottle() {
  return (
    <group position={[0, -0.5, 0]}>
      <LuxuryBottle />
    </group>
  );
}



function Particles({ count = 500 }: { count?: number }) {
  const positions = useMemo(() => {
    const p = Array.from({ length: count * 3 }, () => (Math.random() - 0.5) * 15);
    return new Float32Array(p);
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#5daeff"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scrollToProducts = () => {
    const section = document.getElementById("products");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative w-full min-h-screen overflow-hidden bg-[#050b14]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-full flex items-start pt-24 lg:pt-12" dir="rtl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-12 items-start w-full relative">

          {/* 3D Visual on Desktop / Stunning 2D Crystalline Bottle on Mobile for Butter-Smooth Performance */}
          <div className="relative h-[380px] md:h-[400px] lg:h-[500px] w-full z-0 lg:order-2 flex items-center justify-center">
            {isMobile ? (
              <>
                <style>{`
                  @keyframes shine {
                    0% { left: -100%; }
                    25%, 100% { left: 100%; }
                  }
                  .animate-shine {
                    animation: shine 7s infinite ease-in-out;
                  }
                `}</style>
                <motion.div
                  animate={{ 
                    y: [0, -12, 0],
                    rotate: [0, 1.5, 0]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 5, 
                    ease: "easeInOut" 
                  }}
                  className="relative w-[210px] h-[310px] md:w-[240px] md:h-[360px] cursor-pointer"
                >
                  {/* Crystalline Glow effect behind */}
                  <div className="absolute inset-0 bg-[#5daeff]/20 rounded-full blur-[40px] pointer-events-none scale-90" />
                  
                  {/* Luxury 2D Bottle Container */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0a1630]/90 to-[#07111f]/95 border-2 border-[#5daeff]/40 rounded-[30px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_0_30px_rgba(93,174,255,0.15)] flex flex-col justify-between items-center overflow-hidden">
                    {/* Dynamic Metallic Shine Overlay */}
                    <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-shine" />
                    
                    {/* Golden Cap */}
                    <div className="w-[54px] h-[28px] bg-gradient-to-b from-[#ffd700] to-[#b8860b] rounded-[8px] border border-[#ffd700] shadow-[0_4px_10px_rgba(255,215,0,0.3)] mt-2 shrink-0" />
                    
                    {/* Gold Neck */}
                    <div className="w-[26px] h-[12px] bg-[#ffd700]/80 border-x border-[#ffd700]/30 shrink-0" />
                    
                    {/* Bottle Label */}
                    <div className="w-[120px] h-[130px] rounded-[16px] bg-black/40 border border-[#5daeff]/20 flex flex-col items-center justify-center p-4 backdrop-blur-sm mt-4">
                      <span className="text-[#ffd700] font-black text-2xl tracking-[0.2em]">طيف</span>
                      <span className="text-[#5daeff]/60 font-bold text-[8px] tracking-[0.3em] uppercase mt-2">TIF</span>
                      <div className="w-8 h-[1px] bg-[#ffd700]/30 mt-4" />
                      <span className="text-white/40 text-[7px] mt-3">EAU DE PARFUM</span>
                    </div>
                    
                    {/* Limited Edition Text */}
                    <div className="w-full text-center text-[#5daeff]/40 text-[9px] tracking-widest uppercase mb-2 shrink-0">LIMITED EDITION</div>
                  </div>
                </motion.div>
              </>
            ) : (
              <Canvas shadows gl={{ antialias: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
                <Environment preset="city" />
                <ambientLight intensity={0.5} />
                <spotLight position={[5, 5, 5]} intensity={2} color="#ffffff" angle={0.3} penumbra={1} castShadow />
                <pointLight position={[-2, -2, -2]} intensity={1} color="#5daeff" />

                <RealisticPerfumeBottle />
                <Particles count={300} />
                <Stars radius={50} depth={50} count={800} factor={4} saturation={0} fade speed={1} />
              </Canvas>
            )}
          </div>

          {/* Text Content - Positioned elegantly below the bottle on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative z-10 text-center lg:text-right lg:order-1 mt-4 lg:mt-0 lg:pt-10"
          >
            <h1 className="flex flex-col gap-1 mb-6 lg:mb-6">
              <span className="text-6xl md:text-7xl lg:text-9xl font-black tracking-tighter text-white">طيف</span>
              <span className="text-xl md:text-2xl lg:text-3xl font-bold text-light-beam leading-tight">حيث تتحول الرائحة إلى حضور</span>
            </h1>

            <p className="text-base md:text-xl lg:text-2xl text-crystal-silver font-bold max-w-xl mx-auto lg:mr-0 leading-relaxed mb-12 lg:mb-14">
              عطور كريستالية مستوحاة من الضوء والهدوء والفخامة المطلقة.
            </p>

            <div className="flex flex-row gap-4 justify-center lg:justify-start px-2 lg:px-0">
              <button
                onClick={scrollToProducts}
                className="flex-1 lg:flex-none px-6 lg:px-12 py-4 lg:py-5 bg-white text-black font-black text-sm lg:text-lg rounded-none hover:bg-light-beam hover:text-white transition-all duration-300 transform hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              >
                اكتشف منتجاتنا
              </button>
              <button className="flex-1 lg:flex-none px-6 lg:px-12 py-4 lg:py-5 border-2 border-white/20 text-white font-black text-sm lg:text-lg rounded-none hover:bg-white/10 transition-all duration-300">
                قصتنا
              </button>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-light-beam/5 rounded-full blur-[120px] pointer-events-none z-0" />
    </section>
  );
}
