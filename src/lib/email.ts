import Zavudev from "@zavudev/sdk";

const client = new Zavudev({
  apiKey: process.env.ZAVUDEV_API_KEY!,
});

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    const response = await client.messages.send({
      to,
      text: subject,
      // If Zavu supports email channel, we pass html content
      // For now using the messages API
    });
    return { success: true, data: response };
  } catch (error) {
    console.error("Failed to send email via Zavu:", error);
    return { success: false, error };
  }
}

export function buildEmailTemplate({
  title,
  content,
  imageUrl,
  unsubscribeUrl,
}: {
  title: string;
  content: string;
  imageUrl?: string | null;
  unsubscribeUrl: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 640px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.07);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">
                The AI Pulse
              </h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">
                Tu dosis de innovacion y tecnologia
              </p>
            </td>
          </tr>
          ${
            imageUrl
              ? `
          <!-- Hero Image -->
          <tr>
            <td style="padding: 0;">
              <img src="${imageUrl}" alt="${title}" style="width: 100%; height: auto; display: block;" />
            </td>
          </tr>`
              : ""
          }
          <!-- Title -->
          <tr>
            <td style="padding: 32px 40px 16px;">
              <h2 style="margin: 0; font-size: 24px; font-weight: 700; color: #1a1a2e; line-height: 1.3;">
                ${title}
              </h2>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px;">
                Recibiste este email porque te suscribiste a The AI Pulse.
              </p>
              <a href="${unsubscribeUrl}" style="color: #7c3aed; font-size: 13px; text-decoration: underline;">
                Cancelar suscripcion
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
