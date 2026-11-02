import Stripe from "stripe";

export type Fulfillment = "new" | "ready" | "shipped" | "done";

export type Order = {
  id: string; // checkout session id
  paymentIntent: string;
  created: number;
  email: string;
  name: string;
  phone: string;
  delivery: string; // pickup | spain | europe
  preorder: boolean;
  lang: string;
  total: number;
  items: { name: string; qty: number; amount: number }[];
  address: string;
  status: Fulfillment;
  tracking: string;
};

export type Member = { created: number; name: string; email: string; phone: string; year: string };
export type EarlyBird = { created: number; event: string; email: string; name: string };

export function stripe() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  return key ? new Stripe(key) : null;
}

function fmtAddress(a?: Stripe.Address | null) {
  if (!a) return "";
  return [a.line1, a.line2, [a.postal_code, a.city].filter(Boolean).join(" "), a.state, a.country].filter(Boolean).join(", ");
}

// Toutes les sessions payées récentes, triées en 3 catégories.
export async function loadAll() {
  const s = stripe();
  if (!s) return null;
  const sessions = await s.checkout.sessions.list({ limit: 100, status: "complete", expand: ["data.payment_intent"] });
  const orders: Order[] = [];
  const members: Member[] = [];
  const earlybirds: EarlyBird[] = [];

  await Promise.all(
    sessions.data.map(async (cs) => {
      if (cs.payment_status !== "paid") return;
      const pi = cs.payment_intent as Stripe.PaymentIntent | null;
      const md = cs.metadata ?? {};
      const email = cs.customer_details?.email ?? "";
      const name = cs.customer_details?.name ?? "";
      const phone = cs.customer_details?.phone ?? "";

      if (md.type === "membership") {
        const full = cs.custom_fields?.find((f) => f.key === "full_name")?.text?.value;
        members.push({ created: cs.created, name: full || name, email, phone, year: md.year ?? "" });
        return;
      }
      if (md.type === "earlybird") {
        earlybirds.push({ created: cs.created, event: md.event ?? "", email: md.member_email ?? email, name });
        return;
      }
      if (!md.delivery || !pi) return;

      const li = await s.checkout.sessions.listLineItems(cs.id, { limit: 50 });
      const ship = cs.collected_information?.shipping_details;
      orders.push({
        id: cs.id,
        paymentIntent: pi.id,
        created: cs.created,
        email,
        name: ship?.name || name,
        phone,
        delivery: md.delivery,
        preorder: md.preorder === "yes",
        lang: md.lang ?? "es",
        total: cs.amount_total ?? 0,
        items: li.data.map((l) => ({ name: l.description ?? "", qty: l.quantity ?? 1, amount: l.amount_total })),
        address: fmtAddress(ship?.address),
        status: (pi.metadata?.fulfillment as Fulfillment) || "new",
        tracking: pi.metadata?.tracking ?? "",
      });
    })
  );

  const byDate = (a: { created: number }, b: { created: number }) => b.created - a.created;
  return { orders: orders.sort(byDate), members: members.sort(byDate), earlybirds: earlybirds.sort(byDate) };
}
