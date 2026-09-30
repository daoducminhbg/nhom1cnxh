'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTimeRemaining } from '@/lib/utils';

interface CountdownTimerProps {
  deadline: string;
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
      <div className="py-6 px-8 glass-light rounded-xl border border-[#E11D48]/50 inline-block glow-red-intense">
        <h2 className="text-2xl sm:text-4xl font-bold text-[#E11D48] text-glow-red animate-pulse tracking-widest">
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
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {timeUnits.map((unit, idx) => (
        <div key={unit.label} className="flex items-center gap-2 sm:gap-4">
          <div className="glass flex flex-col items-center justify-center w-16 h-20 sm:w-24 sm:h-28 rounded-xl border border-[#3a3a5e] relative overflow-hidden">
            <div className="absolute top-0 w-full h-1/2 bg-white/5 border-b border-white/10 z-0"></div>
            
            <div className="relative z-10 text-2xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-400 font-mono flex h-10 sm:h-12 overflow-hidden">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={unit.value}
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: '-100%', opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="block"
                >
                  {unit.value.toString().padStart(2, '0')}
                </motion.span>
              </AnimatePresence>
            </div>
            
            <span className="text-[10px] sm:text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider relative z-10">
              {unit.label}
            </span>
          </div>
          
          {idx < timeUnits.length - 1 && (
            <div className="flex flex-col gap-2 text-[#E11D48] font-bold text-xl sm:text-3xl animate-pulse">
              <span>:</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
