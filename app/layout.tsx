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
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={inter.className}>
        <Providers>
          <SessionChecker>
            <ClientLayout>
              <div className="w-full overflow-x-hidden">
                {children}
              </div>
            </ClientLayout>
          </SessionChecker>
        </Providers>
      </body>
    </html>
  );
}