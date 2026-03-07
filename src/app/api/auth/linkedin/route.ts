import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLinkedInAuthUrl } from "@/lib/linkedin";
import { randomUUID } from "crypto";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ message: "userId requerido" }, { status: 400 });
  }

  const state = randomUUID();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const redirectUri = `${appUrl}/api/auth/linkedin/callback`;

  await prisma.oAuthState.create({
    data: { state, provider: "linkedin", userId },
  });

  const authUrl = getLinkedInAuthUrl(state, redirectUri);
  return NextResponse.redirect(authUrl);
}
