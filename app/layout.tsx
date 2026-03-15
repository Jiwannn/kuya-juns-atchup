"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function SessionChecker({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't do anything while session is loading
    if (status === "loading") return;

    // List of public paths that should NEVER redirect
    const publicPaths = [
      '/',
      '/auth/signin',
      '/auth/register',
      '/terms',
      '/privacy',
      '/menu',
      '/about',
      '/catering'
    ];

    // Check if current path is in public paths
    const isPublicPath = publicPaths.includes(pathname || '') || 
                        pathname?.startsWith('/auth/') ||
                        pathname === '/terms' ||
                        pathname === '/privacy';

    // If no session and not on a public path, redirect to signin
    if (!session && !isPublicPath) {
      console.log('Redirecting to signin from:', pathname);
      router.push('/auth/signin');
    }
  }, [session, status, pathname, router]);

  return <>{children}</>;
}