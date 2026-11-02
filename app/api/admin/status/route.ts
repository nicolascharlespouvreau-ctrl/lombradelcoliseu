import { isAdmin } from "@/lib/admin";
import { stripe, type Fulfillment } from "@/lib/orders";
import { sendEmail, statusEmail } from "@/lib/email";

const STATUSES: Fulfillment[] = ["new", "ready", "shipped", "done"];

// Change le statut d'une commande (stocké dans les métadonnées du paiement Stripe)
// et prévient le client par e-mail quand la commande est prête ou expédiée.
export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "unauthorized" }, { status: 401 });
  const s = stripe();
  if (!s) return Response.json({ error: "no_stripe" }, { status: 503 });

  const body = (await req.json().catch(() => ({}))) as { session?: string; status?: string; tracking?: string; notify?: boolean };
  const status = body.status as Fulfillment;
  if (!body.session || !STATUSES.includes(status)) return Response.json({ error: "bad_request" }, { status: 400 });
  const tracking = String(body.tracking ?? "").trim().slice(0, 100);

  try {
    const cs = await s.checkout.sessions.retrieve(body.session, { expand: ["payment_intent"] });
    const pi = cs.payment_intent as { id: string } | null;
    if (!pi || !cs.metadata?.delivery) return Response.json({ error: "not_an_order" }, { status: 400 });

    await s.paymentIntents.update(pi.id, { metadata: { fulfillment: status, tracking } });

    let email: { sent: boolean; reason?: string } = { sent: false, reason: "not_needed" };
    if (body.notify !== false && (status === "ready" || status === "shipped")) {
      const li = await s.checkout.sessions.listLineItems(cs.id, { limit: 50 });
      const items = li.data.map((l) => `${l.quantity ?? 1} × ${l.description ?? ""}`);
      const msg = statusEmail(status, cs.metadata?.lang ?? "es", items, tracking);
      email = await sendEmail(cs.customer_details?.email ?? "", msg);
    }
    return Response.json({ ok: true, email });
  } catch (err) {
    console.error("[admin/status]", err);
    return Response.json({ error: "stripe_error" }, { status: 502 });
  }
}
