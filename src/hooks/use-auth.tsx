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
}

type AuthStore = AuthState & AuthActions;

export const useAuth = create<AuthStore>()(
  persist(
    (set, _get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (payload, opts) => {
        set({ isLoading: true, error: null });

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
            token: data.access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          }));
         
        } catch (error) {
          set((state) => ({
            ...state,
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
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
        set({ isLoading: true, error: null });

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
            token: null,
            isAuthenticated: false,
            isLoading: false,
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
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        }));
      },

      clearError: () => {
        set((state) => ({ ...state, error: null }));
      },

      setLoading: (loading: boolean) => {
        set((state) => ({ ...state, isLoading: loading }));
      },
      setUser: (user: IAuthUser) => {
        set((state) => ({
          ...state,
          user: { ...state.user, ...user },
        }));
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage), // Explicit storage with JSON serialization
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
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
