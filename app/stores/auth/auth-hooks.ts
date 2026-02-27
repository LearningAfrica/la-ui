import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/stores/redux-store";
import { authActions } from "./auth-slice";
import type { AuthResponseInterface } from "@/features/auth/auth-mutations";

export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Drop-in replacement for the old Zustand useAuthStore().
 * Returns the same shape: all state fields + action methods.
 */
export const useAuthStore = () => {
  const state = useSelector((s: RootState) => s.auth);
  const dispatch = useAppDispatch();

  return {
    ...state,
    login: (payload: AuthResponseInterface) =>
      dispatch(authActions.login(payload)),
    logout: () => dispatch(authActions.logout()),
    updateTokens: (access: string, refresh: string) =>
      dispatch(authActions.updateTokens({ access, refresh })),
    updateUser: (updates: Partial<AuthResponseInterface["user"]>) =>
      dispatch(authActions.updateUser(updates)),
  };
};

export const useIsAuthenticated = () => {
  return useSelector((s: RootState) => s.auth.isAuthenticated);
};

export const useCurrentUser = () => {
  return useSelector((s: RootState) => s.auth.user);
};

export const useUserRole = () => {
  return useSelector((s: RootState) => s.auth.role);
};

export const useIsLoggedInAndVerified = () => {
  return useSelector((s: RootState) => {
    return s.auth.isAuthenticated && s.auth.isVerified;
  });
};
