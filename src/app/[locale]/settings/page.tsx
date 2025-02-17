"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Helper: Greeting based on time.
function getGreeting() {
	const hour = new Date().getHours();
	if (hour < 12) return "Good morning";
	if (hour < 18) return "Good afternoon";
	return "Good evening";
}

// Framer Motion animation variants.
const containerVariants = {
	hidden: { opacity: 0, y: 50 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const itemVariants = {
	hidden: { opacity: 0, x: -20 },
	visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

// Zod schema for updating the password.
const passwordSchema = z
	.object({
		newPassword: z
			.string()
			.min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string().min(6, "Confirm password is required"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
	const {
		user,
		isAuthenticatedUser,
		checkUserProfile,
		updateUserPassword,
		toggleUserTwoFactor,
		deleteUserAccount,
	} = useAuthStore();
	const router = useRouter();
	const params = useParams();
	const locale = params.locale || "en";

	// Local state for feedback messages.
	const [passwordMsg, setPasswordMsg] = useState("");
	const [twoFAMsg, setTwoFAMsg] = useState("");
	const [deleteMsg, setDeleteMsg] = useState("");

	// Fetch full user profile if not already loaded.
	useEffect(() => {
		if (!user) {
			checkUserProfile();
			console.log("Fetching user profile...");
		}
	}, [user, checkUserProfile]);

	// Redirect to login if user profile remains empty.
	useEffect(() => {
		if (!user && !isAuthenticatedUser) {
			router.push(`/${locale}/login`);
		}
	}, [user, isAuthenticatedUser, router, locale]);

	// While waiting for user data, show a loading indicator.
	if (!user) {
		return (
			<div className="flex items-center justify-center h-screen">
				Loading...
			</div>
		);
	}

	// React Hook Form setup for updating password.
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<PasswordFormData>({
		resolver: zodResolver(passwordSchema),
	});

	// Handle password update.
	const onPasswordSubmit = async (data: PasswordFormData) => {
		try {
			await updateUserPassword(data.newPassword);
			setPasswordMsg("Password updated successfully.");
			reset();
		} catch (error: unknown) {
			const errMsg =
				error instanceof Error
					? error.message
					: "Error updating password";
			setPasswordMsg(errMsg);
		}
	};

	// Handle toggling two-factor authentication.
	const handleToggle2FA = async () => {
		try {
			await toggleUserTwoFactor();
			// Optionally re-fetch the profile here to get the updated status.
			await checkUserProfile();
			// Show a message based on the new state.
			setTwoFAMsg(
				user.twoFactorEnabled ? "2FA disabled." : "2FA enabled."
			);
		} catch (error: unknown) {
			const errMsg =
				error instanceof Error
					? error.message
					: "Error toggling 2FA preferences";
			setTwoFAMsg(errMsg);
		}
	};

	// Handle account deletion.
	const handleDeleteAccount = async () => {
		const confirmed = confirm(
			"Are you sure you want to delete your account? This action cannot be undone."
		);
		if (!confirmed) return;
		try {
			await deleteUserAccount();
			setDeleteMsg("Account deleted successfully.");
			router.push(`/${locale}/login`);
		} catch (error: unknown) {
			const errMsg =
				error instanceof Error
					? error.message
					: "Error deleting account";
			setDeleteMsg(errMsg);
		}
	};

	return (
		<motion.div
			className="min-h-screen p-8 bg-white dark:bg-black"
			initial="hidden"
			animate="visible"
			variants={containerVariants}
		>
			<div className="max-w-3xl p-6 mx-auto bg-white rounded-lg shadow dark:bg-stone-800">
				{/* Display greeting and username */}
				<h1 className="text-3xl font-bold text-black dark:text-white">
					{getGreeting()}, {user.name}!
				</h1>
				<p className="mt-4 text-lg text-black dark:text-white">
					Welcome to your settings.
				</p>

				{/* Update Password Section */}
				<motion.div variants={itemVariants} className="mt-8">
					<h2 className="text-2xl font-semibold text-black dark:text-white">
						Update Password
					</h2>
					<form
						onSubmit={handleSubmit(onPasswordSubmit)}
						className="mt-4 space-y-4"
					>
						<div>
							<Label
								htmlFor="newPassword"
								className="block text-sm font-medium"
							>
								New Password
							</Label>
							<Input
								id="newPassword"
								type="password"
								{...register("newPassword")}
								placeholder="Enter new password"
							/>
							{errors.newPassword && (
								<p className="text-xs text-red-500">
									{errors.newPassword.message}
								</p>
							)}
						</div>
						<div>
							<Label
								htmlFor="confirmPassword"
								className="block text-sm font-medium"
							>
								Confirm New Password
							</Label>
							<Input
								id="confirmPassword"
								type="password"
								{...register("confirmPassword")}
								placeholder="Confirm new password"
							/>
							{errors.confirmPassword && (
								<p className="text-xs text-red-500">
									{errors.confirmPassword.message}
								</p>
							)}
						</div>
						<Button type="submit" className="w-full">
							Update Password
						</Button>
						{passwordMsg && (
							<p className="mt-2 text-sm text-green-500">
								{passwordMsg}
							</p>
						)}
					</form>
				</motion.div>

				{/* Two-Factor Authentication Section */}
				<motion.div variants={itemVariants} className="mt-8">
					<h2 className="text-2xl font-semibold text-black dark:text-white">
						Two-Factor Authentication
					</h2>
					<p className="mt-2 text-sm text-black dark:text-white">
						{user.twoFactorEnabled ? "Enabled" : "Disabled"}
					</p>
					<Button onClick={handleToggle2FA} className="mt-2">
						{user.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
					</Button>
					{twoFAMsg && (
						<p className="mt-2 text-sm text-green-500">
							{twoFAMsg}
						</p>
					)}
				</motion.div>

				{/* Delete Account Section */}
				<motion.div variants={itemVariants} className="mt-8">
					<h2 className="text-2xl font-semibold text-black dark:text-white">
						Delete Account
					</h2>
					<p className="mt-2 text-sm text-red-500">
						Warning: This action is irreversible. All your data will
						be permanently deleted.
					</p>
					<Button
						variant="destructive"
						onClick={handleDeleteAccount}
						className="mt-2"
					>
						Delete Account
					</Button>
					{deleteMsg && (
						<p className="mt-2 text-sm text-red-500">{deleteMsg}</p>
					)}
				</motion.div>
			</div>
		</motion.div>
	);
}
