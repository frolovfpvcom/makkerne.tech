"use client";

import { useEffect, useState } from "react";
import { DemoNote, Img } from "./shared";

/*
 * Fasebro El is the inside of the fuse board door: a dark panel, white print, and warning yellow
 * only where you should act, which is calling us. The page opens with the question people actually
 * have when they look for an electrician in a hurry, "what has happened?", and answers it before it
 * sells anything. Then the two jobs that pay the bills: chargers and new boards.
 */

const PHONE = "56 78 12 34";
const TEL = "tel:+4556781234";
const SMS = "sms:+4556781234";
const ADDRESS = "Industrivej 14, 4600 Køge";

// Colours: graphite #1A1C1E, panel white #EEEDE8, line on dark #3A3D40, on light #C8C7C1,
// muted on dark #A9ACA8, on light #55585B, warning yellow #F5C400 for calling only.

const mono = "font-(family-name:--font-fasebro-mono)";
const wrap = "mx-auto w-full max-w-[1240px] px-5 sm:px-10";
const h2 = "text-[34px] font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-[52px]";
const call = "inline-flex items-center justify-center whitespace-nowrap bg-[#F5C400] font-extrabold text-[#1A1C1E] transition-colors hover:bg-[#FFD633]";
const field = "w-full border-2 border-[#1A1C1E] bg-white px-4 py-3 text-[17px] text-[#1A1C1E] placeholder:text-[#6C6F72]";

const NAV = [
  ["#fejl", "Fejl i strømmen"],
  ["#ladeboks", "Ladeboks"],
  ["#tavler", "Eltavler"],
  ["#priser", "Priser"],
  ["#kontakt", "Kontakt"],
] as const;

const FAULTS = [
  { key: "strom", label: "Strømmen er gået" },
  { key: "hpfi", label: "HPFI-relæet slår fra" },
  { key: "brand", label: "Det lugter brændt" },
] as const;
type Fault = (typeof FAULTS)[number]["key"];

const HPFI = [
  "Slå alle grupperne fra. Det er de små automatsikringer ved siden af relæet.",
  "Slå HPFI-relæet til igen.",
  "Slå grupperne til én ad gangen. Den, der får relæet til at slå fra, er der, hvor fejlen er. Lad den være slået fra.",
  "Træk stikkene ud på den gruppe og sæt dem i igen ét ad gangen. Tit er det en vaskemaskine, en kogeplade eller en udendørslampe med vand i.",
];

/** Charger: a base price plus what changes it. Example prices incl. moms. */
const BASE = 9995;
const DISTANCE = [
  { label: "Under 10 m", add: 0 },
  { label: "10–25 m", add: 1800 },
  { label: "Over 25 m", add: 4200 },
];
const MOUNT = [
  { label: "På væggen", add: 0 },
  { label: "På en stander", add: 1900 },
];

const PRICES: { what: string; note?: string; price: string }[] = [
  { what: "Akut fremmøde, hverdage kl. 7–16", note: "med kørsel i Køge Kommune og den første halve time", price: "1.195 kr." },
  { what: "Akut fremmøde, aften og weekend", price: "1.995 kr." },
  { what: "Timepris, elektriker", price: "595 kr." },
  { what: "Ny stikkontakt på en eksisterende gruppe", price: "650–950 kr." },
  { what: "Ladeboks 11 kW, monteret", price: "fra 9.995 kr." },
  { what: "Ny eltavle i parcelhus", note: "8–12 grupper, HPFI-relæ og mærkning", price: "14.000–19.000 kr." },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Må jeg selv skifte en stikkontakt?",
    a: "Ja, hvis den nye er af samme slags som den gamle, og du har slået gruppen fra. Nye ledninger og nye udtag skal en autoriseret elinstallatør lave. Sikkerhedsstyrelsen har en liste over, hvad du selv må.",
  },
  {
    q: "Skal ladeboksen anmeldes?",
    a: "Ja, til netselskabet. Det gør vi, og det er med i prisen.",
  },
];

const kr = (n: number) => `${n.toLocaleString("da-DK")} kr.`;

function CallButton({ className = "" }: { className?: string }) {
  return (
    <a href={TEL} className={`${call} h-14 px-7 text-lg ${className}`}>
      Ring {PHONE}
    </a>
  );
}

/** One segmented choice: radios that look like a row of switches. */
function Switches({ name, legend, options, value, onChange }: { name: string; legend: string; options: { label: string; add: number }[]; value: number; onChange: (i: number) => void }) {
  return (
    <fieldset>
      <legend className="mb-3 text-[17px] font-bold">{legend}</legend>
      <div className={`grid gap-1.5 ${options.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
        {options.map((o, i) => (
          <label
            key={o.label}
            className="flex cursor-pointer flex-col items-center justify-center border-2 border-[#1A1C1E] px-1 py-3 text-center has-checked:bg-[#1A1C1E] has-checked:text-[#EEEDE8] has-focus-visible:outline-[3px] has-focus-visible:outline-offset-2 has-focus-visible:outline-[#1A1C1E]"
          >
            <input type="radio" name={name} checked={value === i} onChange={() => onChange(i)} className="sr-only" />
            <span className="whitespace-nowrap text-[15px] font-bold sm:text-[17px]">{o.label}</span>
            <span className="mt-0.5 whitespace-nowrap text-[14px] tabular-nums">{o.add ? `+${kr(o.add)}` : "med i prisen"}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function ElSite() {
  const [menu, setMenu] = useState(false);
  const [fault, setFault] = useState<Fault>("strom");
  const [distance, setDistance] = useState(0);
  const [mount, setMount] = useState(0);
  const [job, setJob] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const price = BASE + DISTANCE[distance].add + MOUNT[mount].add;

  return (
    <div className="min-h-dvh overflow-x-clip bg-[#EEEDE8] font-(family-name:--font-fasebro) text-[#1A1C1E] [&_:focus-visible]:outline-[3px] [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-[#1A1C1E]">
      <DemoNote className="bg-black font-sans text-[#A9ACA8]" />

      <header className="relative z-40 border-b border-[#3A3D40] bg-[#1A1C1E] text-[#EEEDE8] sm:sticky sm:top-0 [&_:focus-visible]:outline-[#F5C400]">
        <div className={`${wrap} flex items-center justify-between gap-4 py-3`}>
          <a href="#top" className="flex min-w-0 flex-col leading-none">
            <span className="whitespace-nowrap text-[22px] font-black uppercase tracking-[0.02em]">Fasebro El</span>
            <span className={`${mono} mt-1 whitespace-nowrap text-[11px] text-[#A9ACA8]`}>Aut. elinstallatør · Køge</span>
          </a>
          <nav aria-label="Hovedmenu" className="hidden gap-6 whitespace-nowrap text-[16px] font-semibold lg:flex">
            {NAV.map(([href, label]) => (
              <a key={href} href={href} className="underline-offset-4 hover:underline">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-3">
            <a href={TEL} className={`${call} h-11 px-4 text-[16px] max-sm:hidden`}>
              Ring {PHONE}
            </a>
            <button
              type="button"
              aria-label={menu ? "Luk menu" : "Åbn menu"}
              aria-expanded={menu}
              aria-controls="fasebro-menu"
              onClick={() => setMenu((m) => !m)}
              className="grid size-11 place-items-center border-2 border-[#EEEDE8] lg:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="square" aria-hidden>
                {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
        {menu && (
          <nav id="fasebro-menu" aria-label="Menu" className="border-t border-[#3A3D40] lg:hidden">
            <ul className={`${wrap} py-2`}>
              {NAV.map(([href, label]) => (
                <li key={href}>
                  <a href={href} onClick={() => setMenu(false)} className="block border-b border-[#3A3D40] py-3.5 text-lg font-semibold">
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <a href={TEL} className="block py-3.5 text-lg font-bold text-[#F5C400]">
                  Ring {PHONE}
                </a>
              </li>
            </ul>
          </nav>
        )}
      </header>

      <main>
        {/* The question first: what has happened? */}
        <section id="top" className="bg-[#1A1C1E] text-[#EEEDE8] [&_:focus-visible]:outline-[#F5C400]">
          <div className={`${wrap} pb-16 pt-10 sm:pb-24 sm:pt-16 lg:pt-20`}>
            <h1 className="max-w-[14ch] text-[44px] font-black leading-[0.95] tracking-[-0.04em] sm:text-[76px] lg:text-[96px]">Elektriker i Køge.</h1>
            <p className="mt-5 max-w-[36ch] text-[19px] leading-[1.4] text-[#A9ACA8] sm:text-[22px]">Fejl i strømmen, nye eltavler og ladebokse til elbilen.</p>

            <div id="fejl" className="mt-12 sm:mt-16">
              <h2 className="text-[22px] font-extrabold sm:text-[26px]">Hvad er der sket?</h2>
              <div className="mt-4 grid gap-2 md:grid-cols-3">
                {FAULTS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    aria-pressed={fault === f.key}
                    aria-controls="fejl-svar"
                    onClick={() => setFault(f.key)}
                    className={`min-h-16 whitespace-nowrap border-2 px-5 py-3 text-left text-[18px] font-bold leading-[1.25] transition-colors ${
                      fault === f.key ? "border-[#EEEDE8] bg-[#EEEDE8] text-[#1A1C1E]" : "border-[#4A4E52] hover:border-[#EEEDE8]"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div id="fejl-svar" className="mt-2 border-2 border-[#EEEDE8] px-5 py-7 sm:px-8 sm:py-9">
                {fault === "strom" && (
                  <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
                    <ol className="flex max-w-[60ch] flex-col gap-5 text-[18px] leading-[1.5]">
                      <li className="grid grid-cols-[2rem_minmax(0,1fr)]">
                        <span className={`${mono} font-bold`}>1</span>
                        <span>Har naboerne strøm? Hvis de heller ikke har, er fejlen på elnettet. Ring til dit netselskab. Hvem det er, står på din elregning.</span>
                      </li>
                      <li className="grid grid-cols-[2rem_minmax(0,1fr)]">
                        <span className={`${mono} font-bold`}>2</span>
                        <span>
                          Har de strøm, så åbn eltavlen og se, om HPFI-relæet er slået fra.{" "}
                          <button type="button" onClick={() => setFault("hpfi")} className="font-bold underline underline-offset-4">
                            Det er det
                          </button>
                        </span>
                      </li>
                      <li className="grid grid-cols-[2rem_minmax(0,1fr)]">
                        <span className={`${mono} font-bold`}>3</span>
                        <span>Er relæet oppe, og er der stadig ingen strøm, så ring til os.</span>
                      </li>
                    </ol>
                    <CallButton className="sm:justify-self-start lg:self-end" />
                  </div>
                )}
                {fault === "hpfi" && (
                  <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
                    <div>
                      <ol className="flex max-w-[60ch] flex-col gap-5 text-[18px] leading-[1.5]">
                        {HPFI.map((s, i) => (
                          <li key={s} className="grid grid-cols-[2rem_minmax(0,1fr)]">
                            <span className={`${mono} font-bold`}>{i + 1}</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ol>
                      <p className="mt-6 max-w-[56ch] border-l-4 border-[#F5C400] pl-4 text-[18px] font-bold leading-[1.45]">
                        Slår relæet fra med det samme, også når alle grupperne er slået fra, så stop og ring til os.
                      </p>
                    </div>
                    <CallButton className="sm:justify-self-start lg:self-end" />
                  </div>
                )}
                {fault === "brand" && (
                  <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
                    <div className="flex max-w-[60ch] flex-col gap-5 text-[18px] leading-[1.5]">
                      <p className="text-[22px] font-extrabold leading-[1.3]">
                        Er der røg eller ild, så ring{" "}
                        <a href="tel:112" className="underline underline-offset-4">
                          112
                        </a>{" "}
                        først.
                      </p>
                      <p>Rør ikke ved det, der lugter eller slår gnister. Slå hovedafbryderen i eltavlen fra, hvis du kan nå den uden at komme tæt på. Ring så til os.</p>
                    </div>
                    <CallButton className="sm:justify-self-start lg:self-end" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Charger, priced while you choose */}
        <section id="ladeboks" className={`${wrap} grid gap-x-12 gap-y-10 py-16 sm:py-24 lg:grid-cols-12`}>
          <figure className="lg:col-span-6">
            <Img id="1766507680004-1c71007aefe5" w={1100} alt="Ladeboks monteret på en trævæg" className="aspect-[4/3] w-full object-cover sm:aspect-[16/9] lg:aspect-[4/5]" />
          </figure>
          <div className="flex flex-col gap-8 lg:col-span-6 lg:self-center">
            <div>
              <h2 className={h2}>Ladeboks til elbilen</h2>
              <p className="mt-4 max-w-[46ch] text-[18px] leading-[1.5] text-[#3E4144]">Prisen er med en 11 kW boks, kabel, ny gruppe i tavlen og anmeldelse til netselskabet.</p>
            </div>
            <Switches name="afstand" legend="Hvor langt er der fra eltavlen?" options={DISTANCE} value={distance} onChange={setDistance} />
            <Switches name="montering" legend="Hvor skal den sidde?" options={MOUNT} value={mount} onChange={setMount} />
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-t-2 border-[#1A1C1E] pt-5">
              <div>
                <p className="text-[15px] text-[#55585B]">Eksempelpris inkl. moms</p>
                <output aria-live="polite" className="block whitespace-nowrap text-[44px] font-black leading-[1.05] tracking-[-0.03em] tabular-nums sm:text-[56px]">
                  {kr(price)}
                </output>
              </div>
              <a
                href="#kontakt"
                onClick={() => setJob(`Ladeboks, ${DISTANCE[distance].label.toLowerCase()} fra eltavlen, ${MOUNT[mount].label.toLowerCase()}. Pris fra siden: ${kr(price)}`)}
                className="inline-flex h-14 items-center whitespace-nowrap bg-[#1A1C1E] px-7 text-lg font-bold text-[#EEEDE8] hover:bg-[#33373C]"
              >
                Bestil ladeboks
              </a>
            </div>
            <p className="-mt-3 text-[15px] leading-[1.5] text-[#55585B]">Er der ikke plads til en ny gruppe i tavlen, siger vi det, før du har betalt noget.</p>
          </div>
        </section>

        {/* Old fuses and a new board, side by side */}
        <section id="tavler" className="bg-[#1A1C1E] text-[#EEEDE8] [&_:focus-visible]:outline-[#F5C400]">
          <div className={`${wrap} py-16 sm:py-24`}>
            <div className="grid gap-x-12 gap-y-5 lg:grid-cols-12">
              <h2 className={`${h2} lg:col-span-6`}>Har du stadig skruesikringer?</h2>
              <p className="max-w-[48ch] text-[18px] leading-[1.55] text-[#C7C9C5] lg:col-span-5 lg:col-start-8 lg:self-end">
                Så mangler huset sandsynligvis et HPFI-relæ, som slår strømmen fra, før nogen får stød. En ny tavle i et parcelhus koster typisk 14.000–19.000 kr. og tager en dag.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-2 sm:gap-4">
              <figure>
                <Img id="1787816104853-f4f0c5e426ea" w={900} alt="Gammel eltavle med skruesikringer af porcelæn" className="aspect-[3/4] w-full object-cover sm:aspect-[4/5]" />
                <figcaption className="mt-3 text-[14px] text-[#A9ACA8]">Skruesikringer af porcelæn</figcaption>
              </figure>
              <figure>
                <Img id="1576446470246-499c738d1c8e" w={900} alt="Række af hvide automatsikringer i en eltavle" className="aspect-[3/4] w-full object-cover sm:aspect-[4/5]" />
                <figcaption className="mt-3 text-[14px] text-[#A9ACA8]">Ny tavle med automatsikringer</figcaption>
              </figure>
            </div>
            <p className="mt-8 text-[14px] text-[#A9ACA8]">Fotos er pladsholdere fra Unsplash. På din side står billeder af jeres egne tavler.</p>
          </div>
        </section>

        {/* Prices and two questions */}
        <section id="priser" className={`${wrap} grid gap-x-12 gap-y-12 py-16 sm:py-24 lg:grid-cols-12`}>
          <div className="lg:col-span-7">
            <h2 className={h2}>Priser</h2>
            <table className="mt-8 w-full border-collapse text-[17px]">
              <caption className="pb-3 text-left text-[15px] text-[#55585B]">Eksempelpriser inkl. moms</caption>
              <tbody>
                {PRICES.map((p) => (
                  <tr key={p.what} className="border-t border-[#C8C7C1] first:border-t-2 first:border-t-[#1A1C1E] last:border-b">
                    <th scope="row" className="py-3.5 pr-4 text-left align-top font-semibold">
                      {p.what}
                      {p.note && <span className="block text-[15px] font-normal text-[#55585B]">{p.note}</span>}
                    </th>
                    <td className="whitespace-nowrap py-3.5 text-right align-top font-bold tabular-nums">{p.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:pt-[92px]">
            {FAQ.map((f) => (
              <details key={f.q} className="group border-b border-[#C8C7C1] first:border-t-2 first:border-t-[#1A1C1E]">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 text-[17px] font-bold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden className={`${mono} text-[20px] leading-none group-open:rotate-45`}>
                    +
                  </span>
                </summary>
                <p className="pb-5 text-[17px] leading-[1.55] text-[#3E4144]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="kontakt" className="bg-white">
          <div className={`${wrap} grid gap-x-12 gap-y-14 py-16 sm:py-24 lg:grid-cols-12`}>
            <div className="lg:col-span-6">
              <h2 className={h2}>Skriv, hvis det ikke haster.</h2>
              <form
                className="mt-8 flex flex-col gap-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                  setJob("");
                  e.currentTarget.reset();
                }}
              >
                <label className="flex flex-col gap-2 text-[17px] font-bold">
                  Hvad skal laves?
                  <textarea
                    required
                    name="opgave"
                    rows={3}
                    value={job}
                    onChange={(e) => setJob(e.target.value)}
                    placeholder="Fx to nye stikkontakter i køkkenet"
                    className={`${field} resize-y font-normal`}
                  />
                </label>
                <label className="flex flex-col gap-2 text-[17px] font-bold">
                  Dit telefonnummer
                  <input
                    required
                    name="telefon"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    pattern="[0-9 +]{8,}"
                    title="Skriv et telefonnummer på mindst 8 cifre"
                    className={`${field} font-normal sm:max-w-[320px]`}
                  />
                </label>
                <button type="submit" className="inline-flex h-14 items-center self-start whitespace-nowrap bg-[#1A1C1E] px-10 text-lg font-bold text-[#EEEDE8] hover:bg-[#33373C]">
                  Send
                </button>
                {sent && (
                  <p role="status" className="max-w-[48ch] border-l-4 border-[#1A1C1E] pl-4 text-[16px] leading-[1.5]">
                    Tak. På en rigtig side ville vi nu ringe dig op. Dette er et eksempel, så der er ikke sendt noget.
                  </p>
                )}
              </form>
            </div>
            <div className="flex flex-col gap-6 lg:col-span-5 lg:col-start-8">
              <p className="text-[18px] leading-[1.5]">
                Har du et billede af tavlen eller det, der er galt,{" "}
                <a href={SMS} className="font-bold underline underline-offset-4">
                  så send det på SMS
                </a>
                .
              </p>
              <dl className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-6 gap-y-3 border-t-2 border-[#1A1C1E] pt-5 text-[16px] leading-[1.45]">
                <dt className="text-[#55585B]">Telefon</dt>
                <dd>
                  <a href={TEL} className="whitespace-nowrap font-bold underline underline-offset-4">
                    {PHONE}
                  </a>
                </dd>
                <dt className="text-[#55585B]">Kontor</dt>
                <dd>Hverdage kl. 7–16</dd>
                <dt className="text-[#55585B]">Område</dt>
                <dd>Fra Solrød til Ringsted</dd>
                <dt className="text-[#55585B]">Værksted</dt>
                <dd>{ADDRESS}</dd>
                <dt className="text-[#55585B]">Autorisation</dt>
                <dd>
                  Elinstallatør nr. 00000 (eksempel)
                  <span className="mt-0.5 block text-[14px] text-[#55585B]">På din side linker vi til Sikkerhedsstyrelsens register.</span>
                </dd>
                <dt className="text-[#55585B]">Garanti</dt>
                <dd>TEKNIQ Installatørernes garantiordning (eksempel)</dd>
                <dt className="text-[#55585B]">CVR</dt>
                <dd>00 00 00 00 (eksempel)</dd>
              </dl>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#1A1C1E] pb-24 text-[15px] text-[#A9ACA8] sm:pb-0 [&_:focus-visible]:outline-[#F5C400]">
        <div className={`${wrap} flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-10`}>
          <span className="text-[18px] font-black uppercase tracking-[0.02em] text-[#EEEDE8]">Fasebro El</span>
          <span>{ADDRESS}</span>
          <span>CVR 00 00 00 00 (eksempel)</span>
          <a href={TEL} className="font-bold text-[#EEEDE8] underline underline-offset-4">
            {PHONE}
          </a>
        </div>
      </footer>

      {/* Phone: call, or text a photo of the board */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-[#3A3D40] bg-[#1A1C1E] px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 sm:hidden [&_:focus-visible]:outline-[#F5C400]">
        <a href={TEL} className={`${call} h-[52px] flex-1 text-[17px]`}>
          Ring {PHONE}
        </a>
        <a href={SMS} className="grid h-[52px] place-items-center whitespace-nowrap border-2 border-[#EEEDE8] px-5 font-bold text-[#EEEDE8]">
          SMS
        </a>
      </div>
    </div>
  );
}
