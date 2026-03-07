import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, buildVerificationEmailTemplate } from "@/lib/email";
import { z } from "zod/v4";
import { randomUUID } from "crypto";

const subscribeSchema = z.object({
  email: z.email(),
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
        // Re-subscribe: send new verification
        const verificationToken = randomUUID();
        await prisma.subscriber.update({
          where: { email: data.email },
          data: {
            status: "PENDING_VERIFICATION",
            verificationToken,
            verificationExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        });
        await sendVerificationEmail(data.email, verificationToken);
        return NextResponse.json(
          { message: "Te enviamos un email de verificacion." },
          { status: 200 }
        );
      }
      if (existing.emailVerified) {
        return NextResponse.json(
          { message: "Este email ya esta suscrito.", userId: existing.id },
          { status: 409 }
        );
      }
      // Resend verification
      const verificationToken = randomUUID();
      await prisma.subscriber.update({
        where: { email: data.email },
        data: {
          verificationToken,
          verificationExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });
      await sendVerificationEmail(data.email, verificationToken);
      return NextResponse.json(
        { message: "Te reenviamos el email de verificacion." },
        { status: 200 }
      );
    }

    const verificationToken = randomUUID();
    const subscriber = await prisma.subscriber.create({
      data: {
        email: data.email,
        status: "PENDING_VERIFICATION",
        verificationToken,
        verificationExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    await sendVerificationEmail(data.email, verificationToken);

    return NextResponse.json(
      {
        message: "Te enviamos un email de verificacion. Revisa tu bandeja de entrada.",
        userId: subscriber.id,
      },
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

async function sendVerificationEmail(email: string, token: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const verifyUrl = `${appUrl}/api/verify?token=${token}`;
  const html = buildVerificationEmailTemplate(verifyUrl);

  await sendEmail({
    to: email,
    subject: "Verifica tu email - The AI Pulse",
    html,
  });
}
