// /src/app/auth/verify-otp/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function VerifyOTPPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'en';
  const { verifyUserOTP, isLoading } = useAuthStore();
  const [otp, setOtp] = useState('');

  const handleVerify = async () => {
    if (otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }
    try {
      await verifyUserOTP(otp);
      alert('OTP verified successfully!');
      router.push(`/${locale}/settings`);
    } catch (error) {
      alert('OTP verification failed. Please try again.');
    }
  };

  return (
    <motion.div
      className="bg-background dark:bg-background-dark flex min-h-screen items-center justify-center p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow dark:bg-stone-800">
        <h1 className="text-primary mb-4 text-center text-2xl font-bold">
          Verify OTP
        </h1>
        <p className="mb-4 text-center text-gray-600 dark:text-gray-300">
          Enter the 6-digit OTP sent to your email.
        </p>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full rounded border p-2 text-center"
          maxLength={6}
          placeholder="Enter OTP"
        />
        <Button onClick={handleVerify} className="mt-4 w-full">
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </Button>
      </div>
    </motion.div>
  );
}
