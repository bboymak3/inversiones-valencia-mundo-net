import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const DEFAULT_ADMIN_PASSWORD = "valencia2025";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    const env = (process as any).env || (globalThis as any).env || {};
    const adminPassword = env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;

    if (password === adminPassword) {
      const token = btoa(`${password}:${Date.now()}:${Math.random()}`);
      return NextResponse.json({
        success: true,
        token,
        message: "Autenticación exitosa",
      });
    }

    return NextResponse.json(
      { success: false, message: "Contraseña incorrecta" },
      { status: 401 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Error en el servidor" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Admin Auth endpoint",
    methods: ["POST"],
    hint: "POST { password: string } to authenticate",
  });
}
