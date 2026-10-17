"use client";
import { useEffect, useState } from "react";
import { formatPrice, membership, type Event, type Lang } from "@/app/content";

type Dict = Record<string, string>;
const errors: Record<string, string> = {
  not_member: "ebNotMember",
  already: "ebAlready",
  sold_out: "ebSoldOut",
  closed: "ebClosed",
};

export default function EarlyBird({ e, lang, t }: { e: Event; lang: Lang; t: Dict }) {
  const [left, setLeft] = useState<number | null>(null);
  const [closed, setClosed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/earlybird?slug=${e.slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setLeft(d.left);
          setClosed(d.closed);
        }
      })
      .catch(() => {});
  }, [e.slug]);

  if (!e.earlyBird) return null;
  const today = new Date().toISOString().slice(0, 10);
  const over = closed || today > e.earlyBird.until;
  const out = left === 0;

  async function buy(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/earlybird", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: e.slug, email: new FormData(ev.currentTarget).get("email"), lang }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error);
    } catch {
      setError("stripe_error");
    }
    setLoading(false);
  }

  return (
    <div className="earlybird">
      <p className="eb-head">
        <span className="eb-title">{t.ebTitle}</span>
        <span className="eb-price">{formatPrice(e.earlyBird.price)}</span>
        {left !== null && left > 0 && !over && <span className="eb-left">{t.ebLeft.replace("{n}", String(left))}</span>}
      </p>
      {over || out ? (
        <p className="eb-msg">{over ? t.ebClosed : t.ebSoldOut}</p>
      ) : (
        <>
          <p className="eb-text">{t.ebText}</p>
          <form className="eb-form" onSubmit={buy}>
            <input name="email" type="email" required placeholder={t.fEmail} aria-label={t.fEmail} autoComplete="email" />
            <button className="btn" type="submit" disabled={loading}>
              {loading ? t.checkoutLoading : t.ebBtn}
            </button>
          </form>
          {error && (
            <p className="cart-error">
              {errors[error] ? t[errors[error]] : t.checkoutError}
              {error === "not_member" && (
                <>
                  {" "}
                  <a href="#horde" className="eb-join">
                    {t.ebJoin} — {formatPrice(membership.price)}
                  </a>
                </>
              )}
            </p>
          )}
        </>
      )}
    </div>
  );
}
