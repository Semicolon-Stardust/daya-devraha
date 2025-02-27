// /src/stores/authStore.ts
import { create } from 'zustand';
import apiClient from '@/apiClient';

interface Admin {
  id: string;
  email: string;
  name: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  twoFactorEnabled: boolean;
  dateOfBirth?: string;
  emergencyRecoveryContact?: string;
}

interface AuthState {
  // Admin state
  admin: Admin | null;
  isAuthenticatedAdmin: boolean;
  // User state
  user: User | null;
  isAuthenticatedUser: boolean;
  // A temporary email stored when 2FA is required
  pendingUserEmail: string | null;
  // Global flags
  error: string | null;
  isLoading: boolean;
  isCheckingAuth: boolean;
  // Admin functions
  registerAdmin: (
    admin_name: string,
    admin_email: string,
    password: string,
    key: string,
  ) => Promise<void>;
  loginAdmin: (admin_email: string, password: string) => Promise<void>;
  logoutAdmin: () => Promise<void>;
  checkAdminAuth: () => Promise<void>;
  checkAdminProfile: () => Promise<void>;
  // User functions
  registerUser: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    dateOfBirth?: string,
    emergencyRecoveryContact?: string,
  ) => Promise<void>;
  loginUser: (
    email: string,
    password: string,
  ) => Promise<{ twoFactorRequired: boolean }>;
  logoutUser: () => Promise<void>;
  checkUserAuth: () => Promise<void>;
  checkUserProfile: () => Promise<void>;
  // New functions:
  updateUserPassword: (newPassword: string) => Promise<void>;
  toggleUserTwoFactor: () => Promise<void>;
  deleteUserAccount: () => Promise<void>;
  verifyUserOTP: (otp: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state for admin
  admin: null,
  isAuthenticatedAdmin: false,
  // Initial state for user
  user: null,
  isAuthenticatedUser: false,
  pendingUserEmail: null,
  // Common flags
  error: null,
  isLoading: false,
  isCheckingAuth: true,

  // =========================
  // Admin Functions (unchanged)
  // =========================

  registerAdmin: async (admin_name, admin_email, password, key) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/admin/register', {
        name: admin_name,
        email: admin_email,
        password,
        adminKey: key,
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

  // =========================
  // User Functions
  // =========================

  registerUser: async (
    name,
    email,
    password,
    confirmPassword,
    dateOfBirth,
    emergencyRecoveryContact,
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/auth/register', {
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
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });
      // If backend indicates that 2FA is required, store the pending email.
      if (response.data.data.twoFactorRequired) {
        set({ pendingUserEmail: email, isLoading: false });
        return { twoFactorRequired: true };
      } else {
        set({
          user: response.data.data,
          isAuthenticatedUser: true,
          isLoading: false,
          pendingUserEmail: null,
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
      await apiClient.post('/auth/logout');
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
      const response = await apiClient.get('/auth/validate-token', {
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
      const response = await apiClient.get('/auth/profile', {
        withCredentials: true,
      });
      set({
        user: response.data.data,
        isAuthenticatedUser: true,
      });
    } catch (error: unknown) {
      set({
        user: null,
        isAuthenticatedUser: false,
      });
    }
  },

  // -------------------------
  // New User Functions
  // -------------------------

  updateUserPassword: async (newPassword: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.put(
        '/auth/update-profile',
        { password: newPassword },
        { withCredentials: true },
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
          { withCredentials: true },
        );
        set((state) => ({
          user: state.user ? { ...state.user, twoFactorEnabled: false } : null,
          isLoading: false,
        }));
      } else {
        await apiClient.post(
          '/user/enable-two-factor',
          {},
          { withCredentials: true },
        );
        set((state) => ({
          user: state.user ? { ...state.user, twoFactorEnabled: true } : null,
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
      await apiClient.delete('/auth/delete-account', {
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

  // New function to verify OTP.
  verifyUserOTP: async (otp: string) => {
    set({ isLoading: true, error: null });
    try {
      // Use the user email from state if available, otherwise use the pending email.
      const email = get().user?.email || get().pendingUserEmail;
      if (!email) {
        throw new Error('No email available for OTP verification.');
      }
      const response = await apiClient.post(
        '/user/verify-otp',
        { email, otp },
        { withCredentials: true },
      );
      // Assume the backend returns the updated user data.
      set({
        user: response.data.data,
        isAuthenticatedUser: true,
        isLoading: false,
        pendingUserEmail: null,
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
}));
