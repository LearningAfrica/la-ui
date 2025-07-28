import type { UserRole } from '../validators/auth-schema';
import type { Organization } from './organization';


export interface IAuthUser {
  id: string;
  username: string;
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

