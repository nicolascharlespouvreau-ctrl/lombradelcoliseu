"use client";
import { useState } from "react";
import { membership, volunteerRoles, contactEmail, formatPrice, type Lang } from "@/app/content";

type Dict = Record<string, string>;

export default function Horde({ lang, t }: { lang: Lang; t: Dict }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function join() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang }),
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

  function onVolunteer(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const f = new FormData(ev.currentTarget);
    // Si une adresse de contact est configurée, on ouvre le client mail pré-rempli.
    if (contactEmail) {
      const roles = f.getAll("roles").join(", ");
      const body = `${f.get("name")}\n${f.get("email")}\n${f.get("phone") || ""}\n\n${t.volRoles} ${roles}\n\n${f.get("message") || ""}`;
      window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(
        "Voluntariado — " + f.get("name")
      )}&body=${encodeURIComponent(body)}`;
    }
    setSent(true);
  }

  return (
    <div className="horde">
      <article className="horde-card member">
        <h3>{t.memberTitle}</h3>
        <p className="member-price">
          {formatPrice(membership.price)} <span>{t.memberPer}</span>
        </p>
        <p className="horde-text">{t.memberText}</p>
        <ul className="perks">
          <li>{t.memberPerk1}</li>
          <li>{t.memberPerk2}</li>
          <li>{t.memberPerk3}</li>
        </ul>
        <button className="btn full" onClick={join} disabled={loading}>
          {loading ? t.checkoutLoading : `${t.memberBtn} — ${formatPrice(membership.price)}`}
        </button>
        {error && <p className="cart-error">{error}</p>}
        <p className="secure">{t.memberNote}</p>
      </article>

      <article className="horde-card">
        <h3>{t.volTitle}</h3>
        <p className="horde-text">{t.volText}</p>
        {sent ? (
          <div className="form-done" role="status">
            {t.volSent}
          </div>
        ) : (
          <form className="form" onSubmit={onVolunteer}>
            <label>
              {t.fName.split(" /")[0]}
              <input name="name" required autoComplete="name" />
            </label>
            <label>
              {t.fEmail}
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label className="full">
              {t.fPhone}
              <input name="phone" type="tel" autoComplete="tel" />
            </label>
            <fieldset className="full roles">
              <legend>{t.volRoles}</legend>
              {volunteerRoles[lang].map((r) => (
                <label key={r} className="role">
                  <input type="checkbox" name="roles" value={r} />
                  <span>{r}</span>
                </label>
              ))}
            </fieldset>
            <label className="full">
              {t.volMsg}
              <textarea name="message" rows={3} />
            </label>
            <button className="btn full" type="submit">
              {t.volSend}
            </button>
          </form>
        )}
      </article>
    </div>
  );
}
