import { create } from 'zustand';
import apiClient from '@/apiClient';

//////////////////////
// Type Definitions //
//////////////////////

export interface Admin {
	id: string;
	email: string;
	name: string;
	twoFactorEnabled?: boolean;
	isVerified: boolean;
	dateOfBirth?: string;
}

export interface User {
	id: string;
	email: string;
	name: string;
	twoFactorEnabled: boolean;
	isVerified: boolean;
	dateOfBirth?: string;
	emergencyRecoveryContact?: string;
}

//////////////////////
// Store Interface  //
//////////////////////

interface AuthState {
	// Admin state and functions
	admin: Admin | null;
	isAuthenticatedAdmin: boolean;
	registerAdmin: (
		admin_name: string,
		admin_email: string,
		password: string,
		confirmPassword: string,
		dateOfBirth?: string
	) => Promise<void>;
	loginAdmin: (admin_email: string, password: string) => Promise<void>;
	logoutAdmin: () => Promise<void>;
	checkAdminAuth: () => Promise<void>;
	checkAdminProfile: () => Promise<void>;
	updateAdminProfile: (
		data: Partial<Admin> & { password?: string }
	) => Promise<void>;
	deleteAdminAccount: () => Promise<void>;
	// Extra admin functions
	verifyAdminEmail: (token: string) => Promise<boolean>;
	resendAdminVerificationEmail: (email: string) => Promise<string>;
	forgotPasswordAdmin: (email: string) => Promise<string>;
	resetPasswordAdmin: (
		token: string,
		newPassword: string,
		confirmPassword: string
	) => Promise<string>;
	verifyAdminOTP: (otp: string) => Promise<void>;
	checkAdminVerificationStatus: () => Promise<void>;
	// New admin function: Toggle Two-Factor Authentication
	toggleAdminTwoFactor: () => Promise<void>;

	// User state and functions
	user: User | null;
	isAuthenticatedUser: boolean;
	registerUser: (
		name: string,
		email: string,
		password: string,
		confirmPassword: string,
		dateOfBirth?: string,
		emergencyRecoveryContact?: string
	) => Promise<void>;
	loginUser: (
		email: string,
		password: string
	) => Promise<{ twoFactorRequired: boolean }>;
	logoutUser: () => Promise<void>;
	checkUserAuth: () => Promise<void>;
	checkUserProfile: () => Promise<void>;
	updateUserPassword: (newPassword: string) => Promise<void>;
	toggleUserTwoFactor: () => Promise<void>;
	deleteUserAccount: () => Promise<void>;
	verifyUserOTP: (otp: string) => Promise<void>;
	checkUserVerificationStatus: () => Promise<void>;
	verifyUserEmail: (token: string) => Promise<boolean>;
	resendUserVerificationEmail: (email: string) => Promise<string>;
	forgotPassword: (email: string) => Promise<string>;
	resetPassword: (
		token: string,
		newPassword: string,
		confirmPassword: string
	) => Promise<string>;

	// Global flags
	error: string | null;
	isLoading: boolean;
	isCheckingAuth: boolean;

	// Extra keys for verification handling
	pendingUserEmail: string | null;
	isEmailVerified: boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
	// Admin initial state
	admin: null,
	isAuthenticatedAdmin: false,
	// User initial state
	user: null,
	isAuthenticatedUser: false,
	// Extra keys
	pendingUserEmail: null,
	isEmailVerified: false,
	// Global flags
	error: null,
	isLoading: false,
	isCheckingAuth: true,

	//////////////////////////////////
	// Admin Functions              //
	//////////////////////////////////

	registerAdmin: async (
		admin_name,
		admin_email,
		password,
		confirmPassword,
		dateOfBirth
	) => {
		set({ isLoading: true, error: null });
		try {
			const response = await apiClient.post('/admin/register', {
				name: admin_name,
				email: admin_email,
				password,
				confirmPassword,
				dateOfBirth,
			});
			set({
				admin: response.data.data,
				isAuthenticatedAdmin: true,
				isLoading: false,
			});
		} catch (error: unknown) {
			let errorMessage = 'Error registering admin';
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			set({ error: errorMessage, isLoading: false });
			throw error;
		}
	},

	loginAdmin: async (admin_email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await apiClient.post('/admin/login', {
				email: admin_email,
				password,
			});
			set({
				admin: response.data.data,
				isAuthenticatedAdmin: true,
				isLoading: false,
			});
		} catch (error: unknown) {
			let errorMessage = 'Error logging in admin';
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			set({ error: errorMessage, isLoading: false });
			throw error;
		}
	},

	logoutAdmin: async () => {
		set({ isLoading: true, error: null });
		try {
			await apiClient.post('/admin/logout');
			set({
				admin: null,
				isAuthenticatedAdmin: false,
				isLoading: false,
			});
		} catch (error: unknown) {
			let errorMessage = 'Error logging out admin';
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			set({ error: errorMessage, isLoading: false });
			throw error;
		}
	},

	checkAdminAuth: async () => {
		set({ isCheckingAuth: true });
		try {
			const response = await apiClient.get('/admin/validate-token', {
				withCredentials: true,
			});
			set({
				admin: response.data.data,
				isAuthenticatedAdmin: true,
				isCheckingAuth: false,
			});
		} catch (error: unknown) {
			set({
				admin: null,
				isAuthenticatedAdmin: false,
				isCheckingAuth: false,
			});
		}
	},

	checkAdminProfile: async () => {
		try {
			const response = await apiClient.get('/admin/profile', {
				withCredentials: true,
			});
			set({
				admin: response.data.data,
				isAuthenticatedAdmin: true,
			});
		} catch (error: unknown) {
			set({
				admin: null,
				isAuthenticatedAdmin: false,
			});
		}
	},

	updateAdminProfile: async (data) => {
		set({ isLoading: true, error: null });
		try {
			const response = await apiClient.put(
				'/admin/update-profile',
				data,
				{
					withCredentials: true,
				}
			);
			set({
				admin: response.data.data,
				isLoading: false,
			});
		} catch (error: unknown) {
			let errorMessage = 'Error updating admin profile';
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			set({ error: errorMessage, isLoading: false });
			throw error;
		}
	},

	deleteAdminAccount: async () => {
		set({ isLoading: true, error: null });
		try {
			await apiClient.delete('/admin/delete-account', {
				withCredentials: true,
			});
			set({
				admin: null,
				isAuthenticatedAdmin: false,
				isLoading: false,
			});
		} catch (error: unknown) {
			let errorMessage = 'Error deleting admin account';
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			set({ error: errorMessage, isLoading: false });
			throw error;
		}
	},

	// Extra Admin Functions

	verifyAdminEmail: async (token: string) => {
		set({ isLoading: true, error: null });
		try {
			const response = await apiClient.get(
				`/admin/verify-email?token=${token}`,
				{
					withCredentials: true,
				}
			);
			const verified = response.data.data?.verified;
			set({ isLoading: false });
			return verified;
		} catch (error: unknown) {
			let errorMessage = 'Error verifying admin email';
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			set({ error: errorMessage, isLoading: false });
			throw error;
		}
	},

	resendAdminVerificationEmail: async (email: string) => {
		set({ isLoading: true, error: null });
		try {
			const response = await apiClient.post(
				'/admin/resend-verification',
				{ email },
				{ withCredentials: true }
			);
			set({ isLoading: false });
			return response.data.message;
		} catch (error: unknown) {
			let errorMessage = 'Error resending admin verification email';
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			set({ error: errorMessage, isLoading: false });
			throw error;
		}
	},

	forgotPasswordAdmin: async (email: string) => {
		set({ isLoading: true, error: null });
		try {
			const response = await apiClient.post(
				'/admin/forgot-password',
				{ email },
				{ withCredentials: true }
			);
			set({ isLoading: false });
			return response.data.message;
		} catch (error: unknown) {
			let errorMessage = 'Error sending admin password reset email';
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			set({ error: errorMessage, isLoading: false });
			throw error;
		}
	},

	resetPasswordAdmin: async (
		token: string,
		newPassword: string,
		confirmPassword: string
	) => {
		set({ isLoading: true, error: null });
		try {
			const response = await apiClient.post(
				'/admin/reset-password',
				{ token, newPassword, confirmPassword },
				{ withCredentials: true }
			);
			set({ isLoading: false });
			return response.data.message;
		} catch (error: unknown) {
			let errorMessage = 'Error resetting admin password';
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			set({ error: errorMessage, isLoading: false });
			throw error;
		}
	},

	verifyAdminOTP: async (otp: string) => {
		set({ isLoading: true, error: null });
		try {
			const email = get().admin?.email;
			if (!email) {
				throw new Error(
					'No admin email available for OTP verification.'
				);
			}
			const response = await apiClient.post(
				'/admin/verify-otp',
				{ email, otp },
				{ withCredentials: true }
			);
			set({
				admin: response.data.data,
				isAuthenticatedAdmin: true,
				isLoading: false,
			});
		} catch (error: unknown) {
			let errorMessage = 'Error verifying admin OTP';
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			set({ error: errorMessage, isLoading: false });
			throw error;
		}
	},

	checkAdminVerificationStatus: async () => {
		try {
			const response = await apiClient.get('/admin/verification-status', {
				withCredentials: true,
			});
			const verified = response.data.data?.verified;
			if (get().admin) {
				set((state) => ({
					admin: { ...state.admin!, isVerified: verified },
				}));
			}
		} catch (error: unknown) {
			if (get().admin) {
				set((state) => ({
					admin: { ...state.admin!, isVerified: false },
				}));
			}
		}
	},

	// New Admin Function: Toggle Two-Factor Authentication
	toggleAdminTwoFactor: async () => {
		set({ isLoading: true, error: null });
		try {
			const currentAdmin = get().admin;
			if (currentAdmin && currentAdmin.twoFactorEnabled) {
				await apiClient.post(
					'/admin/disable-two-factor',
					{},
					{ withCredentials: true }
				);
				set((state) => ({
					admin: state.admin
						? { ...state.admin, twoFactorEnabled: false }
						: null,
					isLoading: false,
				}));
			} else {
				await apiClient.post(
					'/admin/enable-two-factor',
					{},
					{ withCredentials: true }
				);
				set((state) => ({
					admin: state.admin
						? { ...state.admin, twoFactorEnabled: true }
						: null,
					isLoading: false,
				}));
			}
		} catch (error: unknown) {
			let errorMessage = 'Error toggling admin 2FA preferences';
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			set({ error: errorMessage, isLoading: false });
			throw error;
		}
	},

	//////////////////////////////////
	// User Functions               //
	//////////////////////////////////

	registerUser: async (
		name,
		email,
		password,
		confirmPassword,
		dateOfBirth,
		emergencyRecoveryContact
	) => {
		set({ isLoading: true, error: null });
		try {
			const response = await apiClient.post('/user/register', {
				name,
				email,
				password,
				confirmPassword,
				dateOfBirth,
				emergencyRecoveryContact,
			});
			set({
				user: response.data.data,
				isAuthenticatedUser: true,
				isLoading: false,
				isEmailVerified: response.data.data.isVerified,
			});
		} catch (error: unknown) {
			let errorMessage = 'Error registering user';
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			set({ error: errorMessage, isLoading: false });
			throw error;
		}
	},

	loginUser: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await apiClient.post('/user/login', {
				email,
				password,
			});
			if (response.data.data.twoFactorRequired) {
				set({ pendingUserEmail: email, isLoading: false });
				return { twoFactorRequired: true };
			} else {
				set({
					user: response.data.data,
					isAuthenticatedUser: true,
					isLoading: false,
					pendingUserEmail: null,
					isEmailVerified: response.data.data.isVerified,
				});
				return { twoFactorRequired: false };
			}
		} catch (error: unknown) {
			let errorMessage = 'Error logging in user';
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			set({ error: errorMessage, isLoading: false });
			throw error;
		}
	},

	logoutUser: async () => {
		set({ isLoading: true, error: null });
		try {
			await apiClient.post('/user/logout');
			set({
				user: null,
				isAuthenticatedUser: false,
				isLoading: false,
			});
		} catch (error: unknown) {
			let errorMessage = 'Error logging out user';
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			set({ error: errorMessage, isLoading: false });
			throw error;
		}
	},

	checkUserAuth: async () => {
		set({ isCheckingAuth: true });
		try {
			const response = await apiClient.get('/user/validate-token', {
				withCredentials: true,
			});
			set({
				user: response.data.data,
				isAuthenticatedUser: true,
				isCheckingAuth: false,
			});
		} catch (error: unknown) {
			set({
				user: null,
				isAuthenticatedUser: false,
				isCheckingAuth: false,
			});
		}
	},

	checkUserProfile: async () => {
		try {
			const response = await apiClient.get('/user/profile', {
				withCredentials: true,
			});
			set({
				user: response.data.data,
				isAuthenticatedUser: true,
				isEmailVerified: response.data.data.isVerified,
			});
		} catch (error: unknown) {
			set({
				user: null,
				isAuthenticatedUser: false,
				isEmailVerified: false,
			});
		}
	},

	updateUserPassword: async (newPassword: string) => {
		set({ isLoading: true, error: null });
		try {
			await apiClient.put(
				'/user/update-profile',
				{ password: newPassword },
				{ withCredentials: true }
			);
			set({ isLoading: false });
		} catch (error: unknown) {
			let errorMessage = 'Error updating password';
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			set({ error: errorMessage, isLoading: false });
			throw error;
		}
	},

	toggleUserTwoFactor: async () => {
		set({ isLoading: true, error: null });
		try {
			const currentUser = get().user;
			if (currentUser && currentUser.twoFactorEnabled) {
				await apiClient.post(
					'/user/disable-two-factor',
					{},
					{ withCredentials: true }
				);
				set((state) => ({
					user: state.user
						? { ...state.user, twoFactorEnabled: false }
						: null,
					isLoading: false,
				}));
			} else {
				await apiClient.post(
					'/user/enable-two-factor',
					{},
					{ withCredentials: true }
				);
				set((state) => ({
					user: state.user
						? { ...state.user, twoFactorEnabled: true }
						: null,
					isLoading: false,
				}));
			}
		} catch (error: unknown) {
			let errorMessage = 'Error toggling 2FA preferences';
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			set({ error: errorMessage, isLoading: false });
			throw error;
		}
	},

	deleteUserAccount: async () => {
		set({ isLoading: true, error: null });
		try {
			await apiClient.delete('/user/delete-account', {
				withCredentials: true,
			});
			set({
				user: null,
				isAuthenticatedUser: false,
				isLoading: false,
			});
		} catch (error: unknown) {
			let errorMessage = 'Error deleting account';
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			set({ error: errorMessage, isLoading: false });
			throw error;
		}
	},

	verifyUserOTP: async (otp: string) => {
		set({ isLoading: true, error: null });
		try {
			const email = get().user?.email || get().pendingUserEmail;
			if (!email) {
				throw new Error('No email available for OTP verification.');
			}
			const response = await apiClient.post(
				'/user/verify-otp',
				{ email, otp },
				{ withCredentials: true }
			);
			set({
				user: response.data.data,
				isAuthenticatedUser: true,
				isLoading: false,
				pendingUserEmail: null,
				isEmailVerified: response.data.data.isVerified,
			});
		} catch (error: unknown) {
			let errorMessage = 'Error verifying OTP';
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			set({ error: errorMessage, isLoading: false });
			throw error;
		}
	},

	checkUserVerificationStatus: async () => {
		try {
			const response = await apiClient.get('/user/verification-status', {
				withCredentials: true,
			});
			set({ isEmailVerified: response.data.data.verified });
		} catch (error: unknown) {
			set({ isEmailVerified: false });
		}
	},

	verifyUserEmail: async (token: string) => {
		set({ isLoading: true, error: null });
		try {
			const response = await apiClient.get(
				`/user/verify-email?token=${token}`,
				{ withCredentials: true }
			);
			const verified = response.data.data?.verified;
			set({ isEmailVerified: verified, isLoading: false });
			return verified;
		} catch (error: unknown) {
			let errorMessage = 'Error verifying email';
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			set({
				error: errorMessage,
				isLoading: false,
				isEmailVerified: false,
			});
			throw error;
		}
	},

	resendUserVerificationEmail: async (email: string) => {
		set({ isLoading: true, error: null });
		try {
			const response = await apiClient.post(
				'/user/resend-verification',
				{ email },
				{ withCredentials: true }
			);
			set({ isLoading: false });
			return response.data.message;
		} catch (error: unknown) {
			let errorMessage = 'Error resending verification email';
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			set({ error: errorMessage, isLoading: false });
			throw error;
		}
	},

	forgotPassword: async (email: string) => {
		set({ isLoading: true, error: null });
		try {
			const response = await apiClient.post('/user/forgot-password', {
				email,
			});
			set({ isLoading: false });
			return response.data.message;
		} catch (error: unknown) {
			let errorMessage = 'Error sending password reset email';
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			set({ error: errorMessage, isLoading: false });
			throw error;
		}
	},

	resetPassword: async (
		token: string,
		newPassword: string,
		confirmPassword: string
	) => {
		set({ isLoading: true, error: null });
		try {
			const response = await apiClient.post(
				'/user/reset-password',
				{ token, newPassword, confirmPassword },
				{ withCredentials: true }
			);
			set({ isLoading: false });
			return response.data.message;
		} catch (error: unknown) {
			let errorMessage = 'Error resetting password';
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			set({ error: errorMessage, isLoading: false });
			throw error;
		}
	},
}));
