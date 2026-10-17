import Stripe from "stripe";
import { events } from "@/app/content";

// Billets early bird réservés aux membres.
// Vérifications côté serveur, à chaque achat :
//   1. l'e-mail correspond à une adhésion payée il y a moins d'un an (Stripe) ;
//   2. ce membre n'a pas déjà son billet early bird pour ce concert ;
//   3. il reste des billets dans le quota et la vente n'est pas close.

const YEAR = 365 * 24 * 3600;
const EMAIL = /^[^\s@'"\\]+@[^\s@'"\\]+\.[^\s@'"\\]+$/;

function findEvent(slug: unknown) {
  const e = events.find((x) => x.slug === slug);
  if (!e?.earlyBird || e.status !== "upcoming") return null;
  return e as typeof e & { earlyBird: NonNullable<typeof e.earlyBird> };
}

const today = () => new Date().toISOString().slice(0, 10);

async function sold(stripe: Stripe, slug: string) {
  const res = await stripe.paymentIntents.search({
    query: `metadata['type']:'earlybird' AND metadata['event']:'${slug}' AND status:'succeeded'`,
    limit: 100,
  });
  return res.data.length;
}

async function isMember(stripe: Stripe, email: string) {
  const customers = await stripe.customers.search({ query: `email:'${email}'`, limit: 10 });
  const since = Math.floor(Date.now() / 1000) - YEAR;
  for (const c of customers.data) {
    const pis = await stripe.paymentIntents.search({
      query: `customer:'${c.id}' AND metadata['type']:'membership' AND status:'succeeded'`,
      limit: 10,
    });
    if (pis.data.some((pi) => pi.created >= since)) return true;
  }
  return false;
}

// GET /api/earlybird?slug=… → billets restants
export async function GET(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const e = findEvent(new URL(req.url).searchParams.get("slug"));
  if (!key || !e) return Response.json({ error: "unavailable" }, { status: 503 });
  try {
    const left = Math.max(0, e.earlyBird.quota - (await sold(new Stripe(key), e.slug)));
    return Response.json({ left, closed: today() > e.earlyBird.until });
  } catch {
    return Response.json({ error: "stripe_error" }, { status: 502 });
  }
}

// POST /api/earlybird { slug, email, lang } → URL de paiement Stripe
export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return Response.json({ error: "shop_closed" }, { status: 503 });

  let body: { slug?: string; email?: string; lang?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }
  const e = findEvent(body.slug);
  if (!e) return Response.json({ error: "closed" }, { status: 400 });
  if (today() > e.earlyBird.until || today() >= e.date) return Response.json({ error: "closed" }, { status: 400 });

  const email = String(body.email ?? "").trim().toLowerCase();
  if (!EMAIL.test(email) || email.length > 200) return Response.json({ error: "bad_email" }, { status: 400 });

  const lang = body.lang;
  const locale: "en" | "es" | "auto" = lang === "en" ? "en" : lang === "es" || lang === "ca" ? "es" : "auto";
  const stripe = new Stripe(key);

  try {
    if (!(await isMember(stripe, email))) return Response.json({ error: "not_member" }, { status: 403 });

    const already = await stripe.paymentIntents.search({
      query: `metadata['type']:'earlybird' AND metadata['event']:'${e.slug}' AND metadata['member_email']:'${email}' AND status:'succeeded'`,
      limit: 1,
    });
    if (already.data.length) return Response.json({ error: "already" }, { status: 409 });

    if ((await sold(stripe, e.slug)) >= e.earlyBird.quota) return Response.json({ error: "sold_out" }, { status: 409 });

    const origin = req.headers.get("origin") ?? new URL(req.url).origin;
    const meta = { type: "earlybird", event: e.slug, member_email: email };
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale,
      customer_email: email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: e.earlyBird.price,
            product_data: { name: `[EARLY BIRD — MEMBERS] ${e.title} · ${e.date} · ${e.venue}` },
          },
        },
      ],
      success_url: `${origin}/merci?type=earlybird&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#events`,
      metadata: meta,
      payment_intent_data: { description: `EARLY BIRD ${e.slug} — ${email}`, metadata: meta },
    });
    return Response.json({ url: session.url });
  } catch (err) {
    console.error("[earlybird]", err);
    return Response.json({ error: "stripe_error" }, { status: 502 });
  }
}
