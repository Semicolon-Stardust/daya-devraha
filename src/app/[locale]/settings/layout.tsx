"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import VerticalSidebar from "@/components/ui/header/vertical-header";
import { useAuthStore } from "@/stores/authStore";

export default function SettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const params = useParams();
	const locale = params.locale || "en";

	// Destructure auth state and functions from the store
	const { isCheckingAuth, checkUserAuth, isAuthenticatedUser } =
		useAuthStore();
	const router = useRouter();

	// On mount, check user authentication
	useEffect(() => {
		(async () => {
			await checkUserAuth();
		})();
	}, [checkUserAuth]);

	// Once checking is complete, if not authenticated, redirect to login.
	useEffect(() => {
		if (!isCheckingAuth && !isAuthenticatedUser) {
			router.push(`/${locale}/login`);
		}
	}, [isCheckingAuth, isAuthenticatedUser, router, locale]);

	// While the authentication check is in progress, show a loading state.
	if (isCheckingAuth) {
		return (
			<div className="flex items-center justify-center h-screen">
				Loading...
			</div>
		);
	}

	// Render the settings layout with a vertical navbar on the side.
	return (
		<div className="flex min-h-screen">
			{/* Vertical Navbar (only visible on medium screens and up) */}
			<VerticalSidebar />
			{/* Main content area */}
			<main className="flex-1">{children}</main>
		</div>
	);
}
