'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTimeRemaining } from '@/lib/utils';

interface CountdownTimerProps {
  deadline: string;
}

// Single animated digit slot inspired by motion-primitives number ticker
function AnimatedDigit({ digit }: { digit: string }) {
  return (
    <div className="relative inline-flex h-10 sm:h-12 w-[0.62em] items-center justify-center overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={digit}
          initial={{ y: '80%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-80%', opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 flex items-center justify-center font-mono select-none"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export default function CountdownTimer({ deadline }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(deadline));
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(deadline));
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (!isMounted) return null;

  if (timeLeft.total <= 0) {
    return (
      <div className="py-6 px-8 glass-light rounded-2xl border border-[#E11D48]/50 inline-block glow-red-intense shadow-[0_0_30px_rgba(225,29,72,0.4)]">
        <h2 className="text-2xl sm:text-4xl font-black text-[#E11D48] text-glow-red animate-pulse tracking-widest">
          HẾT HẠN
        </h2>
      </div>
    );
  }

  const timeUnits = [
    { label: 'Ngày', value: timeLeft.days },
    { label: 'Giờ', value: timeLeft.hours },
    { label: 'Phút', value: timeLeft.minutes },
    { label: 'Giây', value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-2.5 sm:gap-4.5">
      {timeUnits.map((unit, idx) => {
        const digits = unit.value.toString().padStart(2, '0').split('');

        return (
          <div key={unit.label} className="flex items-center gap-2.5 sm:gap-4.5">
            {/* Glass Digit Box */}
            <div className="glass flex flex-col items-center justify-center w-17 h-22 sm:w-24 sm:h-28 rounded-2xl border border-[#2e2e48] relative overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
              {/* Subtle top glare reflection */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/[0.08] to-transparent border-b border-white/[0.05] pointer-events-none" />

              {/* Number Container with Individual Animated Digits */}
              <div className="relative z-10 text-2xl sm:text-4xl font-black text-white font-mono flex items-center justify-center h-10 sm:h-12 overflow-hidden tracking-tighter">
                {digits.map((d, dIdx) => (
                  <AnimatedDigit key={dIdx} digit={d} />
                ))}
              </div>

              {/* Label */}
              <span className="text-[10px] sm:text-xs font-bold text-[#a0a0b8] mt-1 uppercase tracking-wider relative z-10">
                {unit.label}
              </span>
            </div>

            {/* Glowing Colon Separator */}
            {idx < timeUnits.length - 1 && (
              <div className="flex flex-col gap-1.5 text-[#E11D48] font-black text-xl sm:text-3xl animate-pulse">
                <span>:</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
