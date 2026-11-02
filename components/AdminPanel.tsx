"use client";
import { useState } from "react";
import type { EarlyBird, Fulfillment, Member, Order } from "@/lib/orders";

const STATUS: Record<Fulfillment, string> = {
  new: "Nuevo",
  ready: "Listo para recoger",
  shipped: "Enviado",
  done: "Entregado",
};
const DELIVERY: Record<string, string> = { pickup: "Recogida en concierto", spain: "Envío España", europe: "Envío Europa" };

const money = (c: number) => (c / 100).toLocaleString("es-ES", { style: "currency", currency: "EUR" });
const date = (t: number) =>
  new Date(t * 1000).toLocaleString("es-ES", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });

function OrderCard({ o }: { o: Order }) {
  const [status, setStatus] = useState<Fulfillment>(o.status);
  const [tracking, setTracking] = useState(o.tracking);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function update(next: Fulfillment) {
    if (next === "shipped" && !tracking && !confirm("¿Marcar como enviado sin número de seguimiento?")) return;
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session: o.id, status: next, tracking }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setStatus(next);
      if (next === "ready" || next === "shipped")
        setMsg(d.email?.sent ? "✓ E-mail enviado al cliente" : "⚠ Estado guardado, pero el e-mail NO se envió (falta configurar Resend)");
      else setMsg("✓ Guardado");
    } catch {
      setMsg("Error, inténtalo de nuevo");
    }
    setBusy(false);
  }

  const ship = o.delivery !== "pickup";
  return (
    <article className={`admin-order st-${status}`}>
      <div className="admin-order-top">
        <span className={`admin-badge st-${status}`}>{STATUS[status]}</span>
        {o.preorder && <span className="admin-badge pre">Pre-pedido</span>}
        <span className="admin-date">{date(o.created)}</span>
        <strong className="admin-total">{money(o.total)}</strong>
      </div>
      <ul className="admin-items">
        {o.items.map((i, k) => (
          <li key={k}>
            {i.qty} × {i.name.replace("[PRE-ORDER] ", "")}
          </li>
        ))}
      </ul>
      <p className="admin-client">
        <strong>{o.name || "—"}</strong> · <a href={`mailto:${o.email}`}>{o.email}</a>
        {o.phone && (
          <>
            {" "}· <a href={`tel:${o.phone}`}>{o.phone}</a>
          </>
        )}
      </p>
      <p className="admin-delivery">
        {DELIVERY[o.delivery] ?? o.delivery}
        {ship && o.address && <> — {o.address}</>}
      </p>
      <div className="admin-actions">
        {ship ? (
          <>
            <input placeholder="Nº de seguimiento" value={tracking} onChange={(e) => setTracking(e.target.value)} />
            <button className="btn" disabled={busy} onClick={() => update("shipped")}>Marcar enviado + avisar</button>
          </>
        ) : (
          <button className="btn" disabled={busy} onClick={() => update("ready")}>Listo para recoger + avisar</button>
        )}
        <button className="btn btn-ghost" disabled={busy} onClick={() => update("done")}>Entregado</button>
        {status !== "new" && (
          <button className="admin-link" disabled={busy} onClick={() => update("new")}>Volver a «Nuevo»</button>
        )}
      </div>
      {msg && <p className="admin-msg">{msg}</p>}
    </article>
  );
}

export default function AdminPanel({ orders, members, earlybirds }: { orders: Order[]; members: Member[]; earlybirds: EarlyBird[] }) {
  const [tab, setTab] = useState<"orders" | "members" | "eb">("orders");
  const [filter, setFilter] = useState<"open" | "all">("open");
  const shown = orders.filter((o) => filter === "all" || o.status !== "done");
  const pending = orders.filter((o) => o.status === "new").length;

  return (
    <>
      <nav className="admin-tabs">
        <button className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}>
          Pedidos {pending > 0 && <span className="admin-count">{pending}</span>}
        </button>
        <button className={tab === "members" ? "active" : ""} onClick={() => setTab("members")}>
          Socios ({members.length})
        </button>
        <button className={tab === "eb" ? "active" : ""} onClick={() => setTab("eb")}>
          Early bird ({earlybirds.length})
        </button>
      </nav>

      {tab === "orders" && (
        <section>
          <div className="admin-filter">
            <label>
              <input type="radio" checked={filter === "open"} onChange={() => setFilter("open")} /> Por gestionar
            </label>
            <label>
              <input type="radio" checked={filter === "all"} onChange={() => setFilter("all")} /> Todos
            </label>
          </div>
          {shown.length === 0 ? <p className="admin-empty">No hay pedidos.</p> : shown.map((o) => <OrderCard key={o.id} o={o} />)}
        </section>
      )}

      {tab === "members" && (
        <section className="admin-table">
          {members.length === 0 ? (
            <p className="admin-empty">Todavía no hay socios.</p>
          ) : (
            <table>
              <thead>
                <tr><th>Fecha</th><th>Nombre</th><th>E-mail</th><th>Teléfono</th><th>Año</th></tr>
              </thead>
              <tbody>
                {members.map((m, i) => (
                  <tr key={i}><td>{date(m.created)}</td><td>{m.name}</td><td>{m.email}</td><td>{m.phone}</td><td>{m.year}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {tab === "eb" && (
        <section className="admin-table">
          {earlybirds.length === 0 ? (
            <p className="admin-empty">No hay entradas early bird.</p>
          ) : (
            <table>
              <thead>
                <tr><th>Fecha</th><th>Concierto</th><th>Nombre</th><th>E-mail</th></tr>
              </thead>
              <tbody>
                {earlybirds.map((e, i) => (
                  <tr key={i}><td>{date(e.created)}</td><td>{e.event}</td><td>{e.name}</td><td>{e.email}</td></tr>
                ))}
              </tbody>
            </table>
          )}
          <p className="admin-hint">Lista para la puerta: imprímela o enséñala desde el móvil.</p>
        </section>
      )}
    </>
  );
}
