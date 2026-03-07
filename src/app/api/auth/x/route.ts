import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createXAuthClient, getXAuthUrl } from "@/lib/x-twitter";
import { randomUUID } from "crypto";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ message: "userId requerido" }, { status: 400 });
  }

  const state = randomUUID();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const redirectUri = `${appUrl}/api/auth/x/callback`;

  const client = createXAuthClient();
  const { url, codeVerifier } = getXAuthUrl(client, redirectUri, state);

  await prisma.oAuthState.create({
    data: { state, provider: "x", userId, codeVerifier },
  });

  return NextResponse.redirect(url);
}
