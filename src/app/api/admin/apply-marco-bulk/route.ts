import { NextRequest, NextResponse } from "next/server";

// Aplica el marco activo a TODAS las imágenes de productos
// POST: { categoryPrefix?: string } → aplica el marco a todas las imágenes
// Si categoryPrefix = "IVMN-REDE", solo aplica a las de la categoría Redes
// Si no se especifica, aplica a TODAS las imágenes

export const runtime = "edge";

const DEFAULT_MARCO = "inversiones-valencia/products/IVMN-ACCE-0001.jpg";
const PRODUCTS_PREFIX = "inversiones-valencia/products/";
const AREA_X = 80;
const AREA_Y = 200;
const AREA_W = 1171;
const AREA_H = 1411;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const categoryPrefix = body.categoryPrefix || "";

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

    // 2. Descargar el marco (una sola vez)
    const marcoObj = await bucket.get(activeMarcoKey);
    if (!marcoObj) {
      return NextResponse.json(
        { success: false, message: `Marco no encontrado: ${activeMarcoKey}` },
        { status: 404 }
      );
    }
    const marcoBuffer = await marcoObj.arrayBuffer();
    const marcoBitmap = await createImageBitmap(new Blob([marcoBuffer]));

    // 3. Listar todas las imágenes de productos
    const fullPrefix = categoryPrefix
      ? `${PRODUCTS_PREFIX}${categoryPrefix}`
      : PRODUCTS_PREFIX;
    const listed = await bucket.list({ prefix: fullPrefix, limit: 1000 });

    const productKeys = listed.objects
      .filter((obj: any) => obj.key.endsWith(".jpg") || obj.key.endsWith(".png"))
      .filter((obj: any) => obj.key !== activeMarcoKey) // no procesar el marco default
      .map((obj: any) => obj.key);

    if (productKeys.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No se encontraron imágenes para procesar",
      });
    }

    // 4. Procesar cada imagen (sin esperar para no agotar tiempo)
    let success = 0;
    let failed = 0;
    const errors: { key: string; error: string }[] = [];

    for (const productKey of productKeys) {
      try {
        const productObj = await bucket.get(productKey);
        if (!productObj) {
          failed++;
          errors.push({ key: productKey, error: "no se pudo leer" });
          continue;
        }

        const productBuffer = await productObj.arrayBuffer();
        const productBitmap = await createImageBitmap(new Blob([productBuffer]));

        // Componer
        const combined = await composeImages(marcoBitmap, productBitmap);

        // Subir resultado (sobreescribe)
        await bucket.put(productKey, combined, {
          httpMetadata: {
            contentType: "image/jpeg",
            cacheControl: "public, max-age=31536000, immutable",
          },
        });

        success++;
      } catch (err: any) {
        failed++;
        errors.push({ key: productKey, error: err.message });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Marco aplicado a ${success} imágenes${failed > 0 ? ` (${failed} fallidas)` : ""}`,
      data: {
        total: productKeys.length,
        success,
        failed,
        marcoKey: activeMarcoKey,
        categoryPrefix: categoryPrefix || "todas",
        errors: errors.slice(0, 5), // primeros 5 errores
      },
    });
  } catch (err: any) {
    console.error("Error en apply-marco-bulk:", err);
    return NextResponse.json(
      { success: false, message: "Error: " + err.message },
      { status: 500 }
    );
  }
}

async function composeImages(
  marcoBitmap: ImageBitmap,
  productBitmap: ImageBitmap
): Promise<Buffer> {
  const canvas = new OffscreenCanvas(marcoBitmap.width, marcoBitmap.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo obtener contexto 2D");

  ctx.drawImage(marcoBitmap, 0, 0, marcoBitmap.width, marcoBitmap.height);

  const prodW = productBitmap.width;
  const prodH = productBitmap.height;
  const areaRatio = AREA_W / AREA_H;
  const prodRatio = prodW / prodH;

  let newW, newH;
  if (prodRatio > areaRatio) {
    newW = AREA_W;
    newH = Math.round(AREA_W / prodRatio);
  } else {
    newH = AREA_H;
    newW = Math.round(AREA_H * prodRatio);
  }

  const posX = AREA_X + Math.round((AREA_W - newW) / 2);
  const posY = AREA_Y + Math.round((AREA_H - newH) / 2);

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(posX - 10, posY - 10, newW + 20, newH + 20);
  ctx.drawImage(productBitmap, posX, posY, newW, newH);

  const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.85 });
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
