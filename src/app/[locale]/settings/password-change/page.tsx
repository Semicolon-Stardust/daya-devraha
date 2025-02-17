"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";

// Animation variants for Framer Motion.
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

export default function PasswordSection() {
	const { updateUserPassword } = useAuthStore();
	const [passwordMsg, setPasswordMsg] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<PasswordFormData>({
		resolver: zodResolver(passwordSchema),
	});

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

	return (
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
					<p className="mt-2 text-sm text-green-500">{passwordMsg}</p>
				)}
			</form>
		</motion.div>
	);
}
