import { MOCK_USER_WITH_ORGS } from '@/lib/data/mock-org';
import type {
	AuthState,
	IAuthUser,
	ILoginUser,
	IRegisterUser,
	UserRole,
} from '@/lib/types/auth';
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
const checkRole = (email: string): UserRole =>
	email.includes('admin')
		? 'admin'
		: email.includes('instructor')
			? 'instructor'
			: email.includes('student')
				? 'student'
				: 'guest';
// Mock API functions
const mockLogin = async ({
	email,
	password,
}: ILoginUser): Promise<{ user: IAuthUser; token: string }> => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (email && password) {
				resolve({
					user: { ...MOCK_USER_WITH_ORGS, email, role: checkRole(email) },
					token: 'test-token',
				});
			} else {
				reject(new Error('Invalid credentials'));
			}
		}, 1000);
	});
};

const mockRegister = async (
	payload: IRegisterUser,
): Promise<{ user: IAuthUser; token: string }> => {
	const { email, password, name } = payload;
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (email && password && name) {
				resolve({
					user: { ...MOCK_USER_WITH_ORGS, email, name },
					token: 'mock-jwt-token-new-user',
				});
			} else {
				reject(new Error('Registration failed'));
			}
		}, 1000);
	});
};

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
					const { user, token } = await mockLogin(payload);

					// Use functional update to ensure all state changes are applied together
					set((state) => ({
						...state,
						user,
						token,
						isAuthenticated: true,
						isLoading: false,
						error: null,
					}));
					if (opts?.onSuccess && typeof opts.onSuccess === 'function') {
						opts.onSuccess(user, token);
					} else {
						console.log('Login successful:');
					}
				} catch (error) {
					set((state) => ({
						...state,
						user: null,
						token: null,
						isAuthenticated: false,
						isLoading: false,
						error: error instanceof Error ? error.message : 'Login failed',
					}));
					if (opts?.onError && typeof opts.onError === 'function') {
						opts.onError(
							error instanceof Error ? error.message : 'Login failed',
						);
					} else {
						console.error('Login failed:', error);
					}
				}
			},

			register: async (payload, opts) => {
				set({ isLoading: true, error: null });

				try {
					const { user, token } = await mockRegister(payload);

					set((state) => ({
						...state,
						user,
						token,
						isAuthenticated: true,
						isLoading: false,
						error: null,
					}));
					if (opts?.onSuccess && typeof opts.onSuccess === 'function') {
						opts.onSuccess(user, token);
					} else {
						console.log('Registration successful:', user);
					}
				} catch (error) {
					set((state) => ({
						...state,
						user: null,
						token: null,
						isAuthenticated: false,
						isLoading: false,
						error:
							error instanceof Error ? error.message : 'Registration failed',
					}));
					if (opts?.onError && typeof opts.onError === 'function') {
						opts.onError(
							error instanceof Error ? error.message : 'Registration failed',
						);
					} else {
						console.error('Registration failed:', error);
					}
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
