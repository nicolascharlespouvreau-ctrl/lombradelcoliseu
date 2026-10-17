"use client";
import { useEffect, useState } from "react";
import { t as dict, langs, type Lang } from "@/app/content";

export default function Merci() {
  const [lang, setLang] = useState<Lang>("en");
  const [kind, setKind] = useState<"order" | "member" | "earlybird">("order");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ombra-lang") as Lang | null;
      if (saved && langs.includes(saved)) setLang(saved);
      const type = new URLSearchParams(window.location.search).get("type");
      if (type === "member" || type === "earlybird") setKind(type);
      else localStorage.removeItem("ombra-cart");
    } catch {}
  }, []);
  const t = dict[lang];
  return (
    <main className="thanks">
      <div className="grain" aria-hidden="true" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.webp" alt="L'Ombra del Coliseu" className="thanks-logo" />
      <h1>{kind === "member" ? t.memberThanksTitle : kind === "earlybird" ? t.ebThanksTitle : t.thanksTitle}</h1>
      <p>{kind === "member" ? t.memberThanksText : kind === "earlybird" ? t.ebThanksText : t.thanksText}</p>
      <a href="/" className="btn">
        {t.backHome}
      </a>
    </main>
  );
}
