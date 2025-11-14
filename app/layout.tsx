import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers"
import Nav from "@/components/navbar/nav";
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from "@/context/auth";
import Footer from "@/components/home/footer";
import { CartProvider } from "@/context/cart-context";
import { Suspense } from "react";
import { getMenuImage } from "./admin-dashboard/menu-image/action";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Coscorée — The Essence of K-Beauty Trends",
  description: "Glow up with the hottest Korean beauty trends",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menuImage = await getMenuImage()
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased bg-background`}
      >
        <AuthProvider>
          <CartProvider>
            <Providers>
              <Suspense fallback={null}>
                <Nav menuImage={menuImage} />
              </Suspense>
              <main className='w-full relative flex items-center justify-center'>
                <Suspense fallback={null}>
                  {children}
                  <Toaster />
                </Suspense>
              </main>
              <Footer />
            </Providers>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
