import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!token) {
    return NextResponse.redirect(`${appUrl}/verify?error=missing_token`);
  }

  try {
    const subscriber = await prisma.subscriber.findUnique({
      where: { verificationToken: token },
    });

    if (!subscriber) {
      return NextResponse.redirect(`${appUrl}/verify?error=invalid_token`);
    }

    if (subscriber.verificationExpiry && subscriber.verificationExpiry < new Date()) {
      return NextResponse.redirect(`${appUrl}/verify?error=expired_token`);
    }

    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        emailVerified: true,
        status: "ACTIVE",
        verificationToken: null,
        verificationExpiry: null,
      },
    });

    return NextResponse.redirect(`${appUrl}/dashboard?userId=${subscriber.id}&verified=true`);
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(`${appUrl}/verify?error=server_error`);
  }
}
