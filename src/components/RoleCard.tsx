'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoleWithVotes } from '@/lib/types';
import UserAvatar from '@/components/UserAvatar';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface RoleCardProps {
  role: RoleWithVotes;
  currentUserId: string | null;
  isAdmin: boolean;
  isVotingOpen: boolean;
  userCurrentVote: string | null;
  onVote: (roleId: string) => void;
  onAdminMove?: (userId: string, roleId: string) => void;
  onRefetch?: () => void;
}

export default function RoleCard({
  role,
  currentUserId,
  isAdmin,
  isVotingOpen,
  userCurrentVote,
  onVote,
  onAdminMove,
  onRefetch,
}: RoleCardProps) {
  const currentCount = role.votes.length;
  const isFull = currentCount >= role.max_slots;
  const hasUserVotedForThis = userCurrentVote === role.id;
  const hasUserVotedForOther = userCurrentVote && !hasUserVotedForThis;

  // Inline editing state for Admin
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(role.title);
  const [description, setDescription] = useState(role.description);
  const [maxSlots, setMaxSlots] = useState(role.max_slots);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveEdit = async () => {
    if (!title.trim()) {
      toast.error('Tên vai trò không được để trống');
      return;
    }
    setIsSaving(true);
    const { error } = await supabase
      .from('roles')
      .update({
        title: title.trim(),
        description: description.trim(),
        max_slots: Number(maxSlots) || 1,
      })
      .eq('id', role.id);

    if (error) {
      toast.error('Lỗi khi cập nhật vai trò');
    } else {
      toast.success('Đã cập nhật vai trò thành công!');
      setIsEditing(false);
      onRefetch?.();
    }
    setIsSaving(false);
  };

  const handleRemoveUser = async (userId: string, userName: string) => {
    if (!confirm(`Bạn có chắc muốn hủy đăng ký của "${userName}" khỏi vai trò này?`)) return;
    const { error } = await supabase
      .from('votes')
      .delete()
      .eq('mission_id', role.mission_id)
      .eq('user_id', userId);

    if (error) {
      toast.error('Lỗi khi xóa lượt đăng ký');
    } else {
      toast.success(`Đã hủy vai trò của ${userName}`);
      onRefetch?.();
    }
  };

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
            
            {/* Tooltip full name */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-[#1a1a2e] text-[#f1f1f1] text-xs px-2 py-1 rounded border border-[#2a2a3e] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg">
              {vote.user.full_name}
            </div>

            {/* Admin kick button */}
            {isAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveUser(vote.user!.id, vote.user!.short_name);
                }}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 hover:bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-20"
                title={`Hủy đăng ký của ${vote.user.short_name}`}
              >
                ✕
              </button>
            )}
          </motion.div>
        );
      } else {
        slots.push(
          <div
            key={`empty-${i}`}
            className="w-10 h-10 rounded-full border-2 border-dashed border-[#2a2a3e] flex items-center justify-center text-[#a0a0b8]"
            title="Chỗ trống"
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
      whileHover={!isEditing ? { y: -4, boxShadow: '0 10px 30px -10px rgba(225, 29, 72, 0.2)' } : undefined}
      className={cn(
        "relative overflow-hidden rounded-xl border p-5 transition-all duration-300 flex flex-col justify-between",
        hasUserVotedForThis 
          ? "border-[#F59E0B] bg-gradient-to-br from-[#1a1a2e] to-[#242442]" 
          : "border-[#2a2a3e] bg-[#1a1a2e]/60 backdrop-blur-md"
      )}
    >
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-1",
        isAdmin ? "bg-[#F59E0B]" : hasUserVotedForThis ? "bg-[#F59E0B]" : "bg-[#E11D48]"
      )} />
      
      {/* Top Header & Slot Count */}
      <div>
        <div className="flex justify-between items-start mb-3 pl-2 gap-2">
          {isEditing ? (
            <div className="w-full">
              <label className="block text-[11px] text-[#a0a0b8] mb-1 font-semibold uppercase">Tên vai trò</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#0a0a0f] border border-[#F59E0B] rounded-lg px-3 py-1.5 text-white font-bold text-base focus:outline-none"
                placeholder="Tên vai trò..."
              />
            </div>
          ) : (
            <>
              <h3 className="text-xl font-bold text-[#f1f1f1] flex-1 leading-tight">{role.title}</h3>
              <div className="flex items-center gap-2 shrink-0">
                {isAdmin && (
                  <button
                    onClick={() => {
                      setTitle(role.title);
                      setDescription(role.description);
                      setMaxSlots(role.max_slots);
                      setIsEditing(true);
                    }}
                    className="p-1.5 rounded-lg bg-[#242442] hover:bg-[#3a3a5e] text-[#F59E0B] hover:text-[#FCD34D] transition-colors text-xs flex items-center gap-1 border border-[#3a3a5e]"
                    title="Chỉnh sửa nhanh vai trò"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>Sửa</span>
                  </button>
                )}
                <div className={cn(
                  "px-2 py-1 rounded text-xs font-semibold flex items-center gap-1.5 border",
                  isFull 
                    ? "bg-red-500/20 text-red-400 border-red-500/30" 
                    : "bg-green-500/20 text-green-400 border-green-500/30"
                )}>
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: isFull ? '#f87171' : '#4ade80' }} />
                  <span>{currentCount}/{role.max_slots}</span>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Description & Slots */}
        {isEditing ? (
          <div className="space-y-3 pl-2 my-3">
            <div>
              <label className="block text-[11px] text-[#a0a0b8] mb-1 font-semibold uppercase">Mô tả trách nhiệm</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-[#F59E0B] resize-none"
                placeholder="Mô tả công việc và sản phẩm cần bàn giao..."
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#a0a0b8] mb-1 font-semibold uppercase">Số lượng người tối đa (Slots)</label>
              <input
                type="number"
                min="1"
                max="8"
                value={maxSlots}
                onChange={(e) => setMaxSlots(parseInt(e.target.value) || 1)}
                className="w-24 bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="flex-1 py-2 bg-[#10b981] hover:bg-[#10b981]/90 text-white rounded-lg font-bold text-xs shadow-md transition-colors"
              >
                {isSaving ? 'Đang lưu...' : '✓ Lưu thay đổi'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-[#2a2a3e] hover:bg-[#3a3a5e] text-gray-300 rounded-lg text-xs font-semibold transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-[#a0a0b8] text-sm mb-5 pl-2 leading-relaxed min-h-[40px]">
              {role.description || 'Chưa có mô tả trách nhiệm.'}
            </p>
            
            {/* Visual Slots */}
            <div className="mb-5 pl-2">
              <div className="text-[11px] text-[#6b6b80] mb-2 uppercase font-semibold">Danh sách thành viên:</div>
              <div className="flex flex-wrap gap-2.5 items-center min-h-[40px]">
                <AnimatePresence>
                  {renderSlots()}
                </AnimatePresence>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Bottom Action Section */}
      {!isEditing && (
        <div className="mt-4 pt-3 border-t border-[#2a2a3e] pl-2">
          {isAdmin ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[#F59E0B] text-xs font-semibold py-1">
                <span>👑</span>
                <span>NHÓM TRƯỞNG QUẢN TRỊ</span>
              </div>
              <button
                onClick={() => {
                  setTitle(role.title);
                  setDescription(role.description);
                  setMaxSlots(role.max_slots);
                  setIsEditing(true);
                }}
                className="text-xs px-3 py-1.5 rounded-lg bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30 font-medium transition-colors"
              >
                Chỉnh sửa role
              </button>
            </div>
          ) : !isVotingOpen ? (
            <button disabled className="w-full py-2.5 rounded-lg bg-[#2a2a3e] text-[#a0a0b8] font-medium cursor-not-allowed text-sm">
              ĐÃ KHÓA VOTE
            </button>
          ) : hasUserVotedForThis ? (
            <div className="flex flex-col items-center gap-2">
              <button className="w-full py-2.5 rounded-lg bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/50 font-bold flex items-center justify-center gap-2 cursor-default text-sm shadow-sm">
                <span>ĐÃ CHỌN VAI TRÒ NÀY</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </button>
            </div>
          ) : isFull ? (
            <button disabled className="w-full py-2.5 rounded-lg bg-[#242442] text-[#a0a0b8] font-medium cursor-not-allowed text-sm">
              ĐÃ ĐỦ NGƯỜI
            </button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => onVote(role.id)}
              className={cn(
                "w-full py-2.5 rounded-lg font-bold transition-all shadow-md text-sm",
                hasUserVotedForOther 
                  ? "bg-transparent border border-[#E11D48] text-[#E11D48] hover:bg-[#E11D48]/10" 
                  : "bg-[#E11D48] text-white hover:bg-[#E11D48]/90 hover:shadow-[#E11D48]/30"
              )}
            >
              {hasUserVotedForOther ? "CHUYỂN SANG VAI TRÒ NÀY" : "NHẬN VAI TRÒ NÀY"}
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
}
