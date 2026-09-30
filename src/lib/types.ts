export interface User {
  id: string;
  full_name: string;
  short_name: string;
  pin_code: string | null;
  is_admin: boolean;
  created_at?: string;
}

export interface Mission {
  id: string;
  week_number: number;
  title: string;
  description: string;
  deadline: string;
  is_active: boolean;
  is_voting_open: boolean;
  created_at?: string;
}

export interface Role {
  id: string;
  mission_id: string;
  title: string;
  description: string;
  max_slots: number;
  order_index: number;
  created_at?: string;
}

export interface Vote {
  id: string;
  mission_id: string;
  user_id: string;
  role_id: string;
  voted_at: string;
}

export interface RoleWithVotes extends Role {
  votes: (Vote & { user?: User })[];
}

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};
