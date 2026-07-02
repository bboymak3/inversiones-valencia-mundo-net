import { NextResponse } from "next/server";

// Necesario para Cloudflare Pages
export const runtime = "edge";

export async function GET() {
  return NextResponse.json({
    message: "Inversiones Valencia Mundo Net API",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
