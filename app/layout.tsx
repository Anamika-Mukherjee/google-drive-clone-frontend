import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

const inter = Inter({
     variable: "--font-inter",
     subsets: ["latin"],
     weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
})
export const metadata: Metadata = {
  title: "Your Store",
  description: "A cloud storage for all your files.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-inter antialiased w-screen h-screen`}
      >
        <AppRouterCacheProvider>
        {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
