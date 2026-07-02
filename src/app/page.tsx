"use client";

import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { PromoBanner } from "@/components/sections/promo-banner";
import { Catalog } from "@/components/sections/catalog";
import { WhyUs } from "@/components/sections/why-us";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { CartDrawer } from "@/components/shop/cart-drawer";
import { WhatsAppFloating } from "@/components/sections/whatsapp-floating";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Services />
        <PromoBanner />
        <Catalog />
        <WhyUs />
        <Contact />
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppFloating />
    </>
  );
}
