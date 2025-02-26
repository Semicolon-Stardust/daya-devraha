"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/stores/authStore";

type ResendFormData = {
	email: string;
};

export default function ResendVerificationPage() {
	const { resendVerificationEmail, isLoading, error } = useAuthStore();
	const router = useRouter();
	const params = useParams();
	const locale = params.locale || "en";

	const {
		register,
		handleSubmit,
		formState: { errors: formErrors },
	} = useForm<ResendFormData>();

	const [resendMessage, setResendMessage] = useState<string | null>(null);
	const [resendError, setResendError] = useState<string | null>(null);
	const [showForm, setShowForm] = useState(true);

	const onResendSubmit = async (data: ResendFormData) => {
		setResendMessage(null);
		setResendError(null);
		try {
			const message = await resendVerificationEmail(data.email);
			setResendMessage(message || "Verification email resent.");
			// Optionally hide the form after submission.
			setShowForm(false);
		} catch (err) {
			setResendError("Failed to resend verification email.");
		}
	};

	const formVariants = {
		hidden: { opacity: 0, height: 0 },
		visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
		exit: { opacity: 0, height: 0, transition: { duration: 0.3 } },
	};

	return (
		<motion.div
			className="flex flex-col items-center justify-center min-h-screen bg-background dark:bg-background-dark p-4"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
		>
			<motion.h1 className="text-3xl font-bold mb-4">
				Resend Verification Email
			</motion.h1>

			<AnimatePresence>
				{showForm && (
					<motion.div
						className="w-full max-w-md"
						initial="hidden"
						animate="visible"
						exit="exit"
						variants={formVariants}
					>
						<form
							onSubmit={handleSubmit(onResendSubmit)}
							className="space-y-4"
						>
							<div>
								<input
									type="email"
									placeholder="Enter your email"
									className="w-full p-2 border rounded"
									{...register("email", {
										required: "Email is required",
									})}
								/>
								{formErrors.email && (
									<p className="text-xs text-destructive">
										{formErrors.email.message}
									</p>
								)}
							</div>
							<button
								type="submit"
								className="px-4 py-2 bg-blue-500 text-white rounded"
								disabled={isLoading}
							>
								{isLoading
									? "Sending..."
									: "Send Verification Email"}
							</button>
						</form>
					</motion.div>
				)}
			</AnimatePresence>

			{resendMessage && (
				<motion.p
					className="mt-4 text-green-600 text-sm"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
				>
					{resendMessage}
				</motion.p>
			)}

			{resendError && (
				<motion.p
					className="mt-4 text-red-600 text-sm"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
				>
					{resendError}
				</motion.p>
			)}

			<button
				className="mt-6 px-4 py-2 bg-red-500 text-white rounded"
				onClick={() => router.push(`/${locale}/login`)}
			>
				Back to Login
			</button>
		</motion.div>
	);
}
