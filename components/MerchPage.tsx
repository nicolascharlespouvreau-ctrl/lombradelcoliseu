"use client";
import Shop from "@/components/Shop";
import { useLang, SubHeader, SubFooter } from "@/components/SubPage";
import { t as dict } from "@/app/content";

export default function MerchPage() {
  const [lang, setLang] = useLang();
  const t = dict[lang];
  return (
    <>
      <SubHeader lang={lang} setLang={setLang} backHref="/" backLabel="L'Ombra del Coliseu" />
      <main className="concert">
        <section className="section merch-page">
          <div className="container">
            <h1 className="section-title">
              <span>{t.merchTitle}</span>
            </h1>
            <p className="section-sub">{t.merchSub}</p>
            <Shop lang={lang} t={t} />
          </div>
        </section>
      </main>
      <SubFooter backHref="/" backLabel="L'Ombra del Coliseu" />
    </>
  );
}
