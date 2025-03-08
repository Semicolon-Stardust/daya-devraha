'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';

const itemVariants = {
	hidden: { opacity: 0, x: -20 },
	visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

export default function AdminTwoFactorPage() {
	// Use the admin-specific toggle function and profile re-fetch.
	const { admin, toggleAdminTwoFactor, checkAdminProfile } = useAuthStore();
	const [twoFAMsg, setTwoFAMsg] = useState('');

	const handleToggle2FA = async () => {
		try {
			await toggleAdminTwoFactor();
			// Refresh the admin profile to update the two-factor status.
			await checkAdminProfile();
			setTwoFAMsg('2FA preferences updated.');
		} catch (error: unknown) {
			const errMsg =
				error instanceof Error
					? error.message
					: 'Error toggling 2FA preferences';
			setTwoFAMsg(errMsg);
		}
	};

	return (
		<motion.div variants={itemVariants} className="mt-8">
			<h2 className="text-2xl font-semibold text-black dark:text-white">
				Two-Factor Authentication
			</h2>
			<p className="mt-2 text-sm text-black dark:text-white">
				{admin && admin.twoFactorEnabled ? 'Enabled' : 'Disabled'}
			</p>
			<Button onClick={handleToggle2FA} className="mt-2">
				{admin && admin.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
			</Button>
			{twoFAMsg && (
				<p className="mt-2 text-sm text-green-500">{twoFAMsg}</p>
			)}
		</motion.div>
	);
}
