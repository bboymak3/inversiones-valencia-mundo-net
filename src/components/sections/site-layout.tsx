"use client";

import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { CartDrawer } from "@/components/shop/cart-drawer";
import { WhatsAppFloating } from "@/components/sections/whatsapp-floating";
import { CurrencyInitializer } from "@/components/sections/currency-initializer";
import { BottomNav } from "@/components/sections/bottom-nav";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CurrencyInitializer />
      <Header />
      <main className="flex-1 pb-20 lg:pb-0">{children}</main>
      <Footer />
      <CartDrawer />
      <WhatsAppFloating />
      <BottomNav />
    </>
  );
}
