'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRealtimeVotes } from '@/hooks/useRealtimeVotes';
import { supabase } from '@/lib/supabase';
import { Mission, User } from '@/lib/types';
import RoleCard from '@/components/RoleCard';
import VoteProgress from '@/components/VoteProgress';
import AdminDrawer from '@/components/AdminDrawer';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import Link from 'next/link';

export default function VotePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
  const [fetchingMission, setFetchingMission] = useState(true);
  const [isAdminDrawerOpen, setIsAdminDrawerOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    async function getActiveMission() {
      try {
        const { data, error } = await supabase
          .from('missions')
          .select('*')
          .eq('is_active', true)
          .single();

        if (!error && data) {
          setActiveMissionId(data.id);
        }
      } catch (err) {
        console.error('Error fetching active mission:', err);
      } finally {
        setFetchingMission(false);
      }
    }

    getActiveMission();
  }, []);

  const {
    roles,
    loading: rolesLoading,
    isSyncing,
    mission,
    castVote,
    reorderRoles,
    refetch,
  } = useRealtimeVotes(activeMissionId);

  // ONLY show full-screen loader on initial mount when roles data is not yet available!
  // Subsequent updates/edits will NOT trigger a full-screen black reload!
  if (isLoading || fetchingMission || (rolesLoading && roles.length === 0)) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-[#2a2a3e] border-t-[#E11D48] rounded-full animate-spin shadow-[0_0_30px_rgba(225,29,72,0.5)]"></div>
        <p className="text-gray-400 text-sm font-medium animate-pulse">Đang tải bảng phân công...</p>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-[#f1f1f1] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#E11D48]/10 border border-[#E11D48]/30 flex items-center justify-center text-2xl mb-4">
          ⚠️
        </div>
        <h1 className="text-2xl font-black mb-2">Không có nhiệm vụ nào đang hoạt động</h1>
        <p className="text-[#a0a0b8] text-sm mb-6 max-w-md">
          Admin chưa kích hoạt nhiệm vụ tuần nào. Vui lòng quay lại Dashboard hoặc tạo nhiệm vụ mới.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-gradient-to-r from-[#E11D48] to-[#be123c] rounded-xl text-white font-bold hover:shadow-[0_0_25px_rgba(225,29,72,0.4)] transition-all"
        >
          Quay lại Dashboard
        </Link>
      </div>
    );
  }

  const userCurrentVote = user
    ? roles.find((r) => r.votes.some((v) => v.user_id === user.id))?.id || null
    : null;

  // Filter out admin votes from member count
  const votedUsers = roles
    .flatMap((r) => r.votes.map((v) => v.user))
    .filter((u): u is User => !!u && !u.is_admin);
  const totalVoted = votedUsers.length;

  const handleVote = async (roleId: string) => {
    if (!user) return;
    if (user.is_admin) {
      toast('👑 Bạn là Nhóm trưởng, không cần đăng ký vai trò!', { icon: 'ℹ️' });
      return;
    }
    const targetRole = roles.find((r) => r.id === roleId);
    if (targetRole && targetRole.votes.length >= targetRole.max_slots) {
      toast.error('Vai trò này đã đủ số lượng người đăng ký!');
      return;
    }
    const success = await castVote(user.id, roleId);
    if (success) {
      toast.success('Đã nhận vai trò thành công!');
    } else {
      toast.error('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  const handleReorder = async (newOrder: typeof roles) => {
    if (!user?.is_admin) return;
    const success = await reorderRoles(newOrder);
    if (success) {
      toast.success('Đã cập nhật thứ tự vai trò!', { duration: 1500 });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f1f1f1] pb-28 relative bg-grid selection:bg-[#E11D48]/30">
      {/* Floating Sync indicator - replaces black screen reload */}
      <AnimatePresence>
        {isSyncing && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 right-6 z-50 flex items-center gap-2.5 bg-[#121224]/95 border border-[#E11D48]/50 text-white px-4 py-2 rounded-full text-xs font-bold shadow-[0_0_25px_rgba(225,29,72,0.4)] backdrop-blur-md"
          >
            <div className="w-3.5 h-3.5 border-2 border-[#E11D48] border-t-transparent rounded-full animate-spin" />
            <span>Đang cập nhật...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <header className="bg-[#121222]/90 backdrop-blur-xl border-b border-[#23233a] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="p-2 rounded-xl text-[#a0a0b8] hover:text-white hover:bg-white/5 transition-colors shrink-0"
              title="Quay lại Trang chủ"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-base sm:text-lg font-black text-white truncate">
              Tuần {mission.week_number}: <span className="font-semibold text-gray-200">{mission.title}</span>
            </h1>
          </div>

          {user && (
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold shrink-0">
              <span className="text-[#a0a0b8] hidden sm:inline">Xin chào,</span>
              <span className="text-[#F59E0B] font-bold bg-[#F59E0B]/10 px-2.5 py-1 rounded-lg border border-[#F59E0B]/30">
                {user.short_name} {user.is_admin && '👑'}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Progress Card */}
        <div className="mb-10">
          <VoteProgress totalMembers={8} votedCount={totalVoted} votedUsers={votedUsers} />
        </div>

        {/* Section Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
              <span>BẢNG PHÂN CÔNG</span>
              {user?.is_admin && (
                <span className="text-xs bg-[#E11D48]/15 border border-[#E11D48]/30 text-[#E11D48] px-2.5 py-0.5 rounded-full lowercase tracking-normal font-semibold">
                  chế độ quản trị
                </span>
              )}
            </h2>
            <p className="text-[#a0a0b8] text-sm mt-1.5 leading-relaxed">
              {!mission.is_voting_open
                ? 'Hệ thống nhận vai trò đang tạm khóa bởi Nhóm trưởng.'
                : '8 thành viên tham gia nhận vai trò phù hợp cho nhiệm vụ tuần này.'}
            </p>
          </div>

          {user?.is_admin && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="inline-flex items-center gap-2 bg-[#F59E0B]/10 border border-[#F59E0B]/30 px-3 py-2 rounded-xl text-[#F59E0B] font-semibold">
                <span>💡 Kéo thả thẻ để đổi thứ tự | Bấm "Sửa" trên thẻ để chỉnh chi tiết</span>
              </div>
            </div>
          )}
        </div>

        {/* Roles Reorder Grid */}
        {user?.is_admin ? (
          <Reorder.Group
            axis="y"
            values={roles}
            onReorder={handleReorder}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {roles.map((role) => (
              <Reorder.Item
                key={role.id}
                value={role}
                className="list-none"
                whileDrag={{ scale: 1.03, zIndex: 50, boxShadow: '0 25px 50px rgba(0,0,0,0.6)' }}
              >
                <RoleCard
                  role={role}
                  currentUserId={user?.id || null}
                  isAdmin={true}
                  isVotingOpen={mission.is_voting_open}
                  userCurrentVote={userCurrentVote}
                  onVote={handleVote}
                  onRefetch={refetch}
                />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
            }}
          >
            {roles.map((role) => (
              <motion.div
                key={role.id}
                variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
              >
                <RoleCard
                  role={role}
                  currentUserId={user?.id || null}
                  isAdmin={false}
                  isVotingOpen={mission.is_voting_open}
                  userCurrentVote={userCurrentVote}
                  onVote={handleVote}
                  onRefetch={refetch}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Admin Floating Control Drawer Button */}
      {user?.is_admin && (
        <>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAdminDrawerOpen(true)}
            className="fixed bottom-7 right-7 w-14 h-14 bg-gradient-to-tr from-[#E11D48] to-[#f43f5e] rounded-full shadow-[0_0_30px_rgba(225,29,72,0.5)] flex items-center justify-center text-white z-40 border border-white/20"
            title="Mở bảng điều khiển Quản trị viên"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </motion.button>

          <AdminDrawer
            isOpen={isAdminDrawerOpen}
            onClose={() => setIsAdminDrawerOpen(false)}
            missionId={activeMissionId!}
            roles={roles}
            onRefetch={refetch}
            isVotingOpen={mission?.is_voting_open || false}
          />
        </>
      )}
    </div>
  );
}
