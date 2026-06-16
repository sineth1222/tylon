import type { Metadata } from "next";
import { Oswald, DM_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { Toaster } from "react-hot-toast";
import CartSidebar from "@/components/cart/CartSidebar";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { getUser } from "@/lib/actions/auth";
import { getWishlist } from "@/lib/actions/wishlist";
import PWARegister from "@/components/ui/PWARegister";
import PWAInstallBanner from "@/components/ui/PWAInstallBanner";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "TYLON — Wear Your Mission",
  description:
    "Not clothing. Armor. Each piece carries a story, a philosophy, a mission. Enter a different empire.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TYLON",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser().catch(() => null);
  const wishlistItems = user ? await getWishlist(user.id).catch(() => []) : [];
  const initialWishlistIds = wishlistItems.map((i: any) => i.product_id);

  return (
    <html lang="en" className={`${oswald.variable} ${dmSans.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0D0D0B" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body className="font-sans bg-tylon-bg text-tylon-primary">
        <CartProvider>
          <WishlistProvider
            userId={user?.id ?? null}
            initialIds={initialWishlistIds}
          >
            <PWARegister />
            {children}
            <CartSidebar />
            <WhatsAppButton />
            <PWAInstallBanner />
            <Toaster
              position="bottom-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#1A1A17",
                  color: "#F0EDE6",
                  borderRadius: "2px",
                  padding: "12px 24px",
                  fontSize: "12px",
                  fontFamily: "var(--font-mono)",
                  border: "1px solid #2A2A26",
                  letterSpacing: "0.08em",
                },
                success: {
                  iconTheme: { primary: "#4A5C3A", secondary: "#F0EDE6" },
                },
                error: {
                  iconTheme: { primary: "#6B2020", secondary: "#F0EDE6" },
                },
              }}
            />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
