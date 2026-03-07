import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, buildEmailTemplate } from "@/lib/email";

export async function POST(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get latest published newsletter that hasn't been sent
    const newsletter = await prisma.newsletter.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: { generatedAt: "desc" },
    });

    if (!newsletter) {
      return NextResponse.json(
        { message: "No hay newsletter pendiente de enviar." },
        { status: 404 }
      );
    }

    // Get all active verified subscribers
    const subscribers = await prisma.subscriber.findMany({
      where: {
        status: "ACTIVE",
        emailVerified: true,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    let sent = 0;
    let failed = 0;

    for (const subscriber of subscribers) {
      const unsubscribeUrl = `${appUrl}/api/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;

      const html = buildEmailTemplate({
        title: newsletter.title,
        content: newsletter.content,
        imageUrl: newsletter.imageUrl,
        unsubscribeUrl,
      });

      const result = await sendEmail({
        to: subscriber.email,
        subject: `The AI Pulse: ${newsletter.title}`,
        html,
      });

      if (result.success) {
        sent++;
      } else {
        failed++;
      }
    }

    // Mark newsletter as sent
    await prisma.newsletter.update({
      where: { id: newsletter.id },
      data: { status: "SENT", sentAt: new Date() },
    });

    return NextResponse.json({
      message: `Newsletter enviado. Exitosos: ${sent}, Fallidos: ${failed}`,
      sent,
      failed,
      total: subscribers.length,
    });
  } catch (error) {
    console.error("Send newsletter error:", error);
    return NextResponse.json(
      { message: "Error al enviar newsletter.", error: String(error) },
      { status: 500 }
    );
  }
}
