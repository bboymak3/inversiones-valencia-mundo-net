import { NextRequest, NextResponse } from "next/server";

// Proxy para servir imágenes de marcos desde R2
// URL: /api/marco?key=inversiones-valencia/marcos/marco-1.jpg
// Si no hay key, sirve el marco activo
export const runtime = "edge";

const DEFAULT_MARCO = "inversiones-valencia/products/IVMN-ACCE-0001.jpg";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");

  // Si no hay key, obtener marco activo de D1
  let r2Key = key || DEFAULT_MARCO;
  if (!key) {
    const env = (process as any).env || (globalThis as any).env || {};
    const db = env.DB;
    if (db) {
      try {
        const result = await db
          .prepare("SELECT value FROM ivmn_settings WHERE key = ?")
          .bind("active_marco_key")
          .first();
        if (result?.value) r2Key = result.value;
      } catch {}
    }
  }

  const env = (process as any).env || (globalThis as any).env || {};
  const bucket = env.PRODUCTS_BUCKET;

  if (bucket) {
    try {
      const object = await bucket.get(r2Key);
      if (object === null) {
        return new NextResponse("Marco no encontrado", { status: 404 });
      }
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("Cache-Control", "public, max-age=86400");
      return new NextResponse(object.body as ReadableStream, { headers });
    } catch (err) {
      return new NextResponse("Error al leer marco", { status: 500 });
    }
  }

  return new NextResponse("R2 no configurado", { status: 503 });
}
