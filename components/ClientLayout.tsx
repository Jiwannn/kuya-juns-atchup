"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import CartSidebar from "./CartSidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.includes("/auth/") || false;

  return (
    <>
      {!isAuthPage && <Navbar />}
      <div className={!isAuthPage ? "flex" : ""}>
        <main className="flex-1">{children}</main>
        {!isAuthPage && <CartSidebar />}
      </div>
    </>
  );
}