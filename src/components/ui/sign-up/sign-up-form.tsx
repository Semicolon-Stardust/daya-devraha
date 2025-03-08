'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Checkbox } from '@/components/ui/checkbox';
import LoginModal from '@/components/ui/login/login-modal';

const userSchema = z
	.object({
		name: z
			.string()
			.min(3, { message: 'Name must be at least 3 characters' }),
		email: z.string().email({ message: 'Invalid email address' }),
		username: z
			.string()
			.min(3, { message: 'Username must be at least 3 characters' }),
		password: z
			.string()
			.min(6, { message: 'Password must be at least 6 characters' }),
		confirmPassword: z.string(),
		phone: z.string().min(5, { message: 'Phone number is required' }),
		address: z.string().min(5, { message: 'Address is required' }),
		isAdmin: z.boolean().optional(),
		adminKey: z
			.string()
			.min(6, { message: 'Admin Key must be at least 6 characters' })
			.optional(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

type UserFormData = z.infer<typeof userSchema>;

const SignUpForm = () => {
	const userForm = useForm<UserFormData>({
		resolver: zodResolver(userSchema),
	});

	const t = useTranslations('SignUp');
	const [showAdminKey, setShowAdminKey] = useState(false);

	const handleUserSubmit = (data: UserFormData) => {
		console.log('User Sign Up Data:', data);
	};

	return (
		<motion.div
			className={cn('max-h-[80vh] overflow-y-auto p-4')}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}
		>
			<motion.form
				onSubmit={userForm.handleSubmit(handleUserSubmit)}
				className={cn('space-y-6')}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.5 }}
			>
				<motion.div
					className={cn('flex flex-wrap gap-6')}
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<div className={cn('min-w-[250px] flex-1')}>
						<Label htmlFor="name">{t('fullName')}</Label>
						<Input
							id="name"
							placeholder={t('fullName')}
							{...userForm.register('name')}
							className="w-full"
						/>
					</div>
					<div className={cn('min-w-[250px] flex-1')}>
						<Label htmlFor="email">{t('email')}</Label>
						<Input
							id="email"
							placeholder={t('email')}
							{...userForm.register('email')}
							className="w-full"
						/>
					</div>
				</motion.div>
				<Separator />
				<motion.div
					className={cn('flex flex-wrap gap-6')}
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<div className={cn('min-w-[250px] flex-1')}>
						<Label htmlFor="username">{t('userName')}</Label>
						<Input
							id="username"
							placeholder={t('userName')}
							{...userForm.register('username')}
							className="w-full"
						/>
					</div>
				</motion.div>
				<Separator />
				<motion.div
					className={cn('flex flex-wrap gap-6')}
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<div className={cn('min-w-[250px] flex-1')}>
						<Label htmlFor="password">{t('password')}</Label>
						<Input
							id="password"
							type="password"
							placeholder={t('password')}
							{...userForm.register('password')}
							className="w-full"
						/>
					</div>
					<div className={cn('min-w-[250px] flex-1')}>
						<Label htmlFor="confirmPassword">
							{t('confirmPassword')}
						</Label>
						<Input
							id="confirmPassword"
							type="password"
							placeholder={t('confirmPassword')}
							{...userForm.register('confirmPassword')}
							className="w-full"
						/>
					</div>
				</motion.div>
				<Separator />
				<motion.div
					className={cn('flex items-center space-x-2')}
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<Checkbox
						id="isAdmin"
						checked={showAdminKey}
						onCheckedChange={(checked) =>
							setShowAdminKey(checked === true)
						}
					/>
					<Label htmlFor="isAdmin">{t('isAdmin')}</Label>
				</motion.div>
				<AnimatePresence>
					{showAdminKey && (
						<>
							<motion.div
								className={cn('flex flex-wrap gap-6')}
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.5 }}
							>
								<div className={cn('min-w-[250px] flex-1')}>
									<Label htmlFor="adminKey">
										{t('adminKey')}
									</Label>
									<Input
										id="adminKey"
										type="password"
										placeholder={t('adminKey')}
										{...userForm.register('adminKey')}
										className="w-full"
									/>
								</div>
							</motion.div>
							<Separator />
						</>
					)}
				</AnimatePresence>
				<Button type="submit" className={cn('w-full')}>
					Sign Up
				</Button>
				<div className={cn('flex items-center justify-end text-sm')}>
					<p>{t('alreadyHaveAccount')}</p>
					<LoginModal
						buttonVariant="link"
						buttonEffect="hoverUnderline"
					/>
				</div>
			</motion.form>
		</motion.div>
	);
};

export default SignUpForm;
