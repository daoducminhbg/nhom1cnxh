'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mission } from '@/lib/types';
import { ChevronDown, CheckCircle2, Archive } from 'lucide-react';

interface MissionSelectorProps {
  missions: Mission[];
  activeMission: Mission | null;
  onSelect: (mission: Mission) => void;
}

export default function MissionSelector({ missions, activeMission, onSelect }: MissionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(activeMission);

  const handleSelect = (mission: Mission) => {
    setSelectedMission(mission);
    onSelect(mission);
    setIsOpen(false);
  };

  const currentMission = selectedMission || activeMission;

  return (
    <div className="relative w-full max-w-md mx-auto z-40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full glass flex items-center justify-between px-4 py-3 rounded-xl border border-[#2a2a3e] hover:border-[#3a3a5e] transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-3">
          {currentMission?.is_active ? (
            <div className="w-2 h-2 rounded-full bg-green-500 pulse-dot"></div>
          ) : (
            <Archive className="w-4 h-4 text-gray-400" />
          )}
          <span className="font-semibold text-[#f1f1f1]">
            {currentMission ? `Tuần ${currentMission.week_number}: ${currentMission.title}` : 'Chọn nhiệm vụ'}
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 glass-light rounded-xl border border-[#2a2a3e] overflow-hidden shadow-xl max-h-60 overflow-y-auto"
          >
            {missions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-400 text-center">Không có nhiệm vụ nào.</div>
            ) : (
              missions.map((mission) => (
                <button
                  key={mission.id}
                  onClick={() => handleSelect(mission)}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors border-b border-[#2a2a3e] last:border-0 ${
                    currentMission?.id === mission.id ? 'bg-[#E11D48]/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {mission.is_active ? (
                      <span className="text-[10px] font-bold px-2 py-1 rounded bg-green-500/20 text-green-400 border border-green-500/30">
                        ĐANG HOẠT ĐỘNG
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-1 rounded bg-gray-500/20 text-gray-400 border border-gray-500/30">
                        ĐÃ LƯU TRỮ
                      </span>
                    )}
                    <span className="text-sm font-medium text-gray-200">
                      Tuần {mission.week_number}
                    </span>
                  </div>
                  {currentMission?.id === mission.id && (
                    <CheckCircle2 className="w-4 h-4 text-[#E11D48]" />
                  )}
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
