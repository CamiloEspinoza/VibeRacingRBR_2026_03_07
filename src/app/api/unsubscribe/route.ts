import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { message: "Email requerido." },
      { status: 400 }
    );
  }

  try {
    const subscriber = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (!subscriber) {
      return NextResponse.json(
        { message: "Email no encontrado." },
        { status: 404 }
      );
    }

    await prisma.subscriber.update({
      where: { email },
      data: { status: "UNSUBSCRIBED" },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(`${appUrl}/unsubscribe?success=true`);
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.json(
      { message: "Error al cancelar suscripcion." },
      { status: 500 }
    );
  }
}
