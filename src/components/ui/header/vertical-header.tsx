'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/utils/mode-toggle';
import { useAuthStore } from '@/stores/authStore';

const sidebarVariants = {
  hidden: { x: -250, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
};

export default function VerticalSidebar() {
  const router = useRouter();
  const { logoutUser } = useAuthStore();

  const handleLogout = async () => {
    await logoutUser();
    router.push('/en/login');
  };

  return (
    <motion.aside
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
      className="fixed top-0 left-0 z-10 flex h-full w-64 flex-col bg-gray-200 p-6 shadow-lg dark:bg-black"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          <Link href="/en/settings">Settings</Link>
        </h2>
      </div>
      <nav className="flex flex-col gap-4">
        <Link
          href="/en/settings/delete-account"
          className="text-lg text-gray-700 hover:text-black dark:text-white dark:hover:text-white"
        >
          Delete Account
        </Link>
        <Link
          href="/en/settings/password-change"
          className="text-lg text-gray-700 hover:text-black dark:text-white dark:hover:text-white"
        >
          Change Password
        </Link>
        <Link
          href="/en/settings/two-factor"
          className="text-lg text-gray-700 hover:text-black dark:text-white dark:hover:text-white"
        >
          Two-Factor Authentication
        </Link>
      </nav>
      <div className="mt-auto pt-8">
        <ModeToggle />
        <Button
          variant="outline"
          onClick={handleLogout}
          className="mt-4 w-full"
        >
          Logout
        </Button>
      </div>
    </motion.aside>
  );
}
