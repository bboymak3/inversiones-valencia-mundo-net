import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// Endpoint de debug para verificar qué bindings están disponibles
export async function GET() {
  const processEnv = (process as any).env || {};
  const globalEnv = (globalThis as any).env || {};

  // Intentar getRequestContext
  let requestContextEnv: any = null;
  let requestContextError: string | null = null;
  try {
    const { getRequestContext } = await import("@cloudflare/next-on-pages");
    const ctx = getRequestContext();
    requestContextEnv = {
      hasDB: !!ctx.env?.DB,
      hasBucket: !!ctx.env?.PRODUCTS_BUCKET,
      keys: Object.keys(ctx.env || {}),
    };
  } catch (err: any) {
    requestContextError = err.message;
  }

  return NextResponse.json({
    processEnv: {
      hasDB: !!processEnv.DB,
      hasBucket: !!processEnv.PRODUCTS_BUCKET,
      keys: Object.keys(processEnv).filter((k) =>
        k === "DB" || k === "PRODUCTS_BUCKET" || k.includes("ADMIN") || k.includes("WHATSAPP")
      ),
    },
    globalEnv: {
      hasDB: !!globalEnv.DB,
      hasBucket: !!globalEnv.PRODUCTS_BUCKET,
    },
    requestContext: {
      env: requestContextEnv,
      error: requestContextError,
    },
    timestamp: new Date().toISOString(),
  });
}
