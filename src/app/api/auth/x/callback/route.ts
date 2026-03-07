import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exchangeXCode } from "@/lib/x-twitter";
import { TwitterApi } from "twitter-api-v2";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!code || !state) {
    return NextResponse.redirect(`${appUrl}/dashboard?error=missing_params`);
  }

  try {
    const oauthState = await prisma.oAuthState.findUnique({ where: { state } });

    if (!oauthState || oauthState.provider !== "x" || !oauthState.codeVerifier) {
      return NextResponse.redirect(`${appUrl}/dashboard?error=invalid_state`);
    }

    const redirectUri = `${appUrl}/api/auth/x/callback`;
    const { accessToken, refreshToken, expiresIn } = await exchangeXCode(
      code,
      oauthState.codeVerifier,
      redirectUri
    );

    // Get user ID
    const client = new TwitterApi(accessToken);
    const me = await client.v2.me();

    await prisma.subscriber.update({
      where: { id: oauthState.userId },
      data: {
        xAccessToken: accessToken,
        xRefreshToken: refreshToken,
        xUserId: me.data.id,
        xTokenExpiry: new Date(Date.now() + expiresIn * 1000),
      },
    });

    // Clean up state
    await prisma.oAuthState.delete({ where: { state } });

    return NextResponse.redirect(`${appUrl}/dashboard?userId=${oauthState.userId}&x=connected`);
  } catch (error) {
    console.error("X OAuth error:", error);
    return NextResponse.redirect(`${appUrl}/dashboard?error=x_failed`);
  }
}
