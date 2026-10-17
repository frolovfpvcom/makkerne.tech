"use client";

import { useEffect, useState } from "react";
import { DemoNote, Img } from "./shared";

/*
 * Egholm Tømrer & Snedker in Roskilde. Warm and quiet, like the inside of a wooden house: planed
 * spruce, walnut, smoked oak and the blue of a carpenter's chalk line. A book serif tells each job
 * as a short story about what was hard, with a big photo and a close-up of the detail; a plain
 * sans carries the facts. Wide margins, photos that overlap, and no two jobs laid out alike.
 */

const PHONE = "23 45 67 89";
const TEL = "tel:+4523456789";
const SMS = "sms:+4523456789";
const ADDRESS = "Håndværkervej 8, 4000 Roskilde";

const NAV = [
  ["#opgaver", "Opgaver"],
  ["#vaerksted", "Værkstedet"],
  ["#priser", "Priser"],
  ["#kontakt", "Kontakt"],
] as const;

const PRICES: { what: string; note?: string; price: string }[] = [
  { what: "Besigtigelse", note: "Trækkes fra, hvis du siger ja til tilbuddet.", price: "750 kr." },
  { what: "Timepris, svend", price: "625 kr." },
  { what: "Terrasse med fundament", note: "Trykimprægneret fyr. Lærk og hårdttræ koster mere.", price: "1.900–2.400 kr. pr. m²" },
  { what: "Nyt tag på et parcelhus", note: "Tegl og nyt undertag, 130–160 m².", price: "260.000–380.000 kr." },
  { what: "Tilbygning, trapper og køkkener", price: "Efter besigtigelse" },
];

const FAQ: { q: string; a: string }[] = [
  { q: "Skal en tilbygning godkendes af kommunen?", a: "Som regel, ja. Vi laver tegningerne og sender ansøgningen for dig." },
  { q: "Hvem laver el og VVS?", a: "En elektriker og en VVS'er, vi har brugt i mange år. De står med i vores tilbud, så du kun skal ringe til os." },
];

// Planed spruce #F2EADC, walnut #2A1E16, smoked oak #33261C, chalk-line blue #2D5B8C.
const wrap = "mx-auto w-full max-w-[1360px] px-5 sm:px-10 lg:px-14";
const sans = "font-(family-name:--font-egholm-sans)";
const meta = `${sans} text-[13px] leading-snug text-[#6A5848] sm:text-sm`;
const btn = `${sans} inline-flex items-center justify-center whitespace-nowrap bg-[#2D5B8C] font-semibold text-white transition-colors hover:bg-[#234A73]`;
const field =
  "w-full border-0 border-b-2 border-[#2A1E16]/35 bg-transparent px-0 pb-2 pt-1 text-[22px] leading-snug text-[#2A1E16] placeholder:text-[#2A1E16]/40 focus:border-[#2D5B8C] focus:outline-none sm:text-[28px]";
// The light border that separates a close-up from the photo it overlaps.
const inset = "border-[6px] border-[#F2EADC] sm:border-[10px]";

function StoryText({ facts, title, children, className = "" }: { facts: string; title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <p className={meta}>{facts}</p>
      <h3 className="text-[26px] font-medium leading-[1.15] tracking-[-0.015em] sm:text-[32px]">{title}</h3>
      <p className="max-w-[38ch] text-[17px] leading-[1.6] sm:text-lg">{children}</p>
    </div>
  );
}

export function TomrerSite() {
  const [menu, setMenu] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  return (
    <div className="min-h-dvh overflow-x-clip bg-[#F2EADC] font-(family-name:--font-egholm) text-[#2A1E16] [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-[#2D5B8C]">
      <DemoNote className={`bg-[#2A1E16] text-[#CDBFAC] ${sans}`} />

      <header className={`${wrap} flex items-center justify-between gap-6 py-5 sm:py-7`}>
        <a href="#top" className="flex flex-col gap-1 leading-none">
          <span className="text-[28px] font-semibold tracking-[-0.02em] sm:text-[32px]">Egholm</span>
          <span className={`${sans} whitespace-nowrap text-[13px] text-[#6A5848]`}>Tømrer &amp; snedker i Roskilde</span>
        </a>
        <nav aria-label="Hovedmenu" className={`${sans} hidden gap-9 text-[15px] font-medium lg:flex`}>
          {NAV.map(([href, label]) => (
            <a key={href} href={href} className="underline-offset-[6px] hover:underline">
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-6">
          <a href={TEL} className={`${sans} hidden whitespace-nowrap text-[17px] font-semibold sm:inline`}>
            {PHONE}
          </a>
          <button
            type="button"
            aria-label={menu ? "Luk menu" : "Åbn menu"}
            aria-expanded={menu}
            aria-controls="egholm-menu"
            onClick={() => setMenu((m) => !m)}
            className="-mr-2 grid size-11 place-items-center lg:hidden"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
              {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 9h18M3 15h18" />}
            </svg>
          </button>
        </div>
      </header>
      {menu && (
        <nav id="egholm-menu" aria-label="Menu" className="border-y border-[#2A1E16]/15 lg:hidden">
          <ul className={`${wrap} py-3`}>
            {NAV.map(([href, label]) => (
              <li key={href}>
                <a href={href} onClick={() => setMenu(false)} className="block py-3 text-[26px] font-medium">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <main>
        {/* A frame going up and a pencil line on a board: the two halves of the trade */}
        <section id="top" className={`${wrap} grid gap-12 pb-24 pt-6 sm:gap-16 sm:pt-10 lg:grid-cols-12 lg:gap-x-10 lg:pb-36 lg:pt-14`}>
          <div className="flex flex-col items-start lg:col-span-6 lg:pt-12">
            <h1 className="text-[42px] font-medium leading-[1.04] tracking-[-0.03em] sm:text-[64px] lg:text-[clamp(56px,5.4vw,80px)]">
              Tømrer på pladsen, snedker på værkstedet.
            </h1>
            <p className="mt-6 max-w-[32ch] text-lg leading-[1.55] sm:mt-8 sm:text-xl">
              Tag, tilbygninger og terrasser i Roskilde og omegn. Trapper, døre og køkkener laver vi selv i massivt træ.
            </p>
            <a href="#kontakt" className={`${btn} mt-8 h-14 px-7 text-[17px] sm:mt-10`}>
              Fortæl os om opgaven
            </a>
            <p className={`${meta} mt-4`}>
              Eller ring på{" "}
              <a href={TEL} className="whitespace-nowrap font-semibold text-[#2A1E16] underline underline-offset-2">
                {PHONE}
              </a>
              , hverdage kl. 7–16.
            </p>
          </div>
          <figure className="relative -mr-5 ml-6 sm:-mr-10 sm:ml-24 lg:col-span-5 lg:col-start-8 lg:mx-0">
            <Img priority id="1762813384339-c526d5533976" w={1400} alt="Nyt spærskelet i træ mod en blå himmel" className="aspect-[4/5] w-full object-cover sm:aspect-[4/3] lg:aspect-[4/5]" />
            <Img
              id="1659930087003-2d64e33181f7"
              w={700}
              alt="En hånd sætter en blyantstreg på et bræt"
              className={`${inset} absolute -bottom-10 -left-6 aspect-square w-[46%] object-cover sm:-bottom-14 sm:-left-24 sm:w-[38%] lg:-bottom-16 lg:-left-[30%] lg:w-[52%]`}
            />
          </figure>
        </section>

        {/* Jobs, each told by what was hard about it, each laid out its own way */}
        <section id="opgaver" className="pb-24 sm:pb-36">
          <div className={`${wrap} grid gap-3 lg:grid-cols-12 lg:gap-x-10`}>
            <p className={`${meta} lg:col-span-3 lg:pt-3`}>Opgaver 2024–2026</p>
            <h2 className="text-[34px] font-medium leading-[1.1] tracking-[-0.025em] sm:text-5xl lg:col-span-8 lg:text-[56px]">
              Fire opgaver, og hvad der var svært ved dem.
            </h2>
          </div>

          {/* Gadstrup: the room large, the old beam close */}
          <div className={`${wrap} mt-12 grid sm:mt-20 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-10`}>
            <div className="relative -mx-5 sm:-mx-10 lg:contents">
              <Img id="1728025801541-20b44f6ed5f3" w={1800} alt="Stue med synlige loftsbjælker i træ" className="aspect-[4/3] w-full object-cover lg:col-span-8 lg:row-span-2 lg:aspect-[3/2]" />
              <Img
                id="1644925757334-d0397c01518c"
                w={600}
                alt="Nærbillede af gammelt træ med ridser og spor efter værktøj"
                className={`${inset} absolute -bottom-12 right-5 aspect-[4/5] w-[38%] object-cover sm:right-10 sm:w-[30%] lg:static lg:col-span-3 lg:col-start-10 lg:aspect-square lg:w-full lg:border-0`}
              />
            </div>
            <StoryText
              className="mt-16 sm:mt-24 lg:col-span-4 lg:col-start-9 lg:mt-0 lg:self-end"
              facts="Gadstrup · november 2024 · 48 m² · 2 uger"
              title="Bjælkerne lå under gipsen"
            >
              Huset er fra 1890, loftet fra 1974. Vi tog gipsen ned, skiftede to rådne bjælkeender og lod resten stå, som det var.
            </StoryText>
          </div>

          {/* Svogerslev: one wide photo, set in from the left */}
          <div className={`${wrap} mt-24 grid gap-8 sm:mt-36 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-10`}>
            <Img
              id="1587582423116-ec07293f0395"
              w={1800}
              alt="Tømrer på toppen af et nyt vægskelet til en tilbygning"
              className="-mr-5 ml-10 aspect-[4/3] w-[calc(100%-1.25rem)] object-cover sm:-mr-10 sm:ml-24 sm:w-[calc(100%-3.5rem)] lg:col-span-10 lg:col-start-3 lg:mx-0 lg:aspect-[16/9] lg:w-full"
            />
            <div className="flex flex-col gap-3 lg:col-span-4 lg:col-start-3">
              <p className={meta}>Svogerslev · august 2026 · 32 m² · 7 uger</p>
              <h3 className="text-[26px] font-medium leading-[1.15] tracking-[-0.015em] sm:text-[32px]">Et værelse mere, og æbletræet blev stående</h3>
            </div>
            <p className="max-w-[44ch] text-[17px] leading-[1.6] sm:text-lg lg:col-span-5 lg:col-start-8 lg:pt-7">
              Tilbygningen er trukket en meter ind fra skel, så træet kunne blive. Taget har samme hældning som huset, og facaden er lærk, der får lov at gråne.
            </p>
          </div>

          {/* Roskilde C: no room photo, so the words carry it */}
          <div className={`${wrap} mt-24 grid gap-8 sm:mt-36 lg:grid-cols-12 lg:items-start lg:gap-x-10`}>
            <Img
              id="1497219055242-93359eeed651"
              w={800}
              alt="Hænder med et stemmejern i et stykke træ"
              className="aspect-[3/4] w-[64%] object-cover sm:w-[44%] lg:col-span-3 lg:w-full"
            />
            <div className="flex flex-col gap-5 lg:col-span-7 lg:col-start-5 lg:pt-16">
              <p className={meta}>Roskilde C · marts 2025 · 9 dage på værkstedet, 2 i huset</p>
              <h3 className="sr-only">Køkken i massiv eg</h3>
              <p className="text-[28px] leading-[1.25] tracking-[-0.015em] sm:text-[40px] lg:text-[44px]">
                Køkkenet er i massiv eg. Skufferne er sinket sammen og løber på træ, så der ikke sidder en eneste skinne i det.
              </p>
            </div>
          </div>

          {/* Trekroner: the words first, then the deck at full width */}
          <div className="mt-24 sm:mt-36">
            <div className={`${wrap} grid lg:grid-cols-12 lg:gap-x-10`}>
              <StoryText className="lg:col-span-5 lg:col-start-7" facts="Trekroner · juni 2025 · 38 m² · 6 arbejdsdage" title="Terrassen står på punktfundamenter">
                Haven falder en meter, og tæt ved huset står et gammelt egetræ. Uden en støbt sokkel blev rødderne ikke skåret over.
              </StoryText>
            </div>
            <Img id="1773430272653-375174373c4f" w={2400} alt="Tre tømrere lægger strøer til et nyt terrassedæk bag et træhus" className="mt-10 aspect-[4/3] w-full object-cover sm:mt-14 sm:aspect-[21/9]" />
          </div>

          <p className={`${wrap} ${meta} mt-6`}>Opgaverne er eksempler, og fotos er pladsholdere fra Unsplash. På din side står jeres egne opgaver med jeres egne billeder.</p>
        </section>

        {/* The workshop, in smoked oak */}
        <section id="vaerksted" className="bg-[#33261C] text-[#F2EADC] [&_:focus-visible]:outline-[#F2EADC]">
          <div className="grid lg:grid-cols-2">
            <Img id="1683115099191-51e617fc5ff1" w={1400} alt="Værktøj hængt op på en væg i et værksted" className="aspect-[4/3] w-full object-cover sm:aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-[640px]" />
            <div className="flex flex-col justify-center px-5 py-16 sm:px-10 sm:py-24 lg:px-16 xl:px-24">
              <h2 className="max-w-[18ch] text-[34px] font-medium leading-[1.1] tracking-[-0.025em] sm:text-5xl">Det, der skal passe på millimeter, laver vi på værkstedet.</h2>
              <dl className="mt-10 grid gap-6 sm:grid-cols-2 sm:gap-8">
                <div className="border-t border-[#F2EADC]/25 pt-4">
                  <dt className={`${sans} text-sm text-[#BFAE98]`}>På pladsen</dt>
                  <dd className="mt-2 text-lg leading-[1.5]">Tag og kviste, tilbygninger, terrasser og bjælkelofter.</dd>
                </div>
                <div className="border-t border-[#F2EADC]/25 pt-4">
                  <dt className={`${sans} text-sm text-[#BFAE98]`}>På værkstedet</dt>
                  <dd className="mt-2 text-lg leading-[1.5]">Trapper, døre, vinduer og køkkener, mest i eg og ask.</dd>
                </div>
              </dl>
              <p className="mt-10 max-w-[44ch] text-lg leading-[1.55] text-[#E3D7C6]">
                Kom gerne forbi og se træet, før vi går i gang. Ring først, så er der nogen hjemme.
              </p>
              <p className={`${sans} mt-3 text-sm text-[#BFAE98]`}>{ADDRESS}</p>
            </div>
          </div>
        </section>

        {/* Prices as a short list, with room around it */}
        <section id="priser" className={`${wrap} grid gap-10 py-24 sm:py-36 lg:grid-cols-12 lg:gap-x-10`}>
          <div className="flex flex-col gap-4 lg:sticky lg:top-10 lg:col-span-4 lg:self-start">
            <h2 className="text-[34px] font-medium leading-[1.1] tracking-[-0.025em] sm:text-5xl">Priser</h2>
            <p className="max-w-[32ch] text-lg leading-[1.55]">Du får en fast pris, når vi har set opgaven. Her er, hvad det plejer at koste.</p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <dl className="border-b border-[#2A1E16]/20">
              {PRICES.map((p) => (
                <div key={p.what} className="grid gap-x-8 gap-y-1 border-t border-[#2A1E16]/20 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline">
                  <dt className="text-xl font-medium sm:text-[22px]">{p.what}</dt>
                  <dd className={`text-xl sm:text-right sm:text-[22px] ${p.price.includes("kr") ? "" : "text-[#6A5848]"}`}>{p.price}</dd>
                  {p.note && <dd className={`${meta} mt-1 sm:col-span-2 sm:mt-0`}>{p.note}</dd>}
                </div>
              ))}
            </dl>
            <p className={`${meta} mt-4`}>Eksempelpriser inkl. moms. På din side står dine egne.</p>
            <div className="mt-12 flex flex-col">
              {FAQ.map((f) => (
                <details key={f.q} className="group border-t border-[#2A1E16]/20 last:border-b">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-lg font-medium [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span aria-hidden className={`${sans} mt-0.5 text-xl leading-none transition-transform group-open:rotate-45`}>
                      +
                    </span>
                  </summary>
                  <p className="max-w-[52ch] pb-6 text-[17px] leading-[1.6]">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Contact: write it as you would say it */}
        <section id="kontakt" className="bg-[#F9F5EE]">
          <div className={`${wrap} grid gap-16 py-24 sm:py-32 lg:grid-cols-12 lg:gap-x-10`}>
            <div className="lg:col-span-7">
              <h2 className="text-[34px] font-medium leading-[1.1] tracking-[-0.025em] sm:text-5xl">Hvad skal laves?</h2>
              <form
                className="mt-10 flex flex-col gap-8 sm:mt-12"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                  e.currentTarget.reset();
                }}
              >
                <label className="flex flex-col gap-2">
                  <span className="text-[22px] sm:text-[28px]">Vi vil gerne have lavet</span>
                  <textarea required name="opgave" rows={2} placeholder="fx et bjælkeloft i stuen, ca. 40 m²" className={`${field} resize-none`} />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-[22px] sm:text-[28px]">Ring til mig på</span>
                  <input
                    required
                    name="telefon"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    pattern="[0-9 +]{8,}"
                    title="Skriv et telefonnummer på mindst 8 cifre"
                    placeholder="dit telefonnummer"
                    className={field}
                  />
                </label>
                <div className="flex flex-col items-start gap-4">
                  <button type="submit" className={`${btn} h-14 px-9 text-[17px]`}>
                    Send
                  </button>
                  {sent && (
                    <p role="status" className={`${sans} max-w-[48ch] text-[15px] leading-[1.5]`}>
                      Tak. På en rigtig side ville vi nu ringe dig op. Dette er et eksempel, så der er ikke sendt noget.
                    </p>
                  )}
                </div>
              </form>
            </div>
            <div className="flex flex-col gap-6 lg:col-span-4 lg:col-start-9 lg:pt-3">
              <div>
                <a href={TEL} className="whitespace-nowrap text-[36px] font-medium leading-none tracking-[-0.02em] underline-offset-4 hover:underline sm:text-[40px]">
                  {PHONE}
                </a>
                <p className={`${meta} mt-2`}>Hverdage kl. 7–16</p>
              </div>
              <p className="text-[17px] leading-[1.55]">
                Har du et billede af opgaven,{" "}
                <a href={SMS} className="underline underline-offset-2 hover:text-[#2D5B8C]">
                  så send det på SMS
                </a>
                .
              </p>
              <dl className={`${sans} grid grid-cols-[max-content_minmax(0,1fr)] gap-x-5 gap-y-2.5 border-t border-[#2A1E16]/20 pt-5 text-[15px]`}>
                <dt className="text-[#6A5848]">Værksted</dt>
                <dd>{ADDRESS}</dd>
                <dt className="text-[#6A5848]">Område</dt>
                <dd>Roskilde, Lejre og Greve</dd>
                <dt className="text-[#6A5848]">Besigtigelse</dt>
                <dd>750 kr., trækkes fra</dd>
                <dt className="text-[#6A5848]">Garanti</dt>
                <dd>Byg Garanti (eksempel)</dd>
                <dt className="text-[#6A5848]">CVR</dt>
                <dd>00 00 00 00 (eksempel)</dd>
              </dl>
            </div>
          </div>
        </section>
      </main>

      <footer className={`${sans} bg-[#2A1E16] pb-24 text-[#CDBFAC] sm:pb-0`}>
        <div className={`${wrap} flex flex-wrap justify-between gap-x-8 gap-y-2 py-10 text-sm`}>
          <span className="font-semibold text-[#F2EADC]">Egholm Tømrer &amp; Snedker</span>
          <span>{ADDRESS}</span>
          <span>CVR 00 00 00 00 (eksempel)</span>
          <a href={TEL} className="text-[#F2EADC] underline underline-offset-2">
            {PHONE}
          </a>
        </div>
      </footer>

      {/* Phone: call, or text a photo of the job */}
      <div className={`${sans} fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-[#2A1E16]/15 bg-[#F2EADC] px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 sm:hidden`}>
        <a href={TEL} className={`${btn} h-[52px] flex-1 text-[17px]`}>
          Ring {PHONE}
        </a>
        <a href={SMS} className="grid h-[52px] place-items-center whitespace-nowrap border-2 border-[#2A1E16] px-5 font-semibold">
          SMS
        </a>
      </div>
    </div>
  );
}
