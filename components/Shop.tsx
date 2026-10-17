"use client";
import { useEffect, useMemo, useState } from "react";
import { merch, shipping, formatPrice, type Lang, type Product } from "@/app/content";

type Dict = Record<string, string>;
type Line = { id: string; size?: string; qty: number };
type Delivery = "pickup" | "spain" | "europe";

const KEY = "ombra-cart";

function ProductCard({ p, t, onAdd }: { p: Product; t: Dict; onAdd: (p: Product, size?: string) => void }) {
  const [size, setSize] = useState<string>("");
  const [view, setView] = useState(p.image);
  const [error, setError] = useState(false);
  const sold = p.status === "soldout";
  const pre = p.status === "preorder";

  return (
    <article className="product">
      <div className={p.image ? "product-img photo" : "product-img"}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={view || "/logo.webp"} alt={p.image ? p.name : ""} loading="lazy" />
        {pre && <span className="ribbon">{t.preorder}</span>}
      </div>
      {p.gallery && p.gallery.length > 1 && (
        <div className="thumbs">
          {p.gallery.map((src, i) => (
            <button
              key={src}
              type="button"
              className={src === view ? "thumb active" : "thumb"}
              onClick={() => setView(src)}
              aria-label={`${p.name} ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
      <div className="product-info">
        <h3>{p.name}</h3>
        <p className="product-price">
          <span className={sold ? "price struck" : "price"}>{formatPrice(p.price)}</span>
          {sold && <span className="badge">{t.soldOut}</span>}
        </p>
        {pre && <p className="product-note">{t.preorderNote}</p>}

        {!sold && (
          <>
            {p.sizes?.length ? (
              <div className="sizes" role="radiogroup" aria-label={t.size}>
                {p.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={size === s}
                    className={size === s ? "size active" : "size"}
                    onClick={() => {
                      setSize(s);
                      setError(false);
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : null}
            {error && <p className="size-error">{t.chooseSize}</p>}
            <button
              className="btn full"
              onClick={() => {
                if (p.sizes?.length && !size) return setError(true);
                onAdd(p, size || undefined);
              }}
            >
              {pre ? `${t.preorderBtn} — ${formatPrice(p.price)}` : t.addToCart}
            </button>
          </>
        )}
      </div>
    </article>
  );
}

export default function Shop({ lang, t, limit }: { lang: Lang; t: Dict; limit?: number }) {
  const [cart, setCart] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);
  const [delivery, setDelivery] = useState<Delivery>("pickup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(saved)) setCart(saved.filter((l) => merch.some((p) => p.id === l.id && p.status !== "soldout")));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const count = cart.reduce((n, l) => n + l.qty, 0);
  const subtotal = useMemo(
    () => cart.reduce((sum, l) => sum + (merch.find((p) => p.id === l.id)?.price ?? 0) * l.qty, 0),
    [cart]
  );
  const shippingCost = delivery === "pickup" ? 0 : shipping[delivery];

  function add(p: Product, size?: string) {
    setCart((c) => {
      const i = c.findIndex((l) => l.id === p.id && l.size === size);
      if (i >= 0) return c.map((l, j) => (j === i ? { ...l, qty: Math.min(10, l.qty + 1) } : l));
      return [...c, { id: p.id, size, qty: 1 }];
    });
    setToast(true);
    setTimeout(() => setToast(false), 2200);
  }

  function setQty(i: number, qty: number) {
    setCart((c) => (qty <= 0 ? c.filter((_, j) => j !== i) : c.map((l, j) => (j === i ? { ...l, qty: Math.min(10, qty) } : l))));
  }

  async function checkout() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, delivery, lang }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError(t.checkoutError);
    } catch {
      setError(t.checkoutError);
    }
    setLoading(false);
  }

  return (
    <>
      <div className="merch">
        {(limit ? merch.slice(0, limit) : merch).map((p) => (
          <ProductCard key={p.id} p={p} t={t} onAdd={add} />
        ))}
      </div>
      {limit && merch.length > limit && (
        <p className="see-all">
          <a className="btn btn-ghost" href="/merch">
            {t.seeAllMerch.replace("{n}", String(merch.length))}
          </a>
        </p>
      )}

      {count > 0 && (
        <button className="cart-fab" onClick={() => setOpen(true)} aria-label={`${t.cart} (${count})`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M6 7h12l-1 13H7L6 7Z" />
            <path d="M9 7a3 3 0 0 1 6 0" />
          </svg>
          <span className="cart-count">{count}</span>
        </button>
      )}

      <div className={toast ? "toast show" : "toast"} role="status">
        {t.added}
      </div>

      {open && <div className="cart-backdrop" onClick={() => setOpen(false)} />}
      <aside className={open ? "cart open" : "cart"} aria-hidden={!open} aria-label={t.cart}>
        <header className="cart-head">
          <h2>{t.cart}</h2>
          <button className="cart-close" onClick={() => setOpen(false)} aria-label="Close">
            ×
          </button>
        </header>

        {cart.length === 0 ? (
          <p className="cart-empty">{t.cartEmpty}</p>
        ) : (
          <>
            <ul className="cart-lines">
              {cart.map((l, i) => {
                const p = merch.find((x) => x.id === l.id);
                if (!p) return null;
                return (
                  <li key={l.id + (l.size ?? "")} className="cart-line">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image || "/logo.webp"} alt="" />
                    <div className="cart-line-info">
                      <p className="cart-line-name">{p.name}</p>
                      <p className="cart-line-meta">
                        {l.size && `${t.size} ${l.size}`}
                        {p.status === "preorder" && <span className="mini-badge">{t.preorder}</span>}
                      </p>
                      <div className="qty">
                        <button onClick={() => setQty(i, l.qty - 1)} aria-label="−">−</button>
                        <span>{l.qty}</span>
                        <button onClick={() => setQty(i, l.qty + 1)} aria-label="+">+</button>
                        <button className="cart-remove" onClick={() => setQty(i, 0)}>
                          {t.remove}
                        </button>
                      </div>
                    </div>
                    <p className="cart-line-price">{formatPrice(p.price * l.qty)}</p>
                  </li>
                );
              })}
            </ul>

            <fieldset className="delivery">
              <legend>{t.delivery}</legend>
              {(
                [
                  ["pickup", t.pickup, 0],
                  ["spain", t.shipSpain, shipping.spain],
                  ["europe", t.shipEurope, shipping.europe],
                ] as [Delivery, string, number][]
              ).map(([v, label, cost]) => (
                <label key={v} className={delivery === v ? "active" : ""}>
                  <input type="radio" name="delivery" checked={delivery === v} onChange={() => setDelivery(v)} />
                  <span>{label}</span>
                  {cost > 0 && <span className="delivery-cost">{formatPrice(cost)}</span>}
                </label>
              ))}
            </fieldset>

            <dl className="totals">
              <div>
                <dt>{t.subtotal}</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div>
                <dt>{t.shippingCost}</dt>
                <dd>{formatPrice(shippingCost)}</dd>
              </div>
              <div className="grand">
                <dt>{t.total}</dt>
                <dd>{formatPrice(subtotal + shippingCost)}</dd>
              </div>
            </dl>

            {cart.some((l) => merch.find((p) => p.id === l.id)?.status === "preorder") && (
              <p className="cart-note">{t.preorderNote}</p>
            )}
            {error && <p className="cart-error">{error}</p>}
            <button className="btn full" onClick={checkout} disabled={loading}>
              {loading ? t.checkoutLoading : `${t.checkout} — ${formatPrice(subtotal + shippingCost)}`}
            </button>
            <p className="secure">Stripe · Visa · Mastercard · Apple Pay · Google Pay</p>
          </>
        )}
      </aside>
    </>
  );
}
