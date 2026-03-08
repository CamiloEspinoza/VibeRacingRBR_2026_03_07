import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "The AI Pulse <onboarding@resend.dev>";

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
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
            <td style="background-color: #0a0a0a; padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-style: italic; font-weight: 400; letter-spacing: -0.5px;">
                The AI Pulse
              </h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.5); font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase;">
                Tu dosis de innovación y tecnología
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
              <a href="${unsubscribeUrl}" style="color: #f97316; font-size: 13px; text-decoration: underline;">
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

export function buildVerificationEmailTemplate(verifyUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verifica tu email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 640px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.07);">
          <tr>
            <td style="background-color: #0a0a0a; padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-style: italic; font-weight: 400;">The AI Pulse</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px; text-align: center;">
              <h2 style="margin: 0 0 16px; font-size: 22px; color: #111827; font-weight: 600;">Verifica tu email</h2>
              <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 32px;">
                Haz clic en el botón de abajo para verificar tu email y comenzar a conectar tus redes sociales.
              </p>
              <a href="${verifyUrl}" style="display: inline-block; background-color: #f97316; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                Verificar email →
              </a>
              <p style="color: #9ca3af; font-size: 13px; margin: 24px 0 0;">
                Este enlace expira en 24 horas. Si no te suscribiste, ignora este mensaje.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
