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
  const { user, isCheckingAuth, checkUserAuth, isAuthenticatedUser } =
    useAuthStore();

  // Check user authentication on mount.
  useEffect(() => {
    (async () => {
      await checkUserAuth();
    })();
  }, [checkUserAuth]);

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
        <VerticalSidebar />
        {/* Main content area */}
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow dark:bg-stone-800">
            {user && (
              <h1 className="text-3xl font-bold text-black dark:text-white">
                {getGreeting()}, {user.name}!
              </h1>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
