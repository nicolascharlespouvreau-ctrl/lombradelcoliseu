"use client";
import { useEffect, useState } from "react";
import { langs, type Lang } from "@/app/content";

// Langue partagée entre toutes les pages (mémorisée dans localStorage).
export function useLang() {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ombra-lang") as Lang | null;
      if (saved && langs.includes(saved)) setLang(saved);
      else {
        const nav = navigator.language.slice(0, 2);
        if (nav === "es" || nav === "ca") setLang(nav);
      }
    } catch {}
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem("ombra-lang", lang);
    } catch {}
  }, [lang]);
  return [lang, setLang] as const;
}

export function SubHeader({
  lang,
  setLang,
  backHref,
  backLabel,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  backHref: string;
  backLabel: string;
}) {
  return (
    <>
      <div className="grain" aria-hidden="true" />
      <header className="nav">
        <a href="/" className="logo" aria-label="L'Ombra del Coliseu">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-sm.webp" alt="" width={44} height={49} className="logo-img" />
          <span>L&apos;Ombra</span>
        </a>
        <a href={backHref} className="back-link">
          ← {backLabel}
        </a>
        <div className="lang" role="group" aria-label="Language">
          {langs.map((l) => (
            <button key={l} className={l === lang ? "active" : ""} onClick={() => setLang(l)}>
              {l}
            </button>
          ))}
        </div>
      </header>
    </>
  );
}

export function SubFooter({ backHref, backLabel }: { backHref: string; backLabel: string }) {
  return (
    <footer className="concert-foot">
      <a href={backHref}>← {backLabel}</a>
      <p className="copy">© {new Date().getFullYear()} L&apos;Ombra del Coliseu · Tarragona</p>
    </footer>
  );
}
