'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Define a validation schema for registration using Zod.
const registerSchema = z
	.object({
		name: z.string().nonempty({ message: 'Name is required' }),
		email: z
			.string()
			.nonempty({ message: 'Email is required' })
			.email('Invalid email format'),
		password: z
			.string()
			.min(6, { message: 'Password must be at least 6 characters long' }),
		confirmPassword: z
			.string()
			.nonempty({ message: 'Please confirm your password' }),
		dateOfBirth: z.string().optional(),
		emergencyRecoveryContact: z.string().optional(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

type RegisterFormData = z.infer<typeof registerSchema>;

// Framer Motion animation variants.
const containerVariants = {
	hidden: { opacity: 0, y: 50 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const fieldVariants = {
	hidden: { opacity: 0, x: -20 },
	visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export default function RegisterPage() {
	const router = useRouter();
	const params = useParams();
	const locale = params.locale || 'en';
	const [registrationSuccess, setRegistrationSuccess] = useState(false);

	const {
		registerUser,
		checkUserAuth,
		isAuthenticatedUser: storeAuthenticated,
	} = useAuthStore();

	// Use an object to configure the query.
	const { data: authData } = useQuery({
		queryKey: ['auth'],
		queryFn: async () => {
			const result = await checkUserAuth();
			// Ensure that we always return an object—even if result is undefined.
			return result ?? { isAuthenticated: false };
		},
		// Alternatively, you could also provide an initialData:
		initialData: { isAuthenticated: false },
	});

	// Redirect if already authenticated.
	useEffect(() => {
		if (authData?.isAuthenticated || storeAuthenticated) {
			router.push(`/${locale}/settings`);
		}
	}, [authData, storeAuthenticated, router, locale]);

	// Use a mutation for registration.
	const registerMutation = useMutation({
		mutationFn: async (data: RegisterFormData) => {
			return await registerUser(
				data.name,
				data.email,
				data.password,
				data.confirmPassword,
				data.dateOfBirth,
				data.emergencyRecoveryContact
			);
		},
		onSuccess: () => {
			setRegistrationSuccess(true);
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
	});

	const onSubmit = (data: RegisterFormData) => {
		registerMutation.mutate(data);
	};

	if (registrationSuccess) {
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
						Registration Successful!
					</motion.h1>
					<p className="text-center">
						Please check your email for a verification link before
						logging in.
					</p>
					<div className="flex justify-center">
						<Button onClick={() => router.push(`/${locale}/login`)}>
							Go to Login
						</Button>
					</div>
				</motion.div>
			</motion.div>
		);
	}

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
					Create Your Account
				</motion.h1>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<motion.div variants={fieldVariants}>
						<Label
							htmlFor="name"
							className="block text-sm font-medium"
						>
							Name
						</Label>
						<Input
							id="name"
							type="text"
							{...register('name')}
							className="mt-1 w-full"
							placeholder="Your full name"
						/>
						{errors.name && (
							<p className="text-destructive mt-1 text-xs">
								{errors.name.message}
							</p>
						)}
					</motion.div>
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
							placeholder="you@example.com"
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
						<Label
							htmlFor="confirmPassword"
							className="block text-sm font-medium"
						>
							Confirm Password
						</Label>
						<Input
							id="confirmPassword"
							type="password"
							{...register('confirmPassword')}
							className="mt-1 w-full"
							placeholder="Re-enter your password"
						/>
						{errors.confirmPassword && (
							<p className="text-destructive mt-1 text-xs">
								{errors.confirmPassword.message}
							</p>
						)}
					</motion.div>
					<motion.div variants={fieldVariants}>
						<Label
							htmlFor="dateOfBirth"
							className="block text-sm font-medium"
						>
							Date of Birth
						</Label>
						<Input
							id="dateOfBirth"
							type="date"
							{...register('dateOfBirth')}
							className="mt-1 w-full"
						/>
					</motion.div>
					<motion.div variants={fieldVariants}>
						<Label
							htmlFor="emergencyRecoveryContact"
							className="block text-sm font-medium"
						>
							Emergency Recovery Contact
						</Label>
						<Input
							id="emergencyRecoveryContact"
							type="email"
							{...register('emergencyRecoveryContact')}
							className="mt-1 w-full"
							placeholder="Alternate email"
						/>
					</motion.div>
					<motion.div variants={fieldVariants}>
						<Button type="submit" className="w-full">
							{registerMutation.isPending
								? 'Registering...'
								: 'Register'}
						</Button>
					</motion.div>
					{registerMutation.error && (
						<p className="text-destructive text-center">
							{(registerMutation.error as Error)?.message ||
								'Registration failed.'}
						</p>
					)}
				</form>
			</motion.div>
		</motion.div>
	);
}
