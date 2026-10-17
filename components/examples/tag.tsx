"use client";

import { useEffect, useState } from "react";
import { DemoNote, Img, SampleReviewsNote, Stars } from "./shared";

/*
 * Tagværk, built like a roofer's notebook kept under an open sky: wide panoramic photos, drawn
 * samples of each roof material, and a price per m² for everything. Slate, zinc and sky set the
 * palette; tegl red appears only where it is the material itself. A grotesk carries the figures,
 * a book serif carries captions and the notes from the roof. No cards, no shadows, no motion.
 */

const PHONE = "45 67 89 01";
const TEL = "tel:+4545678901";
const ADDRESS = "Tagstensvej 4, 2610 Rødovre";

const serif = "font-(family-name:--font-tagvaerk-serif)";

type Swatch = "pap" | "fiber" | "beton" | "tegl" | "zink" | "skifer";

const ROOFS: { name: string; swatch: Swatch; low: number; high: number; life: string; when: string }[] = [
  { name: "Tagpap, to lag", swatch: "pap", low: 900, high: 1300, life: "25–30 år", when: "Fladt tag, garage, carport og tilbygning. Billigst at lægge, men det skal ses efter hvert år." },
  { name: "Fibercement-skifer", swatch: "fiber", low: 1100, high: 1500, life: "30–40 år", when: "Du vil have skiferens udtryk til en lavere pris. Let, så spærene sjældent skal forstærkes." },
  { name: "Betontagsten", swatch: "beton", low: 1150, high: 1550, life: "40–50 år", when: "Parcelhuse fra 60'erne og 70'erne, der har beton i forvejen. Tung, så vi tjekker spærene først." },
  { name: "Vingetegl", swatch: "tegl", low: 1400, high: 1900, life: "60–80 år", when: "Det klassiske danske tag. Holder længst for pengene, og stenene kan lægges om, hvis lægterne skal skiftes." },
  { name: "Zink, falset", swatch: "zink", low: 1900, high: 2700, life: "50–80 år", when: "Lav hældning, kviste og inddækninger. Vi lægger det sammen med vores faste blikkenslager, Torben." },
  { name: "Naturskifer", swatch: "skifer", low: 2400, high: 3400, life: "80–100 år", when: "Villaer, der har skifer i forvejen. Dyrest, men ofte kan en stor del af de gamle skifer bruges igen." },
];

const CHECKS = [
  "Tagsten eller pap, rygning og grater",
  "Inddækninger ved skorsten, kviste og ovenlysvinduer",
  "Undertaget set fra loftet: fugt, skjolder og revner",
  "Lægter og spær: råd og nedbøjning",
  "Tagrender og nedløb",
  "Ventilation af loftsrummet",
];

const ROOFS_DONE: { place: string; when: string; house: string; size: string; material: string; time: string; note: string; photo?: { id: string; alt: string } }[] = [
  {
    place: "Islev, Rødovre",
    when: "september 2026",
    house: "Parcelhus fra 1962",
    size: "148 m²",
    material: "Vingetegl og nyt undertag",
    time: "3 uger",
    note: "Tre spær var knækket under en gammel antennemast. Dem skiftede vi, før undertaget kom på.",
    photo: { id: "1763665814538-8ba04597286c", alt: "Tagdækkere lægger nye tegl på et tag" },
  },
  {
    place: "Vanløse",
    when: "juni 2026",
    house: "Villa fra 1931",
    size: "172 m²",
    material: "Naturskifer, lagt om",
    time: "5 uger",
    note: "Alle skifer kom ned og blev sorteret. Omkring to tredjedele kunne bruges igen, resten er købt brugt.",
    photo: { id: "1767463130152-7151c59fc144", alt: "Lyst pudset hus med mørkt skifertag og skorstene" },
  },
  {
    place: "Hvidovre",
    when: "april 2026",
    house: "Fire rækkehuse fra 1974",
    size: "4 × 64 m²",
    material: "Tagpap, to lag",
    time: "9 arbejdsdage",
    note: "Naboerne gik sammen, så stilladset kun skulle op én gang.",
  },
  {
    place: "Brønshøj",
    when: "februar 2026",
    house: "Villa fra 1936",
    size: "2 kviste",
    material: "Zinkinddækning og nyt træværk",
    time: "2 uger",
    note: "Kvistene var utætte ved kinderne. Tegltaget rundt om kunne blive liggende.",
    photo: { id: "1764112105049-bf2a430cf2aa", alt: "Kvist med vindue i et tegltag" },
  },
  {
    place: "Glostrup",
    when: "oktober 2025",
    house: "Parcelhus fra 1968",
    size: "132 m²",
    material: "Eternit skiftet til fibercement-skifer",
    time: "3 uger",
    note: "Det gamle tag var fra før 1986 og indeholdt asbest. Et firma med tilladelse tog det ned, før vi gik i gang.",
    photo: { id: "1778259251532-4c42a113fc2c", alt: "Sadeltage med mørk tagdækning under en skyet himmel" },
  },
  {
    place: "Albertslund",
    when: "august 2025",
    house: "Garage og carport",
    size: "41 m²",
    material: "Tagpap, to lag",
    time: "2 dage",
    note: "Ny tagrende og nedløb samme dag.",
  },
];

const STEPS: { title: string; text: string }[] = [
  { title: "Tageftersyn", text: "Vi går taget og loftet igennem og skriver ned, hvad vi ser." },
  { title: "Fast pris", text: "Senest fem hverdage efter. Der står m², materiale, stillads og hvad det koster pr. m², hvis lægterne er rådne." },
  { title: "Stillads og overdækning", text: "Stilladset kommer op et par dage før. Haven og indkørslen dækker vi af." },
  { title: "Nedrivning og nyt undertag", text: "Vi river aldrig mere ned, end vi kan lukke igen samme dag." },
  { title: "Tagdækning", text: "Lægter, tagsten eller pap, rygning og inddækninger. Tømrerarbejdet laver vi selv undervejs." },
  { title: "Aflevering", text: "Vi går taget igennem sammen med dig, før stilladset tages ned." },
];

const REVIEWS: { stars: number; date: string; text: string; name: string; reply?: string }[] = [
  { stars: 5, date: "2. okt. 2026", text: "Eftersynet viste, at vi godt kunne vente fem år med nyt tag. Det havde vi ikke regnet med at høre fra et tagfirma.", name: "Susanne, Islev" },
  {
    stars: 4,
    date: "18. jul. 2026",
    text: "Flot skifertag, og prisen holdt. Men stilladset stod tre uger, efter de var færdige, og det blev vi trætte af.",
    name: "Jesper, Vanløse",
    reply: "Det er fair, Jesper. Stilladsfirmaet havde travlt, og vi skulle have rykket tidligere. Nu aftaler vi nedtagningen, samtidig med at vi bestiller stilladset.",
  },
  { stars: 5, date: "9. nov. 2025", text: "Vi var nervøse for asbesten i det gamle tag. Ole forklarede hele forløbet, og hvem der kom hvornår.", name: "Kim, Glostrup" },
  { stars: 5, date: "30. apr. 2026", text: "Vi var fire naboer om et nyt paptag. Vi fik én plan for hele rækken og hver sin regning.", name: "Hanne, Hvidovre" },
];

const FAQ: { q: string; a: string }[] = [
  { q: "Kan vi bo i huset, mens taget bliver skiftet?", a: "Ja. Taget er lukket hver aften, enten med det nye undertag eller med presenning. Det larmer i dagtimerne, mest de første dage, hvor vi river ned." },
  { q: "Hvad sker der, hvis det regner?", a: "Vi ser på vejrudsigten hver morgen og river kun ned, hvis vi kan lukke igen samme dag. Er der varslet meget regn, venter vi en dag." },
  {
    q: "Mit tag er af eternit. Er der asbest i?",
    a: "Eternitplader fra før 1986 indeholder som regel asbest. De skal tages ned af et firma, der har lov til det. Vi bruger et fast firma, og prisen står for sig i tilbuddet.",
  },
  {
    q: "Skal jeg søge byggetilladelse?",
    a: "Som regel ikke, når taget skiftes til samme slags. Skifter du materiale, kan lokalplanen have regler, og er huset bevaringsværdigt, skal kommunen spørges. Vi hjælper dig med at tjekke det.",
  },
];

const NAV = [
  ["#tagtyper", "Tagtyper og priser"],
  ["#eftersyn", "Tageftersyn"],
  ["#tage", "Tage vi har lagt"],
  ["#om", "Om os"],
  ["#kontakt", "Kontakt"],
] as const;

const kr = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const round = (n: number) => Math.round(n / 1000) * 1000;

const wrap = "mx-auto max-w-[1240px] px-4 sm:px-8";
const h2 = "text-[32px] font-bold leading-[1.08] tracking-[-0.025em] sm:text-[44px]";
const btn = "items-center justify-center whitespace-nowrap rounded-[3px] bg-[#2C3E48] font-semibold text-white transition-colors hover:bg-[#1C2B33]";
const field = "w-full rounded-[3px] border border-[#8E999E] bg-white px-3.5 py-3 text-base text-[#1F2629] placeholder:text-[#6E787C]";

/** A drawn sample of each roof material, so the table shows what the roof looks like up close. */
function MaterialSwatch({ kind, className = "" }: { kind: Swatch; className?: string }) {
  const rows = [0, 1, 2, 3];
  return (
    <svg viewBox="0 0 96 64" className={className} role="img" aria-hidden preserveAspectRatio="xMidYMid slice">
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
    </svg>
  );
}

export function TagSite() {
  const [menu, setMenu] = useState(false);
  const [area, setArea] = useState("140");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const m2 = Math.min(1000, Math.max(0, Number(area) || 0));

  return (
    <div className="min-h-dvh overflow-x-clip bg-[#F4F6F6] font-(family-name:--font-tagvaerk) text-[#1F2629] [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-[#2C3E48]">
      <DemoNote className="bg-[#1F2629] text-[#C5CDD0]" />

      <header className="relative z-40 border-b border-[#C5CCCF] bg-[#F4F6F6] sm:sticky sm:top-0">
        <div className={`${wrap} flex items-center justify-between gap-4 py-3`}>
          <a href="#top" className="flex min-w-0 items-center gap-2.5">
            <svg viewBox="0 0 40 24" className="h-6 w-10 shrink-0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="miter" aria-hidden>
              <path d="M2 22L20 4l18 18" />
            </svg>
            <span className="flex flex-col leading-tight">
              <span className="whitespace-nowrap text-xl font-bold tracking-[-0.02em]">Tagværk</span>
              <span className="whitespace-nowrap text-[11px] text-[#4F5A5F] sm:text-xs">Tagdækker og tømrer · Rødovre</span>
            </span>
          </a>
          <nav aria-label="Hovedmenu" className="hidden gap-6 whitespace-nowrap text-[15px] font-medium xl:flex">
            {NAV.map(([href, label]) => (
              <a key={href} href={href} className="hover:underline hover:underline-offset-4">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-4">
            <a href={TEL} className="hidden whitespace-nowrap font-semibold sm:inline">
              {PHONE}
            </a>
            <a href="#kontakt" className={`${btn} hidden px-5 py-3 md:inline-flex`}>
              Book tageftersyn
            </a>
            <button
              type="button"
              aria-label={menu ? "Luk menu" : "Åbn menu"}
              aria-expanded={menu}
              aria-controls="tag-menu"
              onClick={() => setMenu((m) => !m)}
              className="grid size-11 place-items-center rounded-[3px] border border-[#8E999E] xl:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
        {menu && (
          <nav id="tag-menu" aria-label="Menu" className="border-t border-[#C5CCCF] xl:hidden">
            <ul className={`${wrap} py-2`}>
              {NAV.map(([href, label]) => (
                <li key={href}>
                  <a href={href} onClick={() => setMenu(false)} className="block border-b border-[#C5CCCF] py-3.5 text-lg font-medium">
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <a href={TEL} className="block py-3.5 text-lg font-semibold">
                  Ring {PHONE}
                </a>
              </li>
            </ul>
          </nav>
        )}
      </header>

      <main>
        {/* Hero: the one price on the sky band, then the roof in panorama */}
        <section id="top" className="bg-[#DDE7EE]">
          <div className={`${wrap} grid gap-6 pb-8 pt-9 sm:pb-12 sm:pt-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-end lg:gap-16 lg:pb-14 lg:pt-20`}>
            <h1 className="text-[38px] font-bold leading-[1.04] tracking-[-0.03em] sm:text-[56px] lg:text-[64px]">
              Et tageftersyn koster 1.250 kr. Så ved du, om taget skal skiftes.
            </h1>
            <div className="flex flex-col gap-5">
              <p className="max-w-[44ch] text-[17px] leading-[1.6] sm:text-lg">
                Tagværk er tre tagdækkere og to tømrere i Rødovre. Vi lægger tegl, skifer, zink og tagpap og laver selv tømrerarbejdet under: spær, lægter og kviste.
              </p>
              <div className="hidden flex-wrap items-center gap-x-5 gap-y-3 sm:flex">
                <a href="#kontakt" className={`${btn} inline-flex px-6 py-4 text-lg`}>
                  Book tageftersyn
                </a>
                <p className="text-[#3B474C]">
                  eller ring{" "}
                  <a href={TEL} className="whitespace-nowrap font-semibold text-[#1F2629] underline underline-offset-2">
                    {PHONE}
                  </a>
                </p>
              </div>
              <p className={`${serif} text-[15px] italic leading-normal text-[#3B474C] sm:text-base`}>
                Beløbet trækkes fra, hvis vi laver arbejdet inden for et halvt år.
              </p>
            </div>
          </div>
        </section>
        <figure className="flex flex-col gap-2">
          <Img
            priority
            id="1763665814538-8ba04597286c"
            w={2400}
            alt="Tagdækkere lægger nye tegl på et tag"
            className="aspect-[3/2] w-full object-cover sm:aspect-[3/1]"
          />
          <figcaption className={`${wrap} flex w-full flex-wrap justify-between gap-x-4 ${serif} text-[15px] italic text-[#4F5A5F]`}>
            <span>Vingetegl og nyt undertag, Islev</span>
            <span>September 2026 · 148 m² · 3 uger</span>
          </figcaption>
        </figure>

        {/* Roof types with price per m², worked out for the visitor's own roof */}
        <section id="tagtyper" className={`${wrap} scroll-mt-20 py-12 sm:py-20`}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end lg:gap-16">
            <div className="flex max-w-[640px] flex-col gap-3">
              <h2 className={h2}>Hvad koster et nyt tag?</h2>
              <p className="text-[17px] leading-[1.6] text-[#3B474C]">
                Prisen pr. m² er med nedrivning af det gamle tag, nyt undertag, lægter, bortskaffelse og moms. Stillads kommer oveni, typisk 18.000–30.000 kr. på et parcelhus.
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="tag-m2" className="text-[15px] font-semibold">
                Dit tag er ca.
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="tag-m2"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={1000}
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  aria-describedby="tag-m2-hint"
                  className={`${field} w-28! text-lg font-semibold tabular-nums`}
                />
                <span className="text-lg">m²</span>
              </div>
              <p id="tag-m2-hint" className={`${serif} text-sm italic text-[#4F5A5F]`}>Hælder taget 45 grader, er tagfladen ca. 1,4 gange husets grundareal.</p>
            </div>
          </div>

          <table className="mt-8 w-full border-collapse text-[15px] sm:text-base">
            <caption className="sr-only">Tagtyper med pris pr. m², levetid og pris for dit tag</caption>
            <thead className="hidden md:table-header-group">
              <tr className="border-b-2 border-[#1F2629] text-left text-[13px] font-semibold uppercase tracking-[0.07em] text-[#4F5A5F]">
                <th scope="col" className="py-2 pr-4" colSpan={2}>
                  Tagtype
                </th>
                <th scope="col" className="py-2 pr-4">
                  Vælg det, når
                </th>
                <th scope="col" className="py-2 pr-4 text-right">
                  Levetid
                </th>
                <th scope="col" className="py-2 pr-4 text-right">
                  Pr. m²
                </th>
                <th scope="col" className="py-2 text-right">
                  Dit tag, ca.
                </th>
              </tr>
            </thead>
            <tbody>
              {ROOFS.map((r) => (
                <tr key={r.name} className="grid grid-cols-[72px_minmax(0,1fr)] gap-x-4 gap-y-1 border-b border-[#C5CCCF] py-4 md:table-row md:py-0">
                  <td className="row-span-3 md:w-[96px] md:py-4 md:pr-4">
                    <MaterialSwatch kind={r.swatch} className="aspect-[3/2] w-full rounded-[2px]" />
                  </td>
                  <th scope="row" className="text-left font-semibold md:w-[190px] md:py-4 md:pr-4">
                    {r.name}
                    <span className="block text-sm font-normal text-[#4F5A5F] md:hidden">
                      {r.life} · {kr(r.low)}–{kr(r.high)} kr./m²
                    </span>
                  </th>
                  <td className={`${serif} col-start-2 leading-[1.5] text-[#3B474C] md:max-w-[44ch] md:py-4 md:pr-6`}>{r.when}</td>
                  <td className="hidden whitespace-nowrap text-right tabular-nums md:table-cell md:py-4 md:pr-4">{r.life}</td>
                  <td className="hidden whitespace-nowrap text-right tabular-nums md:table-cell md:py-4 md:pr-4">
                    {kr(r.low)}–{kr(r.high)} kr.
                  </td>
                  <td className="col-start-2 whitespace-nowrap font-semibold tabular-nums md:py-4 md:text-right">
                    <span className="font-normal text-[#4F5A5F] md:hidden">Dit tag: </span>
                    {m2 > 0 ? `${kr(round(r.low * m2))}–${kr(round(r.high * m2))} kr.` : "Skriv m²"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-[13px] text-[#4F5A5F]">Vejledende priser inkl. moms, oktober 2026. Den faste pris får du efter tageftersynet.</p>
        </section>

        {/* The roof inspection */}
        <section id="eftersyn" className="scroll-mt-20 bg-[#2C3E48] text-white [&_:focus-visible]:outline-white">
          <div className={`${wrap} grid gap-10 py-12 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16`}>
            <div className="flex flex-col gap-5">
              <h2 className={h2}>Tageftersyn, 1.250 kr.</h2>
              <p className="max-w-[46ch] text-[17px] leading-[1.6] text-[#D5DEE3] sm:text-lg">
                Ole eller Rasmus kommer ud og går taget igennem udefra og fra loftet. Det tager omkring en time, og du skal være hjemme, så vi kan komme op på loftet.
              </p>
              <p className={`${serif} max-w-[46ch] text-[17px] leading-[1.6] text-white sm:text-lg`}>
                Senest tre hverdage efter får du en rapport med billeder fra taget og vores ærlige bud: kan det repareres, eller skal det skiftes, og hvornår.
              </p>
              <dl className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-6 gap-y-2 border-t border-[#4B606B] pt-4 text-[15px]">
                <dt className="text-[#B9C6CD]">Pris</dt>
                <dd>1.250 kr. inkl. moms og kørsel</dd>
                <dt className="text-[#B9C6CD]">Trækkes fra</dt>
                <dd>hvis vi laver arbejdet inden for et halvt år</dd>
                <dt className="text-[#B9C6CD]">Område</dt>
                <dd>Rødovre, Hvidovre, Brønshøj, Vanløse, Herlev, Glostrup og Albertslund</dd>
                <dt className="text-[#B9C6CD]">Ventetid nu</dt>
                <dd>Ca. en uge</dd>
              </dl>
              <a href="#kontakt" className="inline-flex h-[52px] items-center self-start whitespace-nowrap rounded-[3px] bg-white px-6 text-[17px] font-semibold text-[#1F2629] transition-colors hover:bg-[#DDE7EE]">
                Book tageftersyn
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-semibold">Det ser vi efter</h3>
              <ul className="border-t border-[#4B606B]">
                {CHECKS.map((c) => (
                  <li key={c} className="flex gap-3 border-b border-[#4B606B] py-3.5 text-[17px] leading-snug">
                    <svg viewBox="0 0 24 24" className="mt-0.5 size-5 shrink-0 text-[#B9C6CD]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Roofs we have laid */}
        <section id="tage" className={`${wrap} scroll-mt-20 py-12 sm:py-20`}>
          <div className="flex max-w-[640px] flex-col gap-3">
            <h2 className={h2}>Tage vi har lagt</h2>
            <p className="text-[17px] leading-[1.6] text-[#3B474C]">Med husets alder, m² og hvor lang tid det tog. Vil du se et af dem fra vejen, så spørg. Vi har adresserne.</p>
          </div>
          <ol className="mt-8 border-t-2 border-[#1F2629]">
            {ROOFS_DONE.map((r) => (
              <li key={r.place + r.when} className="flex flex-col gap-4 border-b border-[#C5CCCF] py-6 sm:py-8">
                {r.photo && <Img id={r.photo.id} w={2000} alt={r.photo.alt} className="aspect-[2/1] w-full rounded-[2px] object-cover sm:aspect-[4/1]" />}
                <div className="grid gap-x-10 gap-y-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                  <div className="flex flex-col gap-1">
                    <p className="text-[13px] font-medium uppercase tracking-[0.07em] text-[#4F5A5F]">
                      {r.place} · {r.when}
                    </p>
                    <h3 className="text-xl font-semibold leading-snug sm:text-2xl">{r.material}</h3>
                    <p className="text-[15px] tabular-nums text-[#3B474C]">
                      {r.house} · {r.size} · {r.time}
                    </p>
                  </div>
                  <p className={`${serif} max-w-[52ch] text-[17px] leading-[1.6] text-[#2E383C]`}>{r.note}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-[13px] text-[#4F5A5F]">Fotos fra Unsplash som pladsholdere. På din side bruger vi dine egne billeder fra tagene.</p>
        </section>

        {/* When the roof has to be replaced, and how payment works */}
        <section className="border-y border-[#C5CCCF] bg-white">
          <div className={`${wrap} grid gap-10 py-12 sm:py-20 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-16`}>
            <div className="flex flex-col gap-6">
              <h2 className={h2}>Når taget skal skiftes</h2>
              <ol className="grid gap-x-8 sm:grid-cols-2">
                {STEPS.map((s, i) => (
                  <li key={s.title} className="flex gap-4 border-t border-[#C5CCCF] py-4">
                    <span className="w-6 shrink-0 text-lg font-bold tabular-nums text-[#7D878B]">{i + 1}</span>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-semibold">{s.title}</h3>
                      <p className="text-[15px] leading-[1.55] text-[#3B474C]">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <aside className="flex flex-col gap-4 self-start border-l-2 border-[#7D878B] pl-5 sm:pl-7 lg:mt-20">
              <h3 className="text-lg font-semibold">Betaling</h3>
              <p className={`${serif} text-[17px] leading-[1.6]`}>
                Du betaler i rater, efterhånden som arbejdet bliver lavet: når stilladset står, når taget er lukket, og ved aflevering.
              </p>
              <p className={`${serif} text-[17px] leading-[1.6]`}>
                Vi tilbyder ikke selv lån eller afbetaling. Mange bruger deres bank, og vi skriver gerne tilbuddet, så banken kan bruge det.
              </p>
              <p className="text-sm leading-normal text-[#4F5A5F]">
                Efterisolering af loftet kan give håndværkerfradrag for arbejdslønnen. Selve tagdækningen giver ikke fradrag. Se reglerne på skat.dk.
              </p>
            </aside>
          </div>
        </section>

        {/* The master */}
        <section id="om" className={`${wrap} grid scroll-mt-20 gap-8 py-12 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16`}>
          <div className="flex flex-col gap-5">
            <h2 className={h2}>Ole Brandt, tagdækkermester</h2>
            <p className={`${serif} text-[18px] leading-[1.65] sm:text-[19px]`}>
              Jeg har lagt tag siden 1994 og startede Tagværk i 2009. I dag er vi tre tagdækkere og to tømrere, og min datter Sofie står for tilbud og regninger. Rasmus har været med næsten fra starten.
            </p>
            <p className={`${serif} text-[18px] leading-[1.65] sm:text-[19px]`}>
              Vi lægger tag hele året, også om vinteren, under overdækning. Et tag, der kan holde fem år mere, siger vi det om.
            </p>
            <dl className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-6 gap-y-2.5 border-t border-[#C5CCCF] pt-5 text-[15px]">
              <dt className="text-[#4F5A5F]">Adresse</dt>
              <dd>{ADDRESS}</dd>
              <dt className="text-[#4F5A5F]">Telefon</dt>
              <dd>Man–fre kl. 7–15.30</dd>
              <dt className="text-[#4F5A5F]">CVR</dt>
              <dd>00 00 00 00 (eksempel)</dd>
              <dt className="text-[#4F5A5F]">Garanti</dt>
              <dd>Byg Garanti (eksempel)</dd>
              <dt className="text-[#4F5A5F]">Ventetid nu</dt>
              <dd>Tageftersyn ca. en uge. Nyt tag fra uge 50.</dd>
            </dl>
          </div>
          <figure className="flex flex-col gap-2 lg:pt-2">
            <Img id="1632759145351-1d592919f522" w={1400} alt="Pladsholderfoto af en mand, der står på et hustag" className="aspect-[16/10] w-full rounded-[2px] object-cover" />
            <figcaption className={`${serif} text-[15px] italic text-[#4F5A5F]`}>Pladsholderfoto · her kommer mesterens eget portræt</figcaption>
          </figure>
        </section>

        {/* Reviews */}
        <section className="border-t border-[#C5CCCF] bg-[#DDE7EE]">
          <div className={`${wrap} py-12 sm:py-20`}>
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 sm:mb-8">
              <h2 className={h2}>Hvad kunderne skriver</h2>
              <SampleReviewsNote className="text-[13px]! text-[#3B474C]" />
            </div>
            <div className="grid gap-x-12 md:grid-cols-2">
              {REVIEWS.map((r) => (
                <figure key={r.name} className="flex flex-col gap-2.5 border-t border-[#9FB0BA] py-6">
                  <p className="flex flex-wrap items-center gap-x-3 text-[13px] text-[#3B474C]">
                    <Stars n={r.stars} className="text-[15px] text-[#2C3E48]" />
                    <span>{r.date}</span>
                  </p>
                  <blockquote className={`${serif} text-[18px] leading-[1.55]`}>{r.text}</blockquote>
                  <figcaption className="text-[15px] font-medium">{r.name}</figcaption>
                  {r.reply && (
                    <p className="mt-1 border-l-2 border-[#2C3E48] pl-3.5 text-[15px] leading-[1.55] text-[#2E383C]">
                      <b className="font-semibold">Svar fra Ole:</b> {r.reply}
                    </p>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Questions */}
        <section className={`${wrap} grid gap-6 py-12 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16`}>
          <h2 className={h2}>Det bliver vi tit spurgt om</h2>
          <div className="border-t border-[#1F2629]">
            {FAQ.map((f) => (
              <details key={f.q} className="group border-b border-[#C5CCCF]">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-lg font-semibold leading-snug [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="mt-0.5 text-2xl font-normal leading-none text-[#4F5A5F] group-open:hidden" aria-hidden>
                    +
                  </span>
                  <span className="mt-0.5 hidden text-2xl font-normal leading-none text-[#4F5A5F] group-open:inline" aria-hidden>
                    −
                  </span>
                </summary>
                <p className={`${serif} max-w-[60ch] pb-5 text-[17px] leading-[1.6] text-[#2E383C]`}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="kontakt" className="scroll-mt-20 border-t border-[#C5CCCF] bg-white">
          <div className={`${wrap} grid gap-10 py-12 sm:py-20 lg:grid-cols-2 lg:gap-16`}>
            <div className="flex max-w-[460px] flex-col gap-4">
              <h2 className={h2}>Book et tageftersyn</h2>
              <p className="text-[17px] leading-[1.6]">
                Skriv adressen og lidt om taget, så ringer Sofie og finder en dag. Drypper det allerede, så ring. Vi kan som regel lægge presenning på samme dag.
              </p>
              <a href={TEL} className="self-start whitespace-nowrap text-[32px] font-bold tracking-[-0.02em] hover:underline hover:underline-offset-4">
                {PHONE}
              </a>
              <p className="text-[15px] text-[#4F5A5F]">
                Man–fre kl. 7–15.30
                <br />
                {ADDRESS}
              </p>
            </div>
            <form
              className="flex max-w-[540px] flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
                e.currentTarget.reset();
              }}
            >
              {sent && (
                <p role="status" className="rounded-[3px] border-l-4 border-[#2C3E48] bg-[#DDE7EE] p-4 leading-normal">
                  Tak. På en rigtig side ville Sofie ringe dig op inden for to hverdage og finde en dag til eftersynet. Dette er et eksempel, så der er ikke sendt noget.
                </p>
              )}
              <label className="flex flex-col gap-1.5 text-[15px] font-medium">
                Navn
                <input required name="navn" type="text" autoComplete="name" className={field} />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-[15px] font-medium">
                  Telefon
                  <input required name="telefon" type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9 +]{8,}" title="Skriv et telefonnummer på mindst 8 cifre" className={field} />
                </label>
                <label className="flex flex-col gap-1.5 text-[15px] font-medium">
                  Husets byggeår <span className="sr-only">(kan udelades)</span>
                  <input name="byggeaar" type="text" inputMode="numeric" pattern="\d{4}" title="Fire cifre, fx 1968" placeholder="Fx 1968" className={field} />
                </label>
              </div>
              <label className="flex flex-col gap-1.5 text-[15px] font-medium">
                Adresse
                <input required name="adresse" type="text" autoComplete="street-address" className={field} />
              </label>
              <label className="flex flex-col gap-1.5 text-[15px] font-medium">
                <span>
                  Hvad har du set? <span className="font-normal text-[#4F5A5F]">(kan udelades)</span>
                </span>
                <textarea name="besked" rows={4} placeholder="Fx mos på nordsiden og en fugtplet på loftet over badeværelset" className={`${field} resize-y`} />
              </label>
              <button type="submit" className={`${btn} inline-flex h-[52px] self-start px-6 text-[17px]`}>
                Book tageftersyn
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-[#1F2629] pb-24 text-[15px] text-[#C5CDD0] sm:pb-0">
        <div className={`${wrap} flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 py-10`}>
          <span className="text-lg font-bold text-white">Tagværk</span>
          <span>{ADDRESS}</span>
          <span>CVR 00 00 00 00 (eksempel)</span>
          <a href={TEL} className="font-semibold text-white underline underline-offset-2">
            {PHONE}
          </a>
        </div>
      </footer>

      {/* Phone: call or book, always within thumb's reach */}
      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2.5 border-t border-[#C5CCCF] bg-[#F4F6F6] px-4 pb-4 pt-3 sm:hidden">
        <a href={TEL} className="grid h-[52px] place-items-center whitespace-nowrap rounded-[3px] border border-[#1F2629] font-semibold">
          <span className="min-[360px]:hidden">Ring</span>
          <span className="hidden min-[360px]:inline">Ring til os</span>
        </a>
        <a href="#kontakt" className={`${btn} flex h-[52px]`}>
          <span className="min-[360px]:hidden">Book</span>
          <span className="hidden min-[360px]:inline">Book eftersyn</span>
        </a>
      </div>
    </div>
  );
}
