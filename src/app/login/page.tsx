'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { USERS_SEED } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import UserAvatar from '@/components/UserAvatar';

type Step = 'SELECT_USER' | 'ENTER_PIN' | 'CREATE_PIN';

export default function LoginPage() {
  const { login, createPin, checkUserHasPin, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState<Step>('SELECT_USER');
  const [selectedUser, setSelectedUser] = useState<typeof USERS_SEED[number] | null>(null);
  
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleUserSelect = async (user: typeof USERS_SEED[number]) => {
    setSelectedUser(user);
    const hasPin = await checkUserHasPin(user.id);
    if (hasPin) {
      setStep('ENTER_PIN');
    } else {
      setStep('CREATE_PIN');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !pin) return;
    
    setIsSubmitting(true);
    const success = await login(selectedUser.id, pin);
    if (success) {
      toast.success('Đăng nhập thành công!');
      router.push('/');
    } else {
      toast.error('Mã PIN không chính xác!');
      setPin('');
    }
    setIsSubmitting(false);
  };

  const handleCreatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    if (pin.length < 4) {
      toast.error('Mã PIN phải có ít nhất 4 số');
      return;
    }
    if (pin !== confirmPin) {
      toast.error('Mã PIN xác nhận không khớp');
      return;
    }

    setIsSubmitting(true);
    const success = await createPin(selectedUser.id, pin);
    if (success) {
      toast.success('Tạo mã PIN và đăng nhập thành công!');
      router.push('/');
    } else {
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    }
    setIsSubmitting(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#E11D48]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#F59E0B]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="z-10 w-full max-w-4xl flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#E11D48] to-[#F59E0B] bg-clip-text text-transparent mb-2 drop-shadow-sm">
            Web CNXH
          </h1>
          <p className="text-gray-400 text-lg">Chọn tài khoản của bạn để tiếp tục</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 'SELECT_USER' && (
            <motion.div 
              key="select"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-3xl"
            >
              {USERS_SEED.map((u) => (
                <motion.button
                  key={u.id}
                  variants={itemVariants}
                  onClick={() => handleUserSelect(u)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#1a1a2e]/80 backdrop-blur-md border border-[#2a2a3e] hover:border-[#E11D48]/50 rounded-2xl p-6 flex flex-col items-center gap-4 transition-colors group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#E11D48]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <UserAvatar user={u as any} size="lg" />
                  <div className="text-center">
                    <div className="font-semibold text-gray-100">{u.short_name}</div>
                    {u.is_admin && (
                      <div className="text-xs text-[#F59E0B] mt-1 font-medium bg-[#F59E0B]/10 px-2 py-0.5 rounded-full inline-block">
                        Quản trị viên
                      </div>
                    )}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}

          {step === 'ENTER_PIN' && selectedUser && (
            <motion.div 
              key="login"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1a1a2e]/80 backdrop-blur-md border border-[#2a2a3e] rounded-2xl p-8 w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setStep('SELECT_USER')}
                className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors"
              >
                ← Quay lại
              </button>
              <div className="flex flex-col items-center mb-8 mt-4">
                <UserAvatar user={selectedUser as any} size="lg" className="mb-4" />
                <h2 className="text-2xl font-bold text-white">Chào, {selectedUser.short_name}</h2>
                <p className="text-gray-400 mt-1">Nhập mã PIN của bạn</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <input
                    type="password"
                    inputMode="numeric"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full bg-[#0a0a0f] border border-[#2a2a3e] focus:border-[#E11D48] rounded-xl px-4 py-3 text-center text-2xl tracking-[0.5em] text-white outline-none transition-colors font-mono"
                    placeholder="••••"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !pin}
                  className="w-full bg-gradient-to-r from-[#E11D48] to-[#F59E0B] hover:opacity-90 text-white rounded-xl py-3 font-semibold transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
                </button>
              </form>
            </motion.div>
          )}

          {step === 'CREATE_PIN' && selectedUser && (
            <motion.div 
              key="create"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1a1a2e]/80 backdrop-blur-md border border-[#2a2a3e] rounded-2xl p-8 w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setStep('SELECT_USER')}
                className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors"
              >
                ← Quay lại
              </button>
              <div className="flex flex-col items-center mb-8 mt-4">
                <UserAvatar user={selectedUser as any} size="lg" className="mb-4" />
                <h2 className="text-2xl font-bold text-white">Tạo mã PIN</h2>
                <p className="text-gray-400 mt-1 text-center">Tài khoản này chưa có mã PIN. Hãy tạo một mã PIN mới.</p>
              </div>

              <form onSubmit={handleCreatePin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Mã PIN mới</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full bg-[#0a0a0f] border border-[#2a2a3e] focus:border-[#E11D48] rounded-xl px-4 py-3 text-center text-xl tracking-[0.25em] text-white outline-none transition-colors font-mono"
                    placeholder="••••"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Xác nhận mã PIN</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    className="w-full bg-[#0a0a0f] border border-[#2a2a3e] focus:border-[#E11D48] rounded-xl px-4 py-3 text-center text-xl tracking-[0.25em] text-white outline-none transition-colors font-mono"
                    placeholder="••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !pin || !confirmPin}
                  className="w-full bg-gradient-to-r from-[#E11D48] to-[#F59E0B] hover:opacity-90 text-white rounded-xl py-3 font-semibold transition-opacity disabled:opacity-50 mt-4"
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Tạo mã PIN'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
