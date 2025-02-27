// /src/app/login/page.tsx
'use client';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

// Define validation schema using Zod.
const loginSchema = z.object({
  email: z
    .string()
    .nonempty({ message: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  password: z.string().nonempty({ message: 'Password is required' }),
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
  const { loginUser, isLoading, error } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'en';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await loginUser(data.email, data.password);
      // If two-factor is required, redirect to the OTP verification page.
      if (result.twoFactorRequired) {
        router.push(`/${locale}/verify-otp`);
      } else {
        router.push(`/${locale}/settings`);
      }
    } catch {
      // Global error state is already set in the store.
    }
  };

  return (
    <motion.div
      className="bg-background dark:bg-background-dark flex min-h-screen items-center justify-center p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="bg-card w-full max-w-md space-y-6 rounded-lg p-8 shadow"
        variants={containerVariants}
      >
        <motion.h1
          className="text-primary text-center text-3xl font-bold"
          variants={fieldVariants}
        >
          Login to Your Account
        </motion.h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <motion.div variants={fieldVariants}>
            <Label htmlFor="email" className="block text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className="mt-1 w-full"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-destructive mt-1 text-xs">
                {errors.email.message}
              </p>
            )}
          </motion.div>
          <motion.div variants={fieldVariants}>
            <Label htmlFor="password" className="block text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              className="mt-1 w-full"
              placeholder="Your secure password"
            />
            {errors.password && (
              <p className="text-destructive mt-1 text-xs">
                {errors.password.message}
              </p>
            )}
          </motion.div>
          <motion.div variants={fieldVariants}>
            <Button type="submit" className="w-full">
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </motion.div>
          {error && <p className="text-destructive text-center">{error}</p>}
        </form>
      </motion.div>
    </motion.div>
  );
}
