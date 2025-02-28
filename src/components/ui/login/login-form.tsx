'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import SignUpModal from '../sign-up/sign-up-modal';
import { motion, AnimatePresence } from 'framer-motion';

const userSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
	password: z
		.string()
		.min(6, { message: 'Password must be at least 6 characters' }),
});

const adminSchema = z.object({
	username: z
		.string()
		.min(3, { message: 'Username must be at least 3 characters' }),
	password: z
		.string()
		.min(6, { message: 'Password must be at least 6 characters' }),
	notes: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;
type AdminFormData = z.infer<typeof adminSchema>;

const LoginForm = () => {
	const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');

	const userForm = useForm<UserFormData>({
		resolver: zodResolver(userSchema),
	});
	const adminForm = useForm<AdminFormData>({
		resolver: zodResolver(adminSchema),
	});

	const handleUserSubmit = (data: UserFormData) => {
		console.log('User Login Data:', data);
	};

	const handleAdminSubmit = (data: AdminFormData) => {
		console.log('Admin Login Data:', data);
	};

	const t = useTranslations('Login');

	return (
		<Tabs
			value={activeTab}
			onValueChange={(value) => setActiveTab(value as 'user' | 'admin')}
		>
			<TabsList className="mb-6 grid grid-cols-2 gap-4">
				<TabsTrigger value="user">{t('userLogin')}</TabsTrigger>
				<TabsTrigger value="admin">{t('adminLogin')}</TabsTrigger>
			</TabsList>
			<AnimatePresence mode="wait">
				{activeTab === 'user' && (
					<motion.div
						key="user"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
					>
						<TabsContent value="user">
							<form
								onSubmit={userForm.handleSubmit(
									handleUserSubmit
								)}
								className="space-y-6"
							>
								<div>
									<Input
										id="email"
										type="email"
										placeholder={t('email')}
										{...userForm.register('email')}
									/>
									{userForm.formState.errors.email && (
										<p className="mt-2 text-red-500">
											{
												userForm.formState.errors.email
													.message
											}
										</p>
									)}
								</div>
								<div>
									<Input
										id="password"
										type="password"
										placeholder={t('password')}
										{...userForm.register('password')}
									/>
									{userForm.formState.errors.password && (
										<p className="mt-2 text-red-500">
											{
												userForm.formState.errors
													.password.message
											}
										</p>
									)}
								</div>
								<Button type="submit">
									{t('loginAsUser')}
								</Button>
								<Separator />
								<div className="flex justify-between">
									<Link href="/forgot-password">
										{t('forgotPassword')}
									</Link>
									<div className="flex items-center justify-center">
										<p>{t('newUser')}</p>
										<SignUpModal
											buttonVariant="link"
											buttonEffect="hoverUnderline"
										/>
									</div>
								</div>
							</form>
						</TabsContent>
					</motion.div>
				)}
				{activeTab === 'admin' && (
					<motion.div
						key="admin"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
					>
						<TabsContent value="admin">
							<form
								onSubmit={adminForm.handleSubmit(
									handleAdminSubmit
								)}
								className="space-y-6"
							>
								<div>
									<Input
										id="username"
										placeholder={t('username')}
										{...adminForm.register('username')}
									/>
									{adminForm.formState.errors.username && (
										<p className="mt-2 text-red-500">
											{
												adminForm.formState.errors
													.username.message
											}
										</p>
									)}
								</div>
								<div>
									<Input
										id="password"
										type="password"
										placeholder={t('password')}
										{...adminForm.register('password')}
									/>
									{adminForm.formState.errors.password && (
										<p className="mt-2 text-red-500">
											{
												adminForm.formState.errors
													.password.message
											}
										</p>
									)}
								</div>
								<Button type="submit">
									{t('loginAsAdmin')}
								</Button>
								<Separator />
								<div className="flex justify-between">
									<Link href="/forgot-password">
										{t('forgotPassword')}
									</Link>
									<div className="flex items-center justify-center">
										<p>{t('notAdmin')}</p>
										<SignUpModal
											buttonVariant="link"
											buttonEffect="hoverUnderline"
										/>
									</div>
								</div>
							</form>
						</TabsContent>
					</motion.div>
				)}
			</AnimatePresence>
		</Tabs>
	);
};

export default LoginForm;
