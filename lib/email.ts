// Envoi d'e-mails via Resend (https://resend.com). Sans RESEND_API_KEY, rien n'est envoyé.
type Lang = "es" | "ca" | "en";

const T: Record<Lang, Record<string, string>> = {
  es: {
    readySubject: "Tu pedido está listo",
    readyIntro: "¡Buenas noticias! Tu pedido de L'Ombra del Coliseu está listo.",
    readyPickup: "Puedes recogerlo en nuestro próximo concierto. Presenta este e-mail o di tu nombre en el puesto de merch.",
    shippedSubject: "Tu pedido ha sido enviado",
    shippedIntro: "Tu pedido de L'Ombra del Coliseu está en camino.",
    tracking: "Número de seguimiento",
    items: "Tu pedido",
    bye: "Gracias por apoyar la escena underground.",
  },
  ca: {
    readySubject: "La teva comanda està llesta",
    readyIntro: "Bones notícies! La teva comanda de L'Ombra del Coliseu està llesta.",
    readyPickup: "Pots recollir-la al nostre proper concert. Mostra aquest e-mail o digues el teu nom a la parada de merch.",
    shippedSubject: "La teva comanda s'ha enviat",
    shippedIntro: "La teva comanda de L'Ombra del Coliseu és en camí.",
    tracking: "Número de seguiment",
    items: "La teva comanda",
    bye: "Gràcies per donar suport a l'escena underground.",
  },
  en: {
    readySubject: "Your order is ready",
    readyIntro: "Good news! Your L'Ombra del Coliseu order is ready.",
    readyPickup: "You can pick it up at our next concert. Show this e-mail or give your name at the merch stand.",
    shippedSubject: "Your order has been shipped",
    shippedIntro: "Your L'Ombra del Coliseu order is on its way.",
    tracking: "Tracking number",
    items: "Your order",
    bye: "Thank you for supporting the underground scene.",
  },
};

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export function statusEmail(kind: "ready" | "shipped", langIn: string, items: string[], tracking?: string) {
  const lang: Lang = langIn === "ca" || langIn === "en" ? langIn : "es";
  const t = T[lang];
  const subject = `${kind === "ready" ? t.readySubject : t.shippedSubject} — L'Ombra del Coliseu`;
  const lines = [
    kind === "ready" ? t.readyIntro : t.shippedIntro,
    kind === "ready" ? t.readyPickup : tracking ? `${t.tracking} : ${tracking}` : "",
  ].filter(Boolean);
  const html = `<div style="background:#070606;padding:32px 16px;font-family:Georgia,serif;color:#e8e0d4">
  <div style="max-width:520px;margin:0 auto;background:#120f0e;border:1px solid #2a211d;padding:28px">
    <p style="font-size:22px;margin:0 0 18px;letter-spacing:2px">L'OMBRA DEL COLISEU</p>
    ${lines.map((l) => `<p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;margin:0 0 12px">${esc(l)}</p>`).join("")}
    <p style="font-family:Arial,sans-serif;font-size:13px;color:#b89a6a;letter-spacing:2px;text-transform:uppercase;margin:22px 0 8px">${t.items}</p>
    <ul style="font-family:Arial,sans-serif;font-size:14px;line-height:1.7;margin:0;padding-left:18px">${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
    <p style="font-family:Arial,sans-serif;font-size:14px;color:#8d8279;margin:24px 0 0">${t.bye}</p>
  </div></div>`;
  const text = [...lines, "", `${t.items}:`, ...items.map((i) => `- ${i}`), "", t.bye].join("\n");
  return { subject, html, text };
}

export async function sendEmail(to: string, msg: { subject: string; html: string; text: string }) {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key || !to) return { sent: false, reason: "no_key" };
  const from = process.env.MAIL_FROM?.trim() || "L'Ombra del Coliseu <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject: msg.subject, html: msg.html, text: msg.text }),
  });
  if (!res.ok) {
    console.error("[email]", res.status, await res.text());
    return { sent: false, reason: "resend_error" };
  }
  return { sent: true };
}
