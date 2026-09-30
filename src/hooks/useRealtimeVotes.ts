'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Vote, Role, User, RoleWithVotes, Mission } from '@/lib/types';
import toast from 'react-hot-toast';

export function useRealtimeVotes(missionId: string | null) {
  const [roles, setRoles] = useState<RoleWithVotes[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [mission, setMission] = useState<Mission | null>(null);

  // Track initial load
  const hasLoadedRef = useRef(false);
  // Debounce timer for drag-and-drop reordering to prevent spamming DB and toasts
  const reorderDebounceTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async (isBackground = false) => {
    if (!missionId) return;

    // Only show full loading if we haven't loaded data yet
    if (!hasLoadedRef.current && !isBackground) {
      setLoading(true);
    } else {
      setIsSyncing(true);
    }

    try {
      const [missionRes, rolesRes, votesRes, usersRes] = await Promise.all([
        supabase.from('missions').select('*').eq('id', missionId).single(),
        supabase.from('roles').select('*').eq('mission_id', missionId).order('order_index'),
        supabase.from('votes').select('*').eq('mission_id', missionId),
        supabase.from('users').select('*'),
      ]);

      if (missionRes.data) setMission(missionRes.data as Mission);

      const users = (usersRes.data || []) as User[];
      const votes = (votesRes.data || []) as Vote[];
      const rolesList = (rolesRes.data || []) as Role[];

      // Combine roles with votes and user info
      const rolesWithVotes: RoleWithVotes[] = rolesList.map((role) => ({
        ...role,
        votes: votes
          .filter((v) => v.role_id === role.id)
          .map((v) => ({ ...v, user: users.find((u) => u.id === v.user_id) })),
      }));

      setRoles(rolesWithVotes);
      hasLoadedRef.current = true;
    } catch (err) {
      console.error('Error fetching realtime votes:', err);
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  }, [missionId]);

  useEffect(() => {
    hasLoadedRef.current = false;
    fetchData(false);

    if (!missionId) return;

    // Realtime channel for instant multi-user synchronization
    const votesChannel = supabase
      .channel(`realtime-channel-${missionId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'votes', filter: `mission_id=eq.${missionId}` },
        () => { fetchData(true); }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'roles', filter: `mission_id=eq.${missionId}` },
        () => { fetchData(true); }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'missions', filter: `id=eq.${missionId}` },
        () => { fetchData(true); }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(votesChannel);
      if (reorderDebounceTimer.current) {
        clearTimeout(reorderDebounceTimer.current);
      }
    };
  }, [missionId, fetchData]);

  const castVote = async (userId: string, roleId: string): Promise<boolean> => {
    if (!missionId) return false;
    setIsSyncing(true);

    await supabase
      .from('votes')
      .delete()
      .eq('mission_id', missionId)
      .eq('user_id', userId);

    const { error } = await supabase
      .from('votes')
      .insert({ mission_id: missionId, user_id: userId, role_id: roleId });

    await fetchData(true);
    return !error;
  };

  const removeVote = async (userId: string): Promise<boolean> => {
    if (!missionId) return false;
    setIsSyncing(true);
    const { error } = await supabase
      .from('votes')
      .delete()
      .eq('mission_id', missionId)
      .eq('user_id', userId);
    await fetchData(true);
    return !error;
  };

  const moveUserToRole = async (userId: string, newRoleId: string): Promise<boolean> => {
    if (!missionId) return false;
    setIsSyncing(true);
    await supabase
      .from('votes')
      .delete()
      .eq('mission_id', missionId)
      .eq('user_id', userId);
    const { error } = await supabase
      .from('votes')
      .insert({ mission_id: missionId, user_id: userId, role_id: newRoleId });
    await fetchData(true);
    return !error;
  };

  // Reorder roles by drag-and-drop:
  // 1. Instant local state update (60fps fluid motion, ZERO lag)
  // 2. Debounced database save (executes ONCE after dragging stops, ZERO toast spam)
  const reorderRoles = useCallback((newRoles: RoleWithVotes[]) => {
    const updated = newRoles.map((r, index) => ({
      ...r,
      order_index: index,
    }));
    // Instant smooth update
    setRoles(updated);

    // Cancel pending timer
    if (reorderDebounceTimer.current) {
      clearTimeout(reorderDebounceTimer.current);
    }

    // Debounce save to database after user releases drag
    reorderDebounceTimer.current = setTimeout(async () => {
      try {
        await Promise.all(
          updated.map((role) =>
            supabase
              .from('roles')
              .update({ order_index: role.order_index })
              .eq('id', role.id)
          )
        );
        // Single unique toast that never stacks or spams
        toast.success('Đã lưu vị trí vai trò mới!', {
          id: 'role-reorder-saved',
          duration: 2000,
        });
      } catch (err) {
        console.error('Failed to update roles order:', err);
        toast.error('Lỗi khi lưu vị trí vai trò', { id: 'role-reorder-saved' });
      }
    }, 600);
  }, []);

  // Quick move role left or right by index
  const moveRolePosition = useCallback(async (roleId: string, direction: 'left' | 'right') => {
    const currentIndex = roles.findIndex((r) => r.id === roleId);
    if (currentIndex === -1) return;
    const targetIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= roles.length) return;

    const newRoles = [...roles];
    const temp = newRoles[currentIndex];
    newRoles[currentIndex] = newRoles[targetIndex];
    newRoles[targetIndex] = temp;

    reorderRoles(newRoles);
  }, [roles, reorderRoles]);

  return {
    roles,
    loading,
    isSyncing,
    mission,
    castVote,
    removeVote,
    moveUserToRole,
    reorderRoles,
    moveRolePosition,
    refetch: () => fetchData(true),
  };
}
