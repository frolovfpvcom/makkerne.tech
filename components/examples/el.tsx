"use client";

import { useEffect, useState } from "react";
import { DemoNote, Img, SampleReviewsNote, Stars } from "./shared";

/*
 * Fasebro El, built like a freshly labelled fuse board: graphite and panel grey, every section a
 * numbered circuit with a white label, tables where an electrician would write tables, and cable
 * yellow kept for one thing only: ringing us when something is wrong. One family (Archivo) for
 * everything. No cards, no shadows, no motion.
 */

const PHONE = "56 78 12 34";
const TEL = "tel:+4556781234";
const ADDRESS = "Industrivej 14, 4600 Køge";

const CIRCUITS = [
  { n: 1, href: "#akut", label: "Strømmen er gået", hint: "Ring nu" },
  { n: 2, href: "#hpfi", label: "HPFI-relæet slår fra", hint: "4 trin" },
  { n: 3, href: "#ladeboks", label: "Ladeboks til elbil", hint: "fra 9.995 kr." },
  { n: 4, href: "#tavler", label: "Ny eltavle", hint: "typisk 1 dag" },
  { n: 5, href: "#priser", label: "Priser", hint: "inkl. moms" },
  { n: 6, href: "#kontakt", label: "Om os og kontakt", hint: "" },
];

const HPFI = [
  { title: "Slå alle grupperne fra", text: "Det er de små automatsikringer i tavlen. HPFI-relæet er den brede kontakt med en testknap mærket T." },
  { title: "Slå HPFI-relæet til igen", text: "Bliver det oppe, sidder fejlen på en af grupperne. Slår det fra med det samme, så stop her og ring." },
  { title: "Slå grupperne til én ad gangen", text: "Den gruppe, der får relæet til at slå fra, er der, hvor fejlen er. Lad den være slået fra." },
  { title: "Træk stikkene ud på den gruppe", text: "Tit er det en vaskemaskine, en kogeplade eller en udendørslampe med vand i. Sæt tingene i igen en ad gangen." },
];

/** Charger: a base price plus what changes it. The firm's own list, incl. moms. */
const BASE = 9995;
const DISTANCE = [
  { label: "Under 10 m", note: "Tavlen er i garagen eller lige ved siden af", add: 0 },
  { label: "10–25 m", note: "Kabel gennem en væg eller langs huset", add: 1800 },
  { label: "Over 25 m", note: "Kabel i jorden til carport eller indkørsel", add: 4200 },
];
const MOUNT = [
  { label: "På væggen", add: 0 },
  { label: "På en stander", add: 1900 },
];

const BOARDS: { place: string; when: string; house: string; before: string; after: string; time: string }[] = [
  { place: "Herfølge", when: "sep. 2026", house: "Parcelhus, 1974", before: "Skruesikringer, intet HPFI", after: "10 grupper, 2 HPFI-relæer", time: "1 dag" },
  { place: "Køge Nord", when: "aug. 2026", house: "Rækkehus, 1988", before: "Gammelt HPFI, ingen mærkning", after: "8 grupper med kombirelæer", time: "1 dag" },
  { place: "Borup", when: "jun. 2026", house: "Landejendom, 1912", before: "Tavle i stald og stuehus", after: "2 nye tavler, ny jordforbindelse", time: "3 dage" },
  { place: "Solrød Strand", when: "apr. 2026", house: "Villa, 1962", before: "Fuld tavle, ingen plads", after: "+2 grupper til varmepumpe og lader", time: "½ dag" },
  { place: "Bjæverskov", when: "feb. 2026", house: "Parcelhus, 1979", before: "Porcelænssikringer", after: "9 grupper, overspændingsbeskyttelse", time: "1 dag" },
];

const PRICES: { what: string; note?: string; price: string }[] = [
  { what: "Akut fremmøde på hverdage", note: "kl. 7–16, inkl. kørsel i Køge Kommune og første halve time", price: "1.195 kr." },
  { what: "Akut fremmøde, aften og weekend", price: "1.995 kr." },
  { what: "Timepris, elektriker", price: "595 kr." },
  { what: "Ny stikkontakt på eksisterende gruppe", price: "650–950 kr." },
  { what: "Ladeboks 11 kW, monteret", note: "under 10 m kabel, på væggen", price: "9.995 kr." },
  { what: "Ny eltavle i parcelhus", note: "8–12 grupper, HPFI og mærkning", price: "14.000–19.000 kr." },
];

const REVIEWS: { stars: number; date: string; text: string; name: string; reply?: string }[] = [
  { stars: 5, date: "4. okt. 2026", text: "Strømmen gik midt i en fødselsdag. Mads var her efter en time, fandt vand i udendørslampen og var væk igen 20 minutter senere.", name: "Camilla, Køge" },
  {
    stars: 4,
    date: "11. sep. 2026",
    text: "Pænt arbejde med ladeboksen og prisen holdt. Men der gik tre uger, før de kunne komme, og det havde jeg ikke fået at vide, da jeg bestilte.",
    name: "Henrik, Herfølge",
    reply: "Det er rigtigt, Henrik. Vi skriver nu ventetiden i ordrebekræftelsen, så man ved det fra start.",
  },
  { stars: 5, date: "20. jun. 2026", text: "Ny tavle i et gammelt stuehus. De forklarede, hvad de lavede og hvorfor, og der stod med tusch på hver gruppe, hvad den gik til.", name: "Sofie, Borup" },
  { stars: 5, date: "2. apr. 2026", text: "Fik lavet to grupper til varmepumpe og lader på en halv dag. Ingen ekstraregning.", name: "Lars, Solrød Strand" },
];

const NAV = [
  ["#hpfi", "HPFI"],
  ["#ladeboks", "Ladeboks"],
  ["#tavler", "Tavler"],
  ["#priser", "Priser"],
  ["#kontakt", "Kontakt"],
] as const;

const kr = (n: number) => `${n.toLocaleString("da-DK")} kr.`;

const wrap = "mx-auto max-w-[1180px] px-4 sm:px-8";
const h2 = "text-[30px] font-bold leading-[1.05] tracking-[-0.025em] sm:text-[42px]";
const call = "items-center justify-center whitespace-nowrap bg-[#F5C400] font-bold text-[#17191B] transition-colors hover:bg-[#FFD633]";
const dark = "items-center justify-center whitespace-nowrap bg-[#17191B] font-semibold text-white transition-colors hover:bg-[#33373C]";
const field = "w-full border border-[#9EA19C] bg-white px-3 py-2.5 text-base text-[#17191B] placeholder:text-[#7A7E80]";

/** A circuit label: number in a black box, name in caps, like the strip on a fuse board. */
function Label({ n, children, onDark = false }: { n: number; children: React.ReactNode; onDark?: boolean }) {
  return (
    <p className={`inline-flex self-start items-stretch border text-[12px] font-semibold uppercase tracking-[0.12em] ${onDark ? "border-[#8D9196]" : "border-[#17191B]"}`}>
      <span className={`grid min-w-7 place-items-center px-1.5 tabular-nums ${onDark ? "bg-[#E8E8E4] text-[#17191B]" : "bg-[#17191B] text-white"}`}>{n}</span>
      <span className="px-2.5 py-1">{children}</span>
    </p>
  );
}

export function ElSite() {
  const [menu, setMenu] = useState(false);
  const [done, setDone] = useState<boolean[]>(HPFI.map(() => false));
  const [distance, setDistance] = useState(0);
  const [mount, setMount] = useState(0);
  const [kind, setKind] = useState("Ladeboks");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const price = BASE + DISTANCE[distance].add + MOUNT[mount].add;
  const allDone = done.every(Boolean);

  return (
    <div className="min-h-dvh overflow-x-clip bg-[#EDEDE9] font-(family-name:--font-fasebro) text-[#17191B] [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-[#17191B]">
      <DemoNote className="bg-[#17191B] text-[#C9CBC7]" />

      <header className="relative z-40 border-b border-[#C3C5C0] bg-[#EDEDE9] sm:sticky sm:top-0">
        <div className={`${wrap} flex items-center justify-between gap-4 py-3`}>
          <a href="#top" className="flex min-w-0 flex-col leading-tight">
            <span className="whitespace-nowrap text-[19px] font-extrabold uppercase tracking-[0.06em] sm:text-xl">Fasebro El</span>
            <span className="whitespace-nowrap text-[11px] text-[#585C60] sm:text-xs">Aut. elinstallatør · Køge</span>
          </a>
          <nav aria-label="Hovedmenu" className="hidden gap-6 whitespace-nowrap text-[15px] font-medium lg:flex">
            {NAV.map(([href, label]) => (
              <a key={href} href={href} className="underline-offset-4 hover:underline">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-3">
            <a href={TEL} className={`${call} hidden px-4 py-2.5 sm:inline-flex`}>
              Ring {PHONE}
            </a>
            <button
              type="button"
              aria-label={menu ? "Luk menu" : "Åbn menu"}
              aria-expanded={menu}
              aria-controls="fasebro-menu"
              onClick={() => setMenu((m) => !m)}
              className="grid size-11 place-items-center border border-[#9EA19C] lg:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden>
                {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
        {menu && (
          <nav id="fasebro-menu" aria-label="Menu" className="border-t border-[#C3C5C0] lg:hidden">
            <ul className={`${wrap} py-2`}>
              {NAV.map(([href, label]) => (
                <li key={href}>
                  <a href={href} onClick={() => setMenu(false)} className="block border-b border-[#C3C5C0] py-3.5 text-lg font-medium">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      <main>
        {/* Hero: who we are on the left, the circuit directory on the right */}
        <section id="top" className={`${wrap} grid gap-10 pb-10 pt-8 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16 lg:pb-14 lg:pt-20`}>
          <div className="flex flex-col gap-6">
            <h1 className="max-w-[16ch] text-[40px] font-bold leading-[1.02] tracking-[-0.03em] sm:text-[58px] lg:text-[66px]">Elektriker i Køge. Akut, tavler og ladebokse.</h1>
            <p className="max-w-[44ch] text-lg leading-[1.55] text-[#3A3E42] sm:text-xl">
              Mads Fasebro og tre svende, autoriseret siden 2011. Vi kører fra Solrød til Ringsted, og vi skriver på tavlen, hvad hver gruppe går til, før vi tager hjem.
            </p>
            <p className="text-[#585C60]">
              Opgaver, der ikke haster: skriv til os, så ringer vi tilbage samme dag.{" "}
              <a href="#kontakt" className="font-semibold text-[#17191B] underline underline-offset-2">
                Skriv til os
              </a>
            </p>
          </div>

          <nav aria-label="Gruppefortegnelse" className="self-start border border-[#17191B] bg-white">
            <p className="flex justify-between border-b border-[#17191B] bg-[#17191B] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-white">
              <span>Gruppefortegnelse</span>
              <span className="text-[#9EA19C]">Fasebro El</span>
            </p>
            <ol>
              {CIRCUITS.map((c) => (
                <li key={c.n} className="border-b border-[#D5D6D2] last:border-b-0">
                  <a href={c.href} className="grid grid-cols-[44px_minmax(0,1fr)_auto] items-center hover:bg-[#F4F4F1]">
                    <span className="grid h-12 place-items-center border-r border-[#D5D6D2] font-bold tabular-nums">{c.n}</span>
                    <span className="px-3.5 font-medium">{c.label}</span>
                    <span className="whitespace-nowrap pr-4 text-sm tabular-nums text-[#585C60]">{c.hint}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </section>

        {/* Circuit 1: acute */}
        <section id="akut" className="scroll-mt-20 bg-[#2B2E32] text-white [&_:focus-visible]:outline-white">
          <div className={`${wrap} grid items-center gap-6 py-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12`}>
            <div className="flex flex-col gap-3 border-l-4 border-[#F5C400] pl-5">
              <Label n={1} onDark>
                Akut
              </Label>
              <h2 className="text-[24px] font-bold leading-tight tracking-[-0.02em] sm:text-[30px]">Strømmen er gået, eller det lugter brændt?</h2>
              <p className="max-w-[62ch] leading-[1.6] text-[#C9CBC7]">
                Ring, så kommer vi. Fremmøde koster 1.195&nbsp;kr. inkl. moms på hverdage kl. 7–16, med kørsel i Køge Kommune og den første halve time. Aften og weekend 1.995&nbsp;kr. Lugter det brændt, så slå hovedafbryderen fra, inden du ringer.
              </p>
            </div>
            <a href={TEL} className={`${call} inline-flex px-7 py-4 text-lg`}>
              Ring {PHONE}
            </a>
          </div>
        </section>

        {/* Circuit 2: HPFI guide */}
        <section id="hpfi" className={`${wrap} grid scroll-mt-20 gap-8 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-16`}>
          <div className="flex flex-col gap-4">
            <Label n={2}>HPFI</Label>
            <h2 className={h2}>Slår HPFI-relæet fra hele tiden?</h2>
            <p className="max-w-[46ch] text-[17px] leading-[1.6] text-[#3A3E42]">
              Tit kan du selv finde fejlen på fem minutter. Følg trinene og sæt flueben. Skru aldrig noget af i tavlen, og rør ikke ved ledninger, der stikker ud.
            </p>
          </div>
          <div>
            <ol className="border-t border-[#17191B]">
              {HPFI.map((s, i) => (
                <li key={s.title} className="border-b border-[#C3C5C0]">
                  <div className="grid grid-cols-[40px_minmax(0,1fr)_auto] items-start gap-x-3 gap-y-1 py-4">
                    <span className="pt-0.5 text-[22px] font-bold tabular-nums leading-none text-[#585C60]" aria-hidden>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className={`text-lg font-semibold leading-snug ${done[i] ? "line-through decoration-2" : ""}`}>{s.title}</h3>
                    <input
                      id={`hpfi-${i}`}
                      type="checkbox"
                      checked={done[i]}
                      onChange={() => setDone((d) => d.map((v, j) => (j === i ? !v : v)))}
                      className="mt-1 size-5 accent-[#17191B]"
                      aria-label={`Trin ${i + 1} klaret: ${s.title}`}
                    />
                    <p className="col-start-2 text-[15px] leading-[1.55] text-[#3A3E42]">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div aria-live="polite">
              {allDone && (
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 bg-[#2B2E32] p-5 text-white">
                  <p className="max-w-[40ch] leading-normal">
                    <b>Slår det stadig fra?</b> <span className="text-[#C9CBC7]">Så sidder fejlen i selve installationen, og det skal en elektriker se på.</span>
                  </p>
                  <a href={TEL} className={`${call} inline-flex px-5 py-3`}>
                    Ring {PHONE}
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Circuit 3: charger price */}
        <section id="ladeboks" className="scroll-mt-20 border-y border-[#C3C5C0] bg-white">
          <div className={`${wrap} grid gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16`}>
            <div className="flex flex-col gap-7">
              <div className="flex flex-col gap-4">
                <Label n={3}>Ladeboks</Label>
                <h2 className={h2}>Hvad koster en ladeboks hos dig?</h2>
                <p className="max-w-[50ch] text-[17px] leading-[1.6] text-[#3A3E42]">
                  Prisen er med en 11 kW ladeboks med app, kabel, ny gruppe i tavlen og anmeldelse til netselskabet. 11 kW er nok til de fleste elbiler, fordi de ikke kan lade hurtigere hjemme.
                </p>
              </div>
              <fieldset>
                <legend className="mb-2 font-semibold">Hvor langt er der fra eltavlen?</legend>
                <div className="border-t border-[#C3C5C0]">
                  {DISTANCE.map((o, i) => (
                    <div key={o.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-3 gap-y-0.5 border-b border-[#C3C5C0] py-3 sm:grid-cols-[120px_minmax(0,1fr)_auto]">
                      <label className="flex cursor-pointer items-baseline gap-3 whitespace-nowrap font-semibold tabular-nums">
                        <input type="radio" name="afstand" checked={distance === i} onChange={() => setDistance(i)} aria-describedby={`afstand-${i}`} className="translate-y-0.5 accent-[#17191B]" />
                        {o.label}
                      </label>
                      <p id={`afstand-${i}`} className="text-[15px] text-[#585C60] max-sm:order-last max-sm:col-span-2 max-sm:pl-[25px]">
                        {o.note}
                      </p>
                      <p className="whitespace-nowrap text-right text-[15px] tabular-nums">{o.add ? `+${kr(o.add)}` : "inkl."}</p>
                    </div>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="mb-2 font-semibold">Hvor skal den sidde?</legend>
                <div className="border-t border-[#C3C5C0]">
                  {MOUNT.map((o, i) => (
                    <div key={o.label} className="flex items-baseline justify-between gap-3 border-b border-[#C3C5C0] py-3">
                      <label className="flex cursor-pointer items-baseline gap-3 font-semibold">
                        <input type="radio" name="montering" checked={mount === i} onChange={() => setMount(i)} className="translate-y-0.5 accent-[#17191B]" />
                        {o.label}
                      </label>
                      <p className="whitespace-nowrap text-[15px] tabular-nums">{o.add ? `+${kr(o.add)}` : "inkl."}</p>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
              <figure className="flex flex-col gap-2">
                <Img id="1766507680004-1c71007aefe5" w={900} alt="Ladeboks monteret på en trævæg" className="aspect-[16/10] w-full object-cover" />
                <figcaption className="flex justify-between gap-3 text-[13px] text-[#585C60]">
                  <span>Carport, Ølby</span>
                  <span>Jul. 2026 · 14 m kabel</span>
                </figcaption>
              </figure>
              <div className="border border-[#17191B] p-5">
                <p className="text-sm text-[#585C60]">Fast pris med dine valg</p>
                <p className="text-[40px] font-bold tabular-nums leading-tight tracking-[-0.02em]" aria-live="polite">
                  {kr(price)}
                </p>
                <p className="mt-1 text-sm leading-normal text-[#585C60]">
                  Inkl. moms. Vi kigger på tavlen, før vi går i gang. Er der ikke plads til en ny gruppe, siger vi det, inden du har betalt noget.
                </p>
                <a href="#kontakt" onClick={() => setKind("Ladeboks")} className={`${dark} inline-flex mt-4 px-5 py-3`}>
                  Bestil ladeboks
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Circuit 4: board log */}
        <section id="tavler" className={`${wrap} scroll-mt-20 py-14 sm:py-20`}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            <div className="flex flex-col gap-4">
              <Label n={4}>Tavler</Label>
              <h2 className={h2}>Har du stadig skruesikringer?</h2>
              <p className="max-w-[48ch] text-[17px] leading-[1.6] text-[#3A3E42]">
                Så mangler huset sandsynligvis et HPFI-relæ, som slår strømmen fra, før nogen får stød. En ny tavle i et parcelhus tager os typisk en dag. Strømmen er væk i 4–6 timer af den.
              </p>
            </div>
            <figure className="flex flex-col gap-2">
              <Img id="1576446470246-499c738d1c8e" w={1000} alt="Række af hvide automatsikringer i en eltavle" className="aspect-[16/9] w-full object-cover" />
              <figcaption className="text-[13px] text-[#585C60]">Fotos fra Unsplash som pladsholdere. På din side bruger vi billeder af dine egne tavler.</figcaption>
            </figure>
          </div>

          <div className="mt-10">
            <table className="w-full border-collapse text-[15px]">
              <caption className="pb-3 text-left text-sm font-semibold uppercase tracking-[0.12em] text-[#585C60]">Seneste tavleskift</caption>
              <thead className="max-md:sr-only">
                <tr className="border-y border-[#17191B] text-left text-[13px] uppercase tracking-[0.08em] text-[#585C60]">
                  <th scope="col" className="py-2.5 pr-4 font-semibold">Sted</th>
                  <th scope="col" className="py-2.5 pr-4 font-semibold">Hus</th>
                  <th scope="col" className="py-2.5 pr-4 font-semibold">Før</th>
                  <th scope="col" className="py-2.5 pr-4 font-semibold">Efter</th>
                  <th scope="col" className="py-2.5 text-right font-semibold">Tid</th>
                </tr>
              </thead>
              <tbody>
                {BOARDS.map((b) => (
                  <tr key={b.place} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 border-b border-[#C3C5C0] py-3.5 max-md:first:border-t max-md:first:border-t-[#17191B] md:table-row md:py-0">
                    <th scope="row" className="text-left font-semibold md:py-3.5 md:pr-4">
                      {b.place}
                      <span className="block text-[13px] font-normal text-[#585C60]">{b.when}</span>
                    </th>
                    <td className="text-right tabular-nums md:hidden">{b.time}</td>
                    <td className="col-span-2 text-[#585C60] md:py-3.5 md:pr-4 md:text-[#17191B]">{b.house}</td>
                    <td className="col-span-2 md:py-3.5 md:pr-4">
                      <span className="md:hidden">{b.before} → </span>
                      <span className="max-md:hidden">{b.before}</span>
                      <span className="md:hidden">{b.after}</span>
                    </td>
                    <td className="max-md:hidden md:py-3.5 md:pr-4">{b.after}</td>
                    <td className="whitespace-nowrap text-right tabular-nums max-md:hidden md:py-3.5">{b.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Circuit 5: prices */}
        <section id="priser" className="scroll-mt-20 bg-[#2B2E32] text-white [&_:focus-visible]:outline-white">
          <div className={`${wrap} grid gap-8 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-16`}>
            <div className="flex flex-col gap-4">
              <Label n={5} onDark>
                Priser
              </Label>
              <h2 className={h2}>Det koster det</h2>
              <p className="max-w-[44ch] leading-[1.6] text-[#C9CBC7]">
                Større opgaver får en fast pris, når vi har set huset. Håndværkerfradrag gælder kun nogle grønne opgaver, fx en varmepumpe. Se reglerne på skat.dk.
              </p>
            </div>
            <table className="w-full border-collapse">
              <caption className="pb-3 text-left text-sm text-[#9EA19C]">Vejledende priser inkl. moms, oktober 2026</caption>
              <tbody>
                {PRICES.map((p) => (
                  <tr key={p.what} className="border-y border-[#4B4F54]">
                    <th scope="row" className="py-3.5 pr-4 text-left align-top font-medium">
                      {p.what}
                      {p.note && <span className="block text-sm font-normal text-[#9EA19C]">{p.note}</span>}
                    </th>
                    <td className="whitespace-nowrap py-3.5 text-right align-top tabular-nums">{p.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Reviews */}
        <section className={`${wrap} py-14 sm:py-20`}>
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h2 className={h2}>Det skriver kunderne</h2>
            <SampleReviewsNote className="text-[#585C60]" />
          </div>
          <ol className="grid border-t border-[#17191B] md:grid-cols-2">
            {REVIEWS.map((r, i) => (
              <li key={r.name} className={`flex flex-col gap-2.5 border-b border-[#C3C5C0] py-6 ${i % 2 ? "md:border-l md:pl-8" : "md:pr-8"}`}>
                <p className="flex flex-wrap items-center gap-x-3 text-sm text-[#585C60]">
                  <Stars n={r.stars} className="text-[#17191B]" />
                  <span>{r.date}</span>
                </p>
                <blockquote className="text-[17px] leading-[1.6]">{r.text}</blockquote>
                <p className="text-[15px] text-[#585C60]">{r.name}</p>
                {r.reply && (
                  <p className="mt-1 border-l-2 border-[#17191B] pl-3.5 text-[15px] leading-[1.55] text-[#3A3E42]">
                    <b className="font-semibold">Svar fra Mads:</b> {r.reply}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* Circuit 6: about and contact */}
        <section id="kontakt" className="scroll-mt-20 border-t border-[#C3C5C0] bg-white">
          <div className={`${wrap} grid gap-12 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16`}>
            <div className="flex flex-col gap-4">
              <Label n={6}>Kontakt</Label>
              <h2 className={h2}>Mads Fasebro, elinstallatør</h2>
              <p className="max-w-[46ch] text-[17px] leading-[1.6] text-[#3A3E42]">
                Jeg tager telefonen fra kl. 7 til 16. Ringer du uden for den tid, og haster det ikke, så skriv. Jeg ringer tilbage næste morgen.
              </p>
              <div className="grid aspect-[16/9] max-w-[420px] place-items-center border border-dashed max-sm:aspect-[3/1] border-[#9EA19C] p-4 text-center text-sm text-[#585C60]">
                Her kommer et billede af Mads ved bilen
              </div>
              <dl className="mt-2 grid grid-cols-[max-content_minmax(0,1fr)] gap-x-6 gap-y-2.5 border-t border-[#C3C5C0] pt-5 text-[15px]">
                <dt className="text-[#585C60]">Telefon</dt>
                <dd>
                  <a href={TEL} className="font-semibold underline underline-offset-2">
                    {PHONE}
                  </a>
                </dd>
                <dt className="text-[#585C60]">Adresse</dt>
                <dd>{ADDRESS}</dd>
                <dt className="text-[#585C60]">Autorisation</dt>
                <dd>Aut. nr. 00000 (eksempel), slå os op hos Sikkerhedsstyrelsen</dd>
                <dt className="text-[#585C60]">CVR</dt>
                <dd>00 00 00 00 (eksempel)</dd>
                <dt className="text-[#585C60]">Ventetid nu</dt>
                <dd>Ca. 2 uger på ladebokse og tavler. Akut samme dag.</dd>
              </dl>
            </div>

            <form
              className="flex flex-col gap-4 lg:pt-10"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
                e.currentTarget.reset();
              }}
            >
              {sent && (
                <p role="status" className="border-l-4 border-[#17191B] bg-[#EDEDE9] p-4 leading-normal">
                  Tak. På en rigtig side ville Mads ringe dig op i dag eller i morgen tidlig. Dette er et eksempel, så der er ikke sendt noget.
                </p>
              )}
              <fieldset>
                <legend className="mb-2 text-[15px] font-medium">Hvad drejer det sig om?</legend>
                <div className="flex flex-wrap gap-2">
                  {["Ladeboks", "Ny tavle", "Fejl, der ikke haster", "Andet"].map((k) => (
                    <label key={k} className={`cursor-pointer border px-3.5 py-2 text-[15px] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#17191B] ${kind === k ? "border-[#17191B] bg-[#17191B] text-white" : "border-[#9EA19C] hover:border-[#17191B]"}`}>
                      <input type="radio" name="emne" value={k} checked={kind === k} onChange={() => setKind(k)} className="sr-only" />
                      {k}
                    </label>
                  ))}
                </div>
              </fieldset>
              <p className="text-sm text-[#585C60]">
                Er strømmen gået, så ring på{" "}
                <a href={TEL} className="font-semibold text-[#17191B] underline underline-offset-2">
                  {PHONE}
                </a>{" "}
                i stedet. Vi læser ikke beskeder om aftenen.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-[15px] font-medium">
                  Navn
                  <input required name="navn" autoComplete="name" className={field} />
                </label>
                <label className="flex flex-col gap-1.5 text-[15px] font-medium">
                  Telefon
                  <input required name="telefon" type="tel" autoComplete="tel" pattern="[0-9 +]{8,}" title="Skriv et telefonnummer på mindst 8 cifre" className={field} />
                </label>
              </div>
              <label className="flex flex-col gap-1.5 text-[15px] font-medium">
                Postnummer
                <input required name="postnummer" inputMode="numeric" pattern="\d{4}" maxLength={4} title="Fire cifre" autoComplete="postal-code" className={`${field} max-w-[160px]`} />
              </label>
              <label className="flex flex-col gap-1.5 text-[15px] font-medium">
                Beskriv kort opgaven
                <textarea required name="besked" rows={4} placeholder="Fx ladeboks i carporten, ca. 15 m fra tavlen i bryggerset" className={`${field} resize-y`} />
              </label>
              <button type="submit" className={`${dark} inline-flex self-start px-6 py-3.5 text-[17px]`}>
                Send
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-[#17191B] pb-24 text-[#C9CBC7] sm:pb-0">
        <div className={`${wrap} flex flex-wrap justify-between gap-x-8 gap-y-2 py-8 text-sm`}>
          <span className="font-bold uppercase tracking-[0.06em] text-white">Fasebro El</span>
          <span>{ADDRESS}</span>
          <span>CVR 00 00 00 00 (eksempel)</span>
          <a href={TEL} className="text-white underline underline-offset-2">
            {PHONE}
          </a>
        </div>
      </footer>

      {/* Phone: call (yellow, the only yellow) or write */}
      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2.5 border-t border-[#C3C5C0] bg-[#EDEDE9] px-4 pb-4 pt-3 sm:hidden">
        <a href={TEL} className={`${call} inline-flex h-[52px]`}>
          Ring nu
        </a>
        <a href="#kontakt" className={`${dark} inline-flex h-[52px]`}>
          Skriv til os
        </a>
      </div>
    </div>
  );
}
