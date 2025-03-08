'use client';

import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';

const schema = z.object({
	email: z
		.string()
		.nonempty({ message: 'Email is required' })
		.email({ message: 'Invalid email format' }),
});

type ForgotPasswordFormData = z.infer<typeof schema>;

export default function AdminForgotPasswordPage() {
	const router = useRouter();
	const params = useParams();
	const locale = (params.locale as string) || 'en';
	const { forgotPasswordAdmin } = useAuthStore();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(schema),
	});

	const mutation = useMutation({
		mutationFn: (data: ForgotPasswordFormData) =>
			forgotPasswordAdmin(data.email),
		onSuccess: () => {
			alert('Password reset email sent. Please check your email.');
			router.push(`/${locale}/admin/login`);
		},
		onError: (error: any) => {
			alert(error.message || 'Error sending password reset email.');
		},
	});

	const onSubmit = (data: ForgotPasswordFormData) => {
		mutation.mutate(data);
	};

	return (
		<div className="bg-background dark:bg-background-dark flex min-h-screen flex-col items-center justify-center p-4">
			<h1 className="mb-4 text-3xl font-bold">Forgot Password</h1>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="w-full max-w-md rounded bg-white p-8 shadow"
			>
				<div className="mb-4">
					<label
						htmlFor="email"
						className="block text-sm font-medium"
					>
						Email Address
					</label>
					<input
						id="email"
						type="email"
						{...register('email')}
						className="mt-1 block w-full rounded border p-2"
						placeholder="Enter your email"
					/>
					{errors.email && (
						<p className="text-destructive mt-1 text-sm">
							{errors.email.message}
						</p>
					)}
				</div>
				<Button type="submit" className="w-full">
					{mutation.isPending ? 'Sending...' : 'Send Reset Link'}
				</Button>
			</form>
		</div>
	);
}
