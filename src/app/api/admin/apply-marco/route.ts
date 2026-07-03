import { NextRequest, NextResponse } from "next/server";

// API para aplicar el marco activo a la imagen de un producto
// POST: { sku: string } → descarga imagen + marco, los combina, sube resultado
// Usa el marco activo guardado en D1 (ivmn_settings.active_marco_key)

export const runtime = "edge";

const DEFAULT_MARCO = "inversiones-valencia/products/IVMN-ACCE-0001.jpg";
// Área útil dentro del marco (donde va el producto)
// Calculado para el marco IVMN-ACCE-0001 (1331x1691)
const AREA_X = 80;
const AREA_Y = 200;
const AREA_W = 1171;
const AREA_H = 1411;

export async function POST(req: NextRequest) {
  try {
    const { sku, marcoKey } = await req.json();

    if (!sku) {
      return NextResponse.json(
        { success: false, message: "Falta el SKU del producto" },
        { status: 400 }
      );
    }

    const env = (process as any).env || (globalThis as any).env || {};
    const bucket = env.PRODUCTS_BUCKET;
    const db = env.DB;

    if (!bucket) {
      return NextResponse.json(
        { success: false, message: "R2 bucket no configurado" },
        { status: 503 }
      );
    }

    // 1. Determinar qué marco usar
    let activeMarcoKey = marcoKey;
    if (!activeMarcoKey) {
      if (db) {
        try {
          const result = await db
            .prepare("SELECT value FROM ivmn_settings WHERE key = ?")
            .bind("active_marco_key")
            .first();
          activeMarcoKey = result?.value || DEFAULT_MARCO;
        } catch {
          activeMarcoKey = DEFAULT_MARCO;
        }
      } else {
        activeMarcoKey = DEFAULT_MARCO;
      }
    }

    // 2. Descargar el marco de R2
    const marcoObj = await bucket.get(activeMarcoKey);
    if (!marcoObj) {
      return NextResponse.json(
        { success: false, message: `Marco no encontrado: ${activeMarcoKey}` },
        { status: 404 }
      );
    }
    const marcoBuffer = await marcoObj.arrayBuffer();

    // 3. Descargar la imagen del producto de R2
    const productKey = `inversiones-valencia/products/${sku}.jpg`;
    const productObj = await bucket.get(productKey);
    if (!productObj) {
      return NextResponse.json(
        { success: false, message: `Imagen de producto no encontrada: ${productKey}` },
        { status: 404 }
      );
    }
    const productBuffer = await productObj.arrayBuffer();

    // 4. Combinar las imágenes
    // Como Edge Runtime no tiene acceso a Pillow/Sharp directamente,
    // usamos Canvas API vía OffscreenCanvas (disponible en Workers)
    const combined = await composeImages(marcoBuffer, productBuffer);

    // 5. Subir el resultado a R2 (sobreescribe la imagen original)
    await bucket.put(productKey, combined, {
      httpMetadata: {
        contentType: "image/jpeg",
        cacheControl: "public, max-age=31536000, immutable",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Marco aplicado a ${sku}`,
      data: {
        sku,
        marcoKey: activeMarcoKey,
        productKey,
        url: `/api/img/${sku}?t=${Date.now()}`, // cache busting
      },
    });
  } catch (err: any) {
    console.error("Error applying marco:", err);
    return NextResponse.json(
      { success: false, message: "Error: " + err.message },
      { status: 500 }
    );
  }
}

// Componer dos imágenes usando Canvas API
async function composeImages(
  marcoBuffer: ArrayBuffer,
  productBuffer: ArrayBuffer
): Promise<Buffer> {
  // Crear blobs y ImageBitmaps
  const marcoBlob = new Blob([marcoBuffer]);
  const productBlob = new Blob([productBuffer]);

  const marcoBitmap = await createImageBitmap(marcoBlob);
  const productBitmap = await createImageBitmap(productBlob);

  // Crear canvas con el tamaño del marco
  const canvas = new OffscreenCanvas(marcoBitmap.width, marcoBitmap.height);
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No se pudo obtener contexto 2D del canvas");
  }

  // Dibujar el marco de fondo
  ctx.drawImage(marcoBitmap, 0, 0, marcoBitmap.width, marcoBitmap.height);

  // Calcular tamaño del producto preservando aspect ratio
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

  // Centrar en el área útil
  const posX = AREA_X + Math.round((AREA_W - newW) / 2);
  const posY = AREA_Y + Math.round((AREA_H - newH) / 2);

  // Dibujar fondo blanco detrás del producto
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(posX - 10, posY - 10, newW + 20, newH + 20);

  // Dibujar el producto sobre el marco
  ctx.drawImage(productBitmap, posX, posY, newW, newH);

  // Exportar como JPEG
  const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.85 });
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
