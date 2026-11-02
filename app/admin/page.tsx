import type { Metadata } from "next";
import { isAdmin } from "@/lib/admin";
import { loadAll } from "@/lib/orders";
import AdminPanel from "@/components/AdminPanel";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin · L'Ombra del Coliseu", robots: { index: false, follow: false } };

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  if (!process.env.ADMIN_PASSWORD?.trim()) {
    return (
      <main className="admin admin-login">
        <h1>Admin</h1>
        <p>Falta la variable ADMIN_PASSWORD en Vercel.</p>
      </main>
    );
  }

  if (!(await isAdmin())) {
    return (
      <main className="admin admin-login">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-sm.webp" alt="" width={64} height={71} />
        <h1>Admin</h1>
        <form method="post" action="/api/admin/login">
          <input type="password" name="password" placeholder="Contraseña" autoComplete="current-password" required />
          <button className="btn" type="submit">Entrar</button>
        </form>
        {error && <p className="admin-error">Contraseña incorrecta.</p>}
      </main>
    );
  }

  let data: Awaited<ReturnType<typeof loadAll>> = null;
  let failed = false;
  try {
    data = await loadAll();
  } catch (e) {
    console.error("[admin]", e);
    failed = true;
  }

  return (
    <main className="admin">
      <header className="admin-head">
        <h1>Admin · L&apos;Ombra</h1>
        <form method="post" action="/api/admin/logout">
          <button className="admin-link" type="submit">Salir</button>
        </form>
      </header>
      {!data ? (
        <p className="admin-error">{failed ? "Error al leer Stripe." : "Stripe no está configurado (STRIPE_SECRET_KEY)."}</p>
      ) : (
        <AdminPanel orders={data.orders} members={data.members} earlybirds={data.earlybirds} />
      )}
    </main>
  );
}
