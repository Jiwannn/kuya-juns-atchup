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
  
  const isAuthPage = pathname?.startsWith("/auth/") || false;
  const isAdminPage = pathname?.startsWith("/admin/") || false;
  
  const showNavbar = !isAuthPage && !isAdminPage && !!session;

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