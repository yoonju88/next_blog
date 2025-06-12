import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers"
import Nav from "@/components/navbar/nav";
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from "@/context/auth";
import Footer from "@/components/home/footer";
import { CartProvider } from "@/context/cart-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Coscorée — The Essence of K-Beauty Trends",
  description: "Glow up with the hottest Korean beauty trends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased bg-background`}
      >
        <AuthProvider>
          <CartProvider>
            <Providers>
              <Nav />
              <main className='container mx-auto max-w-[1290px] relative flex items-center justify-center '>
                {children}
                <Toaster />
              </main>
              <Footer />
            </Providers>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
