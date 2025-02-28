'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';

const schema = z
	.object({
		newPassword: z
			.string()
			.nonempty({ message: 'New password is required' })
			.min(6, { message: 'Password must be at least 6 characters' }),
		confirmPassword: z
			.string()
			.nonempty({ message: 'Please confirm your password' }),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

type ResetPasswordFormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const params = useParams();
	const locale = (params.locale as string) || 'en';
	const token = searchParams.get('token') || '';
	const { resetPassword } = useAuthStore();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ResetPasswordFormData>({
		resolver: zodResolver(schema),
	});

	const mutation = useMutation({
		mutationFn: (data: ResetPasswordFormData) =>
			resetPassword(token, data.newPassword, data.confirmPassword),
		onSuccess: () => {
			alert('Password reset successful!');
			router.push(`/${locale}/login`);
		},
		onError: (error: any) => {
			alert(error.message || 'Password reset failed.');
		},
	});

	const onSubmit = (data: ResetPasswordFormData) => {
		mutation.mutate(data);
	};

	useEffect(() => {
		if (!token) {
			router.push(`/${locale}/login`);
		}
	}, [token, router, locale]);

	return (
		<div className="bg-background dark:bg-background-dark flex min-h-screen flex-col items-center justify-center p-4">
			<h1 className="mb-4 text-3xl font-bold">Reset Password</h1>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="w-full max-w-md rounded bg-white p-8 shadow"
			>
				<div className="mb-4">
					<label
						htmlFor="newPassword"
						className="block text-sm font-medium"
					>
						New Password
					</label>
					<input
						id="newPassword"
						type="password"
						{...register('newPassword')}
						className="mt-1 block w-full rounded border p-2"
						placeholder="Enter new password"
					/>
					{errors.newPassword && (
						<p className="text-destructive mt-1 text-sm">
							{errors.newPassword.message}
						</p>
					)}
				</div>
				<div className="mb-4">
					<label
						htmlFor="confirmPassword"
						className="block text-sm font-medium"
					>
						Confirm Password
					</label>
					<input
						id="confirmPassword"
						type="password"
						{...register('confirmPassword')}
						className="mt-1 block w-full rounded border p-2"
						placeholder="Confirm new password"
					/>
					{errors.confirmPassword && (
						<p className="text-destructive mt-1 text-sm">
							{errors.confirmPassword.message}
						</p>
					)}
				</div>
				<Button type="submit" className="w-full">
					{mutation.isPending ? 'Resetting...' : 'Reset Password'}
				</Button>
			</form>
		</div>
	);
}
