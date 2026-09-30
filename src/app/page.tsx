'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Mission } from '@/lib/types';
import Header from '@/components/Header';
import CountdownTimer from '@/components/CountdownTimer';
import MissionSelector from '@/components/MissionSelector';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  const [missions, setMissions] = useState<Mission[]>([]);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMission, setNewMission] = useState({
    week_number: '',
    title: '',
    description: '',
    deadline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    async function fetchData() {
      if (!isAuthenticated) return;
      
      try {
        const { data: allMissions, error: missionsError } = await supabase
          .from('missions')
          .select('*')
          .order('week_number', { ascending: false });
          
        if (missionsError) throw missionsError;
        
        setMissions(allMissions || []);
        
        const active = allMissions?.find(m => m.is_active) || null;
        setActiveMission(active);
        setSelectedMission(active || (allMissions && allMissions.length > 0 ? allMissions[0] : null));
      } catch (error) {
        console.error('Error fetching missions:', error);
        toast.error('Lỗi khi tải dữ liệu nhiệm vụ');
      } finally {
        setIsFetching(false);
      }
    }
    
    fetchData();
  }, [isAuthenticated]);

  const handleCreateMission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMission.week_number || !newMission.title || !newMission.deadline) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setIsSubmitting(true);
    try {
      // Deactivate current active missions
      await supabase
        .from('missions')
        .update({ is_active: false })
        .eq('is_active', true);
        
      // Insert new mission
      const { data, error } = await supabase
        .from('missions')
        .insert([{
          week_number: parseInt(newMission.week_number),
          title: newMission.title,
          description: newMission.description,
          deadline: new Date(newMission.deadline).toISOString(),
          is_active: true,
          is_voting_open: true
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success('Đã tạo nhiệm vụ mới thành công!');
      
      // Update local state
      const newMissionData = data as Mission;
      setMissions([newMissionData, ...missions.map(m => ({ ...m, is_active: false }))]);
      setActiveMission(newMissionData);
      setSelectedMission(newMissionData);
      setIsModalOpen(false);
      setNewMission({ week_number: '', title: '', description: '', deadline: '' });
      
    } catch (error) {
      console.error('Error creating mission:', error);
      toast.error('Lỗi khi tạo nhiệm vụ mới');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !isAuthenticated || isFetching) {
    return (
      <div className="min-h-screen bg-grid flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#E11D48] border-t-transparent rounded-full animate-spin glow-red"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-12 z-10">
        
        {/* Admin Controls */}
        {user?.is_admin && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end"
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-[#E11D48] hover:bg-[#E11D48]/90 text-white px-4 py-2 rounded-lg font-medium transition-colors glow-red"
            >
              <Plus size={18} />
              Tạo nhiệm vụ tuần mới
            </button>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full flex justify-center mb-4"
        >
          <MissionSelector 
            missions={missions} 
            activeMission={activeMission} 
            onSelect={setSelectedMission} 
          />
        </motion.div>

        {selectedMission ? (
          <motion.div 
            key={selectedMission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center text-center gap-8"
          >
            <div className="space-y-4 max-w-3xl">
              <h2 className="text-sm sm:text-base font-bold tracking-widest text-[#F59E0B] uppercase text-glow-gold">
                Nhiệm vụ tuần {selectedMission.week_number}
              </h2>
              <h1 className="text-3xl sm:text-5xl font-black text-white text-glow-red leading-tight">
                {selectedMission.title}
              </h1>
            </div>

            <div className="glass p-6 sm:p-8 rounded-2xl border border-[#2a2a3e] max-w-3xl w-full text-left">
              <h3 className="text-lg font-semibold text-gray-200 mb-4 border-b border-[#3a3a5e] pb-2">Mô tả công việc</h3>
              <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                {selectedMission.description || 'Không có mô tả chi tiết.'}
              </div>
            </div>

            <div className="space-y-6 mt-4">
              <h3 className="text-xl font-medium text-gray-400">Thời gian còn lại</h3>
              <CountdownTimer deadline={selectedMission.deadline} />
            </div>

            {selectedMission.is_active && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8"
              >
                <Link 
                  href="/vote"
                  className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-[#E11D48] rounded-full overflow-hidden neon-border glow-red-intense"
                >
                  <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                  <span className="relative flex items-center gap-2">
                    THAM GIA BỎ PHIẾU VAI TRÒ
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p className="text-xl">Chưa có nhiệm vụ nào được tạo.</p>
          </div>
        )}
      </main>

      {/* Admin Create Mission Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass-light border border-[#2a2a3e] rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-[#2a2a3e] flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Tạo nhiệm vụ tuần mới</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleCreateMission} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Tuần số *</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    className="w-full bg-[#0a0a0f] border border-[#3a3a5e] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E11D48] transition-colors"
                    value={newMission.week_number}
                    onChange={e => setNewMission({...newMission, week_number: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Tên nhiệm vụ *</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-[#0a0a0f] border border-[#3a3a5e] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E11D48] transition-colors"
                    value={newMission.title}
                    onChange={e => setNewMission({...newMission, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Mô tả công việc</label>
                  <textarea 
                    rows={4}
                    className="w-full bg-[#0a0a0f] border border-[#3a3a5e] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E11D48] transition-colors resize-none"
                    value={newMission.description}
                    onChange={e => setNewMission({...newMission, description: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Deadline *</label>
                  <input 
                    type="datetime-local" 
                    required
                    className="w-full bg-[#0a0a0f] border border-[#3a3a5e] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E11D48] transition-colors"
                    value={newMission.deadline}
                    onChange={e => setNewMission({...newMission, deadline: e.target.value})}
                  />
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-[#E11D48] hover:bg-[#E11D48]/90 text-white rounded-lg font-medium transition-colors glow-red disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Đang tạo...' : 'Tạo nhiệm vụ'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
