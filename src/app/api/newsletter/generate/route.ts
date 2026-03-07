import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateNewsletterContent } from "@/lib/gemini";
import { newsletterConfig } from "@/lib/newsletter-config";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const generated = await generateNewsletterContent(newsletterConfig.topic);

    let imageUrl: string | undefined;

    // Upload image to Vercel Blob if generated
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
    });
  } catch (error) {
    console.error("Generate newsletter error:", error);
    return NextResponse.json(
      { message: "Error al generar newsletter.", error: String(error) },
      { status: 500 }
    );
  }
}
