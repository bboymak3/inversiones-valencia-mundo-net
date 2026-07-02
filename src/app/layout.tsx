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

const SITE_URL = "https://inversionesvalencia.pages.dev";
const SITE_NAME = "Inversiones Valencia Mundo Net";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Inversiones Valencia Mundo Net | Cámaras de Seguridad y Tecnología en Valencia, Venezuela",
    template: "%s | Inversiones Valencia Mundo Net",
  },
  description:
    "Especialistas en venta e instalación de cámaras de seguridad CCTV, DVR/NVR, kits de videovigilancia, accesorios para computadoras y celulares en Valencia, Venezuela. Cotiza por WhatsApp +58 416-9726126.",
  keywords: [
    "cámaras de seguridad",
    "CCTV",
    "videovigilancia",
    "DVR",
    "NVR",
    "instalación de cámaras",
    "cámaras IP",
    "cámaras WiFi",
    "kits de cámaras",
    "discos duros para CCTV",
    "accesorios para PC",
    "accesorios para celular",
    "mouse",
    "teclados",
    "cargadores",
    "redes y conectividad",
    "Valencia",
    "Carabobo",
    "Venezuela",
    "Inversiones Valencia",
    "Mundo Net",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  applicationName: SITE_NAME,
  category: "Tecnología y Seguridad",
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
    title: "Inversiones Valencia Mundo Net | Cámaras de Seguridad y Tecnología",
    description:
      "Venta e instalación de cámaras de seguridad CCTV, accesorios para PC y celulares en Valencia, Venezuela. Cotiza por WhatsApp +58 416-9726126.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Inversiones Valencia Mundo Net - Cámaras de Seguridad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Inversiones Valencia Mundo Net | Cámaras de Seguridad",
    description:
      "Venta e instalación de cámaras de seguridad CCTV, accesorios para PC y celulares en Valencia, Venezuela.",
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
    "Venta e instalación de cámaras de seguridad CCTV, accesorios para computadoras y celulares en Valencia, Venezuela.",
  url: SITE_URL,
  telephone: "+584169726126",
  email: "ventas@inversionesvalencia.net",
  image: `${SITE_URL}/logo.svg`,
  logo: `${SITE_URL}/logo.svg`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Valencia",
    addressRegion: "Carabobo",
    addressCountry: "VE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 10.162,
    longitude: -68.0078,
  },
  openingHours: "Mo-Sa 08:00-18:00",
  priceRange: "$$",
  areaServed: ["Valencia", "Carabobo", "Venezuela"],
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
