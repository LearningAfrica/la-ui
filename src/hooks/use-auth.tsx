import type { AuthState, IAuthUser } from '@/lib/types/auth';
import { apiErrorMsg } from '@/lib/utils/axios-err';
import { cookieStorage } from 'zustand-cookie-storage';
import {
  loginUserResponseSchema,
  registerUserResponseSchema,
  type ILoginUser,
  type ILoginUserResponse,
  type IRegisterUser,
  type IRegisterUserResponse,
} from '@/lib/validators/auth-schema';
import type { AxiosInstance } from 'axios';
import { toast } from 'sonner';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
// Types

type RegisterOrLoginCallbackProps = {
  onSuccess?: (user: IAuthUser, token: string) => void;
  onError?: (error: string) => void;
};

interface AuthActions {
  login: (
    axiosClient: AxiosInstance,
    props: ILoginUser,
    options?: RegisterOrLoginCallbackProps,
  ) => Promise<void>;
  register: (
    axiosClient: AxiosInstance,
    props: IRegisterUser,
    options?: RegisterOrLoginCallbackProps,
  ) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: IAuthUser) => void;
  getCurrentOrganization: () => IAuthUser['organizations'][number] | undefined;
  getCurrentUserRole: () => IAuthUser['user_role'] | undefined;
  changeCurrentOrganization: (organizationId: string) => void; // Add this method to change current organization
}

type AuthStore = AuthState & AuthActions;

export const useAuth = create<AuthStore>()(
  persist(
    (set, _get) => ({
      user: {} as IAuthUser,
      access_token: null,
      is_authenticated: false,
      is_loading: false,
      error: null,
      current_org_id: null,
      refresh_token: null,
      session_id: uuidv4(), // Generate a unique session ID on initialization
      login: async (axiosClient, payload, opts) => {
        set({ is_loading: true, error: null });
        try {
          const { data: dbData } = await axiosClient.post<ILoginUserResponse>(
            '/auth/login/',
            payload,
          );
          const data = loginUserResponseSchema.parse(dbData);
          // Use functional update to ensure all state changes are applied together
          set((state) => ({
            ...state,
            user: {
              id: data.id,
              user_role: data.user_role,
              organizations: data.organizations,
              avatar: undefined, // Adjust as needed
              can_create_organization: data.can_create_organization,
              email: data.email,
            },
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            is_authenticated: true,
            is_loading: false,
            error: null,
            session_id: uuidv4(), // Generate a new session ID on login
            current_org_id:
              data.organizations.length > 0 ? data.organizations[0].id : null,
          }));
        } catch (error) {
          set((state) => ({
            ...state,
            user: null,
            access_token: null,
            is_authenticated: false,
            is_loading: false,
            error: apiErrorMsg(error, 'Login failed'),
          }));
          if (opts?.onError && typeof opts.onError === 'function') {
            opts.onError(apiErrorMsg(error, 'Login failed'));
          } else {
            console.error('Login failed:', error);
          }
          throw new Error(apiErrorMsg(error, 'Login failed'));
        }
      },

      register: async (axiosClient, payload, opts) => {
        set({ is_loading: true, error: null });

        try {
          const { data } = await axiosClient.post<IRegisterUserResponse>(
            '/auth/register/',
            payload,
          );
          registerUserResponseSchema.parse(data);
          set((state) => ({
            ...state,
            user: {
              id: data.id,
              // username: data.username,
              user_role: data.user_role,
              organizations: data.organizations,
              avatar: undefined, // Adjust as needed
              can_create_organization: data.can_create_organization,
              email: data.email,
            },
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            is_authenticated: true,
            is_loading: false,
            error: null,
            session_id: uuidv4(), // Generate a new session ID on login
            current_org_id:
              data.organizations.length > 0 ? data.organizations[0].id : null,
          }));

          // registerUserResponseSchema.parse(dbData);
        } catch (error) {
          set((state) => ({
            ...state,
            user: null,
            access_token: null,
            is_authenticated: false,
            is_loading: false,
            error: apiErrorMsg(error, 'Registration failed'),
          }));
          if (opts?.onError && typeof opts.onError === 'function') {
            opts.onError(apiErrorMsg(error, 'Registration failed'));
          } else {
            console.error('Registration failed:', error);
          }
          throw new Error(apiErrorMsg(error, 'Registration failed'));
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
          refresh_token: null,
          current_org_id: null,
          session_id: uuidv4(), // Generate a new session ID on logout
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
        return _get().user?.user_role;
      },
    }),
    {
      name: 'c9f98b10c9263e2753024f85',
      storage: createJSONStorage(() => cookieStorage), // Explicit storage with JSON serialization
      partialize: (state) => ({
        current_org_id: state.current_org_id,
        refresh_token: state.refresh_token,
        access_token: state.access_token,
        user: state.user,
        is_authenticated: state.is_authenticated,
        session_id: state.session_id,
      }),
      version: 1, // Add version for future migrations
      migrate: (persistedState, version) => {
        if (version === 0) {
          // Handle migration from version 0 to 1 if needed
          return persistedState as AuthState;
        }
        return persistedState as AuthState;
      },
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as AuthStore),
      }),
      onRehydrateStorage(state) {
        if (state) {
          state.is_loading = false; // Ensure loading is false after rehydration
          state.error = null; // Clear any errors on rehydration
        }
      },
    },
  ),
);
