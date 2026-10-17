import Stripe from "stripe";
import { membership } from "@/app/content";

// Cotisation annuelle : le montant est relu ici côté serveur, jamais depuis le navigateur.
export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return Response.json({ error: "shop_closed" }, { status: 503 });

  let lang = "";
  try {
    lang = String((await req.json()).lang ?? "");
  } catch {}
  const locale: "en" | "es" | "auto" = lang === "en" ? "en" : lang === "es" || lang === "ca" ? "es" : "auto";
  const label = lang === "en" ? "Full name" : lang === "ca" ? "Nom complet" : "Nombre completo";

  const year = new Date().getFullYear();
  const origin = req.headers.get("origin") ?? new URL(req.url).origin;
  const stripe = new Stripe(key);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale,
      customer_creation: "always",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: membership.price,
            product_data: { name: `L'Ombra del Coliseu — Membership / Quota de soci ${year}` },
          },
        },
      ],
      custom_fields: [{ key: "full_name", label: { type: "custom", custom: label }, type: "text" }],
      phone_number_collection: { enabled: true },
      success_url: `${origin}/merci?type=member&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#horde`,
      metadata: { type: "membership", year: String(year) },
      payment_intent_data: { description: `MEMBERSHIP ${year}`, metadata: { type: "membership", year: String(year) } },
    });
    return Response.json({ url: session.url });
  } catch (err) {
    console.error("[membership]", err);
    return Response.json({ error: "stripe_error" }, { status: 502 });
  }
}
