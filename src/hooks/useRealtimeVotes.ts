'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Vote, Role, User, RoleWithVotes, Mission } from '@/lib/types';

export function useRealtimeVotes(missionId: string | null) {
  const [roles, setRoles] = useState<RoleWithVotes[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [mission, setMission] = useState<Mission | null>(null);
  
  // Track whether initial load has happened
  const hasLoadedRef = useRef(false);

  const fetchData = useCallback(async (isBackground = false) => {
    if (!missionId) return;
    
    // Only show full loading if we haven't loaded data yet
    if (!hasLoadedRef.current && !isBackground) {
      setLoading(true);
    } else {
      setIsSyncing(true);
    }

    try {
      // Fetch mission, roles, votes, users in parallel
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

      // Combine roles with their votes and user info
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

    // Subscribe to realtime changes on votes, roles, missions
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
    };
  }, [missionId, fetchData]);

  const castVote = async (userId: string, roleId: string): Promise<boolean> => {
    if (!missionId) return false;
    setIsSyncing(true);
    
    // Delete existing vote for this user in this mission
    await supabase
      .from('votes')
      .delete()
      .eq('mission_id', missionId)
      .eq('user_id', userId);

    // Insert new vote
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

  // Reorder roles by drag-and-drop
  const reorderRoles = async (newRoles: RoleWithVotes[]): Promise<boolean> => {
    // Instant optimistic update with smooth spring
    const updated = newRoles.map((r, index) => ({
      ...r,
      order_index: index,
    }));
    setRoles(updated);

    try {
      // Update order_index in Supabase in background
      await Promise.all(
        updated.map((role) =>
          supabase
            .from('roles')
            .update({ order_index: role.order_index })
            .eq('id', role.id)
        )
      );
      return true;
    } catch (err) {
      console.error('Failed to update roles order:', err);
      await fetchData(true);
      return false;
    }
  };

  return {
    roles,
    loading,
    isSyncing,
    mission,
    castVote,
    removeVote,
    moveUserToRole,
    reorderRoles,
    refetch: () => fetchData(true),
  };
}
