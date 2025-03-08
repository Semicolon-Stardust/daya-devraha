'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/stores/authStore';

type ResendFormData = {
	email: string;
};

export default function ResendVerificationPage() {
	const { resendUserVerificationEmail, isLoading, error } = useAuthStore();
	const router = useRouter();
	const params = useParams();
	const locale = params.locale || 'en';

	const {
		register,
		handleSubmit,
		formState: { errors: formErrors },
	} = useForm<ResendFormData>();

	const [resendMessage, setResendMessage] = useState<string | null>(null);
	const [resendError, setResendError] = useState<string | null>(null);
	const [showForm, setShowForm] = useState(true);

	const onResendSubmit = async (data: ResendFormData) => {
		setResendMessage(null);
		setResendError(null);
		try {
			const message = await resendUserVerificationEmail(data.email);
			setResendMessage(message || 'Verification email resent.');
			// Optionally hide the form after submission.
			setShowForm(false);
		} catch (err) {
			setResendError('Failed to resend verification email.');
		}
	};

	const formVariants = {
		hidden: { opacity: 0, height: 0 },
		visible: { opacity: 1, height: 'auto', transition: { duration: 0.3 } },
		exit: { opacity: 0, height: 0, transition: { duration: 0.3 } },
	};

	return (
		<motion.div
			className="bg-background dark:bg-background-dark flex min-h-screen flex-col items-center justify-center p-4"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
		>
			<motion.h1 className="mb-4 text-3xl font-bold">
				Resend Verification Email
			</motion.h1>

			<AnimatePresence>
				{showForm && (
					<motion.div
						className="w-full max-w-md"
						initial="hidden"
						animate="visible"
						exit="exit"
						variants={formVariants}
					>
						<form
							onSubmit={handleSubmit(onResendSubmit)}
							className="space-y-4"
						>
							<div>
								<input
									type="email"
									placeholder="Enter your email"
									className="w-full rounded border p-2"
									{...register('email', {
										required: 'Email is required',
									})}
								/>
								{formErrors.email && (
									<p className="text-destructive text-xs">
										{formErrors.email.message}
									</p>
								)}
							</div>
							<button
								type="submit"
								className="rounded bg-blue-500 px-4 py-2 text-white"
								disabled={isLoading}
							>
								{isLoading
									? 'Sending...'
									: 'Send Verification Email'}
							</button>
						</form>
					</motion.div>
				)}
			</AnimatePresence>

			{resendMessage && (
				<motion.p
					className="mt-4 text-sm text-green-600"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
				>
					{resendMessage}
				</motion.p>
			)}

			{resendError && (
				<motion.p
					className="mt-4 text-sm text-red-600"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
				>
					{resendError}
				</motion.p>
			)}

			<button
				className="mt-6 rounded bg-red-500 px-4 py-2 text-white"
				onClick={() => router.push(`/${locale}/login`)}
			>
				Back to Login
			</button>
		</motion.div>
	);
}
