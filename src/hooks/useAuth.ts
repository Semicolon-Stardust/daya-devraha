// src/hooks/useAuth.ts
import { useAuthStore } from '@/stores/authStore';

export const useAuth = () => {
	const token = useAuthStore((state) => state.token);
	const user = useAuthStore((state) => state.user);
	const isAuthenticated = Boolean(token);
	return { token, user, isAuthenticated };
};
