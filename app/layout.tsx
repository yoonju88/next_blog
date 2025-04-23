import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers"
import Nav from "@/components/navbar/nav";
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from "@/context/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yoonju's Blog and to do list",
  description: "꾸준히 공부하장!!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
      >
        <AuthProvider>
          <Providers>
            <Nav />
            <main className='container mx-auto min-h-screen relative flex items-center justify-center'>
              {children}
              <Toaster />
            </main>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
