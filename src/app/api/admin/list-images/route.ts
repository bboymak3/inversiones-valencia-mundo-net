import { NextRequest, NextResponse } from "next/server";

// Lista todas las imágenes disponibles en R2 (carpeta inversiones-valencia/products/)
// Opcional: ?prefix=IVMN-REDE para filtrar por prefijo
// Retorna: lista de { key, sku, size, uploaded }

export const runtime = "edge";

const PRODUCTS_PREFIX = "inversiones-valencia/products/";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const prefix = url.searchParams.get("prefix") || "";
  const fullPrefix = prefix ? `${PRODUCTS_PREFIX}${prefix}` : PRODUCTS_PREFIX;

  const env = (process as any).env || (globalThis as any).env || {};
  const bucket = env.PRODUCTS_BUCKET;

  if (!bucket) {
    return NextResponse.json(
      { success: false, message: "R2 bucket no configurado", images: [] },
      { status: 503 }
    );
  }

  try {
    const listed = await bucket.list({ prefix: fullPrefix, limit: 1000 });
    const images = listed.objects
      .filter((obj: any) => obj.key.endsWith(".jpg") || obj.key.endsWith(".png"))
      .map((obj: any) => {
        const filename = obj.key.split("/").pop() || "";
        const sku = filename.replace(/\.(jpg|png)$/i, "");
        return {
          key: obj.key,
          sku,
          filename,
          size: obj.size || 0,
          uploaded: obj.uploaded?.toISOString?.() || null,
          url: `/api/img/${sku}`,
        };
      })
      .sort((a: any, b: any) => a.sku.localeCompare(b.sku));

    return NextResponse.json({
      success: true,
      images,
      total: images.length,
      truncated: listed.truncated || false,
    });
  } catch (err: any) {
    console.error("Error listando imágenes:", err);
    return NextResponse.json(
      { success: false, message: "Error: " + err.message, images: [] },
      { status: 500 }
    );
  }
}
