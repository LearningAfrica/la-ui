import type { Organization } from './organization';

export type UserRole =
  | 'student'
  | 'instructor'
  | 'admin'
  | 'superAdmin'
  | 'guest';

export interface IAuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: UserRole;
  organizations: Organization[];
  currentOrganization?: Organization;
}

export interface AuthState {
  user: IAuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ILoginUser {
  email: string;
  password: string;
  // role?: UserRole; // Optional role for login
}
export interface IRegisterUser {
  email: string;
  password: string;
  name: string;
}
