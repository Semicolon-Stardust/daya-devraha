'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function VerifyEmailPage() {
	const { checkUserVerificationStatus, isEmailVerified, isLoading, error } =
		useAuthStore();
	const router = useRouter();
	const params = useParams();
	const locale = params.locale || 'en';

	const [status, setStatus] = useState<'verified' | 'not_verified' | null>(
		null
	);

	useEffect(() => {
		checkUserVerificationStatus()
			.then(() => {
				setStatus(isEmailVerified ? 'verified' : 'not_verified');
			})
			.catch(() => {
				setStatus('not_verified');
			});
	}, [checkUserVerificationStatus, isEmailVerified]);

	const iconVariants = {
		hidden: { scale: 0 },
		visible: {
			scale: 1,
			transition: { type: 'spring', stiffness: 260, damping: 20 },
		},
	};

	return (
		<motion.div
			className="flex items-center justify-center p-4"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
		>
			{isLoading && (
				<p className="text-lg text-gray-800 dark:text-gray-200">
					Checking verification status...
				</p>
			)}
			{!isLoading && status === 'verified' && (
				<motion.div
					className="flex items-center justify-center gap-1.5"
					variants={iconVariants}
					initial="hidden"
					animate="visible"
				>
					<svg
						className="h-16 w-16 text-green-500 dark:text-green-400"
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
					<p className="mt-4 text-3xl font-bold text-green-600 dark:text-green-300">
						Your email is verified!
					</p>
				</motion.div>
			)}
			{!isLoading && status === 'not_verified' && (
				<motion.div
					className="flex flex-col items-center"
					variants={iconVariants}
					initial="hidden"
					animate="visible"
				>
					<svg
						className="h-16 w-16 text-red-500 dark:text-red-400"
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
					<p className="mt-4 text-3xl font-bold text-red-600 dark:text-red-300">
						Your email is not verified.
					</p>
					{error && (
						<p className="text-destructive dark:text-destructive-dark mt-2 text-sm">
							{error}
						</p>
					)}
					<button
						className="mt-4 text-blue-500 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500"
						onClick={() =>
							router.push(`/${locale}/resend-verification`)
						}
					>
						Resend Verification Email
					</button>
				</motion.div>
			)}
		</motion.div>
	);
}
