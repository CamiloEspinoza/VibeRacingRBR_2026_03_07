import { GoogleGenAI } from "@google/genai";

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface GeneratedNewsletter {
  title: string;
  summary: string;
  contentHtml: string;
  imageBase64?: string;
  imageMimeType?: string;
}

export async function generateNewsletterContent(
  topic: string
): Promise<GeneratedNewsletter> {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const contentResponse = await genai.models.generateContent({
    model: "gemini-2.5-flash-preview-05-20",
    contents: `You are a world-class newsletter writer. Generate a newsletter edition for today (${today}).

Topic focus: ${topic}

Return a JSON object with this exact structure (no markdown code blocks, just raw JSON):
{
  "title": "A compelling, catchy title for today's edition",
  "summary": "A 1-2 sentence summary of what's in this edition",
  "sections": [
    {
      "heading": "Section heading",
      "content": "2-3 paragraphs of engaging, informative content with real insights. Use HTML formatting (<p>, <strong>, <em>, <ul>, <li>)."
    }
  ]
}

Generate 3-4 sections. Make the content informative, engaging, and valuable. Write in a professional but approachable tone. Include specific details, trends, and actionable insights. Content should be in Spanish.`,
    config: {
      responseMimeType: "application/json",
    },
  });

  const contentText = contentResponse.text ?? "";
  let parsed: {
    title: string;
    summary: string;
    sections: { heading: string; content: string }[];
  };

  try {
    parsed = JSON.parse(contentText);
  } catch {
    parsed = {
      title: `Newsletter del ${today}`,
      summary: "Edicion generada automaticamente",
      sections: [
        {
          heading: "Contenido del dia",
          content: `<p>${contentText}</p>`,
        },
      ],
    };
  }

  const contentHtml = buildNewsletterHtml(parsed);

  let imageBase64: string | undefined;
  let imageMimeType: string | undefined;

  try {
    const imageResponse = await genai.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: `Generate a modern, professional hero image for a tech newsletter titled "${parsed.title}". The image should be visually striking, use a modern color palette with purples and blues, and convey innovation and technology. Do NOT include any text in the image. Abstract tech/AI themed artwork.`,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    });

    if (imageResponse.candidates?.[0]?.content?.parts) {
      for (const part of imageResponse.candidates[0].content.parts) {
        if (part.inlineData) {
          imageBase64 = part.inlineData.data;
          imageMimeType = part.inlineData.mimeType;
          break;
        }
      }
    }
  } catch (error) {
    console.error("Image generation failed:", error);
  }

  return {
    title: parsed.title,
    summary: parsed.summary,
    contentHtml,
    imageBase64,
    imageMimeType,
  };
}

function buildNewsletterHtml(data: {
  title: string;
  summary: string;
  sections: { heading: string; content: string }[];
}): string {
  const sectionsHtml = data.sections
    .map(
      (section) => `
    <div style="margin-bottom: 32px;">
      <h2 style="font-size: 22px; font-weight: 700; color: #1a1a2e; margin-bottom: 12px; border-left: 4px solid #7c3aed; padding-left: 12px;">
        ${section.heading}
      </h2>
      <div style="color: #374151; line-height: 1.7; font-size: 16px;">
        ${section.content}
      </div>
    </div>`
    )
    .join("\n");

  return `
<div style="max-width: 640px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <div style="text-align: center; margin-bottom: 24px;">
    <p style="font-size: 14px; color: #6b7280; margin: 0;">${data.summary}</p>
  </div>
  ${sectionsHtml}
  <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 32px; text-align: center; color: #9ca3af; font-size: 13px;">
    <p>Este newsletter fue generado automaticamente por IA.</p>
  </div>
</div>`;
}
