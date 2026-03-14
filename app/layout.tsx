import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kuya Jun's Atchup Sabaw Eatery",
  description: "Affordable and delicious packed meals and food trays",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-orange-50">
            <ClientLayout>
              {children}
            </ClientLayout>
          </div>
        </Providers>
      </body>
    </html>
  );
}