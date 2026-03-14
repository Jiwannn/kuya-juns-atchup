"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function SessionChecker({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      // If not authenticated and not on auth page, redirect to signin
      if (!pathname?.startsWith('/auth/') && pathname !== '/') {
        console.log('No session, redirecting to login...');
        router.push('/auth/signin');
      }
    }

    // Also check if session expired but still on protected page
    if (status === "loading") return;
    
    if (!session && !pathname?.startsWith('/auth/') && pathname !== '/') {
      console.log('Session expired, redirecting...');
      router.push('/auth/signin');
    }
  }, [status, session, pathname, router]);

  return <>{children}</>;
}