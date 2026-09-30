'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CyberBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none">
      {/* 1. Deep Vignette Radial Overlay */}
      <div className="absolute inset-0 bg-[#07070d]/90" />

      {/* 2. Top Cyber Spotlight Beam (Radial Glow from Top Center) */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] opacity-40 blur-[120px]"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(225, 29, 72, 0.35) 0%, rgba(245, 158, 11, 0.15) 45%, transparent 75%)',
        }}
      />

      {/* 3. Floating Aurora Orb 1: Ruby Crimson (Upper Left) */}
      <motion.div
        animate={{
          x: [-40, 50, -30, -40],
          y: [-30, 40, -40, -30],
          scale: [1, 1.25, 0.95, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full blur-[140px] opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(225, 29, 72, 0.6) 0%, rgba(159, 18, 57, 0.3) 60%, transparent 80%)',
        }}
      />

      {/* 4. Floating Aurora Orb 2: Imperial Gold (Upper Right / Center) */}
      <motion.div
        animate={{
          x: [40, -40, 30, 40],
          y: [20, -50, 30, 20],
          scale: [1.1, 0.9, 1.2, 1.1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-40 right-[-10%] w-[550px] h-[550px] rounded-full blur-[130px] opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.55) 0%, rgba(217, 119, 6, 0.25) 55%, transparent 75%)',
        }}
      />

      {/* 5. Floating Aurora Orb 3: Deep Cyber Rose (Bottom Center) */}
      <motion.div
        animate={{
          x: [-30, 40, -20, -30],
          y: [40, -30, 20, 40],
          scale: [0.9, 1.15, 0.95, 0.9],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-[-15%] left-[25%] w-[700px] h-[700px] rounded-full blur-[160px] opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(225, 29, 72, 0.45) 0%, rgba(112, 26, 117, 0.2) 60%, transparent 80%)',
        }}
      />

      {/* 6. Dynamic Cyber Grid with Center Illumination */}
      <div
        className="absolute inset-0 opacity-45"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(225, 29, 72, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(225, 29, 72, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 35%, black 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 35%, black 40%, transparent 95%)',
        }}
      />

      {/* 7. Subtle High-Tech Crosshair Dots at Intersections */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(rgba(245, 158, 11, 0.5) 1px, transparent 1px)',
          backgroundSize: '96px 96px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 85%)',
        }}
      />

      {/* 8. Floating Cyber Particle Sparks */}
      <div className="absolute inset-0">
        {[
          { left: '12%', top: '25%', size: 3, delay: 0, duration: 6, color: '#E11D48' },
          { left: '22%', top: '65%', size: 2, delay: 2, duration: 8, color: '#F59E0B' },
          { left: '35%', top: '18%', size: 3.5, delay: 1, duration: 7, color: '#E11D48' },
          { left: '48%', top: '75%', size: 2.5, delay: 3, duration: 9, color: '#F59E0B' },
          { left: '62%', top: '30%', size: 4, delay: 1.5, duration: 7.5, color: '#E11D48' },
          { left: '74%', top: '55%', size: 2, delay: 4, duration: 8.5, color: '#F59E0B' },
          { left: '88%', top: '22%', size: 3, delay: 2.5, duration: 6.5, color: '#E11D48' },
          { left: '92%', top: '70%', size: 2.5, delay: 0.5, duration: 9.5, color: '#E11D48' },
          { left: '15%', top: '85%', size: 2, delay: 3.5, duration: 8, color: '#F59E0B' },
          { left: '80%', top: '88%', size: 3, delay: 1.8, duration: 7, color: '#F59E0B' },
        ].map((particle, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-15, 15, -15],
              opacity: [0.2, 0.85, 0.2],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeInOut',
            }}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: particle.left,
              top: particle.top,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              boxShadow: `0 0 12px ${particle.color}, 0 0 24px ${particle.color}`,
            }}
          />
        ))}
      </div>

      {/* 9. Top Cyber Horizon Laser Line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#E11D48] to-transparent opacity-60 shadow-[0_0_15px_rgba(225,29,72,0.8)]" />
    </div>
  );
}
