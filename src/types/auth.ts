export type UserRole = 'master' | 'client' | 'demo';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  companyName?: string;
  role: UserRole;
  isMaster: boolean;
  isProfileComplete?: boolean;
  emailVerified?: boolean;
  createdAt: string;
}

export interface AuthSession {
  user: AuthUser;
  token?: string;
  expiresAt: string;
}
