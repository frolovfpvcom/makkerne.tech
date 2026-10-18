"use client";

import { useEffect, useRef, useState } from "react";
import { DemoNote, Img } from "./shared";

/*
 * Bøgh Gulve in Hillerød. The floors do the talking and the words stay out of the way: a light
 * geometric sans, lye white and soaped oak, and photos at the width of a room. It opens on a
 * before-and-after you can drag, the finishes are chosen by their grain up close, and the jobs are
 * wide rooms with one line each.
 */

const PHONE = "67 89 01 23";
const TEL = "tel:+4567890123";
const ADDRESS = "Kornmarken 7B, 3400 Hillerød";

const NAV = [
  ["#behandling", "Pris"],
  ["#gulve", "Gulve"],
  ["#kontakt", "Kontakt"],
] as const;

const HERO = "1562582664-8a8803c031ca";

type Finish = { name: string; photo: string; alt: string; rate: number | null; days: number; when: string; use: string };

const FINISHES: Finish[] = [
  {
    name: "Lak",
    photo: "1597113366853-fea190b6cd82",
    alt: "Lakeret egeplanke set helt tæt på",
    rate: 235,
    days: 2,
    when: "Det mest slidstærke og det letteste at holde rent.",
    use: "I kan gå på det i strømpesokker dagen efter. Tæpper først efter to uger.",
  },
  {
    name: "Olie",
    photo: "1544840280-80e54213dfdc",
    alt: "Olieret træ med tydelige årer",
    rate: 250,
    days: 2,
    when: "Mat, og man kan se træet. Skal have plejeolie en til to gange om året.",
    use: "Kan betrædes forsigtigt efter et døgn. Ingen vand den første uge.",
  },
  {
    name: "Sæbe",
    photo: "1611072337226-1140ab367200",
    alt: "Lys egeplanke behandlet med sæbe",
    rate: 215,
    days: 1,
    when: "Til lyse gulve i fyr og eg, der skal blive lyse. Vaskes med sæbespåner.",
    use: "Rummet kan bruges samme aften.",
  },
  {
    name: "Nyt gulv",
    photo: "1590938272761-c11f74452660",
    alt: "Nylagt parketgulv i træ",
    rate: null,
    days: 0,
    when: "Planker, parket eller sildeben. Prisen afhænger af træet og undergulvet.",
    use: "",
  },
];

const MIN_PRICE = 3800;

const PRICES: { what: string; price: string }[] = [
  { what: "Opmåling", price: "450 kr." },
  { what: "Hvidpigment i lak eller olie, tillæg", price: "40 kr. pr. m²" },
  { what: "Trappe, slibning og lak", price: "650 kr. pr. trin" },
  { what: "Mindstepris pr. opgave", price: "3.800 kr." },
  { what: "Nyt plankegulv eller parket, arbejdsløn", price: "320–420 kr. pr. m²" },
  { what: "Sildeben, arbejdsløn", price: "750–950 kr. pr. m²" },
];

const kr = (n: number) => `${n.toLocaleString("da-DK")} kr.`;

// Lye white #F7F5F0, soaped oak #E7DCC9, smoked oak #2B2620, grey #6B6257.
const wrap = "mx-auto w-full max-w-[1440px] px-5 sm:px-10";
const h2 = "text-[36px] font-light leading-[1.05] tracking-[-0.02em] sm:text-[52px]";
const meta = "text-[14px] text-[#6B6257]";
const btn = "inline-flex items-center justify-center whitespace-nowrap bg-[#2B2620] font-medium text-[#F7F5F0] transition-colors hover:bg-[#4A4038]";
const field = "w-full border-0 border-b border-[#2B2620]/40 bg-transparent px-0 py-2.5 text-lg text-[#2B2620] placeholder:text-[#6B6257] focus:border-[#2B2620] focus:outline-none";

/** Drag to wipe from the old floor to the new one. */
function FloorSlider() {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const moveTo = (x: number) => {
    const r = box.current?.getBoundingClientRect();
    if (r) setPos(Math.min(100, Math.max(0, ((x - r.left) / r.width) * 100)));
  };
  return (
    <figure>
      <div
        ref={box}
        className="relative aspect-[4/5] cursor-ew-resize touch-pan-y select-none overflow-hidden sm:aspect-[16/9] lg:aspect-auto lg:h-[min(82svh,880px)]"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          moveTo(e.clientX);
        }}
        onPointerMove={(e) => e.buttons && moveTo(e.clientX)}
      >
        <Img priority id={HERO} w={2400} alt="Slebet trægulv med sollys hen over plankerne" className="pointer-events-none absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Img priority id={HERO} w={2400} alt="" className="pointer-events-none size-full object-cover brightness-[0.7] contrast-[0.85] grayscale-[60%] sepia-[45%]" />
        </div>
        <span className="absolute left-0 top-0 bg-[#2B2620] px-3 py-1.5 text-[13px] font-medium uppercase tracking-[0.14em] text-[#F7F5F0]">Før</span>
        <span className="absolute right-0 top-0 bg-[#F7F5F0] px-3 py-1.5 text-[13px] font-medium uppercase tracking-[0.14em] text-[#2B2620]">Efter</span>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(pos)}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Før og efter: træk til højre for at se gulvet før"
          className="peer absolute inset-x-0 bottom-0 h-1 w-full opacity-0"
        />
        <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-[#F7F5F0] peer-focus-visible:[&>span]:outline-2 peer-focus-visible:[&>span]:outline-offset-2 peer-focus-visible:[&>span]:outline-[#F7F5F0]" style={{ left: `${pos}%` }}>
          <span className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center bg-[#F7F5F0] text-[#2B2620]">
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
              <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />
            </svg>
          </span>
        </div>
      </div>
      <figcaption className={`${wrap} mt-3 ${meta}`}>Pladsholder: før-billedet er det samme foto, gjort mat. På din side står to rigtige fotos af det samme gulv.</figcaption>
    </figure>
  );
}

export function GulvSite() {
  const [menu, setMenu] = useState(false);
  const [pick, setPick] = useState(0);
  const [m2, setM2] = useState("24");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const f = FINISHES[pick];
  const area = Math.max(0, Math.min(400, Number(m2.replace(",", ".")) || 0));
  const price = f.rate ? Math.max(MIN_PRICE, Math.round((area * f.rate) / 100) * 100) : 0;
  const days = f.days + (area > 60 ? 1 : 0) + (area > 120 ? 1 : 0);

  return (
    <div className="min-h-dvh overflow-x-clip bg-[#F7F5F0] font-(family-name:--font-boegh) text-[#2B2620] [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-[#2B2620]">
      <DemoNote className="bg-[#2B2620] text-[#E2D8C6]" />

      <header className={`${wrap} flex items-center justify-between gap-6 py-5`}>
        <a href="#top" className="whitespace-nowrap text-[17px] font-medium uppercase tracking-[0.22em]">
          Bøgh Gulve
        </a>
        <nav aria-label="Hovedmenu" className="hidden gap-9 text-[15px] lg:flex">
          {NAV.map(([href, label]) => (
            <a key={href} href={href} className="underline-offset-[6px] hover:underline">
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-5">
          <a href={TEL} className="hidden whitespace-nowrap font-medium sm:inline">
            {PHONE}
          </a>
          <button
            type="button"
            aria-label={menu ? "Luk menu" : "Åbn menu"}
            aria-expanded={menu}
            aria-controls="boegh-menu"
            onClick={() => setMenu((m) => !m)}
            className="-mr-2 grid size-11 place-items-center lg:hidden"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 9h18M3 15h18" />}
            </svg>
          </button>
        </div>
      </header>
      {menu && (
        <nav id="boegh-menu" aria-label="Menu" className="border-y border-[#2B2620]/12 lg:hidden">
          <ul className={`${wrap} py-3`}>
            {NAV.map(([href, label]) => (
              <li key={href}>
                <a href={href} onClick={() => setMenu(false)} className="block py-3 text-[28px] font-light">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <main>
        {/* A few words, then the floor before and after, at full width */}
        <section id="top">
          <div className={`${wrap} grid gap-8 pb-10 pt-6 sm:pb-14 sm:pt-10 lg:grid-cols-12 lg:items-end lg:gap-x-10`}>
            <h1 className="text-[42px] font-light leading-[1.04] tracking-[-0.025em] sm:text-[64px] lg:col-span-7 lg:text-[clamp(60px,5.6vw,84px)]">
              Vi sliber, olierer og lægger trægulve i Nordsjælland.
            </h1>
            <div className="flex flex-col items-start gap-4 lg:col-span-4 lg:col-start-9">
              <p className="max-w-[32ch] text-lg leading-[1.5]">De fleste gulve er færdige på to dage. Opmålingen koster 450 kr. og trækkes fra.</p>
              <a href="#kontakt" className={`${btn} h-14 px-7 text-[17px]`}>
                Book en opmåling
              </a>
            </div>
          </div>
          <FloorSlider />
        </section>

        {/* Choose the finish by its grain, and see what it costs */}
        <section id="behandling" className={`${wrap} py-24 sm:py-36`}>
          <div className="grid gap-4 lg:grid-cols-12 lg:gap-x-10">
            <h2 className={`${h2} lg:col-span-6`}>Hvad skal dit gulv have?</h2>
            <p className="max-w-[36ch] text-lg leading-[1.5] text-[#6B6257] lg:col-span-4 lg:col-start-9 lg:self-end">Vælg en behandling, og skriv hvor mange m² rummet er.</p>
          </div>
          <div role="group" aria-label="Behandling" className="mt-10 grid grid-cols-4 gap-2 sm:mt-14 sm:gap-4 lg:gap-6">
            {FINISHES.map((x, i) => (
              <button key={x.name} type="button" aria-pressed={pick === i} onClick={() => setPick(i)} className="group flex flex-col gap-2 text-left sm:gap-3">
                <span className={`block overflow-hidden transition-opacity ${pick === i ? "" : "opacity-60 group-hover:opacity-100"}`}>
                  <Img id={x.photo} w={700} alt={x.alt} className="aspect-square w-full object-cover sm:aspect-[3/4]" />
                </span>
                <span className={`border-t-2 pt-2 text-[15px] leading-tight sm:text-lg ${pick === i ? "border-[#2B2620] font-medium" : "border-transparent text-[#6B6257]"}`}>
                  {x.name}
                  <span className="hidden text-[15px] text-[#6B6257] sm:block">{x.rate ? `${x.rate} kr. pr. m²` : "Efter opmåling"}</span>
                </span>
              </button>
            ))}
          </div>
          <div aria-live="polite" className="mt-10 grid gap-8 border-t border-[#2B2620]/15 pt-8 sm:mt-14 lg:grid-cols-12 lg:gap-x-10">
            <div className="flex flex-col gap-2 lg:col-span-5">
              <p className="text-2xl font-normal">{f.name}</p>
              <p className="max-w-[40ch] text-[17px] leading-[1.55]">{f.when}</p>
            </div>
            {f.rate ? (
              <div className="flex flex-wrap items-end gap-x-8 gap-y-4 lg:col-span-6 lg:col-start-7">
                <label className="flex flex-col text-[15px] text-[#6B6257]">
                  Rummets m²
                  <input
                    inputMode="decimal"
                    value={m2}
                    onChange={(e) => setM2(e.target.value.replace(/[^\d,.]/g, ""))}
                    className="w-24 border-0 border-b border-[#2B2620]/40 bg-transparent px-0 py-2 text-2xl tabular-nums text-[#2B2620] focus:border-[#2B2620] focus:outline-none"
                  />
                </label>
                <p className="text-[36px] font-light leading-none tracking-[-0.02em] sm:text-[52px]">
                  <span className="whitespace-nowrap">ca. {kr(price)}</span>
                </p>
                <p className="basis-full text-[15px] leading-[1.5] text-[#6B6257]">
                  {days} {days === 1 ? "dag" : "dage"}. {f.use} Inkl. moms.{area * f.rate < MIN_PRICE && ` Mindstepris ${kr(MIN_PRICE)}`}
                </p>
              </div>
            ) : (
              <p className="text-[17px] leading-[1.55] lg:col-span-6 lg:col-start-7">Ring eller skriv, så kommer vi og måler op. Opmålingen koster 450 kr. og trækkes fra.</p>
            )}
          </div>
          <details className="group mt-10 border-y border-[#2B2620]/15 lg:ml-[calc(50%+1.25rem)]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[17px] [&::-webkit-details-marker]:hidden">
              Hele prislisten
              <span aria-hidden className="text-2xl font-light leading-none transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <dl className="pb-4 text-[15px]">
              {PRICES.map((p) => (
                <div key={p.what} className="flex justify-between gap-4 border-t border-[#2B2620]/10 py-2.5">
                  <dt>{p.what}</dt>
                  <dd className="whitespace-nowrap text-right">{p.price}</dd>
                </div>
              ))}
            </dl>
            <p className={`pb-4 ${meta}`}>Eksempelpriser inkl. moms. På din side står dine egne.</p>
          </details>
        </section>

        {/* Floors from this year, at the width of the room */}
        <section id="gulve" className="pb-24 sm:pb-36">
          <div className={wrap}>
            <h2 className={h2}>Gulve fra i år</h2>
          </div>
          <figure className="mt-10 sm:mt-14">
            <Img id="1668910242969-bd2933e7a5cf" w={2400} alt="Stue med lyse fyrreplanker og et vindue ud mod træer" className="aspect-[4/3] w-full object-cover sm:aspect-[21/9]" />
            <figcaption className={`${wrap} mt-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8`}>
              <span className="text-xl">Malede fyrreplanker fra 1920, ludet og sæbet</span>
              <span className={meta}>Alsønderup · 64 m² · 2 dage</span>
            </figcaption>
          </figure>
          <div className={`${wrap} mt-20 grid gap-16 sm:mt-28 lg:grid-cols-12 lg:gap-x-10`}>
            <figure className="lg:col-span-5">
              <Img id="1761053130711-2515ef532bb5" w={1200} alt="Sildebensgulv i eg set tæt på" className="aspect-[4/5] w-full object-cover" />
              <figcaption className="mt-4 flex flex-col gap-1">
                <span className="text-xl">Sildeben i eg med en bort langs væggene</span>
                <span className={meta}>Hillerød C · 38 m² · 6 dage</span>
              </figcaption>
            </figure>
            <figure className="lg:col-span-7 lg:mt-48">
              <Img id="1721395290083-895bf53d6178" w={1600} alt="Tomt rum med lyst trægulv og hvide vægge" className="aspect-[3/2] w-full object-cover" />
              <figcaption className="mt-4 flex flex-col gap-1">
                <span className="text-xl">To børneværelser, mens familien var på ferie</span>
                <span className={meta}>Fredensborg · 24 m² · olie · 2 dage</span>
              </figcaption>
            </figure>
          </div>
          <figure className="mt-20 sm:mt-28">
            <Img id="1598718544285-7180f670198b" w={2400} alt="Stue med brunt parketgulv og hvide vægge" className="aspect-[4/3] w-full object-cover sm:aspect-[21/9]" />
            <figcaption className={`${wrap} mt-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8`}>
              <span className="text-xl">Parket fra 1978, slebet for første gang</span>
              <span className={meta}>Allerød · 52 m² · mat lak · 3 dage</span>
            </figcaption>
          </figure>
          <p className={`${wrap} mt-10 ${meta}`}>Gulvene er eksempler, og fotos er pladsholdere fra Unsplash. På din side står jeres egne gulve.</p>
        </section>

        {/* Contact on soaped oak */}
        <section id="kontakt" className="bg-[#E7DCC9]">
          <div className={`${wrap} grid gap-14 py-24 sm:py-32 lg:grid-cols-12 lg:gap-x-10`}>
            <div className="flex flex-col gap-5 lg:col-span-5">
              <h2 className={h2}>Book en opmåling</h2>
              <p className="max-w-[34ch] text-lg leading-[1.5]">Vi kommer ud og ser gulvet. Det koster 450 kr., som trækkes fra, hvis vi laver det.</p>
              <a href={TEL} className="mt-2 whitespace-nowrap text-[36px] font-light tracking-[-0.02em] underline-offset-[6px] hover:underline sm:text-[44px]">
                {PHONE}
              </a>
              <dl className="mt-4 grid grid-cols-[max-content_minmax(0,1fr)] gap-x-6 gap-y-2.5 text-[15px]">
                <dt className="text-[#6B6257]">Telefon</dt>
                <dd>Hverdage kl. 7–16</dd>
                <dt className="text-[#6B6257]">Værksted</dt>
                <dd>{ADDRESS}</dd>
                <dt className="text-[#6B6257]">Område</dt>
                <dd>Hillerød, Allerød, Fredensborg og Gribskov</dd>
                <dt className="text-[#6B6257]">Garanti</dt>
                <dd>Byg Garanti (eksempel)</dd>
                <dt className="text-[#6B6257]">CVR</dt>
                <dd>00 00 00 00 (eksempel)</dd>
              </dl>
            </div>
            <form
              className="flex flex-col gap-8 lg:col-span-6 lg:col-start-7 lg:pt-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
                e.currentTarget.reset();
              }}
            >
              <label className="flex flex-col gap-1 text-[15px] text-[#6B6257]">
                Hvilket gulv, og hvor stort?
                <textarea required name="gulv" rows={3} placeholder="Fx stue med gammel parket, ca. 30 m²" className={`${field} resize-y`} />
              </label>
              <label className="flex flex-col gap-1 text-[15px] text-[#6B6257]">
                Telefon
                <input required name="telefon" type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9 +]{8,}" title="Skriv et telefonnummer på mindst 8 cifre" className={field} />
              </label>
              <div className="flex flex-col items-start gap-4">
                <button type="submit" className={`${btn} h-14 px-8 text-[17px]`}>
                  Send
                </button>
                {sent && (
                  <p role="status" className="text-[15px] leading-[1.5]">
                    Tak. På en rigtig side ville vi ringe dig op og finde en dag. Dette er et eksempel, så der er ikke sendt noget.
                  </p>
                )}
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-[#2B2620] pb-24 text-[#D8CFC2] sm:pb-0">
        <div className={`${wrap} flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-10 text-sm`}>
          <span className="font-medium uppercase tracking-[0.22em] text-[#F7F5F0]">Bøgh Gulve</span>
          <span>{ADDRESS}</span>
          <span>CVR 00 00 00 00 (eksempel)</span>
          <a href={TEL} className="text-[#F7F5F0] underline underline-offset-2">
            {PHONE}
          </a>
        </div>
      </footer>

      {/* Phone: call, or book the visit */}
      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2 border-t border-[#2B2620]/12 bg-[#F7F5F0] px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 sm:hidden">
        <a href={TEL} className="grid h-[52px] place-items-center whitespace-nowrap border border-[#2B2620] font-medium">
          Ring {PHONE}
        </a>
        <a href="#kontakt" className={`${btn} h-[52px]`}>
          Book opmåling
        </a>
      </div>
    </div>
  );
}
