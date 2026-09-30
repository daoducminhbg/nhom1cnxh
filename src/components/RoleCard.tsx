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
  dragHandleProps?: any;
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
  dragHandleProps,
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
    try {
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
    } catch (err) {
      toast.error('Có lỗi xảy ra khi lưu');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveUser = async (userId: string, userName: string) => {
    if (!confirm(`Bạn có chắc muốn hủy vai trò của "${userName}"?`)) return;
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
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            className="relative group cursor-pointer"
          >
            <div className="relative">
              <UserAvatar user={vote.user} size="md" />
              <div className="absolute inset-0 rounded-full ring-2 ring-[#E11D48]/40 animate-pulse pointer-events-none" />
            </div>

            {/* Tooltip full name with smooth blur */}
            <div className="absolute -top-11 left-1/2 transform -translate-x-1/2 bg-[#0e0e1a]/95 text-white text-xs px-2.5 py-1 rounded-lg border border-[#3a3a5e] opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-30 whitespace-nowrap shadow-2xl backdrop-blur-md">
              {vote.user.full_name}
            </div>

            {/* Admin Kick button */}
            {isAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveUser(vote.user!.id, vote.user!.short_name);
                }}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-red-600 to-rose-600 hover:scale-110 text-white rounded-full text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg z-30"
                title={`Hủy vai trò của ${vote.user.short_name}`}
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
            className="w-10 h-10 rounded-full border-2 border-dashed border-[#2d2d48] hover:border-[#E11D48]/50 flex items-center justify-center text-[#5a5a78] hover:text-[#E11D48] transition-colors"
            title="Slot trống"
          >
            <span className="text-base font-light leading-none">+</span>
          </div>
        );
      }
    }
    return slots;
  };

  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      whileHover={!isEditing ? { y: -5, boxShadow: '0 15px 35px -10px rgba(225, 29, 72, 0.25)' } : undefined}
      className={cn(
        "relative rounded-2xl border p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden",
        hasUserVotedForThis
          ? "border-[#F59E0B]/80 bg-gradient-to-br from-[#16162a]/95 via-[#1a1a32]/90 to-[#221c38]/90 shadow-[0_0_30px_rgba(245,158,11,0.15)]"
          : "border-[#26263e] bg-[#121222]/90 backdrop-blur-xl hover:border-[#E11D48]/60 shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
      )}
    >
      {/* Left glowing border accent */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-300",
          isAdmin
            ? "bg-gradient-to-b from-[#F59E0B] via-[#E11D48] to-[#F59E0B]"
            : hasUserVotedForThis
            ? "bg-gradient-to-b from-[#F59E0B] to-[#D97706] shadow-[0_0_12px_rgba(245,158,11,0.6)]"
            : "bg-gradient-to-b from-[#E11D48] to-[#9F1239] shadow-[0_0_12px_rgba(225,29,72,0.5)]"
        )}
      />

      {/* Top Header & Slot Count */}
      <div>
        <div className="flex justify-between items-start mb-3.5 pl-2 gap-3">
          {isEditing ? (
            <div className="w-full">
              <label className="block text-[11px] text-[#F59E0B] font-bold uppercase tracking-wider mb-1">
                Tên vai trò
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#0a0a0f] border-2 border-[#F59E0B] rounded-xl px-3.5 py-2 text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/50 transition-all"
                placeholder="Tên vai trò..."
                autoFocus
              />
            </div>
          ) : (
            <>
              <div className="flex-1 flex items-center gap-2">
                {/* Admin Drag Handle */}
                {isAdmin && (
                  <div
                    {...dragHandleProps}
                    className="cursor-grab active:cursor-grabbing p-1 text-[#6b6b88] hover:text-[#F59E0B] transition-colors rounded hover:bg-white/5"
                    title="Kéo thả để đổi vị trí"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 8h16M4 16h16" />
                    </svg>
                  </div>
                )}
                <h3 className="text-xl font-black text-white tracking-tight leading-snug group-hover:text-glow-red transition-all">
                  {role.title}
                </h3>
              </div>

              {/* Slot Badge & Edit Button */}
              <div className="flex items-center gap-2 shrink-0">
                {isAdmin && (
                  <button
                    onClick={() => {
                      setTitle(role.title);
                      setDescription(role.description);
                      setMaxSlots(role.max_slots);
                      setIsEditing(true);
                    }}
                    className="p-1.5 rounded-lg bg-[#202036] hover:bg-[#F59E0B]/20 text-[#F59E0B] hover:text-[#FCD34D] transition-all text-xs font-semibold flex items-center gap-1 border border-[#F59E0B]/30 hover:border-[#F59E0B] shadow-sm"
                    title="Sửa tên, mô tả, số slot"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>Sửa</span>
                  </button>
                )}

                <div
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-bold font-mono flex items-center gap-1.5 border shadow-sm",
                    isFull
                      ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                      : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                  )}
                >
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      isFull ? "bg-rose-400 animate-pulse" : "bg-emerald-400 pulse-dot"
                    )}
                  />
                  <span>{currentCount}/{role.max_slots}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Content Section: Description & Slots */}
        {isEditing ? (
          <div className="space-y-3 pl-2 my-4">
            <div>
              <label className="block text-[11px] text-[#a0a0b8] font-bold uppercase tracking-wider mb-1">
                Mô tả trách nhiệm & Sản phẩm
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-[#0a0a0f] border border-[#3a3a5e] focus:border-[#F59E0B] rounded-xl px-3.5 py-2 text-sm text-gray-200 focus:outline-none resize-none transition-colors"
                placeholder="Mô tả công việc chi tiết..."
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#a0a0b8] font-bold uppercase tracking-wider mb-1">
                Số lượng người tối đa (Slots)
              </label>
              <input
                type="number"
                min="1"
                max="8"
                value={maxSlots}
                onChange={(e) => setMaxSlots(parseInt(e.target.value) || 1)}
                className="w-28 bg-[#0a0a0f] border border-[#3a3a5e] focus:border-[#F59E0B] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none font-bold"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <span>✓</span>
                    <span>Lưu thay đổi</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 bg-[#24243a] hover:bg-[#343450] text-gray-300 rounded-xl text-xs font-semibold transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-[#a0a0b8] text-sm mb-5 pl-2 leading-relaxed min-h-[44px]">
              {role.description || 'Chưa có mô tả chi tiết.'}
            </p>

            {/* Slots section */}
            <div className="mb-5 pl-2">
              <div className="flex flex-wrap gap-2.5 items-center min-h-[44px]">
                <AnimatePresence mode="popLayout">
                  {renderSlots()}
                </AnimatePresence>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Action Area */}
      {!isEditing && (
        <div className="mt-4 pt-3.5 border-t border-[#26263e] pl-2">
          {isAdmin ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[#F59E0B] text-xs font-extrabold tracking-wide py-1">
                <span className="text-sm">👑</span>
                <span>NHÓM TRƯỞNG QUẢN TRỊ</span>
              </div>
              <button
                onClick={() => {
                  setTitle(role.title);
                  setDescription(role.description);
                  setMaxSlots(role.max_slots);
                  setIsEditing(true);
                }}
                className="text-xs px-3.5 py-1.5 rounded-lg bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30 font-bold transition-all"
              >
                Chỉnh sửa role
              </button>
            </div>
          ) : !isVotingOpen ? (
            <button
              disabled
              className="w-full py-3 rounded-xl bg-[#1c1c30] text-[#6b6b80] font-bold cursor-not-allowed text-sm border border-[#2a2a3e]"
            >
              ĐÃ KHÓA VOTE
            </button>
          ) : hasUserVotedForThis ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-full py-3 rounded-xl bg-[#F59E0B]/15 border-2 border-[#F59E0B] text-[#F59E0B] font-black flex items-center justify-center gap-2 text-sm shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                <span>ĐÃ CHỌN VAI TRÒ NÀY</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          ) : isFull ? (
            <button
              disabled
              className="w-full py-3 rounded-xl bg-[#18182c] text-[#6b6b80] font-bold cursor-not-allowed text-sm border border-[#26263a]"
            >
              ĐÃ ĐỦ NGƯỜI
            </button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onVote(role.id)}
              className={cn(
                "w-full py-3 rounded-xl font-black transition-all text-sm tracking-wide shadow-lg",
                hasUserVotedForOther
                  ? "bg-transparent border-2 border-[#E11D48] text-[#E11D48] hover:bg-[#E11D48]/15 hover:shadow-[0_0_20px_rgba(225,29,72,0.3)]"
                  : "bg-gradient-to-r from-[#E11D48] to-[#be123c] text-white hover:from-[#f43f5e] hover:to-[#E11D48] shadow-[0_0_25px_rgba(225,29,72,0.4)]"
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
