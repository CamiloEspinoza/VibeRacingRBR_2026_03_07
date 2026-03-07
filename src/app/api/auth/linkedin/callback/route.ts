import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exchangeLinkedInCode, getLinkedInProfile } from "@/lib/linkedin";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!code || !state) {
    return NextResponse.redirect(`${appUrl}/dashboard?error=missing_params`);
  }

  try {
    const oauthState = await prisma.oAuthState.findUnique({ where: { state } });

    if (!oauthState || oauthState.provider !== "linkedin") {
      return NextResponse.redirect(`${appUrl}/dashboard?error=invalid_state`);
    }

    const redirectUri = `${appUrl}/api/auth/linkedin/callback`;
    const { accessToken, expiresIn } = await exchangeLinkedInCode(code, redirectUri);
    const profile = await getLinkedInProfile(accessToken);

    await prisma.subscriber.update({
      where: { id: oauthState.userId },
      data: {
        linkedinAccessToken: accessToken,
        linkedinUserId: profile.id,
        linkedinTokenExpiry: new Date(Date.now() + expiresIn * 1000),
      },
    });

    // Clean up state
    await prisma.oAuthState.delete({ where: { state } });

    return NextResponse.redirect(`${appUrl}/dashboard?userId=${oauthState.userId}&linkedin=connected`);
  } catch (error) {
    console.error("LinkedIn OAuth error:", error);
    return NextResponse.redirect(`${appUrl}/dashboard?error=linkedin_failed`);
  }
}
