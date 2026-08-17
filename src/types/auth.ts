export type UserRole = 'master' | 'client' | 'demo';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  companyName: string;
  role: UserRole;
  isMaster: boolean;
  createdAt: string;
}

export interface AuthSession {
  user: AuthUser | null;
  token?: string;
  isAuthenticated: boolean;
}
