// src/hooks/useProtectedRoute.ts
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export const useProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/en/login");
    }
  }, [isAuthenticated, router]);
};
