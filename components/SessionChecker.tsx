"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function SessionChecker({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Log for debugging
    console.log('SessionChecker - Path:', pathname);
    console.log('SessionChecker - Status:', status);
    console.log('SessionChecker - Session:', !!session);

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
    const isPublicRoute = publicRoutes.includes(pathname || '') || 
                          pathname?.startsWith('/auth/') || 
                          pathname === '/terms' || 
                          pathname === '/privacy';

    console.log('SessionChecker - isPublicRoute:', isPublicRoute);

    if (status === "unauthenticated" || (!session && status !== "loading")) {
      // Only redirect if not on a public route
      if (!isPublicRoute) {
        console.log('⛔ Redirecting to signin from:', pathname);
        router.push('/auth/signin');
      } else {
        console.log('✅ Public route, no redirect:', pathname);
      }
    }
  }, [status, session, pathname, router]);

  return <>{children}</>;
}