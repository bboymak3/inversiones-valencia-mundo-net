"use client";

import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { PromoBanner } from "@/components/sections/promo-banner";
import { CatalogHome } from "@/components/sections/catalog";
import { NexusOne } from "@/components/sections/nexus-one";
import { CamarasGallery } from "@/components/sections/camaras-gallery";
import { ZonasBarinas } from "@/components/sections/zonas-barinas";
import { SeoContent } from "@/components/sections/seo-content";
import { WhyUs } from "@/components/sections/why-us";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { CartDrawer } from "@/components/shop/cart-drawer";
import { WhatsAppFloating } from "@/components/sections/whatsapp-floating";
import { CurrencyInitializer } from "@/components/sections/currency-initializer";
import { BottomNav } from "@/components/sections/bottom-nav";

export default function Home() {
  return (
    <>
      <CurrencyInitializer />
      <Header />
      <main className="flex-1 pb-20 lg:pb-0">
        <Hero />
        <Services />
        <PromoBanner />
        <NexusOne />
        <CatalogHome />
        <CamarasGallery />
        <ZonasBarinas />
        <SeoContent />
        <WhyUs />
        <Contact />
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppFloating />
      <BottomNav />
    </>
  );
}
