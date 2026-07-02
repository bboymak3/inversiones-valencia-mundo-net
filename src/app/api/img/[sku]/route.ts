import { NextRequest, NextResponse } from "next/server";

// Necesario para Cloudflare Pages
export const runtime = "edge";

// Proxy de imágenes desde R2 (ivmn-products bucket)
// URL: /api/img/[sku]
// En desarrollo sin R2 binding, retorna el placeholder SVG
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  const { sku } = await params;

  if (!sku) {
    return new NextResponse("Missing SKU", { status: 400 });
  }

  // Construir la key en R2
  const r2Key = `inversiones-valencia/products/${sku}.jpg`;

  // En Cloudflare Pages, el binding R2 está disponible en (env as any).PRODUCTS_BUCKET
  const env = (process as any).env || (globalThis as any).env || {};
  const bucket = env.PRODUCTS_BUCKET;

  if (bucket) {
    try {
      const object = await bucket.get(r2Key);
      if (object === null) {
        return servePlaceholder(sku);
      }
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
      headers.set("ETag", object.httpEtag);
      return new NextResponse(object.body as ReadableStream, { headers });
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
    },
  });
}
