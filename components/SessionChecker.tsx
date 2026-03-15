"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function SessionChecker({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Public routes that don't require authentication
    const publicRoutes = [
      '/',
      '/auth/signin',
      '/auth/register',
      '/terms',
      '/privacy',
      '/menu',
      '/about',
      '/catering'
    ];
    
    // Check if current path is a public route
    const isPublicRoute = publicRoutes.some(route => 
      pathname === route || 
      pathname?.startsWith('/auth/') ||
      pathname === '/terms' ||
      pathname === '/privacy'
    );

    if (status === "unauthenticated" || (!session && status !== "loading")) {
      // Only redirect if not on a public route
      if (!isPublicRoute) {
        console.log('No session, redirecting to login from:', pathname);
        router.push('/auth/signin');
      }
    }
  }, [status, session, pathname, router]);

  return <>{children}</>;
}