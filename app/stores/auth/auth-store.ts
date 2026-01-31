import { setAuthHelpers } from "@/lib/api/index";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AuthUser = {
  role: string;
  name: string;
  canCreateOrg: boolean;
};
type State = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  accessToken?: string;
  refreshToken?: string;
};

type Actions = {
  login: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  logout: () => void;
};

export const useAuthStore = create<State & Actions>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      login: (user: AuthUser, accessToken: string, refreshToken: string) =>
        set(() => ({
          isAuthenticated: true,
          user,
          accessToken,
          refreshToken,
        })),

      logout: () =>
        set(() => ({
          isAuthenticated: false,
          user: null,
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
