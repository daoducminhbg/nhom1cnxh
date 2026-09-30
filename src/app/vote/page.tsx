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
import { Toaster, toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
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
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('is_active', true)
        .single();
      
      if (!error && data) {
        setActiveMissionId(data.id);
      }
      setFetchingMission(false);
    }
    
    getActiveMission();
  }, []);

  const { roles, loading: rolesLoading, mission, castVote, refetch } = useRealtimeVotes(activeMissionId);

  if (isLoading || fetchingMission || rolesLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#2a2a3e] border-t-[#E11D48] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-[#f1f1f1] flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Không có nhiệm vụ nào đang hoạt động</h1>
        <Link href="/" className="px-6 py-2 bg-[#2a2a3e] rounded-lg hover:bg-[#242442] transition-colors">
          Quay lại Dashboard
        </Link>
      </div>
    );
  }

  const userCurrentVote = user 
    ? roles.find(r => r.votes.some(v => v.user_id === user.id))?.id || null 
    : null;

  const votedUsers = roles.flatMap(r => r.votes.map(v => v.user)).filter(Boolean) as User[];
  const totalVoted = votedUsers.length;

  const handleVote = async (roleId: string) => {
    if (!user) return;
    const targetRole = roles.find(r => r.id === roleId);
    if (targetRole && targetRole.votes.length >= targetRole.max_slots) {
      toast.error('Vai trò này đã đủ người!');
      return;
    }
    const success = await castVote(user.id, roleId);
    if (success) {
      toast.success('Đã nhận vai trò thành công!');
    } else {
      toast.error('Có lỗi xảy ra!');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f1f1f1] pb-24">
      <Toaster position="top-center" toastOptions={{
        style: { background: '#1a1a2e', color: '#f1f1f1', border: '1px solid #2a2a3e' }
      }}/>
      
      <header className="bg-[#1a1a2e] border-b border-[#2a2a3e] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[#a0a0b8] hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </Link>
            <h1 className="text-xl font-bold text-white truncate">Tuần {mission.week_number}: {mission.title}</h1>
          </div>
          {user && (
            <div className="text-sm font-medium">
              Xin chào, <span className="text-[#F59E0B]">{user.short_name}</span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-10">
          <VoteProgress totalMembers={8} votedCount={totalVoted} votedUsers={votedUsers} />
        </div>

        <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-end gap-3">
          <div>
            <h2 className="text-2xl font-bold uppercase">Bảng Phân Công</h2>
            <p className="text-[#a0a0b8] mt-1">
              {!mission.is_voting_open ? 'Hệ thống vote đang tạm khóa.' : '8 thành viên tham gia nhận vai trò phù hợp cho tuần này.'}
            </p>
          </div>
          {user?.is_admin && (
            <div className="inline-flex items-center gap-2 bg-[#F59E0B]/10 border border-[#F59E0B]/30 px-3.5 py-1.5 rounded-lg text-xs text-[#F59E0B] font-semibold self-start sm:self-auto">
              <span>👑 Nhóm trưởng: Bạn có quyền bấm "Sửa" trực tiếp trên từng thẻ hoặc mở nút đỏ góc phải</span>
            </div>
          )}
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
        >
          {roles.map(role => (
            <motion.div key={role.id} variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
              <RoleCard
                role={role}
                currentUserId={user?.id || null}
                isAdmin={user?.is_admin || false}
                isVotingOpen={mission.is_voting_open}
                userCurrentVote={userCurrentVote}
                onVote={handleVote}
                onRefetch={refetch}
              />
            </motion.div>
          ))}
        </motion.div>
      </main>

      {user?.is_admin && (
        <>
          <button
            onClick={() => setIsAdminDrawerOpen(true)}
            className="fixed bottom-8 right-8 w-14 h-14 bg-[#E11D48] rounded-full shadow-lg shadow-[#E11D48]/30 flex items-center justify-center text-white hover:scale-105 transition-transform z-30"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </button>
          
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
