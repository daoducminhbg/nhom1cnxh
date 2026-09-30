'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { APP_NAME, APP_SUBTITLE, APP_TITLE } from '@/lib/constants';
import UserAvatar from '@/components/UserAvatar';
import { LogOut } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-50 glass border-b border-[#2a2a3e] neon-border w-full"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex flex-col justify-center">
          <h1 className="text-xl font-bold text-glow-red flex items-center gap-2">
            <span className="text-[#E11D48]">@</span>{APP_NAME}
          </h1>
          <p className="text-[10px] sm:text-xs text-gray-400 font-medium hidden sm:block tracking-wider">
            {APP_TITLE}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              {user.is_admin && (
                <span className="hidden sm:inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/50 glow-gold">
                  ADMIN
                </span>
              )}
              
              <div className="flex items-center gap-2 bg-[#1a1a2e]/80 rounded-full pl-1 pr-3 py-1 border border-[#2a2a3e]">
                <UserAvatar user={user} size="sm" showName={false} />
                <span className="text-sm font-medium text-gray-200">
                  {user.short_name}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-[#E11D48] hover:bg-[#E11D48]/10 rounded-full transition-colors flex items-center gap-1"
                title="Đổi tài khoản"
              >
                <LogOut size={18} />
                <span className="sr-only">Đổi tài khoản</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
