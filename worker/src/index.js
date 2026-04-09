/**
 * Cloudflare Worker — Contact form handler for Contenedores B
 *
 * Receives POST from the contact form, validates input, and sends an email
 * via Mailgun. Configured via secrets:
 *   - MAILGUN_API_KEY     (wrangler secret put MAILGUN_API_KEY)
 *   - MAILGUN_DOMAIN      (e.g. mg.contenedoresb.com)
 *   - MAILGUN_FROM        (e.g. "Contenedores B <noreply@mg.contenedoresb.com>")
 *   - MAIL_TO             (e.g. Marlenac3189@gmail.com)
 *   - ALLOWED_ORIGIN      (e.g. https://contenedoresb.com)
 */

const MAX_NAME = 120;
const MAX_PHONE = 40;
const MAX_MESSAGE = 2000;

export default {
  async fetch(request, env) {
    const origin = env.ALLOWED_ORIGIN || "https://contenedoresb.com";

    const corsHeaders = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "method_not_allowed" }, 405, corsHeaders);
    }

    let data;
    try {
      const ct = request.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        data = await request.json();
      } else {
        const form = await request.formData();
        data = Object.fromEntries(form);
      }
    } catch {
      return json({ ok: false, error: "invalid_body" }, 400, corsHeaders);
    }

    // Honeypot — bots fill hidden fields, real users don't
    if (data.website && String(data.website).trim() !== "") {
      // Pretend success so bots don't retry
      return json({ ok: true }, 200, corsHeaders);
    }

    const name = sanitize(data.name, MAX_NAME);
    const phone = sanitize(data.phone, MAX_PHONE);
    const message = sanitize(data.message, MAX_MESSAGE);

    if (!name || !phone || !message) {
      return json({ ok: false, error: "missing_fields" }, 400, corsHeaders);
    }

    const subject = `Nuevo contacto desde contenedoresb.com — ${name}`;
    const text = [
      `Nombre: ${name}`,
      `Teléfono: ${phone}`,
      ``,
      `Mensaje:`,
      message,
      ``,
      `---`,
      `Enviado desde el formulario de contacto de contenedoresb.com`,
    ].join("\n");

    const html = `
      <h2 style="font-family:sans-serif;color:#1B3A5C;">Nuevo contacto desde contenedoresb.com</h2>
      <table style="font-family:sans-serif;border-collapse:collapse;">
        <tr><td style="padding:6px 12px;color:#666;">Nombre</td><td style="padding:6px 12px;"><strong>${escapeHtml(name)}</strong></td></tr>
        <tr><td style="padding:6px 12px;color:#666;">Teléfono</td><td style="padding:6px 12px;"><a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></td></tr>
      </table>
      <h3 style="font-family:sans-serif;color:#1B3A5C;">Mensaje</h3>
      <p style="font-family:sans-serif;white-space:pre-wrap;">${escapeHtml(message)}</p>
      <hr/>
      <p style="font-family:sans-serif;color:#999;font-size:12px;">Enviado desde el formulario de contacto de contenedoresb.com</p>
    `;

    const body = new URLSearchParams();
    body.append("from", env.MAILGUN_FROM);
    body.append("to", env.MAIL_TO);
    body.append("subject", subject);
    body.append("text", text);
    body.append("html", html);
    body.append("h:Reply-To", `${name} <noreply@${env.MAILGUN_DOMAIN}>`);

    const auth = btoa(`api:${env.MAILGUN_API_KEY}`);
    const mgRes = await fetch(
      `https://api.mailgun.net/v3/${env.MAILGUN_DOMAIN}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      }
    );

    if (!mgRes.ok) {
      const errText = await mgRes.text();
      console.error("Mailgun error:", mgRes.status, errText);
      return json({ ok: false, error: "send_failed" }, 502, corsHeaders);
    }

    return json({ ok: true }, 200, corsHeaders);
  },
};

function sanitize(value, max) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}
