import { GoogleGenAI } from "@google/genai";

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface SocialPost {
  platform: "linkedin" | "x";
  text: string;
  createdAt: string;
  authorId: string;
}

export interface GeneratedNewsletter {
  title: string;
  summary: string;
  contentHtml: string;
  imageBase64?: string;
  imageMimeType?: string;
}

export async function generateNewsletterFromPosts(
  posts: SocialPost[]
): Promise<GeneratedNewsletter> {
  const today = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? "matutina" : "vespertina";

  const linkedinPosts = posts.filter((p) => p.platform === "linkedin");
  const xPosts = posts.filter((p) => p.platform === "x");

  const postsContext = `
## Publicaciones de LinkedIn (${linkedinPosts.length} posts):
${linkedinPosts.map((p, i) => `${i + 1}. ${p.text}`).join("\n\n")}

## Publicaciones de X/Twitter (${xPosts.length} tweets):
${xPosts.map((p, i) => `${i + 1}. ${p.text}`).join("\n\n")}
`;

  const contentResponse = await genai.models.generateContent({
    model: "gemini-2.5-flash-preview-05-20",
    contents: `Eres un experto escritor de newsletters. Genera la edicion ${timeOfDay} del newsletter para hoy (${today}).

Tu tarea es tomar las siguientes publicaciones de redes sociales del usuario y crear un newsletter atractivo, bien estructurado y valioso basado en ese contenido.

${postsContext}

Instrucciones:
- Agrupa las publicaciones por temas similares
- Agrega contexto, analisis y valor editorial a cada publicacion
- Si hay publicaciones interesantes, destaca los puntos clave
- Crea titulares atractivos para cada seccion
- El tono debe ser profesional pero cercano
- Todo el contenido en espanol

Return a JSON object with this exact structure (no markdown code blocks, just raw JSON):
{
  "title": "Un titulo atractivo para esta edicion del newsletter",
  "summary": "1-2 oraciones resumiendo los temas principales",
  "sections": [
    {
      "heading": "Titulo de la seccion",
      "content": "Contenido en HTML (<p>, <strong>, <em>, <ul>, <li>). 2-3 parrafos por seccion."
    }
  ]
}

Generate 3-4 sections based on the posts content.`,
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
      title: `Newsletter ${timeOfDay} - ${today}`,
      summary: "Edicion generada automaticamente",
      sections: [
        {
          heading: "Resumen del dia",
          content: `<p>${contentText}</p>`,
        },
      ],
    };
  }

  const contentHtml = buildNewsletterHtml(parsed, linkedinPosts.length, xPosts.length);

  let imageBase64: string | undefined;
  let imageMimeType: string | undefined;

  try {
    const imageResponse = await genai.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: `Generate a modern, professional hero image for a social media digest newsletter titled "${parsed.title}". The image should be visually striking with a purple and blue gradient palette, combining elements of social media, networking, and digital communication. Abstract style, no text in the image.`,
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

// Fallback when no posts are available
export async function generateNewsletterContent(
  topic: string
): Promise<GeneratedNewsletter> {
  const today = new Date().toLocaleDateString("es-ES", {
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

Generate 3-4 sections. Content in Spanish.`,
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
      sections: [{ heading: "Contenido del dia", content: `<p>${contentText}</p>` }],
    };
  }

  const contentHtml = buildNewsletterHtml(parsed, 0, 0);

  let imageBase64: string | undefined;
  let imageMimeType: string | undefined;

  try {
    const imageResponse = await genai.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: `Generate a modern, professional hero image for a tech newsletter titled "${parsed.title}". Visually striking, purple and blue palette, innovation and technology theme. No text in the image. Abstract artwork.`,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: { aspectRatio: "16:9" },
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

  return { title: parsed.title, summary: parsed.summary, contentHtml, imageBase64, imageMimeType };
}

function buildNewsletterHtml(
  data: { title: string; summary: string; sections: { heading: string; content: string }[] },
  linkedinCount: number,
  xCount: number
): string {
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

  const sourceBadges =
    linkedinCount > 0 || xCount > 0
      ? `<div style="display: flex; gap: 8px; justify-content: center; margin-bottom: 16px;">
        ${linkedinCount > 0 ? `<span style="background: #0077b5; color: white; padding: 4px 12px; border-radius: 16px; font-size: 12px;">LinkedIn: ${linkedinCount} posts</span>` : ""}
        ${xCount > 0 ? `<span style="background: #1da1f2; color: white; padding: 4px 12px; border-radius: 16px; font-size: 12px;">X: ${xCount} tweets</span>` : ""}
      </div>`
      : "";

  return `
<div style="max-width: 640px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <div style="text-align: center; margin-bottom: 24px;">
    ${sourceBadges}
    <p style="font-size: 14px; color: #6b7280; margin: 0;">${data.summary}</p>
  </div>
  ${sectionsHtml}
  <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 32px; text-align: center; color: #9ca3af; font-size: 13px;">
    <p>Este newsletter fue generado automaticamente por IA a partir de tus publicaciones en redes sociales.</p>
  </div>
</div>`;
}
