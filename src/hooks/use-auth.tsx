import apiClient from '@/lib/api';
import type { AuthState, IAuthUser } from '@/lib/types/auth';
import { extractCorrectErrorMessage } from '@/lib/utils/axios-err';
import {
  loginUserResponseSchema,
  type ILoginUser,
  type ILoginUserResponse,
  type IRegisterUser,
  type IRegisterUserResponse,
} from '@/lib/validators/auth-schema';
import { toast } from 'sonner';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Types

type RegisterOrLoginCallbackProps = {
  onSuccess?: (user: IAuthUser, token: string) => void;
  onError?: (error: string) => void;
};

interface AuthActions {
  login: (
    props: ILoginUser,
    options?: RegisterOrLoginCallbackProps,
  ) => Promise<void>;
  register: (
    props: IRegisterUser,
    options?: RegisterOrLoginCallbackProps,
  ) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: IAuthUser) => void;
  getCurrentOrganization: () => IAuthUser['organizations'][number] | undefined;
  getCurrentUserRole: () => IAuthUser['role'] | undefined;
  changeCurrentOrganization: (organizationId: string) => void; // Add this method to change current organization
}

type AuthStore = AuthState & AuthActions;

export const useAuth = create<AuthStore>()(
  persist(
    (set, _get) => ({
      user: null,
      access_token: null,
      is_authenticated: false,
      is_loading: false,
      error: null,
      current_org_id: null,
      refresh_token: null,
      login: async (payload, opts) => {
        set({ is_loading: true, error: null });

        try {
          const { data: dbData } = await apiClient.post<ILoginUserResponse>(
            '/auth/login/',
            payload,
          );
          const data = loginUserResponseSchema.parse(dbData);
          // Use functional update to ensure all state changes are applied together
          set((state) => ({
            ...state,
            user: {
              id: data.id,
              username: data.username,
              role: data.user_role,
              organizations: [],
              avatar: undefined, // Adjust as needed
            },
            access_token: data.access_token,
            is_authenticated: true,
            is_loading: false,
            error: null,
          }));
        } catch (error) {
          set((state) => ({
            ...state,
            user: null,
            access_token: null,
            is_authenticated: false,
            is_loading: false,
            error: extractCorrectErrorMessage(error, 'Login failed'),
          }));
          if (opts?.onError && typeof opts.onError === 'function') {
            opts.onError(extractCorrectErrorMessage(error, 'Login failed'));
          } else {
            console.error('Login failed:', error);
          }
          throw new Error(extractCorrectErrorMessage(error, 'Login failed'));
        }
      },

      register: async (payload, opts) => {
        set({ is_loading: true, error: null });

        try {
          // const { data: dbData } =
          await apiClient.post<IRegisterUserResponse>(
            '/auth/register/',
            payload,
          );
          // registerUserResponseSchema.parse(dbData);
        } catch (error) {
          set((state) => ({
            ...state,
            user: null,
            access_token: null,
            is_authenticated: false,
            is_loading: false,
            error: extractCorrectErrorMessage(error, 'Registration failed'),
          }));
          if (opts?.onError && typeof opts.onError === 'function') {
            opts.onError(
              extractCorrectErrorMessage(error, 'Registration failed'),
            );
          } else {
            console.error('Registration failed:', error);
          }
          throw new Error(
            extractCorrectErrorMessage(error, 'Registration failed'),
          );
        }
      },

      logout: () => {
        set((state) => ({
          ...state,
          user: null,
          access_token: null,
          is_authenticated: false,
          is_loading: false,
          error: null,
        }));
      },

      clearError: () => {
        set((state) => ({ ...state, error: null }));
      },

      setLoading: (loading: boolean) => {
        set((state) => ({ ...state, is_loading: loading }));
      },
      setUser: (user: IAuthUser) => {
        set((state) => ({
          ...state,
          user: { ...state.user, ...user },
        }));
      },
      changeCurrentOrganization: (organizationId: string) => {
        if (_get().user?.organizations.length === 0) {
          toast.error('No organizations available to switch to.');
          return;
        }

        if (
          !_get().user?.organizations.some((org) => org.id === organizationId)
        ) {
          toast.error('Organization not found.');
          return;
        }

        set((state) => ({
          ...state,
          current_org_id: organizationId,
        }));
      },
      getCurrentOrganization: () => {
        const orgId = _get().current_org_id;
        if (!orgId) return undefined;
        return _get().user?.organizations.find((org) => org.id === orgId);
      },
      getCurrentUserRole: () => {
        return _get().user?.role;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage), // Explicit storage with JSON serialization
      partialize: (state) => ({
        user: state.user,
        token: state.access_token,
        isAuthenticated: state.is_authenticated,
      }),
      version: 1, // Add version for future migrations
      migrate: (persistedState, version) => {
        if (version === 0) {
          // Handle migration from version 0 to 1 if needed
          return persistedState as AuthState;
        }
        return persistedState as AuthState;
      },
    },
  ),
);
