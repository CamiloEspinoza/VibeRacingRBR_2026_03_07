import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const subscriber = await prisma.subscriber.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        linkedinUserId: true,
        xUserId: true,
      },
    });

    if (!subscriber) {
      return NextResponse.json(
        { message: "Subscriber no encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: subscriber.id,
      email: subscriber.email,
      emailVerified: subscriber.emailVerified,
      linkedinConnected: !!subscriber.linkedinUserId,
      xConnected: !!subscriber.xUserId,
    });
  } catch (error) {
    console.error("Get subscriber error:", error);
    return NextResponse.json(
      { message: "Error interno." },
      { status: 500 }
    );
  }
}
