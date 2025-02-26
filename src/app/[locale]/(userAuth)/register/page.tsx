// /src/app/register/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define a validation schema for registration using Zod.
const registerSchema = z
	.object({
		name: z.string().nonempty({ message: "Name is required" }),
		email: z
			.string()
			.nonempty({ message: "Email is required" })
			.email("Invalid email format"),
		password: z
			.string()
			.min(6, { message: "Password must be at least 6 characters long" }),
		confirmPassword: z
			.string()
			.nonempty({ message: "Please confirm your password" }),
		dateOfBirth: z.string().optional(),
		emergencyRecoveryContact: z.string().optional(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type RegisterFormData = z.infer<typeof registerSchema>;

// Framer Motion animation variants
const containerVariants = {
	hidden: { opacity: 0, y: 50 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const fieldVariants = {
	hidden: { opacity: 0, x: -20 },
	visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export default function RegisterPage() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
	});
	const { registerUser, isLoading, error } = useAuthStore();
	const router = useRouter();
	const params = useParams();
	const locale = params.locale || "en";
	const [registrationSuccess, setRegistrationSuccess] = useState(false);

	const onSubmit = async (data: RegisterFormData) => {
		try {
			await registerUser(
				data.name,
				data.email,
				data.password,
				data.confirmPassword,
				data.dateOfBirth,
				data.emergencyRecoveryContact
			);
			// Instead of immediately redirecting, set success flag to show the message.
			setRegistrationSuccess(true);
		} catch (err) {
			console.error("Registration error:", err);
		}
	};

	if (registrationSuccess) {
		return (
			<motion.div
				className="flex items-center justify-center min-h-screen p-4 bg-background dark:bg-background-dark"
				initial="hidden"
				animate="visible"
				variants={containerVariants}
			>
				<motion.div
					className="w-full max-w-md p-8 space-y-6 rounded-lg shadow bg-card"
					variants={containerVariants}
				>
					<motion.h1
						className="text-3xl font-bold text-center text-primary"
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
			className="flex items-center justify-center min-h-screen p-4 bg-background dark:bg-background-dark"
			initial="hidden"
			animate="visible"
			variants={containerVariants}
		>
			<motion.div
				className="w-full max-w-md p-8 space-y-6 rounded-lg shadow bg-card"
				variants={containerVariants}
			>
				<motion.h1
					className="text-3xl font-bold text-center text-primary"
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
							{...register("name")}
							className="w-full mt-1"
							placeholder="Your full name"
						/>
						{errors.name && (
							<p className="mt-1 text-xs text-destructive">
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
							{...register("email")}
							className="w-full mt-1"
							placeholder="you@example.com"
						/>
						{errors.email && (
							<p className="mt-1 text-xs text-destructive">
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
							{...register("password")}
							className="w-full mt-1"
							placeholder="Your secure password"
						/>
						{errors.password && (
							<p className="mt-1 text-xs text-destructive">
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
							{...register("confirmPassword")}
							className="w-full mt-1"
							placeholder="Re-enter your password"
						/>
						{errors.confirmPassword && (
							<p className="mt-1 text-xs text-destructive">
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
							{...register("dateOfBirth")}
							className="w-full mt-1"
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
							{...register("emergencyRecoveryContact")}
							className="w-full mt-1"
							placeholder="Alternate email"
						/>
					</motion.div>
					<motion.div variants={fieldVariants}>
						<Button type="submit" className="w-full">
							{isLoading ? "Registering..." : "Register"}
						</Button>
					</motion.div>
					{error && (
						<p className="text-center text-destructive">{error}</p>
					)}
				</form>
			</motion.div>
		</motion.div>
	);
}
