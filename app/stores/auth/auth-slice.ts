import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthResponseInterface } from "@/features/auth/auth-mutations";

export interface AuthState {
  isAuthenticated: boolean;
  role?: AuthResponseInterface["user_role"] | null;
  user: AuthResponseInterface["user"] | null;
  canCreateOrg?: AuthResponseInterface["can_create_organization"];
  organizations: AuthResponseInterface["organizations"];
  isVerified?: boolean;
  isActive?: boolean;
  accessToken?: string;
  refreshToken?: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  organizations: [],
  accessToken: undefined,
  refreshToken: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<AuthResponseInterface>) {
      const payload = action.payload;

      state.isAuthenticated = true;
      state.role = payload.user_role;
      state.user = payload.user;
      state.organizations = payload.organizations;
      state.isVerified = payload.user.is_verified;
      state.isActive = payload.user.is_active;
      state.accessToken = payload.access;
      state.refreshToken = payload.refresh;
      state.canCreateOrg = payload.can_create_organization;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.role = null;
      state.user = null;
      state.organizations = [];
      state.isVerified = undefined;
      state.isActive = undefined;
      state.accessToken = undefined;
      state.refreshToken = undefined;
    },
    updateTokens(
      state,
      action: PayloadAction<{ access: string; refresh: string }>
    ) {
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
    },
    updateUser(
      state,
      action: PayloadAction<Partial<AuthResponseInterface["user"]>>
    ) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
