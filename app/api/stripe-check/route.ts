import Stripe from "stripe";

// Diagnostic : indique si la clé Stripe est présente, son mode, et si Stripe l'accepte.
// N'affiche JAMAIS la clé. À supprimer une fois la boutique en service.
export const dynamic = "force-dynamic";

export async function GET() {
  const raw = process.env.STRIPE_SECRET_KEY;
  if (!raw) return Response.json({ keyFound: false, hint: "STRIPE_SECRET_KEY absente de cet environnement (vérifier le nom, l'environnement Production et refaire un Redeploy)" });
  const key = raw.trim();
  const mode = key.startsWith("sk_test_") ? "test" : key.startsWith("sk_live_") ? "live" : key.startsWith("rk_") ? "restricted" : key.startsWith("pk_") ? "PUBLIABLE (mauvaise clé : il faut la clé secrète sk_…)" : "inconnu";
  const spaces = raw !== key;
  try {
    const acct = await new Stripe(key).balance.retrieve();
    return Response.json({ keyFound: true, mode, extraSpaces: spaces, stripeAccepted: true, livemode: acct.livemode });
  } catch (e) {
    return Response.json({ keyFound: true, mode, extraSpaces: spaces, stripeAccepted: false, error: (e as { message?: string }).message ?? "erreur" });
  }
}
