import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/hooks/useToast";
import { APP_CONFIG } from "@/config/app";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: APP_CONFIG.name,
    template: `%s | ${APP_CONFIG.shortName}`,
  },
  description: APP_CONFIG.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
