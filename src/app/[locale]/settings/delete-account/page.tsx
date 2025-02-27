'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { useRouter, useParams } from 'next/navigation';

// Animation variants for Framer Motion.
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

export default function DeleteAccountSection() {
  const { deleteUserAccount } = useAuthStore();
  const [deleteMsg, setDeleteMsg] = useState('');
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'en';

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      'Are you sure you want to delete your account? This action cannot be undone.',
    );
    if (!confirmed) return;
    try {
      await deleteUserAccount();
      setDeleteMsg('Account deleted successfully.');
      router.push(`/${locale}/login`);
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : 'Error deleting account';
      setDeleteMsg(errMsg);
    }
  };

  return (
    <motion.div variants={itemVariants} className="mt-8">
      <h2 className="text-2xl font-semibold text-black dark:text-white">
        Delete Account
      </h2>
      <p className="mt-2 text-sm text-red-500">
        Warning: This action is irreversible. All your data will be permanently
        deleted.
      </p>
      <Button
        variant="destructive"
        onClick={handleDeleteAccount}
        className="mt-2"
      >
        Delete Account
      </Button>
      {deleteMsg && <p className="mt-2 text-sm text-red-500">{deleteMsg}</p>}
    </motion.div>
  );
}
