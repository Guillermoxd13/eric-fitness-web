import { Resend } from "resend";

// Lazy singleton — don't construct unless needed.
let client: Resend | null = null;
function getClient(): Resend | null {
  if (client) return client;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  client = new Resend(key);
  return client;
}

const FROM = process.env.RESEND_FROM_EMAIL || "Eric Fitness <onboarding@resend.dev>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://eric-fitness-web.vercel.app";

type SendResult = { sent: boolean; reason?: string; error?: string };

export async function sendWelcomeEmail({
  to,
  name,
}: {
  to: string;
  name?: string | null;
}): Promise<SendResult> {
  const resend = getClient();
  if (!resend) {
    return { sent: false, reason: "no-api-key" };
  }

  const greeting = name ? `${name.split(" ")[0]}` : "atleta";

  const html = welcomeHtml({ greeting });
  const text = welcomeText({ greeting });

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: [to],
      subject: "Bienvenido a Eric Fitness",
      html,
      text,
      replyTo: process.env.RESEND_REPLY_TO || "ericksonza9@gmail.com",
    });
    if (error) {
      return { sent: false, error: error.message };
    }
    return { sent: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown";
    return { sent: false, error: message };
  }
}

function welcomeText({ greeting }: { greeting: string }) {
  return [
    `Hola ${greeting},`,
    "",
    "Bienvenido a Eric Fitness — el método completo de Erickson Zambrano.",
    "",
    "Ya puedes entrar al panel y empezar con los entrenamientos gratuitos:",
    `${SITE_URL}/dashboard`,
    "",
    "Cuando quieras dar el siguiente paso, los planes Premium están aquí:",
    `${SITE_URL}/pricing`,
    "",
    "— Erickson · Eric Fitness",
    "",
    `Si no fuiste tú quien creó esta cuenta, ignora este email.`,
  ].join("\n");
}

function welcomeHtml({ greeting }: { greeting: string }) {
  // Inline styles only — most email clients strip <style> tags. Dark theme.
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Bienvenido a Eric Fitness</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0b;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#0a0a0b;padding:32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background:#111113;border:1px solid rgba(255,255,255,0.08);border-radius:20px;overflow:hidden;">
          <tr>
            <td style="padding:40px 40px 24px;">
              <div style="font-size:22px;font-weight:800;letter-spacing:-0.02em;line-height:1;color:#ffffff;">
                ERIC <span style="color:#ef4444;">FITNESS</span>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 16px;">
              <div style="font-size:11px;color:#ef4444;letter-spacing:0.18em;text-transform:uppercase;font-family:'JetBrains Mono',ui-monospace,monospace;">
                — Bienvenido
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 24px;">
              <h1 style="margin:0;font-size:36px;line-height:1.05;letter-spacing:-0.03em;font-weight:800;color:#ffffff;">
                Hola, ${escapeHtml(greeting)}.<br>
                <span style="color:#ef4444;font-style:italic;">Empieza fuerte.</span>
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 24px;color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;">
              Tu cuenta está activa. Ya puedes entrar al panel y reproducir los vídeos gratuitos.
              Cuando quieras dar el siguiente paso, los planes Premium incluyen el catálogo completo
              + la llamada grupal mensual conmigo.
            </td>
          </tr>
          <tr>
            <td style="padding:8px 40px 32px;" align="left">
              <a href="${SITE_URL}/dashboard"
                 style="display:inline-block;background:#ef4444;color:#ffffff;text-decoration:none;
                        padding:14px 22px;border-radius:12px;font-weight:600;font-size:14px;">
                Ir al panel →
              </a>
              <a href="${SITE_URL}/pricing"
                 style="display:inline-block;margin-left:8px;background:transparent;color:#ffffff;
                        text-decoration:none;padding:14px 22px;border-radius:12px;font-weight:600;
                        font-size:14px;border:1px solid rgba(255,255,255,0.14);">
                Ver planes
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.08);
                       color:rgba(255,255,255,0.4);font-size:12px;line-height:1.5;
                       font-family:'JetBrains Mono',ui-monospace,monospace;letter-spacing:0.06em;">
              ERICKSON ZAMBRANO · MÉTODO COMPLETO<br>
              <span style="text-transform:uppercase;">Si no fuiste tú quien creó esta cuenta, ignora este email.</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
