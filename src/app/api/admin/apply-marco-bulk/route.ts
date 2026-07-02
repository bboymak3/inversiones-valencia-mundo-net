import { NextRequest, NextResponse } from "next/server";

// Lista las imágenes a procesar para aplicar marco masivamente
// GET: { categoryPrefix?: string } → devuelve lista de SKUs y la URL del marco activo
// El browser luego procesa cada imagen con Canvas nativo (que SÍ funciona en browser)

export const runtime = "edge";

const DEFAULT_MARCO = "inversiones-valencia/products/IVMN-ACCE-0001.jpg";
const PRODUCTS_PREFIX = "inversiones-valencia/products/";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const categoryPrefix = url.searchParams.get("prefix") || "";

  const env = (process as any).env || (globalThis as any).env || {};
  const bucket = env.PRODUCTS_BUCKET;
  const db = env.DB;

  if (!bucket) {
    return NextResponse.json(
      { success: false, message: "R2 bucket no configurado" },
      { status: 503 }
    );
  }

  // 1. Determinar marco activo
  let activeMarcoKey = DEFAULT_MARCO;
  if (db) {
    try {
      const result = await db
        .prepare("SELECT value FROM ivmn_settings WHERE key = ?")
        .bind("active_marco_key")
        .first();
      if (result?.value) activeMarcoKey = result.value;
    } catch {}
  }

  // 2. Listar imágenes de productos
  const fullPrefix = categoryPrefix
    ? `${PRODUCTS_PREFIX}IVMN-${categoryPrefix}`
    : PRODUCTS_PREFIX;
  const listed = await bucket.list({ prefix: fullPrefix, limit: 1000 });

  const productKeys = listed.objects
    .filter((obj: any) => obj.key.endsWith(".jpg") || obj.key.endsWith(".png"))
    .filter((obj: any) => obj.key !== activeMarcoKey) // excluir el marco default
    .filter((obj: any) => !obj.key.includes("/marcos/")) // excluir marcos subidos
    .map((obj: any) => {
      const filename = obj.key.split("/").pop() || "";
      const sku = filename.replace(/\.(jpg|png)$/i, "");
      return {
        key: obj.key,
        sku,
        url: `/api/img/${sku}`,
      };
    });

  return NextResponse.json({
    success: true,
    images: productKeys,
    total: productKeys.length,
    marcoUrl: `/api/marco?key=${encodeURIComponent(activeMarcoKey)}`,
    marcoKey: activeMarcoKey,
  });
}
