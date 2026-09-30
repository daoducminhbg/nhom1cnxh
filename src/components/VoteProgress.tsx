'use client';

import React from 'react';
import { motion } from 'framer-motion';
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
    <div className="bg-[#1a1a2e]/80 backdrop-blur-md border border-[#2a2a3e] rounded-xl p-6 w-full shadow-xl">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-xl font-bold text-[#f1f1f1] uppercase tracking-wider">Tiến độ nhận việc</h2>
          <p className="text-[#a0a0b8] text-sm mt-1">Tuần này</p>
        </div>
        <div className="flex items-baseline gap-1">
          <motion.span 
            key={votedCount}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl font-black text-[#F59E0B]"
          >
            {votedCount}
          </motion.span>
          <span className="text-[#a0a0b8] text-lg font-medium">/ {totalMembers} ĐÃ NHẬN VIỆC</span>
        </div>
      </div>
      
      <div className="h-4 w-full bg-[#0a0a0f] rounded-full overflow-hidden border border-[#2a2a3e] mt-4 relative">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#E11D48] to-[#F59E0B] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, type: "spring", bounce: 0.2 }}
        />
      </div>
      
      {votedUsers.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-[#a0a0b8] mr-2">Đã chọn:</span>
          {votedUsers.map((user) => (
            <motion.div
              key={user.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <UserAvatar user={user} size="sm" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
