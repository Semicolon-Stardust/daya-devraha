"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function VerifyEmailPage() {
	const { checkUserVerificationStatus, isEmailVerified, isLoading, error } =
		useAuthStore();
	const router = useRouter();
	const params = useParams();
	const locale = params.locale || "en";

	// Local state to display the status based on checkUserVerificationStatus
	const [status, setStatus] = useState<"verified" | "not_verified" | null>(
		null
	);

	useEffect(() => {
		// Call the function to update the verification status.
		checkUserVerificationStatus()
			.then(() => {
				setStatus(isEmailVerified ? "verified" : "not_verified");
			})
			.catch(() => {
				setStatus("not_verified");
			});
	}, [checkUserVerificationStatus, isEmailVerified]);

	// Framer Motion variants for animation.
	const iconVariants = {
		hidden: { scale: 0 },
		visible: {
			scale: 1,
			transition: { type: "spring", stiffness: 260, damping: 20 },
		},
	};

	return (
		<motion.div
			className="flex flex-col items-center justify-center min-h-screen bg-background dark:bg-background-dark p-4"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
		>
			{isLoading && (
				<p className="text-lg">Checking verification status...</p>
			)}
			{!isLoading && status === "verified" && (
				<motion.div
					className="flex flex-col items-center"
					variants={iconVariants}
					initial="hidden"
					animate="visible"
				>
					<svg
						className="w-16 h-16 text-green-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M5 13l4 4L19 7"
						/>
					</svg>
					<p className="mt-4 text-3xl font-bold text-green-600">
						Your email is verified!
					</p>
					<button
						className="mt-6 px-4 py-2 bg-green-500 text-white rounded"
						onClick={() => router.push(`/${locale}/dashboard`)}
					>
						Go to Dashboard
					</button>
				</motion.div>
			)}
			{!isLoading && status === "not_verified" && (
				<motion.div
					className="flex flex-col items-center"
					variants={iconVariants}
					initial="hidden"
					animate="visible"
				>
					<svg
						className="w-16 h-16 text-red-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
					<p className="mt-4 text-3xl font-bold text-red-600">
						Your email is not verified.
					</p>
					{error && (
						<p className="mt-2 text-sm text-destructive">{error}</p>
					)}
					<button
						className="mt-4 underline text-blue-500 hover:text-blue-700"
						onClick={() =>
							router.push(`/${locale}/resend-verification`)
						}
					>
						Resend Verification Email
					</button>
					<button
						className="mt-6 px-4 py-2 bg-red-500 text-white rounded"
						onClick={() => router.push(`/${locale}/dashboard`)}
					>
						Back to Dashboard
					</button>
				</motion.div>
			)}
		</motion.div>
	);
}
