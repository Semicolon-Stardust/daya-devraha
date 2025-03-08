'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

// Define validation schema using Zod.
const loginSchema = z.object({
	email: z
		.string()
		.nonempty({ message: 'Email is required' })
		.email({ message: 'Invalid email format' }),
	password: z.string().nonempty({ message: 'Password is required' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const containerVariants = {
	hidden: { opacity: 0, y: 50 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const fieldVariants = {
	hidden: { opacity: 0, x: -20 },
	visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export default function AdminLoginPage() {
	const router = useRouter();
	const params = useParams();
	const locale = params.locale || 'en';
	const [localError, setLocalError] = useState<string | null>(null);

	const { loginAdmin, isLoading, error, admin } = useAuthStore();

	// If already logged in, redirect to admin settings.
	useEffect(() => {
		if (admin) {
			router.push(`/${locale}/admin/settings`);
		}
	}, [admin, router, locale]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginFormData) => {
		setLocalError(null);
		try {
			await loginAdmin(data.email, data.password);
			// The useEffect above will handle redirection upon login.
		} catch {
			// Error is handled in the store.
		}
	};

	return (
		<motion.div
			className="bg-background dark:bg-background-dark flex min-h-screen items-center justify-center p-4"
			initial="hidden"
			animate="visible"
			variants={containerVariants}
		>
			<motion.div
				className="bg-card w-full max-w-md space-y-6 rounded-lg p-8 shadow"
				variants={containerVariants}
			>
				<motion.h1
					className="text-primary text-center text-3xl font-bold"
					variants={fieldVariants}
				>
					Admin Login
				</motion.h1>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<motion.div variants={fieldVariants}>
						<Label
							htmlFor="email"
							className="block text-sm font-medium"
						>
							Email
						</Label>
						<Input
							id="email"
							type="email"
							{...register('email')}
							className="mt-1 w-full"
							placeholder="admin@dayadevraha.com"
						/>
						{errors.email && (
							<p className="text-destructive mt-1 text-xs">
								{errors.email.message}
							</p>
						)}
					</motion.div>
					<motion.div variants={fieldVariants}>
						<Label
							htmlFor="password"
							className="block text-sm font-medium"
						>
							Password
						</Label>
						<Input
							id="password"
							type="password"
							{...register('password')}
							className="mt-1 w-full"
							placeholder="Your secure password"
						/>
						{errors.password && (
							<p className="text-destructive mt-1 text-xs">
								{errors.password.message}
							</p>
						)}
					</motion.div>
					<motion.div variants={fieldVariants}>
						<Button type="submit" className="w-full">
							{isLoading ? 'Logging in...' : 'Login'}
						</Button>
					</motion.div>
					{(error || localError) && (
						<p className="text-destructive text-center">
							{localError ||
								((error as unknown) as Error)?.message ||
								'Login failed.'}
						</p>
					)}
				</form>
			</motion.div>
		</motion.div>
	);
}
