'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';

export default function AdminSettingsVerifyEmailPage() {
	const { checkAdminVerificationStatus, isEmailVerified, isLoading, error } =
		useAuthStore();
	const [status, setStatus] = useState<'verified' | 'not_verified' | null>(
		null
	);

	useEffect(() => {
		// Call the function to check the verification status
		checkAdminVerificationStatus()
			.then(() => {
				// Set the status based on the isEmailVerified flag
				setStatus(isEmailVerified ? 'verified' : 'not_verified');
			})
			.catch(() => {
				setStatus('not_verified');
			});
	}, [checkAdminVerificationStatus, isEmailVerified]);

	const iconVariants = {
		hidden: { scale: 0 },
		visible: {
			scale: 1,
			transition: { type: 'spring', stiffness: 260, damping: 20 },
		},
	};

	return (
		<motion.div
			className="bg-background dark:bg-background-dark flex min-h-screen flex-col items-center justify-center p-4"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
		>
			{isLoading ? (
				<p className="text-lg">Checking verification status...</p>
			) : (
				<>
					{status === 'verified' ? (
						<motion.div
							className="flex flex-col items-center"
							variants={iconVariants}
							initial="hidden"
							animate="visible"
						>
							<svg
								className="h-16 w-16 text-green-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
							<p className="mt-4 text-xl text-green-600">
								Your email is verified!
							</p>
						</motion.div>
					) : (
						<motion.div
							className="flex flex-col items-center"
							variants={iconVariants}
							initial="hidden"
							animate="visible"
						>
							<svg
								className="h-16 w-16 text-red-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
							<p className="mt-4 text-xl text-red-600">
								Your email is not verified.
							</p>
						</motion.div>
					)}
					{error && (
						<p className="text-destructive mt-2 text-sm">{error}</p>
					)}
				</>
			)}
		</motion.div>
	);
}
