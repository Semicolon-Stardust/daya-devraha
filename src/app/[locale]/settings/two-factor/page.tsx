'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';

// Animation variants for Framer Motion.
const itemVariants = {
	hidden: { opacity: 0, x: -20 },
	visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

export default function TwoFASection() {
	const { user, toggleUserTwoFactor, checkUserProfile } = useAuthStore();
	const [twoFAMsg, setTwoFAMsg] = useState('');

	const handleToggle2FA = async () => {
		try {
			await toggleUserTwoFactor();
			// Re-fetch the profile to update 2FA status.
			await checkUserProfile();
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
				{user && user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
			</p>
			<Button onClick={handleToggle2FA} className="mt-2">
				{user && user.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
			</Button>
			{twoFAMsg && (
				<p className="mt-2 text-sm text-green-500">{twoFAMsg}</p>
			)}
		</motion.div>
	);
}
