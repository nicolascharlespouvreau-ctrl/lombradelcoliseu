"use client";
import { useEffect, useState } from "react";
import Shop from "@/components/Shop";
import Horde from "@/components/Horde";
import {
  events,
  genres,
  supporters,
  socialLinks,
  contactEmail,
  t as dict,
  langs,
  dateLocale,
  type Lang,
  type Event,
} from "@/app/content";

/* Silhouette des arches de l'amphithéâtre romain de Tarragone */
function Arches({ className = "" }: { className?: string }) {
  const arches = Array.from({ length: 11 }, (_, i) => i);
  return (
    <svg className={className} viewBox="0 0 1100 260" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b211d" />
          <stop offset="1" stopColor="#120e0c" />
        </linearGradient>
      </defs>
      <path
        fill="url(#stone)"
        d={
          "M0 260 V70 H1100 V260 Z " +
          arches
            .map((i) => {
              const x = 20 + i * 100;
              return `M${x} 260 V150 A40 40 0 0 1 ${x + 80} 150 V260 Z`;
            })
            .join(" ")
        }
        fillRule="evenodd"
      />
      <rect x="0" y="58" width="1100" height="12" fill="#33271f" />
      {arches.map((i) => (
        <rect key={i} x={20 + i * 100 + 34} y="18" width="12" height="40" fill="#241b17" />
      ))}
    </svg>
  );
}

function formatDate(d: string, lang: Lang) {
  const date = new Date(d + "T12:00:00");
  return {
    day: date.toLocaleDateString(dateLocale[lang], { day: "2-digit" }),
    month: date.toLocaleDateString(dateLocale[lang], { month: "short" }).replace(".", ""),
    weekday: date.toLocaleDateString(dateLocale[lang], { weekday: "long" }),
    year: date.getFullYear(),
  };
}

function EventCard({ e, lang, featured = false }: { e: Event; lang: Lang; featured?: boolean }) {
  const t = dict[lang];
  const d = formatDate(e.date, lang);
  return (
    <article className={(featured ? "event featured" : "event") + (e.poster ? " has-poster" : "")}>
      {e.poster && (
        <a className="event-poster" href={e.poster} target="_blank" rel="noreferrer" aria-label={t.viewPoster}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={e.poster} alt={e.title} loading="lazy" />
        </a>
      )}
      <div className="event-date">
        <span className="event-day">{d.day}</span>
        <span className="event-month">{d.month}</span>
        <span className="event-year">{d.year}</span>
      </div>
      <div className="event-body">
        <p className="event-meta">
          {d.weekday} · {e.venue}
          {e.address ? `, ${e.address}` : ""}, {e.city}
        </p>
        <h3>{e.status === "upcoming" ? <a href={`/concerts/${e.slug}`}>{e.title}</a> : e.title}</h3>
        {e.lineup.length > 0 && e.lineup.every((b) => e.title.includes(b.name)) && (
          <p className="event-genres">{Array.from(new Set(e.lineup.map((b) => b.genre))).join(" · ")}</p>
        )}
        {e.lineup.length > 0 && !e.lineup.every((b) => e.title.includes(b.name)) && (
          <ul className="lineup">
            {e.lineup.map((b) => (
              <li key={b.name}>
                {b.name} <span>{b.genre}{b.origin ? ` · ${b.origin}` : ""}</span>
              </li>
            ))}
          </ul>
        )}
        {e.status === "upcoming" && (
          <div className="event-info">
            {e.doors && (
              <span>
                {t.doors} {e.doors}
              </span>
            )}
            {e.start && (
              <span>
                {t.start} {e.start}
              </span>
            )}
            {e.presale && (
              <span>
                {t.presale} {e.presale}
                {e.presaleFee ? ` ${t.fee.replace("{fee}", e.presaleFee)}` : ""}
              </span>
            )}
            {e.door && (
              <span>
                {t.door} {e.door}
              </span>
            )}
          </div>
        )}
      </div>
      {e.status === "upcoming" && (
        <div className="event-cta">
          <a className="btn btn-ghost" href={`/concerts/${e.slug}`}>
            {t.moreInfo}
          </a>
          {e.ticketUrl ? (
            <a className="btn" href={e.ticketUrl} target="_blank" rel="noreferrer">
              {t.tickets}
            </a>
          ) : (
            <span className="btn btn-ghost disabled">{t.ticketsSoon}</span>
          )}
        </div>
      )}
    </article>
  );
}

export default function Site() {
  const [lang, setLang] = useState<Lang>("en");
  const [menu, setMenu] = useState(false);
  const [booked, setBooked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

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

  const t = dict[lang];
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events
    .filter((e) => e.status === "upcoming" && e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  const past = events
    .filter((e) => e.status === "past" || e.date < today)
    .sort((a, b) => b.date.localeCompare(a.date));
  const next = upcoming[0];

  const links: [string, string][] = [
    [t.navEvents, "#events"],
    [t.navAbout, "#manifesto"],
    [t.navHorde, "#horde"],
    [t.navMerch, "#merch"],
    [t.navBooking, "#booking"],
  ];

  function onBooking(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    // Si une adresse de contact est configurée, on ouvre le client mail pré-rempli.
    if (contactEmail) {
      const f = new FormData(ev.currentTarget);
      const body = `${f.get("name")}\n${f.get("email")}\n${f.get("link")}\n\n${f.get("message")}`;
      window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(
        "Booking — " + f.get("name")
      )}&body=${encodeURIComponent(body)}`;
    }
    setBooked(true);
  }

  return (
    <>
      <div className="grain" aria-hidden="true" />

      <header className="nav">
        <a href="#" className="logo" aria-label="L'Ombra del Coliseu">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-sm.webp" alt="" width={44} height={49} className="logo-img" />
          <span>L&apos;Ombra</span>
        </a>
        <nav className={menu ? "nav-links open" : "nav-links"}>
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenu(false)}>
              {label}
            </a>
          ))}
        </nav>
        <div className="lang" role="group" aria-label="Language">
          {langs.map((l) => (
            <button key={l} className={l === lang ? "active" : ""} onClick={() => setLang(l)}>
              {l}
            </button>
          ))}
        </div>
        <button
          className="burger"
          aria-label="Menu"
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          <span />
          <span />
        </button>
      </header>

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="moon" aria-hidden="true" />
          <div className="hero-inner">
            <p className="kicker">{t.heroKicker}</p>
            <h1>
              <span className="h1-small">L&apos;</span>Ombra
              <br />
              <span className="h1-del">del</span> Coliseu
            </h1>
            <p className="hero-sub">{t.heroSub}</p>
            {next && (
              <a href={`/concerts/${next.slug}`} className="hero-next">
                <span className="hero-next-label">{t.nextShow}</span>
                <span className="hero-next-title">{next.title}</span>
                {next.lineup.length > 0 && next.title !== next.lineup.map((b) => b.name).join(" + ") && (
                  <span className="hero-next-lineup">{next.lineup.map((b) => b.name).join(" · ")}</span>
                )}
                <span className="hero-next-meta">
                  {formatDate(next.date, lang).day} {formatDate(next.date, lang).month} · {next.venue}
                </span>
              </a>
            )}
          </div>
          <Arches className="arches" />
        </section>

        {/* EVENTS */}
        <section id="events" className="section">
          <div className="container">
            <h2 className="section-title">
              <span>{t.upcoming}</span>
            </h2>
            {upcoming.length ? (
              <div className="events">
                {upcoming.map((e, i) => (
                  <EventCard key={e.slug} e={e} lang={lang} featured={i === 0} />
                ))}
              </div>
            ) : (
              <p className="empty">{t.noUpcoming}</p>
            )}

            {past.length > 0 && (
              <>
                <h3 className="sub-title">{t.past}</h3>
                <ul className="past">
                  {past.map((e) => {
                    const d = formatDate(e.date, lang);
                    return (
                      <li key={e.slug} className={e.poster ? "has-poster" : ""}>
                        {e.poster && (
                          <a className="past-poster" href={e.poster} target="_blank" rel="noreferrer" aria-label={t.viewPoster}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={e.poster} alt={e.title} loading="lazy" />
                          </a>
                        )}
                        <span className="past-date">
                          {d.day} {d.month} {d.year}
                        </span>
                        <span className="past-main">
                          <span className="past-title">{e.title}</span>
                          {e.lineup.length > 0 && (
                            <span className="past-lineup">{e.lineup.map((b) => b.name).join(" · ")}</span>
                          )}
                        </span>
                        <span className="past-venue">{e.venue}</span>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        </section>

        {/* MANIFESTO */}
        <section id="manifesto" className="section manifesto">
          <div className="container narrow">
            <div className="sigil" aria-hidden="true">
              ✠
            </div>
            <h2 className="manifesto-title">{t.aboutTitle}</h2>
            <p>{t.about1}</p>
            <p>{t.about2}</p>
            <p className="genres-label">{t.genres}</p>
            <ul className="genres">
              {genres.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* REJOINDRE LA HORDE : adhésion + bénévoles */}
        <section id="horde" className="section">
          <div className="container">
            <h2 className="section-title">
              <span>{t.hordeTitle}</span>
            </h2>
            <p className="section-sub">{t.hordeSub}</p>
            <Horde lang={lang} t={t} />
          </div>
        </section>

        {/* MERCH */}
        <section id="merch" className="section">
          <div className="container">
            <h2 className="section-title">
              <span>{t.merchTitle}</span>
            </h2>
            <p className="section-sub">{t.merchSub}</p>
            <Shop lang={lang} t={t} />
          </div>
        </section>

        {/* BOOKING */}
        <section id="booking" className="section booking">
          <div className="container split">
            <div>
              <h2 className="section-title left">
                <span>{t.bookingTitle}</span>
              </h2>
              <p className="section-sub left">{t.bookingSub}</p>
              <ul className="socials">
            {socialLinks.map((l) => (
              <li key={l.label}>
                <a href={l.url} target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
            </div>
            {booked ? (
              <div className="form-done" role="status">
                {t.fSent}
              </div>
            ) : (
              <form className="form" onSubmit={onBooking}>
                <label>
                  {t.fName}
                  <input name="name" required />
                </label>
                <label>
                  {t.fEmail}
                  <input name="email" type="email" required />
                </label>
                <label className="full">
                  {t.fLink}
                  <input name="link" type="url" />
                </label>
                <label className="full">
                  {t.fMsg}
                  <textarea name="message" rows={4} required />
                </label>
                <button className="btn full" type="submit">
                  {t.fSend}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="newsletter">
          <div className="container news-inner">
            <h2>{t.newsTitle}</h2>
            {subscribed ? (
              <p className="news-done">{t.newsDone}</p>
            ) : (
              <form
                className="news-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubscribed(true);
                }}
              >
                <input type="email" required placeholder={t.newsPlaceholder} aria-label={t.newsPlaceholder} />
                <button className="btn" type="submit">
                  {t.newsBtn}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <Arches className="arches footer-arches" />
        <div className="container footer-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.webp" alt="L'Ombra del Coliseu" className="footer-logo" loading="lazy" width={640} height={714} />
          <p className="footer-motto">{t.footer}</p>
          <ul className="socials center">
            {socialLinks.map((l) => (
              <li key={l.label}>
                <a href={l.url} target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="supporters">
            <p>{t.supporters}</p>
            <ul>
              {supporters.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <p className="copy">© {new Date().getFullYear()} L&apos;Ombra del Coliseu · Tarragona</p>
        </div>
      </footer>
    </>
  );
}
