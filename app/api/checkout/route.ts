import Stripe from "stripe";
import { merch, shipping, europeCountries } from "@/app/content";

// Les prix sont TOUJOURS relus ici, côté serveur, depuis app/content.ts :
// on ne fait jamais confiance au prix envoyé par le navigateur.

type CartLine = { id: string; size?: string; qty: number };
type Delivery = "pickup" | "spain" | "europe";

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return Response.json({ error: "shop_closed" }, { status: 503 });
  }

  let body: { items?: CartLine[]; delivery?: Delivery; lang?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const items = Array.isArray(body.items) ? body.items.slice(0, 20) : [];
  const delivery: Delivery = ["pickup", "spain", "europe"].includes(body.delivery as string)
    ? (body.delivery as Delivery)
    : "pickup";
  // Stripe Checkout ne propose pas le catalan : on bascule sur l'espagnol.
  const locale: "en" | "es" | "auto" = body.lang === "en" ? "en" : body.lang === "es" || body.lang === "ca" ? "es" : "auto";

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const summary: string[] = [];
  let hasPreorder = false;

  for (const line of items) {
    const product = merch.find((p) => p.id === line.id);
    const qty = Math.floor(Number(line.qty));
    if (!product || product.status === "soldout" || !(qty >= 1 && qty <= 10)) {
      return Response.json({ error: "invalid_item" }, { status: 400 });
    }
    if (product.sizes?.length && !product.sizes.includes(line.size ?? "")) {
      return Response.json({ error: "invalid_size" }, { status: 400 });
    }
    const isPre = product.status === "preorder";
    hasPreorder ||= isPre;
    const name = `${isPre ? "[PRE-ORDER] " : ""}${product.name}${line.size ? ` — ${line.size}` : ""}`;
    summary.push(`${qty}x ${product.id}${line.size ? `/${line.size}` : ""}${isPre ? " (pre)" : ""}`);
    lineItems.push({
      quantity: qty,
      price_data: {
        currency: "eur",
        unit_amount: product.price,
        product_data: { name },
      },
    });
  }

  if (!lineItems.length) {
    return Response.json({ error: "empty_cart" }, { status: 400 });
  }

  const origin = req.headers.get("origin") ?? new URL(req.url).origin;
  const stripe = new Stripe(key);

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    line_items: lineItems,
    locale,
    phone_number_collection: { enabled: true },
    success_url: `${origin}/merci?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/#merch`,
    metadata: {
      delivery,
      preorder: hasPreorder ? "yes" : "no",
      items: summary.join(", ").slice(0, 490),
    },
    payment_intent_data: {
      description: `Ombra Harvest — ${delivery === "pickup" ? "PICKUP AT CONCERT" : "SHIPPING " + delivery.toUpperCase()}${hasPreorder ? " — PRE-ORDER" : ""}`,
    },
  };

  if (delivery === "spain" || delivery === "europe") {
    params.shipping_address_collection = {
      allowed_countries: delivery === "spain" ? ["ES"] : [...europeCountries],
    };
    params.shipping_options = [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          display_name: delivery === "spain" ? "Envío España" : "Shipping Europe",
          fixed_amount: { amount: shipping[delivery], currency: "eur" },
        },
      },
    ];
  } else {
    params.custom_text = {
      submit: { message: "Recogida en un concierto de L'Ombra del Coliseu / Pick-up at one of our concerts." },
    };
  }

  try {
    const session = await stripe.checkout.sessions.create(params);
    return Response.json({ url: session.url });
  } catch (err) {
    console.error("[checkout]", err);
    return Response.json({ error: "stripe_error" }, { status: 502 });
  }
}
