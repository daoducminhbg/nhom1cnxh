'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '@/lib/types';
import UserAvatar from '@/components/UserAvatar';

interface VoteProgressProps {
  totalMembers: number;
  votedCount: number;
  votedUsers: User[];
}

export default function VoteProgress({ totalMembers, votedCount, votedUsers }: VoteProgressProps) {
  const percentage = Math.min(100, Math.round((votedCount / totalMembers) * 100)) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-[#121222]/90 backdrop-blur-xl border border-[#26263e] rounded-2xl p-6 sm:p-7 w-full shadow-[0_10px_35px_rgba(0,0,0,0.4)] relative overflow-hidden"
    >
      {/* Top subtle light reflection */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E11D48]/40 to-transparent pointer-events-none" />

      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2.5">
            <span>TIẾN ĐỘ NHẬN VIỆC</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E11D48]/15 border border-[#E11D48]/30 text-[#E11D48] font-bold lowercase tracking-normal">
              tuần này
            </span>
          </h2>
          <p className="text-[#a0a0b8] text-xs sm:text-sm mt-1">
            Tổng số 8 thành viên cần đăng ký nhận vai trò
          </p>
        </div>

        <div className="flex items-baseline gap-1.5 self-end sm:self-auto font-mono">
          <motion.span
            key={votedCount}
            initial={{ scale: 1.4, color: '#E11D48' }}
            animate={{ scale: 1, color: '#F59E0B' }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="text-3xl sm:text-4xl font-black"
          >
            {votedCount}
          </motion.span>
          <span className="text-[#a0a0b8] text-lg sm:text-xl font-bold">
            / {totalMembers} ĐÃ NHẬN VIỆC
          </span>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="h-4 sm:h-5 w-full bg-[#0a0a0f] rounded-full overflow-hidden border border-[#2a2a3e] relative shadow-inner p-0.5">
        <motion.div
          className="h-full bg-gradient-to-r from-[#E11D48] via-[#f43f5e] to-[#F59E0B] rounded-full shadow-[0_0_20px_rgba(225,29,72,0.6)] relative"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        >
          {/* Shimmer pulse inside progress bar */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </motion.div>
      </div>

      {/* Percentage Indicator */}
      <div className="flex justify-between items-center mt-2 text-xs font-mono text-[#6b6b88]">
        <span>0%</span>
        <span className="text-[#F59E0B] font-bold">{percentage}% HOÀN THÀNH</span>
        <span>100%</span>
      </div>

      {/* List of members who voted */}
      {votedUsers.length > 0 && (
        <div className="mt-5 pt-4 border-t border-[#222238] flex flex-wrap gap-2.5 items-center">
          <span className="text-xs text-[#a0a0b8] font-semibold uppercase tracking-wider mr-1">
            Đã đăng ký ({votedUsers.length}):
          </span>
          <AnimatePresence mode="popLayout">
            {votedUsers.map((u) => (
              <motion.div
                key={u.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className="relative group cursor-pointer"
              >
                <UserAvatar user={u} size="sm" />
                <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 bg-[#0e0e1a] text-white text-[11px] px-2 py-0.5 rounded border border-[#3a3a5e] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg z-20">
                  {u.short_name}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
