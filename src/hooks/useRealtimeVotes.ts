'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Vote, Role, User, RoleWithVotes, Mission } from '@/lib/types';

export function useRealtimeVotes(missionId: string | null) {
  const [roles, setRoles] = useState<RoleWithVotes[]>([]);
  const [loading, setLoading] = useState(true);
  const [mission, setMission] = useState<Mission | null>(null);

  const fetchData = useCallback(async () => {
    if (!missionId) return;
    setLoading(true);

    // Fetch mission
    const { data: missionData } = await supabase
      .from('missions')
      .select('*')
      .eq('id', missionId)
      .single();
    if (missionData) setMission(missionData as Mission);

    // Fetch roles
    const { data: rolesData } = await supabase
      .from('roles')
      .select('*')
      .eq('mission_id', missionId)
      .order('order_index');

    // Fetch votes with user info
    const { data: votesData } = await supabase
      .from('votes')
      .select('*')
      .eq('mission_id', missionId);

    // Fetch all users
    const { data: usersData } = await supabase
      .from('users')
      .select('*');

    const users = (usersData || []) as User[];
    const votes = (votesData || []) as Vote[];
    const rolesList = (rolesData || []) as Role[];

    // Combine roles with their votes and user info
    const rolesWithVotes: RoleWithVotes[] = rolesList.map((role) => ({
      ...role,
      votes: votes
        .filter((v) => v.role_id === role.id)
        .map((v) => ({ ...v, user: users.find((u) => u.id === v.user_id) })),
    }));

    setRoles(rolesWithVotes);
    setLoading(false);
  }, [missionId]);

  useEffect(() => {
    fetchData();

    if (!missionId) return;

    // Subscribe to realtime changes on votes table
    const votesChannel = supabase
      .channel(`votes-${missionId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'votes', filter: `mission_id=eq.${missionId}` },
        () => { fetchData(); }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'roles', filter: `mission_id=eq.${missionId}` },
        () => { fetchData(); }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'missions' },
        () => { fetchData(); }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(votesChannel);
    };
  }, [missionId, fetchData]);

  const castVote = async (userId: string, roleId: string): Promise<boolean> => {
    if (!missionId) return false;
    
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

    return !error;
  };

  const removeVote = async (userId: string): Promise<boolean> => {
    if (!missionId) return false;
    const { error } = await supabase
      .from('votes')
      .delete()
      .eq('mission_id', missionId)
      .eq('user_id', userId);
    return !error;
  };

  const moveUserToRole = async (userId: string, newRoleId: string): Promise<boolean> => {
    if (!missionId) return false;
    await supabase
      .from('votes')
      .delete()
      .eq('mission_id', missionId)
      .eq('user_id', userId);
    const { error } = await supabase
      .from('votes')
      .insert({ mission_id: missionId, user_id: userId, role_id: newRoleId });
    return !error;
  };

  return { roles, loading, mission, castVote, removeVote, moveUserToRole, refetch: fetchData };
}
