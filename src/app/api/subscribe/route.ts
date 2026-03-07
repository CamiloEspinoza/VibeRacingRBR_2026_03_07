import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";

const subscribeSchema = z.object({
  email: z.email(),
  frequency: z.enum(["DAILY", "WEEKLY"]).default("WEEKLY"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = subscribeSchema.parse(body);

    const existing = await prisma.subscriber.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      if (existing.status === "UNSUBSCRIBED") {
        await prisma.subscriber.update({
          where: { email: data.email },
          data: { status: "ACTIVE", frequency: data.frequency },
        });
        return NextResponse.json(
          { message: "Te has re-suscrito exitosamente." },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { message: "Este email ya esta suscrito." },
        { status: 409 }
      );
    }

    await prisma.subscriber.create({
      data: {
        email: data.email,
        frequency: data.frequency,
      },
    });

    return NextResponse.json(
      { message: "Suscripcion exitosa. Pronto recibiras tu primer newsletter." },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Email invalido." },
        { status: 400 }
      );
    }
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { message: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
