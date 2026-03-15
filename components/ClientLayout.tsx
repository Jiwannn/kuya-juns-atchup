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
    // Debug: Log the current pathname
    console.log("Current pathname:", pathname);
  }, [pathname]);
  
  // Check for all pages that should NOT show the navbar
  const isAuthPage = pathname?.startsWith("/auth/") || false;
  const isAdminPage = pathname?.startsWith("/admin/") || false;
  const isDashboardPage = pathname === "/dashboard" || pathname?.startsWith("/dashboard/") || false;
  
  // Debug: Log the checks
  console.log("Path checks:", { isAuthPage, isAdminPage, isDashboardPage, hasSession: !!session });
  
  // Only show navbar on regular pages when logged in (not on auth, admin, or dashboard)
  const showNavbar = !isAuthPage && !isAdminPage && !isDashboardPage && !!session;
  
  console.log("Show navbar:", showNavbar);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {showNavbar && <Navbar />}
      <div className={`${showNavbar ? "flex" : "w-full"} overflow-x-hidden`}>
        <main className="flex-1 w-full max-w-full overflow-x-hidden">
          {children}
        </main>
        {showNavbar && <CartSidebar />}
      </div>
    </>
  );
}