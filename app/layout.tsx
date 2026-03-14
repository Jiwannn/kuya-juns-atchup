import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import ClientLayout from "@/components/ClientLayout";
import SessionChecker from "@/components/SessionChecker";

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
          <SessionChecker>
            <ClientLayout>
              {children}
            </ClientLayout>
          </SessionChecker>
        </Providers>
      </body>
    </html>
  );
}