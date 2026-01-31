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
};

type Actions = {
  login: (user: AuthUser) => void;
  logout: () => void;
};

export const useAuthStore = create<State & Actions>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      login: (user: AuthUser) =>
        set(() => ({
          isAuthenticated: true,
          user,
        })),

      logout: () =>
        set(() => ({
          isAuthenticated: false,
          user: null,
        })),
    }),
    {
      name: "auth-storage",
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
