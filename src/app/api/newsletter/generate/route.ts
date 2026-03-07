import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  generateNewsletterFromPosts,
  generateNewsletterContent,
  type SocialPost,
} from "@/lib/gemini";
import { newsletterConfig } from "@/lib/newsletter-config";
import { getLinkedInPosts } from "@/lib/linkedin";
import { getXPosts, refreshXToken } from "@/lib/x-twitter";
import { put } from "@vercel/blob";

export const maxDuration = 60; // Allow up to 60s for AI generation

export async function POST(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Collect posts from all active subscribers with connected accounts
    const subscribers = await prisma.subscriber.findMany({
      where: {
        status: "ACTIVE",
        emailVerified: true,
        OR: [
          { linkedinAccessToken: { not: null } },
          { xAccessToken: { not: null } },
        ],
      },
    });

    const allPosts: SocialPost[] = [];

    for (const sub of subscribers) {
      // Fetch LinkedIn posts
      if (sub.linkedinAccessToken && sub.linkedinUserId) {
        try {
          const posts = await getLinkedInPosts(
            sub.linkedinAccessToken,
            sub.linkedinUserId
          );
          allPosts.push(
            ...posts.map((p) => ({
              platform: "linkedin" as const,
              text: p.text,
              createdAt: new Date(p.createdAt).toISOString(),
              authorId: p.author,
            }))
          );
        } catch (error) {
          console.error(`LinkedIn fetch failed for ${sub.id}:`, error);
        }
      }

      // Fetch X posts (refresh token if needed)
      if (sub.xAccessToken && sub.xUserId) {
        let accessToken = sub.xAccessToken;

        // Refresh token if expired
        if (sub.xTokenExpiry && sub.xTokenExpiry < new Date() && sub.xRefreshToken) {
          try {
            const refreshed = await refreshXToken(sub.xRefreshToken);
            accessToken = refreshed.accessToken;
            await prisma.subscriber.update({
              where: { id: sub.id },
              data: {
                xAccessToken: refreshed.accessToken,
                xRefreshToken: refreshed.refreshToken,
                xTokenExpiry: new Date(Date.now() + refreshed.expiresIn * 1000),
              },
            });
          } catch (error) {
            console.error(`X token refresh failed for ${sub.id}:`, error);
          }
        }

        try {
          const tweets = await getXPosts(accessToken);
          allPosts.push(
            ...tweets.map((t) => ({
              platform: "x" as const,
              text: t.text,
              createdAt: t.createdAt,
              authorId: t.authorId,
            }))
          );
        } catch (error) {
          console.error(`X fetch failed for ${sub.id}:`, error);
        }
      }
    }

    // Generate newsletter from posts or fallback to topic-based
    const generated =
      allPosts.length > 0
        ? await generateNewsletterFromPosts(allPosts)
        : await generateNewsletterContent(newsletterConfig.topic);

    let imageUrl: string | undefined;

    if (generated.imageBase64 && generated.imageMimeType) {
      const buffer = Buffer.from(generated.imageBase64, "base64");
      const extension = generated.imageMimeType.split("/")[1] || "png";
      const filename = `newsletter-${Date.now()}.${extension}`;

      const blob = await put(filename, buffer, {
        access: "public",
        contentType: generated.imageMimeType,
      });
      imageUrl = blob.url;
    }

    const newsletter = await prisma.newsletter.create({
      data: {
        title: generated.title,
        summary: generated.summary,
        content: generated.contentHtml,
        imageUrl,
        status: "PUBLISHED",
      },
    });

    return NextResponse.json({
      message: "Newsletter generado exitosamente.",
      id: newsletter.id,
      postsUsed: allPosts.length,
    });
  } catch (error) {
    console.error("Generate newsletter error:", error);
    return NextResponse.json(
      { message: "Error al generar newsletter.", error: String(error) },
      { status: 500 }
    );
  }
}
