import type {  ILoginUserResponse, UserRole } from '../validators/auth-schema';

export interface IAuthUser {
  id: string;
  email: string;
  user_role?: UserRole;
  can_create_organization: boolean;
  organizations: Pick<ILoginUserResponse,'organizations'>['organizations']
}

export interface AuthState {
  user: IAuthUser | null;
  current_org_id: string | null;
  session_id: string | null;
  access_token: string | null;
  refresh_token: string | null;
  is_authenticated: boolean;
  is_loading: boolean;
  error: string | null;
}

