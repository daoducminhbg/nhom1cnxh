'use client';

import { motion } from 'framer-motion';
import { getInitials, getAvatarColor } from '@/lib/utils';
import { User } from '@/lib/types';

interface UserAvatarProps {
  user: User | { id: string; short_name: string; full_name: string };
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
};

export default function UserAvatar({ user, size = 'md', showName = false, className = '' }: UserAvatarProps) {
  const colorClass = getAvatarColor(user.id);
  const initials = getInitials(user.short_name);

  return (
    <div className={`flex items-center gap-2 ${className}`} title={user.full_name}>
      <motion.div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center font-bold text-white shadow-lg ring-2 ring-white/10`}
        whileHover={{ scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {initials}
      </motion.div>
      {showName && (
        <span className="text-sm font-medium text-text">{user.short_name}</span>
      )}
    </div>
  );
}
