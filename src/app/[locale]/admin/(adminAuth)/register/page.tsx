'use client';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Updated validation schema: Removed adminKey field.
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
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

type RegisterFormData = z.infer<typeof registerSchema>;

const containerVariants = {
	hidden: { opacity: 0, y: 50 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const fieldVariants = {
	hidden: { opacity: 0, x: -20 },
	visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export default function AdminRegisterPage() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
	});
	const { registerAdmin, isLoading, error, admin } = useAuthStore();
	const router = useRouter();
	const params = useParams();
	const locale = params.locale || 'en';

	// If already registered and logged in, redirect to admin settings.
	if (admin) {
		router.push(`/${locale}/admin/settings`);
		return null;
	}

	const onSubmit = async (data: RegisterFormData) => {
		try {
			await registerAdmin(
				data.name,
				data.email,
				data.password,
				data.confirmPassword,
				data.dateOfBirth ?? ''
			);
			// After registration, redirect to verify-email page.
			router.push(`/${locale}/admin/verify-email`);
		} catch (err) {
			console.error('Registration error:', err);
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
					Admin Registration
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
						<Button type="submit" className="w-full">
							{isLoading ? 'Registering...' : 'Register'}
						</Button>
					</motion.div>
					{error && (
						<p className="text-destructive text-center">{error}</p>
					)}
				</form>
			</motion.div>
		</motion.div>
	);
}
