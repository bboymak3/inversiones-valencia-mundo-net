import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

// Nota: el nombre "Valencia" es el nombre comercial de la tienda
// NO hace referencia a la ciudad de Valencia, Carabobo.
// Estamos ubicados en Barinas, estado Barinas, Venezuela.
// Hacemos envíos a toda Venezuela y viajamos para instalaciones a nivel nacional.
const SITE_URL = "https://inversiones-valencia-mundo-net.pages.dev";
const SITE_NAME = "Inversiones Valencia Mundo Net";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Instalación de Cámaras de Seguridad a Nivel Nacional | Inversiones Valencia Mundo Net",
    template: "%s | Inversiones Valencia Mundo Net",
  },
  description:
    "Instalación de cámaras de seguridad CCTV a nivel nacional en Venezuela 🇻🇪. Cámaras WiFi, videovigilancia, accesorios para PC y celulares. Envíos a toda Venezuela. Cotiza por WhatsApp +58 416-9726126.",
  keywords: [
    "instalación de cámaras de seguridad",
    "cámaras de seguridad",
    "instalaciones a nivel nacional",
    "envíos a toda Venezuela",
    "CCTV",
    "videovigilancia",
    "DVR",
    "NVR",
    "cámaras IP",
    "cámaras WiFi",
    "kits de cámaras",
    "discos duros para CCTV",
    "accesorios para PC",
    "accesorios para celular",
    "redes y conectividad",
    "Barinas",
    "Venezuela",
    "Inversiones Valencia",
    "Mundo Net",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  applicationName: SITE_NAME,
  category: "Seguridad y Tecnología",
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/favicon.svg" }],
    shortcut: ["/favicon.svg"],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "es_VE",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Instalación de Cámaras de Seguridad a Nivel Nacional 🇻🇪",
    description:
      "Instalación de cámaras de seguridad CCTV a nivel nacional en Venezuela. Cámaras WiFi, videovigilancia, accesorios para PC y celulares. Envíos a toda Venezuela. Cotiza por WhatsApp +58 416-9726126.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Inversiones Valencia Mundo Net - Instalación de Cámaras de Seguridad a Nivel Nacional",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instalación de Cámaras de Seguridad a Nivel Nacional 🇻🇪",
    description:
      "Instalación de cámaras de seguridad CCTV a nivel nacional en Venezuela. Envíos a toda Venezuela. Cotiza por WhatsApp +58 416-9726126.",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  verification: {
    other: {
      "theme-color": "#4CAF50",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#4CAF50",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: SITE_NAME,
  description:
    "Instalación de cámaras de seguridad CCTV a nivel nacional en Venezuela. Envíos a todo el país. Especialistas en videovigilancia, accesorios para PC y celulares.",
  url: SITE_URL,
  telephone: "+584169726126",
  email: "ventas@inversionesvalencia.net",
  image: `${SITE_URL}/logo.svg`,
  logo: `${SITE_URL}/logo.svg`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Barinas",
    addressRegion: "Barinas",
    addressCountry: "VE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 8.6226,
    longitude: -70.2075,
  },
  openingHours: "Mo-Sa 08:00-18:00",
  priceRange: "$$",
  areaServed: {
    "@type": "Country",
    name: "Venezuela",
  },
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
