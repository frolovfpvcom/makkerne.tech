"use client";

import { useEffect, useState } from "react";
import { DemoNote, Img } from "./shared";

/*
 * Tagværk, a roofer in Rødovre. The roofs are the content: one full-bleed photo to open, then
 * finished roofs at the size you would see them from the street, each with the facts a neighbour
 * would ask about. Charcoal, warm limestone and a little clay, all from the roofs themselves.
 * One heavy grotesk does the talking. Prices sit behind a choice of material, not in a table.
 */

const PHONE = "45 67 89 01";
const TEL = "tel:+4545678901";
const ADDRESS = "Tagstensvej 4, 2610 Rødovre";

type Swatch = "pap" | "fiber" | "beton" | "tegl" | "zink" | "skifer";

const ROOFS: { name: string; swatch: Swatch; low: number; high: number; life: string; when: string }[] = [
  { name: "Vingetegl", swatch: "tegl", low: 1400, high: 1900, life: "60–80 år", when: "Det klassiske danske tag. Stenene kan lægges om, hvis lægterne skal skiftes." },
  { name: "Naturskifer", swatch: "skifer", low: 2400, high: 3400, life: "80–100 år", when: "Dyrest, men ofte kan en stor del af de gamle skifer bruges igen." },
  { name: "Betontagsten", swatch: "beton", low: 1150, high: 1550, life: "40–50 år", when: "Tung. Vi tjekker spærene, før vi siger ja." },
  { name: "Fibercement-skifer", swatch: "fiber", low: 1100, high: 1500, life: "30–40 år", when: "Skiferens udtryk til en lavere pris, og let nok til de fleste spær." },
  { name: "Zink, falset", swatch: "zink", low: 1900, high: 2700, life: "50–80 år", when: "Til lav hældning, kviste og inddækninger." },
  { name: "Tagpap, to lag", swatch: "pap", low: 900, high: 1300, life: "25–30 år", when: "Fladt tag, garage og tilbygning. Skal ses efter hvert år." },
];

const FAQ: { q: string; a: string }[] = [
  { q: "Kan vi bo hjemme imens?", a: "Ja. Taget er lukket hver aften, med nyt undertag eller presenning. Det larmer mest de første dage." },
  { q: "Hvad hvis det regner?", a: "Vi river kun ned, hvis vi kan lukke igen samme dag. Er der varslet meget regn, venter vi." },
  { q: "Mit tag er af eternit. Er der asbest i?", a: "Plader fra før 1986 har som regel asbest. De tages ned af et firma med tilladelse, og prisen står for sig i tilbuddet." },
  { q: "Hvordan betaler jeg?", a: "I rater: når stilladset står, når taget er lukket, og ved aflevering. Vi tilbyder ikke selv lån." },
  { q: "Skal jeg søge byggetilladelse?", a: "Sjældent, når taget skiftes til samme slags. Skifter du materiale, eller er huset bevaringsværdigt, tjekker vi lokalplanen med dig." },
];

const NAV = [
  ["#tage", "Tage"],
  ["#priser", "Priser"],
  ["#eftersyn", "Tageftersyn"],
  ["#kontakt", "Kontakt"],
] as const;

const kr = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const round = (n: number) => Math.round(n / 1000) * 1000;

// Charcoal, limestone, clay.
const wrap = "mx-auto w-full max-w-[1320px] px-5 sm:px-10";
const meta = "text-[13px] font-medium uppercase tracking-[0.08em] tabular-nums";
const btn = "inline-flex items-center justify-center whitespace-nowrap bg-[#232120] font-semibold text-[#ECE7DE] transition-colors hover:bg-[#A0482B]";
const field = "w-full border-0 border-b-2 border-[#232120]/40 bg-transparent px-0 py-2.5 text-lg text-[#232120] placeholder:text-[#232120]/45 focus:border-[#232120] focus:outline-none";

/** A drawn sample of each roof material, so the choice shows what the roof looks like up close. */
function MaterialSwatch({ kind, className = "" }: { kind: Swatch; className?: string }) {
  const rows = [0, 1, 2, 3];
  // One 96 × 64 tile, repeated at its own size, so tiles and seams keep a believable scale.
  return (
    <svg className={className} aria-hidden>
      <defs>
        <pattern id={`tag-${kind}`} width="96" height="64" patternUnits="userSpaceOnUse">
          {kind === "pap" && (
            <>
              <rect width="96" height="64" fill="#2B2F31" />
              {[20, 42].map((y) => (
                <g key={y}>
                  <path d={`M0 ${y}H96`} stroke="#464D51" strokeWidth="2" />
                  <path d={`M0 ${y + 2}H96`} stroke="#1E2123" strokeWidth="1" />
                </g>
              ))}
            </>
          )}
          {(kind === "skifer" || kind === "fiber") && (
            <>
              <rect width="96" height="64" fill={kind === "skifer" ? "#363E43" : "#5E676C"} />
              {rows.map((r) => (
                <g key={r}>
                  <path d={`M0 ${r * 16 + 16}H96`} stroke={kind === "skifer" ? "#1E2427" : "#454D51"} strokeWidth="1.5" />
                  {[0, 1, 2, 3, 4, 5, 6].map((c) => {
                    const x = c * 16 + (r % 2 ? 8 : 0);
                    return <path key={c} d={`M${x} ${r * 16}V${r * 16 + 16}`} stroke={kind === "skifer" ? "#1E2427" : "#454D51"} strokeWidth="1.2" />;
                  })}
                  {kind === "skifer" && <rect x={(r * 37) % 80} y={r * 16 + 1} width="15" height="14" fill="#2D3438" />}
                </g>
              ))}
            </>
          )}
          {(kind === "tegl" || kind === "beton") && (
            <>
              <rect width="96" height="64" fill={kind === "tegl" ? "#A4472B" : "#6C7173"} />
              {rows.map((r) => (
                <path
                  key={r}
                  d={`M-4 ${r * 16 + 15} q6 -9 12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0`}
                  fill="none"
                  stroke={kind === "tegl" ? "#7A2F1B" : "#4D5254"}
                  strokeWidth="2"
                />
              ))}
            </>
          )}
          {kind === "zink" && (
            <>
              <rect width="96" height="64" fill="#9AA4A8" />
              {[14, 38, 62, 86].map((x) => (
                <g key={x}>
                  <path d={`M${x} 0V64`} stroke="#6F7A7E" strokeWidth="2.5" />
                  <path d={`M${x + 1.5} 0V64`} stroke="#C3CBCE" strokeWidth="1" />
                </g>
              ))}
            </>
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#tag-${kind})`} />
    </svg>
  );
}

/** The facts under a finished roof, in the order a neighbour asks: where, what, how big, how long. */
function RoofFacts({ place, facts, note, className = "" }: { place: string; facts: string; note: string; className?: string }) {
  return (
    <div className={`grid gap-x-10 gap-y-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] ${className}`}>
      <div>
        <h3 className="text-[28px] font-extrabold leading-none tracking-[-0.02em] sm:text-[34px]">{place}</h3>
        <p className={`${meta} mt-2 text-[#5E5A55]`}>{facts}</p>
      </div>
      <p className="max-w-[46ch] text-[17px] leading-[1.55] md:pt-1">{note}</p>
    </div>
  );
}

export function TagSite() {
  const [menu, setMenu] = useState(false);
  const [pick, setPick] = useState(0);
  const [area, setArea] = useState("140");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const roof = ROOFS[pick];
  const m2 = Math.min(1000, Math.max(0, Number(area) || 0));

  return (
    <div className="min-h-dvh overflow-x-clip bg-[#ECE7DE] font-(family-name:--font-tagvaerk) text-[#232120] [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-[#A0482B]">
      <DemoNote className="bg-[#232120] text-[#B9B2A7]" />

      <header className="relative z-40 bg-[#ECE7DE] sm:sticky sm:top-0">
        <div className={`${wrap} flex h-16 items-center justify-between gap-6 sm:h-[72px]`}>
          <a href="#top" className="flex items-baseline gap-3 whitespace-nowrap">
            <span className="text-[22px] font-black uppercase tracking-[-0.01em]">Tagværk</span>
            <span className="hidden text-sm text-[#5E5A55] md:inline">Tagdækker og tømrer i Rødovre</span>
          </a>
          <nav aria-label="Hovedmenu" className="hidden items-center gap-8 text-[15px] font-medium lg:flex">
            {NAV.map(([href, label]) => (
              <a key={href} href={href} className="underline-offset-[6px] hover:underline">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-5">
            <a href={TEL} className="hidden items-baseline gap-2 whitespace-nowrap sm:flex">
              <span className="text-sm text-[#5E5A55]">Utæt tag?</span>
              <span className="text-lg font-bold">{PHONE}</span>
            </a>
            <button
              type="button"
              aria-label={menu ? "Luk menu" : "Åbn menu"}
              aria-expanded={menu}
              aria-controls="tag-menu"
              onClick={() => setMenu((m) => !m)}
              className="-mr-2 grid size-11 place-items-center lg:hidden"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 8h18M3 16h18" />}
              </svg>
            </button>
          </div>
        </div>
        {menu && (
          <nav id="tag-menu" aria-label="Menu" className="border-t border-[#232120]/15 lg:hidden">
            <ul className={`${wrap} py-3`}>
              {NAV.map(([href, label]) => (
                <li key={href}>
                  <a href={href} onClick={() => setMenu(false)} className="block py-3 text-2xl font-bold">
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <a href={TEL} className="block py-3 text-2xl font-bold text-[#A0482B]">
                  Ring {PHONE}
                </a>
              </li>
            </ul>
          </nav>
        )}
      </header>

      <main>
        {/* The roof, full width, then what we say about roofs */}
        <section id="top">
          <figure className="relative">
            <Img
              priority
              id="1763665814538-8ba04597286c"
              w={2600}
              alt="Tagdækkere lægger nye tegl på lægterne"
              className="aspect-[5/4] w-full object-cover sm:aspect-[16/9] lg:h-[min(78svh,820px)] lg:aspect-auto"
            />
            <figcaption className={`${meta} absolute bottom-3 right-5 bg-[#232120]/80 px-2.5 py-1 text-[11px] text-[#ECE7DE] sm:right-10`}>
              Nyt undertag og tegl · Islev · 148 m²
            </figcaption>
          </figure>
          <div className={`${wrap} grid gap-8 pb-16 pt-8 sm:pb-24 sm:pt-12 lg:grid-cols-12 lg:gap-10`}>
            <h1 className="text-[42px] font-black leading-[0.98] tracking-[-0.035em] sm:text-[68px] lg:col-span-8 lg:text-[88px]">
              Kan taget holde fem år mere, siger vi det.
            </h1>
            <div className="flex flex-col items-start gap-4 lg:col-span-4 lg:pt-3">
              <p className="text-lg leading-[1.5]">Tegl, skifer, zink og tagpap. Spær, lægter og kviste laver vi selv.</p>
              <a href="#kontakt" className={`${btn} mt-2 h-14 px-7 text-[17px]`}>
                Book tageftersyn, 1.250 kr.
              </a>
              <p className="text-[15px] text-[#5E5A55]">Beløbet trækkes fra, hvis vi lægger taget.</p>
            </div>
          </div>
        </section>

        {/* Finished roofs, as big as they are */}
        <section id="tage" className="scroll-mt-20 pb-20 sm:pb-28">
          <div className={wrap}>
            <p className={`${meta} border-t-2 border-[#232120] pt-3`}>Tage, vi har lagt</p>
          </div>

          <figure className="mt-8 sm:mt-10">
            <Img id="1767463130152-7151c59fc144" w={2600} alt="Lyst pudset villa med mørkt skifertag og to skorstene" className="aspect-[4/3] w-full object-cover sm:aspect-[21/9]" />
            <figcaption className={`${wrap} mt-5 sm:mt-6`}>
              <RoofFacts
                place="Vanløse"
                facts="Villa fra 1931 · 172 m² · naturskifer, lagt om · 5 uger"
                note="Alle skifer kom ned og blev sorteret. To ud af tre kunne bruges igen, resten købte vi brugt fra et nedrevet hus i Valby."
              />
            </figcaption>
          </figure>

          <div className={`${wrap} mt-16 grid gap-12 sm:mt-24 lg:grid-cols-12 lg:gap-10`}>
            <figure className="lg:col-span-5 lg:mt-24">
              <Img id="1764112105049-bf2a430cf2aa" w={1200} alt="Kvist med vindue i et tegltag" className="aspect-[4/5] w-full object-cover" />
              <figcaption className="mt-5">
                <RoofFacts place="Brønshøj" facts="Villa fra 1936 · 2 kviste · zink · 2 uger" note="Kvistene var utætte ved kinderne. Tegltaget rundt om kunne blive liggende." className="md:grid-cols-1!" />
              </figcaption>
            </figure>
            <figure className="lg:col-span-7">
              <Img id="1778259251532-4c42a113fc2c" w={1800} alt="Sadeltage med mørk tagdækning under en skyet himmel" className="aspect-[3/2] w-full object-cover" />
              <figcaption className="mt-5">
                <RoofFacts
                  place="Glostrup"
                  facts="Parcelhus fra 1968 · 132 m² · fibercement-skifer · 3 uger"
                  note="Det gamle eternittag havde asbest. Det blev taget ned af et firma med tilladelse, før vi gik i gang."
                  className="md:grid-cols-1!"
                />
              </figcaption>
              <blockquote className="mt-10 border-l-2 border-[#A0482B] pl-5">
                <p className="text-[22px] font-medium leading-[1.35] tracking-[-0.01em] sm:text-[26px]">
                  »Vi var nervøse for asbesten. De sagde på forhånd, hvem der kom hvornår, og det holdt.«
                </p>
                <footer className="mt-3 text-sm text-[#5E5A55]">Eksempel på et kundecitat. På din side står dine egne kunders ord.</footer>
              </blockquote>
            </figure>
          </div>

          <p className={`${wrap} mt-14 text-[13px] text-[#5E5A55]`}>Opgaverne er eksempler, og fotos er pladsholdere fra Unsplash. På din side står dine egne tage og billeder.</p>
        </section>

        {/* Price per m², one material at a time */}
        <section id="priser" className="scroll-mt-20 bg-[#DCD4C6] py-20 sm:py-28">
          <div className={`${wrap} grid gap-12 lg:grid-cols-12 lg:gap-10`}>
            <div className="lg:col-span-5">
              <h2 className="text-[40px] font-black leading-none tracking-[-0.03em] sm:text-[56px]">Hvad koster et nyt tag?</h2>
              <fieldset className="mt-8 border-t border-[#232120]/25">
                <legend className="sr-only">Vælg tagtype</legend>
                {ROOFS.map((r, i) => (
                  <label
                    key={r.name}
                    className={`flex cursor-pointer items-center justify-between gap-3 border-b border-[#232120]/25 py-3 text-lg transition-colors has-focus-visible:outline-2 has-focus-visible:outline-[#A0482B] sm:text-xl ${
                      i === pick ? "font-bold" : "text-[#232120]/60 hover:text-[#232120]"
                    }`}
                  >
                    <input type="radio" name="tagtype" checked={i === pick} onChange={() => setPick(i)} className="sr-only" />
                    {r.name}
                    <span aria-hidden className={`text-[#A0482B] ${i === pick ? "" : "invisible"}`}>
                      →
                    </span>
                  </label>
                ))}
              </fieldset>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <MaterialSwatch kind={roof.swatch} className="block aspect-[5/2] w-full" />
              <p className="mt-6 text-[40px] font-black leading-none tracking-[-0.03em] sm:text-[56px]">
                {kr(roof.low)}–{kr(roof.high)} kr.
              </p>
              <p className={`${meta} mt-3`}>pr. m² · holder {roof.life}</p>
              <p className="mt-4 max-w-[44ch] text-lg leading-[1.5]">{roof.when}</p>

              <div className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-2 border-t border-[#232120]/25 pt-5 text-lg">
                <label htmlFor="tag-m2">Mit tag er ca.</label>
                <input
                  id="tag-m2"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={1000}
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-20 border-0 border-b-2 border-[#232120] bg-transparent py-0.5 text-center text-lg font-bold tabular-nums focus:outline-none"
                />
                <span>m²</span>
                <span className="font-bold">= ca. {m2 > 0 ? `${kr(round(roof.low * m2))}–${kr(round(roof.high * m2))} kr.` : "…"}</span>
              </div>
              <p className="mt-4 text-[13px] leading-[1.5] text-[#5E5A55]">
                Eksempelpriser inkl. moms, nedrivning, undertag, lægter og bortskaffelse. Stillads kommer oveni, typisk 18.000–30.000 kr. på et parcelhus. Den faste pris får du efter eftersynet.
              </p>
            </div>
          </div>
        </section>

        {/* The inspection, on the dark of a roof */}
        <section id="eftersyn" className="scroll-mt-20 bg-[#232120] text-[#ECE7DE]">
          <div className="grid lg:grid-cols-2">
            <div className="relative aspect-[3/2] lg:aspect-auto">
              <Img id="1777547314567-00ec923dffbe" w={1600} alt="Tagsten af sten under en overskyet himmel" className="absolute inset-0 size-full object-cover" />
            </div>
            <div className="flex flex-col items-start gap-6 px-5 py-16 sm:px-10 sm:py-24 lg:px-16">
              <h2 className="text-[40px] font-black leading-none tracking-[-0.03em] sm:text-[56px]">Tageftersyn, 1.250 kr.</h2>
              <p className="max-w-[40ch] text-lg leading-[1.55] text-[#ECE7DE]/85">
                En af os går taget igennem udefra og fra loftet. Det tager omkring en time. Bagefter får du billederne og vores bud: reparér, vent eller skift.
              </p>
              <p className="max-w-[40ch] text-[15px] leading-[1.55] text-[#ECE7DE]/60">
                Rødovre, Hvidovre, Brønshøj, Vanløse, Herlev, Glostrup og Albertslund. Beløbet trækkes fra, hvis vi lægger taget.
              </p>
              <a href="#kontakt" className="inline-flex h-14 items-center whitespace-nowrap bg-[#ECE7DE] px-7 text-[17px] font-semibold text-[#232120] transition-colors hover:bg-[#A0482B] hover:text-[#ECE7DE]">
                Book tageftersyn
              </a>
            </div>
          </div>
        </section>

        {/* Questions people ask before a new roof */}
        <section className={`${wrap} grid gap-8 py-20 sm:py-28 lg:grid-cols-12 lg:gap-10`}>
          <h2 className="text-[32px] font-black leading-none tracking-[-0.03em] sm:text-[40px] lg:col-span-4">Godt at vide</h2>
          <div className="border-t border-[#232120] lg:col-span-8">
            {FAQ.map((f) => (
              <details key={f.q} className="group border-b border-[#232120]/25">
                <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-5 text-lg font-semibold leading-snug sm:text-xl [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden className="text-2xl font-normal leading-none transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="max-w-[58ch] pb-6 text-[17px] leading-[1.55] text-[#232120]/80">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="kontakt" className="scroll-mt-20 border-t-2 border-[#232120]">
          <div className={`${wrap} grid gap-14 py-20 sm:py-28 lg:grid-cols-12 lg:gap-10`}>
            <div className="lg:col-span-5">
              <h2 className="text-[40px] font-black leading-none tracking-[-0.03em] sm:text-[56px]">Ring eller skriv.</h2>
              <a href={TEL} className="mt-8 block whitespace-nowrap text-[44px] font-black leading-none tracking-[-0.03em] hover:text-[#A0482B] sm:text-[64px]">
                {PHONE}
              </a>
              <p className="mt-4 text-[17px] leading-[1.55]">Drypper det, så ring. Så finder vi ud af, om der skal presenning på.</p>
              <dl className="mt-8 grid grid-cols-[max-content_minmax(0,1fr)] gap-x-6 gap-y-2 text-[15px]">
                <dt className="text-[#5E5A55]">Telefon</dt>
                <dd>Man–fre kl. 7–15.30</dd>
                <dt className="text-[#5E5A55]">Værksted</dt>
                <dd>{ADDRESS}</dd>
                <dt className="text-[#5E5A55]">Garanti</dt>
                <dd>Byg Garanti (eksempel)</dd>
                <dt className="text-[#5E5A55]">CVR</dt>
                <dd>00 00 00 00 (eksempel)</dd>
              </dl>
            </div>
            <form
              className="flex flex-col gap-7 lg:col-span-6 lg:col-start-7"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
                e.currentTarget.reset();
              }}
            >
              <label className="flex flex-col gap-1 text-[15px] font-medium">
                Hvad drejer det sig om?
                <textarea required name="opgave" rows={3} placeholder="Fx mos på nordsiden og en fugtplet over badeværelset" className={`${field} resize-y`} />
              </label>
              <div className="grid gap-7 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-[15px] font-medium">
                  Telefon
                  <input required name="telefon" type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9 +]{8,}" title="Skriv et telefonnummer på mindst 8 cifre" className={field} />
                </label>
                <label className="flex flex-col gap-1 text-[15px] font-medium">
                  <span>
                    Adresse <span className="font-normal text-[#5E5A55]">(kan udelades)</span>
                  </span>
                  <input name="adresse" type="text" autoComplete="street-address" className={field} />
                </label>
              </div>
              <button type="submit" className={`${btn} h-14 self-start px-8 text-[17px]`}>
                Send
              </button>
              {sent && (
                <p role="status" className="border-l-2 border-[#A0482B] pl-4 text-[17px] leading-[1.5]">
                  Tak. På en rigtig side ville vi ringe dig op og finde en dag til eftersynet. Dette er et eksempel, så der er ikke sendt noget.
                </p>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-[#232120] pb-24 text-[15px] text-[#B9B2A7] sm:pb-0">
        <div className={`${wrap} flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 py-10`}>
          <span className="text-lg font-black uppercase text-[#ECE7DE]">Tagværk</span>
          <span>{ADDRESS}</span>
          <span>CVR 00 00 00 00 (eksempel)</span>
          <a href={TEL} className="font-semibold text-[#ECE7DE] underline underline-offset-4">
            {PHONE}
          </a>
        </div>
      </footer>

      {/* Phone: call or book, within thumb's reach */}
      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 border-t border-[#232120]/20 bg-[#ECE7DE] sm:hidden">
        <a href={TEL} className="grid h-14 place-items-center whitespace-nowrap font-semibold">
          <span className="min-[360px]:hidden">Ring</span>
          <span className="hidden min-[360px]:inline">Ring {PHONE}</span>
        </a>
        <a href="#kontakt" className="grid h-14 place-items-center whitespace-nowrap bg-[#232120] font-semibold text-[#ECE7DE]">
          <span className="min-[360px]:hidden">Book</span>
          <span className="hidden min-[360px]:inline">Book eftersyn</span>
        </a>
      </div>
    </div>
  );
}
