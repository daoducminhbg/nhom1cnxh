'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoleWithVotes } from '@/lib/types';
import UserAvatar from '@/components/UserAvatar';
import { cn } from '@/lib/utils';

interface RoleCardProps {
  role: RoleWithVotes;
  currentUserId: string | null;
  isAdmin: boolean;
  isVotingOpen: boolean;
  userCurrentVote: string | null;
  onVote: (roleId: string) => void;
  onAdminMove?: (userId: string, roleId: string) => void;
}

export default function RoleCard({
  role,
  currentUserId,
  isAdmin,
  isVotingOpen,
  userCurrentVote,
  onVote,
  onAdminMove
}: RoleCardProps) {
  const currentCount = role.votes.length;
  const isFull = currentCount >= role.max_slots;
  const hasUserVotedForThis = userCurrentVote === role.id;
  const hasUserVotedForOther = userCurrentVote && !hasUserVotedForThis;

  const renderSlots = () => {
    const slots = [];
    for (let i = 0; i < role.max_slots; i++) {
      const vote = role.votes[i];
      if (vote && vote.user) {
        slots.push(
          <motion.div
            key={vote.id}
            layoutId={`avatar-${vote.user.id}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group"
          >
            <UserAvatar user={vote.user} size="md" />
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-[#1a1a2e] text-[#f1f1f1] text-xs px-2 py-1 rounded border border-[#2a2a3e] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
              {vote.user.full_name}
            </div>
          </motion.div>
        );
      } else {
        slots.push(
          <div
            key={`empty-${i}`}
            className="w-10 h-10 rounded-full border-2 border-dashed border-[#2a2a3e] flex items-center justify-center text-[#a0a0b8]"
          >
            <span className="text-lg">+</span>
          </div>
        );
      }
    }
    return slots;
  };

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(225, 29, 72, 0.2)' }}
      className={cn(
        "relative overflow-hidden rounded-xl border p-5 transition-all duration-300",
        hasUserVotedForThis 
          ? "border-[#F59E0B] bg-gradient-to-br from-[#1a1a2e] to-[#242442]" 
          : "border-[#2a2a3e] bg-[#1a1a2e]/60 backdrop-blur-md"
      )}
    >
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-1",
        hasUserVotedForThis ? "bg-[#F59E0B]" : "bg-[#E11D48]"
      )} />
      
      <div className="flex justify-between items-start mb-3 pl-2">
        <h3 className="text-xl font-bold text-[#f1f1f1]">{role.title}</h3>
        <div className={cn(
          "px-2 py-1 rounded text-xs font-semibold flex items-center gap-1",
          isFull ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
        )}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: isFull ? '#f87171' : '#4ade80' }} />
          <span>{currentCount}/{role.max_slots}</span>
        </div>
      </div>
      
      <p className="text-[#a0a0b8] text-sm mb-6 pl-2 line-clamp-2 h-10">{role.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-6 pl-2 min-h-[40px]">
        <AnimatePresence>
          {renderSlots()}
        </AnimatePresence>
      </div>
      
      <div className="mt-auto pt-4 border-t border-[#2a2a3e] pl-2">
        {!isVotingOpen ? (
          <button disabled className="w-full py-2.5 rounded-lg bg-[#2a2a3e] text-[#a0a0b8] font-medium cursor-not-allowed">
            ĐÃ KHÓA VOTE
          </button>
        ) : hasUserVotedForThis ? (
          <div className="flex flex-col items-center gap-2">
            <button className="w-full py-2.5 rounded-lg bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/50 font-bold flex items-center justify-center gap-2 cursor-default">
              <span>ĐÃ CHỌN</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </button>
          </div>
        ) : isFull ? (
          <button disabled className="w-full py-2.5 rounded-lg bg-[#242442] text-[#a0a0b8] font-medium cursor-not-allowed">
            ĐÃ ĐỦ NGƯỜI
          </button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onVote(role.id)}
            className={cn(
              "w-full py-2.5 rounded-lg font-bold transition-all shadow-lg",
              hasUserVotedForOther 
                ? "bg-transparent border border-[#E11D48] text-[#E11D48] hover:bg-[#E11D48]/10" 
                : "bg-[#E11D48] text-white hover:bg-[#E11D48]/90 hover:shadow-[#E11D48]/30"
            )}
          >
            {hasUserVotedForOther ? "CHUYỂN SANG VAI TRÒ NÀY" : "NHẬN VAI TRÒ NÀY"}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
