import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const newsletter = await prisma.newsletter.findFirst({
      where: {
        status: { in: ["PUBLISHED", "SENT"] },
      },
      orderBy: { generatedAt: "desc" },
    });

    if (!newsletter) {
      return NextResponse.json(null, { status: 204 });
    }

    return NextResponse.json(newsletter);
  } catch (error) {
    console.error("Get latest newsletter error:", error);
    return NextResponse.json(
      { message: "Error al obtener newsletter." },
      { status: 500 }
    );
  }
}
