'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import VerticalSidebar from '@/components/ui/header/vertical-header';
import { useAuthStore } from '@/stores/authStore';

function getGreeting() {
	const hour = new Date().getHours();
	if (hour < 12) return 'Good morning';
	if (hour < 18) return 'Good afternoon';
	return 'Good evening';
}

export default function SettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const params = useParams();
	const locale = params.locale || 'en';
	const router = useRouter();
	const {
		user,
		isCheckingAuth,
		isAuthenticatedUser,
		checkUserAuth,
		checkUserProfile,
		logoutUser,
	} = useAuthStore();

	const handleLogout = async () => {
		await logoutUser();
		router.push('/en/login');
	};
	// Check user authentication on mount.
	useEffect(() => {
		(async () => {
			await checkUserAuth();
		})();
	}, [checkUserAuth]);

	// Once authenticated, fetch the user profile to get the username.
	useEffect(() => {
		if (isAuthenticatedUser) {
			checkUserProfile();
		}
	}, [isAuthenticatedUser, checkUserProfile]);

	// Redirect to login if not authenticated once checking is complete.
	useEffect(() => {
		if (!isCheckingAuth && !isAuthenticatedUser) {
			router.push(`/${locale}/login`);
		}
	}, [isCheckingAuth, isAuthenticatedUser, router, locale]);

	// While waiting for the auth check to finish, show a loading indicator.
	if (isCheckingAuth) {
		return (
			<div className="flex h-screen items-center justify-center">
				Loading...
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white dark:bg-black">
			<div className="flex">
				{/* Vertical Sidebar */}
				<VerticalSidebar
					heading="User Settings"
					headingLink={`/settings`}
					links={[
						{
							label: 'Verify Email',
							href: `/settings/verify-email`,
						},
						{
							label: 'Change Password',
							href: `/settings/password-change`,
						},
						{
							label: 'Two Factor Authentication',
							href: `/settings/two-factor`,
						},
						{
							label: 'Delete Account',
							href: `/settings/delete-account`,
						},
					]}
					onLogout={handleLogout}
				/>
				{/* Main content area */}
				<main className="flex-1 p-8">
					<div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow dark:bg-stone-800">
						{user && (
							<h1 className="text-3xl font-bold text-black dark:text-white">
								{getGreeting()},{' '}
								{user?.name?.split(' ')[0] || 'User'}
							</h1>
						)}
						{children}
					</div>
				</main>
			</div>
		</div>
	);
}
