import type { AuthResponseInterface } from "@/features/auth/auth-mutations";
import { setAuthHelpers } from "@/lib/api/index";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Represents the authentication state structure
 */
type State = {
  isAuthenticated: boolean;
  role?: AuthResponseInterface["user_role"] | null;
  user: AuthResponseInterface["user"] | null;
  canCreateOrg?: AuthResponseInterface["can_create_organization"];
  organizations: AuthResponseInterface["organizations"];
  isVerified?: boolean;
  isActive?: boolean;
  accessToken?: string;
  refreshToken?: string;
};

type Actions = {
  login: (payload: AuthResponseInterface) => void;
  logout: () => void;
};

export const useAuthStore = create<State & Actions>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      organizations: [],
      accessToken: undefined,
      refreshToken: undefined,

      login: (payload: AuthResponseInterface) =>
        set(() => ({
          isAuthenticated: true,
          role: payload.user_role,
          user: payload.user,
          organizations: payload.organizations,
          isVerified: payload.user.is_verified,
          isActive: payload.user.is_active,
          accessToken: payload.access,
          refreshToken: payload.refresh,
          canCreateOrg: payload.can_create_organization,
        })),

      logout: () =>
        set(() => ({
          isAuthenticated: false,
          role: null,
          user: null,
          organizations: [],
          isVerified: undefined,
          isActive: undefined,
          accessToken: undefined,
          refreshToken: undefined,
        })),
    }),
    {
      name: "auth-storage",
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/**
 * Hook to get the authentication status
 * @returns {boolean} True if the user is authenticated, false otherwise
 */
export const useIsAuthenticated = () => {
  return useAuthStore((state) => state.isAuthenticated);
};

/**
 * Hook to get the current authenticated user
 * @returns {AuthResponseInterface["user"] | null} The current user object or null if not authenticated
 */
export const useCurrentUser = () => {
  return useAuthStore((state) => state.user);
};

/**
 * Hook to get the current user's role
 * @returns {AuthResponseInterface["user_role"] | null | undefined} The user's role or null/undefined if not available
 */
export const useUserRole = () => {
  return useAuthStore((state) => state.role);
};

/**
 * Hook to check if the user is both authenticated and verified
 * @returns {boolean} True if the user is authenticated and their account is verified
 */
export const useIsLoggedInAndVerified = () => {
  const { isAuthenticated, isVerified } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    isVerified: state.isVerified,
  }));

  return isAuthenticated && isVerified;
};

// Set up the auth helpers for the API client
setAuthHelpers(
  () => useAuthStore.getState().accessToken!,
  () => useAuthStore.getState().logout()
);

// Subscribe to auth state changes to update API client helpers
useAuthStore.subscribe((state) => {
  setAuthHelpers(
    () => state.accessToken!,
    () => state.logout()
  );
});
