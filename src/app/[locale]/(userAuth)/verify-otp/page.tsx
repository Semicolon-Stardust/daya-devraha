'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from '@/components/ui/input-otp';

const containerVariants = {
	hidden: { opacity: 0, y: 50 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface OTPFormData {
	otp: string;
}

export default function VerifyOTPPage() {
	const router = useRouter();
	const params = useParams();
	const locale = params.locale || 'en';
	// Destructure verifyUserOTP and pendingUserEmail from the auth store.
	const { verifyUserOTP, pendingUserEmail } = useAuthStore();
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<OTPFormData>({
		defaultValues: { otp: '' },
	});

	// If there's no pending user, redirect away (e.g. to the login page)
	useEffect(() => {
		if (!pendingUserEmail) {
			router.push(`/${locale}/login`);
		}
	}, [pendingUserEmail, router, locale]);

	const verifyMutation = useMutation({
		mutationFn: (otpCode: string) => verifyUserOTP(otpCode),
		onSuccess: () => {
			setSuccessMessage('OTP verified successfully!');
			setTimeout(() => {
				router.push(`/${locale}/settings`);
			}, 2000);
		},
		onError: () => {
			// Error message is handled below.
		},
	});

	const onSubmit = (data: OTPFormData) => {
		setSuccessMessage(null);
		verifyMutation.mutate(data.otp);
	};

	return (
		<motion.div
			className="bg-background dark:bg-background-dark flex min-h-screen items-center justify-center p-4"
			initial="hidden"
			animate="visible"
			variants={containerVariants}
		>
			<div className="w-full max-w-md rounded-lg bg-white p-8 shadow dark:bg-stone-800">
				<h1 className="text-primary mb-4 text-center text-2xl font-bold">
					Verify OTP
				</h1>
				<p className="mb-4 text-center text-gray-600 dark:text-gray-300">
					Enter the 6-digit OTP sent to your email.
				</p>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col items-center space-y-4"
				>
					<Controller
						name="otp"
						control={control}
						rules={{
							required: 'OTP is required',
							minLength: {
								value: 6,
								message: 'OTP must be 6 digits',
							},
							maxLength: {
								value: 6,
								message: 'OTP must be 6 digits',
							},
							pattern: {
								value: /^[0-9]{6}$/,
								message: 'OTP must contain only numbers',
							},
						}}
						render={({ field, fieldState: { error } }) => (
							<div>
								<InputOTP
									maxLength={6}
									value={field.value}
									onChange={field.onChange}
								>
									<InputOTPGroup>
										<InputOTPSlot index={0} />
										<InputOTPSlot index={1} />
										<InputOTPSlot index={2} />
									</InputOTPGroup>
									<InputOTPSeparator />
									<InputOTPGroup>
										<InputOTPSlot index={3} />
										<InputOTPSlot index={4} />
										<InputOTPSlot index={5} />
									</InputOTPGroup>
								</InputOTP>
								{error && (
									<p className="text-destructive text-center text-sm">
										{error.message}
									</p>
								)}
							</div>
						)}
					/>
					{verifyMutation.error && !errors.otp && (
						<p className="text-destructive text-center text-sm">
							{(verifyMutation.error as Error)?.message ||
								'OTP verification failed'}
						</p>
					)}
					{successMessage && (
						<p className="text-success text-center text-sm">
							{successMessage}
						</p>
					)}
					<Button type="submit" className="mt-4 w-full">
						{verifyMutation.isPending
							? 'Verifying...'
							: 'Verify OTP'}
					</Button>
				</form>
			</div>
		</motion.div>
	);
}
