"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import CartSidebar from "./CartSidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Check if current page is auth page or admin page
  const isAuthPage = pathname?.startsWith("/auth/") || false;
  const isAdminPage = pathname?.startsWith("/admin/") || false;
  
  // Only show navbar on non-auth, non-admin pages when user is logged in
  // AND NOT on any admin page
  const showNavbar = !isAuthPage && !isAdminPage && !!session;

  // Log for debugging
  useEffect(() => {
    if (mounted) {
      console.log('ClientLayout:', { pathname, isAuthPage, isAdminPage, showNavbar });
    }
  }, [pathname, isAuthPage, isAdminPage, showNavbar, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {showNavbar && <Navbar />}
      <div className={showNavbar ? "flex" : "w-full"}>
        <main className="flex-1">{children}</main>
        {showNavbar && <CartSidebar />}
      </div>
    </>
  );
}