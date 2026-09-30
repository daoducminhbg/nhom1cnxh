'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { RoleWithVotes, User } from '@/lib/types';
import toast from 'react-hot-toast';

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  missionId: string;
  roles: RoleWithVotes[];
  onRefetch: () => void;
  isVotingOpen: boolean;
}

export default function AdminDrawer({ isOpen, onClose, missionId, roles, onRefetch, isVotingOpen }: AdminDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [newRole, setNewRole] = useState({ title: '', description: '', max_slots: 1, order_index: 0 });

  const handleToggleVoting = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('missions')
      .update({ is_voting_open: !isVotingOpen })
      .eq('id', missionId);
    
    if (error) {
      toast.error('Lỗi khi cập nhật trạng thái vote');
    } else {
      toast.success(`Đã ${!isVotingOpen ? 'mở' : 'khóa'} chức năng vote`);
      onRefetch();
    }
    setLoading(false);
  };

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.title.trim()) return;
    
    setLoading(true);
    const { error } = await supabase
      .from('roles')
      .insert({
        mission_id: missionId,
        title: newRole.title,
        description: newRole.description,
        max_slots: newRole.max_slots,
        order_index: newRole.order_index
      });
      
    if (error) {
      toast.error('Lỗi khi thêm vai trò');
    } else {
      toast.success('Đã thêm vai trò thành công');
      setNewRole({ title: '', description: '', max_slots: 1, order_index: 0 });
      onRefetch();
    }
    setLoading(false);
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('Bạn có chắc muốn xóa vai trò này? Tất cả vote cho vai trò này sẽ bị xóa.')) return;
    
    setLoading(true);
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', roleId);
      
    if (error) {
      toast.error('Lỗi khi xóa vai trò');
    } else {
      toast.success('Đã xóa vai trò');
      onRefetch();
    }
    setLoading(false);
  };

  const handleResetVotes = async () => {
    if (!confirm('NGUY HIỂM: Bạn có chắc muốn XÓA TOÀN BỘ VOTE của nhiệm vụ này? Hành động này không thể hoàn tác.')) return;
    
    setLoading(true);
    const { error } = await supabase
      .from('votes')
      .delete()
      .eq('mission_id', missionId);
      
    if (error) {
      toast.error('Lỗi khi xóa votes');
    } else {
      toast.success('Đã xóa toàn bộ vote');
      onRefetch();
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0a0a0f]/80 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full md:w-[450px] bg-[#1a1a2e] border-l border-[#2a2a3e] z-50 shadow-2xl overflow-y-auto flex flex-col"
          >
            <div className="p-6 border-b border-[#2a2a3e] flex justify-between items-center bg-[#1a1a2e] sticky top-0 z-10">
              <h2 className="text-xl font-bold text-[#f1f1f1]">Admin Control</h2>
              <button onClick={onClose} className="p-2 text-[#a0a0b8] hover:text-white rounded-full hover:bg-[#242442] transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="p-6 space-y-8 flex-1">
              {/* Toggle Voting */}
              <section className="bg-[#242442]/50 p-4 rounded-xl border border-[#2a2a3e]">
                <h3 className="text-lg font-semibold text-[#f1f1f1] mb-4">Trạng thái Vote</h3>
                <button
                  onClick={handleToggleVoting}
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition-colors ${
                    isVotingOpen ? 'bg-[#E11D48] hover:bg-[#E11D48]/90' : 'bg-[#10b981] hover:bg-[#10b981]/90'
                  }`}
                >
                  {isVotingOpen ? 'KHÓA VOTE' : 'MỞ VOTE'}
                </button>
              </section>

              {/* Add Role */}
              <section className="bg-[#242442]/50 p-4 rounded-xl border border-[#2a2a3e]">
                <h3 className="text-lg font-semibold text-[#f1f1f1] mb-4">Thêm Vai Trò Mới</h3>
                <form onSubmit={handleAddRole} className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#a0a0b8] mb-1">Tên vai trò</label>
                    <input required value={newRole.title} onChange={e => setNewRole({...newRole, title: e.target.value})} className="w-full bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E11D48]" />
                  </div>
                  <div>
                    <label className="block text-sm text-[#a0a0b8] mb-1">Mô tả</label>
                    <textarea value={newRole.description} onChange={e => setNewRole({...newRole, description: e.target.value})} className="w-full bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E11D48] h-20 resize-none" />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm text-[#a0a0b8] mb-1">Số lượng</label>
                      <input type="number" min="1" value={newRole.max_slots} onChange={e => setNewRole({...newRole, max_slots: parseInt(e.target.value) || 1})} className="w-full bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E11D48]" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm text-[#a0a0b8] mb-1">Thứ tự</label>
                      <input type="number" value={newRole.order_index} onChange={e => setNewRole({...newRole, order_index: parseInt(e.target.value) || 0})} className="w-full bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E11D48]" />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="w-full py-2 bg-[#F59E0B] text-[#0a0a0f] font-bold rounded-lg hover:bg-[#F59E0B]/90 transition-colors">
                    Thêm Vai Trò
                  </button>
                </form>
              </section>

              {/* Manage Roles */}
              <section className="bg-[#242442]/50 p-4 rounded-xl border border-[#2a2a3e]">
                <h3 className="text-lg font-semibold text-[#f1f1f1] mb-4">Quản lý Vai Trò</h3>
                <div className="space-y-3">
                  {roles.map(role => (
                    <div key={role.id} className="flex justify-between items-center p-3 bg-[#0a0a0f] rounded-lg border border-[#2a2a3e]">
                      <div>
                        <div className="font-medium text-white">{role.title}</div>
                        <div className="text-xs text-[#a0a0b8]">Slots: {role.max_slots} | Thứ tự: {role.order_index}</div>
                      </div>
                      <button onClick={() => handleDeleteRole(role.id)} disabled={loading} className="text-red-400 hover:text-red-300 p-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Danger Zone */}
              <section className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
                <button
                  onClick={handleResetVotes}
                  disabled={loading}
                  className="w-full py-3 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 transition-colors"
                >
                  RESET TOÀN BỘ VOTE
                </button>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
