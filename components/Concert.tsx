"use client";
import EarlyBird from "@/components/EarlyBird";
import { useLang, SubHeader, SubFooter } from "@/components/SubPage";
import { events, dateLocale, t as dict } from "@/app/content";

export default function Concert({ slug }: { slug: string }) {
  const [lang, setLang] = useLang();

  const e = events.find((x) => x.slug === slug)!;
  const t = dict[lang];
  const date = new Date(e.date + "T12:00:00");
  const longDate = date.toLocaleDateString(dateLocale[lang], { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const place = [e.venue, e.address, e.city].filter(Boolean).join(", ");
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;
  const upcoming = e.status === "upcoming";

  return (
    <>
      <SubHeader lang={lang} setLang={setLang} backHref="/#events" backLabel={t.back} />

      <main className="concert">
        <section className="container concert-top">
          {e.poster && (
            <a className="concert-poster" href={e.poster} target="_blank" rel="noreferrer" aria-label={t.viewPoster}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={e.poster} alt={e.title} />
            </a>
          )}
          <div className="concert-info">
            <p className="kicker">{longDate}</p>
            <h1>{e.title}</h1>
            <p className="concert-bands">{e.lineup.map((b) => b.name).join(" · ")}</p>

            <dl className="concert-facts">
              {(e.doors || e.start) && (
                <div>
                  <dt>{t.doors} / {t.start}</dt>
                  <dd>
                    {e.doors}
                    {e.doors && e.start ? " · " : ""}
                    {e.start}
                  </dd>
                </div>
              )}
              <div>
                <dt>{e.venue}</dt>
                <dd>
                  {[e.address, e.city].filter(Boolean).join(", ")}{" "}
                  <a href={maps} target="_blank" rel="noreferrer" className="maps-link">
                    {t.directions} ↗
                  </a>
                </dd>
              </div>
            </dl>

            {upcoming && (
              <div className="concert-tickets">
                <h2>{t.ticketsTitle}</h2>
                <ul className="prices">
                  {e.presale && (
                    <li>
                      <span>{t.presale}</span>
                      <strong>{e.presale}</strong>
                      {e.presaleFee && <em>{t.fee.replace("{fee}", e.presaleFee)}</em>}
                    </li>
                  )}
                  {e.door && (
                    <li>
                      <span>{t.door}</span>
                      <strong>{e.door}</strong>
                    </li>
                  )}
                </ul>
                {e.ticketUrl ? (
                  <a className="btn full" href={e.ticketUrl} target="_blank" rel="noreferrer">
                    {t.tickets}
                  </a>
                ) : (
                  <span className="btn btn-ghost disabled full">{t.ticketsSoon}</span>
                )}
                {e.earlyBird && <EarlyBird e={e} lang={lang} t={t} />}
              </div>
            )}
          </div>
        </section>

        {e.lineup.length > 0 && (
          <section className="section">
            <div className="container">
              <h2 className="section-title">
                <span>{t.lineupTitle}</span>
              </h2>
              <div className="bands">
                {e.lineup.map((b) => (
                  <article key={b.name} className="band">
                    <h3>{b.name}</h3>
                    <p className="band-meta">
                      {b.genre}
                      {b.origin ? ` · ${b.origin}` : ""}
                    </p>
                    {b.bio?.[lang] && <p className="band-bio">{b.bio[lang]}</p>}
                    {b.links?.length ? (
                      <ul className="band-links">
                        {b.links.map((l) => (
                          <li key={l.url}>
                            <a href={l.url} target="_blank" rel="noreferrer">
                              {l.label} ↗
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <SubFooter backHref="/#events" backLabel={t.back} />
    </>
  );
}
