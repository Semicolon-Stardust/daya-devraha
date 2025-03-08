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

export default function AdminSettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const params = useParams();
	const locale = params.locale || 'en';
	const router = useRouter();
	const {
		admin,
		isCheckingAuth,
		isAuthenticatedAdmin,
		checkAdminAuth,
		checkAdminProfile,
		logoutAdmin,
	} = useAuthStore();

	const handleLogout = async () => {
		await logoutAdmin();
		router.push('/en/admin/login');
	};

	// Check admin authentication on mount.
	useEffect(() => {
		(async () => {
			await checkAdminAuth();
		})();
	}, [checkAdminAuth]);

	// Once authenticated, fetch the full admin profile.
	useEffect(() => {
		if (isAuthenticatedAdmin) {
			checkAdminProfile();
		}
	}, [isAuthenticatedAdmin, checkAdminProfile]);

	// Redirect to admin login if not authenticated.
	useEffect(() => {
		if (!isCheckingAuth && !isAuthenticatedAdmin) {
			router.push(`/${locale}/admin/login`);
		}
	}, [isCheckingAuth, isAuthenticatedAdmin, router, locale]);

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
					heading="Admin Settings"
					headingLink={`/admin/settings`}
					links={[
						{
							label: 'Verify Email',
							href: `/admin/settings/verify-email`,
						},
						{
							label: 'Change Password',
							href: `/admin/settings/password-change`,
						},
						{
							label: 'Two Factor Authentication',
							href: `/admin/settings/two-factor`,
						},
						{
							label: 'Delete Account',
							href: `/admin/settings/delete-account`,
						},
					]}
					onLogout={handleLogout}
				/>
				{/* Main content area */}
				<main className="flex-1 p-8">
					<div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow dark:bg-stone-800">
						{admin && (
							<h1 className="text-3xl font-bold text-black dark:text-white">
								{getGreeting()},{' '}
								{admin?.name?.split(' ')[0] || 'Admin'}
							</h1>
						)}
						{children}
					</div>
				</main>
			</div>
		</div>
	);
}
