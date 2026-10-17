"use client";
import { useEffect, useState } from "react";
import { t as dict, langs, type Lang } from "@/app/content";

export default function Merci() {
  const [lang, setLang] = useState<Lang>("en");
  const [member, setMember] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ombra-lang") as Lang | null;
      if (saved && langs.includes(saved)) setLang(saved);
      if (new URLSearchParams(window.location.search).get("type") === "member") setMember(true);
      else localStorage.removeItem("ombra-cart");
    } catch {}
  }, []);
  const t = dict[lang];
  return (
    <main className="thanks">
      <div className="grain" aria-hidden="true" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.webp" alt="L'Ombra del Coliseu" className="thanks-logo" />
      <h1>{member ? t.memberThanksTitle : t.thanksTitle}</h1>
      <p>{member ? t.memberThanksText : t.thanksText}</p>
      <a href="/" className="btn">
        {t.backHome}
      </a>
    </main>
  );
}
