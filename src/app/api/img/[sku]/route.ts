import { NextRequest, NextResponse } from "next/server";

// Necesario para Cloudflare Pages
export const runtime = "edge";

// Headers CORS para que el browser pueda usar las imágenes en Canvas
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
  "Access-Control-Vary": "Accept",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

// Proxy de imágenes desde R2 (ivmn-products bucket)
// URL: /api/img/[sku]
// - Sirve WebP si existe y el navegador lo soporta (mucho más liviano)
// - Si no existe WebP, sirve el JPG original
// - Si no hay imagen en R2, retorna placeholder SVG
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  const { sku } = await params;

  if (!sku) {
    return new NextResponse("Missing SKU", { status: 400, headers: CORS_HEADERS });
  }

  // Detectar si el navegador soporta WebP
  const acceptHeader = req.headers.get("accept") || "";
  const supportsWebp = acceptHeader.includes("image/webp");

  // Construir keys en R2
  const jpgKey = `inversiones-valencia/products/${sku}.jpg`;
  const webpKey = `inversiones-valencia/products/${sku}.webp`;

  const env = (process as any).env || (globalThis as any).env || {};
  const bucket = env.PRODUCTS_BUCKET;

  if (bucket) {
    try {
      // 1. Si el navegador soporta WebP, intentar servir WebP primero
      if (supportsWebp) {
        const webpObject = await bucket.get(webpKey);
        if (webpObject !== null) {
          const headers = new Headers();
          headers.set("Content-Type", "image/webp");
          headers.set("Cache-Control", "public, max-age=31536000, immutable");
          headers.set("ETag", webpObject.httpEtag);
          headers.set("Vary", "Accept");
          Object.entries(CORS_HEADERS).forEach(([k, v]) => headers.set(k, v));
          return new NextResponse(webpObject.body as ReadableStream, { headers });
        }
      }

      // 2. Fallback a JPG
      const jpgObject = await bucket.get(jpgKey);
      if (jpgObject !== null) {
        const headers = new Headers();
        jpgObject.writeHttpMetadata(headers);
        headers.set("Content-Type", "image/jpeg");
        headers.set("Cache-Control", "public, max-age=31536000, immutable");
        headers.set("ETag", jpgObject.httpEtag);
        headers.set("Vary", "Accept");
        Object.entries(CORS_HEADERS).forEach(([k, v]) => headers.set(k, v));
        return new NextResponse(jpgObject.body as ReadableStream, { headers });
      }

      // 3. Si no hay JPG, intentar WebP aunque el navegador no lo soporte (raro)
      if (!supportsWebp) {
        const webpObject = await bucket.get(webpKey);
        if (webpObject !== null) {
          const headers = new Headers();
          headers.set("Content-Type", "image/webp");
          headers.set("Cache-Control", "public, max-age=31536000, immutable");
          headers.set("ETag", webpObject.httpEtag);
          Object.entries(CORS_HEADERS).forEach(([k, v]) => headers.set(k, v));
          return new NextResponse(webpObject.body as ReadableStream, { headers });
        }
      }

      // 4. No hay imagen → placeholder SVG
      return servePlaceholder(sku);
    } catch (err) {
      console.error("R2 error:", err);
      return servePlaceholder(sku);
    }
  }

  return servePlaceholder(sku);
}

function servePlaceholder(sku: string) {
  const colors = ["#4CAF50", "#2E7D32", "#1B5E20", "#388E3C", "#5CB85C", "#66BB6A", "#43A047", "#00897B"];
  const hash = sku.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const color = colors[hash % colors.length];

  const parts = sku.split("-");
  const catCode = parts[1] || "PROD";

  const svg = `<svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${color}22"/>
      <stop offset="100%" stop-color="${color}55"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg)"/>
  <g opacity="0.18">
    <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="12" cy="12" r="2" fill="${color}"/>
    </pattern>
    <rect width="400" height="400" fill="url(#dots)"/>
  </g>
  <text x="200" y="180" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="120" font-weight="800" fill="${color}" opacity="0.65">${catCode}</text>
  <text x="200" y="240" text-anchor="middle" font-family="monospace" font-size="18" fill="#374151">${sku}</text>
  <text x="200" y="290" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="14" fill="#6B7280">Inversiones Valencia Mundo Net</text>
  <rect x="100" y="320" width="200" height="3" rx="1.5" fill="${color}" opacity="0.6"/>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=300",
      ...CORS_HEADERS,
    },
  });
}
