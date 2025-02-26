"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

// Define validation schema using Zod.
const loginSchema = z.object({
	email: z
		.string()
		.nonempty({ message: "Email is required" })
		.email({ message: "Invalid email format" }),
	password: z.string().nonempty({ message: "Password is required" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Framer Motion animation variants.
const containerVariants = {
	hidden: { opacity: 0, y: 50 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const fieldVariants = {
	hidden: { opacity: 0, x: -20 },
	visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export default function LoginPage() {
	const router = useRouter();
	const params = useParams();
	const locale = params.locale || "en";
	const [localError, setLocalError] = useState<string | null>(null);

	const {
		loginUser,
		logoutUser,
		checkUserAuth,
		checkUserVerificationStatus, // new function to check email verification status
		isAuthenticatedUser: storeAuthenticated,
	} = useAuthStore();

	// Use an object to configure the query.
	const { data: authData } = useQuery({
		queryKey: ["auth"],
		queryFn: async () => {
			const result = await checkUserAuth();
			return result ?? { isAuthenticated: false };
		},
	});

	// Redirect if already authenticated.
	useEffect(() => {
		if (authData?.isAuthenticated || storeAuthenticated) {
			router.push(`/${locale}/settings`);
		}
	}, [authData, storeAuthenticated, router, locale]);

	// Use a mutation for login action.
	const loginMutation = useMutation({
		mutationFn: async (data: LoginFormData) => {
			return await loginUser(data.email, data.password);
		},
		onSuccess: async (result) => {
			// Call checkUserVerificationStatus to update isEmailVerified in store.
			await checkUserVerificationStatus();
			// Now check if the user is verified
			if (result.twoFactorRequired) {
				router.push(`/${locale}/verify-otp`);
			} else if (!useAuthStore.getState().isEmailVerified) {
				setLocalError(
					"Your email address is not verified. Please check your inbox for the verification link."
				);
				await logoutUser();
			} else {
				router.push(`/${locale}/settings`);
			}
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginFormData) => {
		setLocalError(null);
		loginMutation.mutate(data);
	};

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
					Login to Your Account
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
						<Button type="submit" className="w-full">
							{loginMutation.isPending
								? "Logging in..."
								: "Login"}
						</Button>
					</motion.div>
					{(loginMutation.error || localError) && (
						<p className="text-center text-destructive">
							{localError ||
								(loginMutation.error as Error)?.message ||
								"Login failed."}
						</p>
					)}
				</form>
			</motion.div>
		</motion.div>
	);
}
