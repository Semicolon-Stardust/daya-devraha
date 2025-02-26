"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function VerifyEmailPage() {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const { verifyUserEmail, isLoading, error } = useAuthStore();
	const router = useRouter();
	const params = useParams();
	const locale = params.locale || "en";

	// Local state: "success" | "failure" | "already" | null
	const [verificationStatus, setVerificationStatus] = useState<
		"success" | "failure" | "already" | null
	>(null);

	useEffect(() => {
		if (token) {
			verifyUserEmail(token)
				.then((result) => {
					if (typeof result === "string" && result === "already") {
						setVerificationStatus("already");
					} else {
						setVerificationStatus(result ? "success" : "failure");
					}
				})
				.catch(() => {
					setVerificationStatus("failure");
				});
		} else {
			setVerificationStatus("failure");
		}
	}, [token, verifyUserEmail]);

	// Framer Motion animation variants for the icons.
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
			{isLoading && <p className="text-lg">Verifying...</p>}
			{!isLoading && verificationStatus === "success" && (
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
					<p className="mt-4 text-xl text-green-600">
						Email verified successfully!
					</p>
					<button
						className="mt-6 px-4 py-2 bg-green-500 text-white rounded"
						onClick={() => router.push(`/${locale}/login`)}
					>
						Go to Login
					</button>
				</motion.div>
			)}
			{!isLoading && verificationStatus === "already" && (
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
					<p className="mt-4 text-xl text-green-600">
						Email already verified!
					</p>
					<button
						className="mt-6 px-4 py-2 bg-green-500 text-white rounded"
						onClick={() => router.push(`/${locale}/login`)}
					>
						Go to Login
					</button>
				</motion.div>
			)}
			{!isLoading && verificationStatus === "failure" && (
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
					<p className="mt-4 text-xl text-red-600">
						Email verification failed. Please try again.
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
						onClick={() => router.push(`/${locale}/login`)}
					>
						Back to Login
					</button>
				</motion.div>
			)}
		</motion.div>
	);
}
