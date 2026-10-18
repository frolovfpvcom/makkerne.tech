"use client";

import { useEffect, useState } from "react";
import { DemoNote, Img } from "./shared";

/*
 * Holm VVS is the side of the van: the phone number is the biggest thing on it. One typeface made
 * to be read in a hurry, black on white, and the two colours every tap already carries: red for
 * "ring now", blue for "write, it can wait". Nothing about who is on call or how fast we come,
 * because a page cannot know that. What it can do is tell you how to shut the water off.
 */

const PHONE = "12 34 56 78";
const TEL = "tel:+4512345678";
const SMS = "sms:+4512345678";
const ADDRESS = "Kobbervej 7, 2730 Herlev";

// Colours: ink #101820, tile grey #E9ECEE, line #C5CCD1, muted #4B5560 (on ink #A7B1BA),
// tap red #D0311C for calling only, tap blue #1E56C8 for writing.

const mono = "font-(family-name:--font-holm-mono) [word-spacing:-0.3em]";
const wrap = "mx-auto w-full max-w-[1280px] px-5 sm:px-10 lg:px-14";
const h2 = "text-[34px] font-extrabold leading-[1.05] tracking-[-0.025em] sm:text-[48px]";
const red = "inline-flex items-center justify-center whitespace-nowrap bg-[#D0311C] font-bold text-white transition-colors hover:bg-[#B0270F]";
const blue = "inline-flex items-center justify-center whitespace-nowrap bg-[#1E56C8] font-bold text-white transition-colors hover:bg-[#1745A5]";
const field = "w-full border-2 border-[#101820] bg-white px-4 py-3 text-[17px] text-[#101820] placeholder:text-[#6A747D]";

const NAV = [
  ["#hovedhane", "Luk for vandet"],
  ["#kontakt", "Skriv til os"],
  ["#opgaver", "Opgaver"],
  ["#priser", "Priser"],
] as const;

const SHUT_OFF: { title: string; text: string }[] = [
  { title: "Luk for hovedhanen", text: "Den sidder ved vandmåleren, tit i bryggerset, i kælderen eller under køkkenvasken. Drej med uret, til den stopper." },
  { title: "Er vandet varmt?", text: "Så kommer det fra varmen. Luk de to haner ved fjernvarmeunitten." },
  { title: "Lækker vandvarmeren?", text: "Slå sikringen fra i eltavlen. Den hedder tit VVB." },
  { title: "Tag billeder, før du tørrer op", text: "Forsikringen vil se skaden, og vi kan se, hvilke dele vi skal have med." },
];

type Row = { what: string; note?: string; price: string };
const HOURLY: Row[] = [
  { what: "Kørsel", note: "Herlev og nabokommuner", price: "395 kr." },
  { what: "VVS-montør", note: "pr. påbegyndt halve time", price: "795 kr./t" },
  { what: "Lærling", price: "450 kr./t" },
  { what: "Døgnvagt, fremmøde", note: "aften, nat og weekend, med den første halve time", price: "1.495 kr." },
  { what: "Døgnvagt, derefter", price: "1.195 kr./t" },
];
const FIXED: Row[] = [
  { what: "Skift af blandingsbatteri", note: "du køber batteriet", price: "1.450 kr." },
  { what: "Nyt toilet monteret", note: "hvidt gulvtoilet, det gamle kører vi væk", price: "7.900 kr." },
  { what: "Stoppet håndvask eller køkkenafløb", price: "fra 1.190 kr." },
  { what: "Eftersyn af fjernvarmeunit", price: "1.395 kr." },
  { what: "Nyt badeværelse", note: "besigtigelse 595 kr., trækkes fra", price: "Fast pris" },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Hvad hvis det tager mere end en time om natten?",
    a: "Så siger vi prisen, før vi går videre. Om natten laver vi det, der skal til for at stoppe skaden, og kommer tilbage på en hverdag med resten.",
  },
  {
    q: "Kan jeg få håndværkerfradrag?",
    a: "Tilslutning til fjernvarme kan give fradrag for arbejdslønnen. Service og nye badeværelser giver ikke fradrag. Reglerne står på skat.dk.",
  },
];

function Prices({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <table className="w-full border-collapse text-[16px]">
      <caption className="border-b-2 border-[#101820] pb-2 text-left text-[15px] font-bold">{title}</caption>
      <tbody>
        {rows.map((r) => (
          <tr key={r.what} className="border-b border-[#C5CCD1]">
            <th scope="row" className="py-3 pr-4 text-left align-top font-normal">
              {r.what}
              {r.note && <span className="block text-[14px] text-[#4B5560]">{r.note}</span>}
            </th>
            <td className="whitespace-nowrap py-3 text-right align-top font-bold tabular-nums">{r.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function VvsSite() {
  const [menu, setMenu] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  return (
    <div className="min-h-dvh overflow-x-clip bg-white font-(family-name:--font-holm) text-[#101820] [&_:focus-visible]:outline-[3px] [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-[#1E56C8]">
      <DemoNote className="bg-[#101820] text-[#A7B1BA]" />

      <header className="relative z-40 border-b-2 border-[#101820] bg-white sm:sticky sm:top-0">
        <div className={`${wrap} flex items-center justify-between gap-4 py-3`}>
          <a href="#top" className="whitespace-nowrap text-[26px] font-extrabold leading-none tracking-[-0.03em]">
            Holm VVS
          </a>
          <nav aria-label="Hovedmenu" className="hidden gap-7 whitespace-nowrap text-[16px] font-semibold lg:flex">
            {NAV.map(([href, label]) => (
              <a key={href} href={href} className="underline-offset-4 hover:underline">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-3">
            <a href={TEL} className={`${red} h-11 gap-2 px-4 text-[16px] max-sm:hidden`}>
              Ring <span className={mono}>{PHONE}</span>
            </a>
            <button
              type="button"
              aria-label={menu ? "Luk menu" : "Åbn menu"}
              aria-expanded={menu}
              aria-controls="holm-menu"
              onClick={() => setMenu((m) => !m)}
              className="grid size-11 place-items-center border-2 border-[#101820] lg:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" aria-hidden>
                {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
        {menu && (
          <nav id="holm-menu" aria-label="Menu" className="border-t border-[#C5CCD1] lg:hidden">
            <ul className={`${wrap} py-2`}>
              {NAV.map(([href, label]) => (
                <li key={href}>
                  <a href={href} onClick={() => setMenu(false)} className="block border-b border-[#C5CCD1] py-3.5 text-lg font-semibold">
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <a href={TEL} className="block py-3.5 text-lg font-bold text-[#D0311C]">
                  Ring {PHONE}
                </a>
              </li>
            </ul>
          </nav>
        )}
      </header>

      <main>
        {/* The van: the number, how to call it, and the photo running off the edge */}
        <section
          id="top"
          className="bg-[#101820] text-white [&_:focus-visible]:outline-white lg:grid lg:grid-cols-[minmax(3.5rem,1fr)_minmax(0,664px)_minmax(0,504px)_minmax(3.5rem,1fr)]"
        >
          <div className="px-5 pb-12 pt-10 sm:px-10 sm:pb-16 sm:pt-16 lg:col-start-2 lg:px-0 lg:pb-24 lg:pr-12 lg:pt-20">
            <p className={`${mono} text-[14px] text-[#A7B1BA]`}>Aut. VVS-installatør · Herlev</p>
            <h1 className="mt-4 max-w-[16ch] text-[36px] font-extrabold leading-[1.04] tracking-[-0.03em] sm:text-[52px] lg:text-[60px]">
              Vand, varme og afløb i Herlev og omegn.
            </h1>
            <div className="mt-10 border-t border-[#3A4651] pt-6 sm:mt-14">
              <p className="text-[17px] font-bold">Døgnvagt alle dage</p>
              <a
                href={TEL}
                className={`${mono} mt-2 block whitespace-nowrap text-[15vw] font-bold leading-none tracking-[-0.04em] hover:text-[#FFB4A6] sm:text-[96px] lg:text-[min(7vw,104px)]`}
              >
                {PHONE}
              </a>
              <div className="mt-7 hidden flex-wrap gap-3 sm:flex">
                <a href={TEL} className={`${red} h-14 px-8 text-lg`}>
                  Ring døgnvagten
                </a>
                <a href={SMS} className="inline-flex h-14 items-center whitespace-nowrap border-2 border-white px-6 text-lg font-bold hover:bg-white hover:text-[#101820]">
                  SMS et billede
                </a>
              </div>
              <p className="mt-7 max-w-[40ch] text-[17px] leading-[1.5] text-[#C9D1D8]">
                Mens du ringer: luk for hovedhanen.{" "}
                <a href="#hovedhane" className="whitespace-nowrap font-bold text-white underline underline-offset-4">
                  Hvor sidder den?
                </a>
              </p>
            </div>
          </div>
          <div className="relative lg:col-span-2 lg:col-start-3 lg:row-start-1">
            <Img
              priority
              id="1676210134190-3f2c0d5cf58d"
              w={1400}
              alt="VVS-montør skifter en vandvarmer i et teknikrum"
              className="aspect-[4/3] w-full object-cover sm:aspect-[16/9] lg:absolute lg:inset-0 lg:aspect-auto lg:h-full"
            />
          </div>
        </section>

        {/* What to do before we get there */}
        <section id="hovedhane" className="bg-[#E9ECEE]">
          <div className={`${wrap} grid gap-x-10 gap-y-10 py-16 sm:py-24 lg:grid-cols-12`}>
            <h2 className={`${h2} lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:self-end`}>Luk for vandet, mens du venter.</h2>
            <figure className="lg:col-span-5 lg:row-span-2 lg:row-start-1">
              <Img
                id="1759091563266-b1ce4d8b484d"
                w={1000}
                alt="To afspærringshaner med røde håndtag over et sort rør"
                className="aspect-[3/2] w-full object-cover lg:aspect-[4/5]"
              />
              <figcaption className="mt-3 text-[14px] text-[#4B5560]">Sådan kan en afspærringshane se ud. Pladsholderfoto.</figcaption>
            </figure>
            <ol className="flex flex-col border-t-2 border-[#101820] lg:col-span-6 lg:col-start-7 lg:row-start-2 lg:self-start">
              {SHUT_OFF.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 border-b border-[#C5CCD1] py-5">
                  <span className={`${mono} text-[22px] font-bold leading-[1.15]`}>{i + 1}</span>
                  <div>
                    <h3 className="text-[20px] font-bold leading-[1.2]">{s.title}</h3>
                    <p className="mt-1.5 max-w-[48ch] text-[17px] leading-[1.5] text-[#2E3A44]">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* The other route: it can wait, so write */}
        <section id="kontakt" className={`${wrap} grid gap-x-10 gap-y-14 py-16 sm:py-24 lg:grid-cols-12`}>
          <div className="lg:col-span-6">
            <h2 className={h2}>Kan det vente til en hverdag?</h2>
            <p className="mt-4 max-w-[40ch] text-[17px] leading-[1.55] text-[#2E3A44]">Skriv, hvad der er galt, så ringer vi og finder en tid.</p>
            <form
              className="mt-8 flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
                e.currentTarget.reset();
              }}
            >
              <label className="flex flex-col gap-2 text-[16px] font-bold">
                Hvad er der galt?
                <textarea required name="opgave" rows={3} placeholder="Fx toilettet løber hele tiden" className={`${field} resize-y font-normal`} />
              </label>
              <label className="flex flex-col gap-2 text-[16px] font-bold">
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
              <button type="submit" className={`${blue} h-14 self-start px-10 text-lg`}>
                Send
              </button>
              {sent && (
                <p role="status" className="max-w-[48ch] border-l-4 border-[#1E56C8] pl-4 text-[16px] leading-[1.5]">
                  Tak. På en rigtig side ville vi nu ringe dig op. Dette er et eksempel, så der er ikke sendt noget.
                </p>
              )}
            </form>
          </div>

          <dl className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-6 gap-y-3 self-start border-t-2 border-[#101820] pt-5 text-[16px] leading-[1.45] lg:col-span-5 lg:col-start-8">
            <dt className="text-[#4B5560]">Kontor</dt>
            <dd>Hverdage kl. 7–16, fredag til 14</dd>
            <dt className="text-[#4B5560]">Døgnvagt</dt>
            <dd>
              Alle dage på{" "}
              <a href={TEL} className={`${mono} whitespace-nowrap font-bold underline underline-offset-4`}>
                {PHONE}
              </a>
            </dd>
            <dt className="text-[#4B5560]">Område</dt>
            <dd>Herlev, Ballerup, Gladsaxe og Rødovre</dd>
            <dt className="text-[#4B5560]">Værksted</dt>
            <dd>{ADDRESS}</dd>
            <dt className="text-[#4B5560]">Autorisation</dt>
            <dd>
              VVS-installatør nr. 00000 (eksempel)
              <span className="mt-0.5 block text-[14px] text-[#4B5560]">På din side linker vi til Sikkerhedsstyrelsens register.</span>
            </dd>
            <dt className="text-[#4B5560]">Garanti</dt>
            <dd>TEKNIQ Installatørernes garantiordning (eksempel)</dd>
            <dt className="text-[#4B5560]">CVR</dt>
            <dd>00 00 00 00 (eksempel)</dd>
          </dl>
        </section>

        {/* What the vans are actually for */}
        <section id="opgaver" className="bg-[#101820] text-white [&_:focus-visible]:outline-white">
          <div className={`${wrap} py-16 sm:py-24`}>
            <div className="grid gap-x-10 gap-y-5 lg:grid-cols-12">
              <h2 className={`${h2} lg:col-span-5`}>Mest små opgaver.</h2>
              <p className="max-w-[52ch] text-[17px] leading-[1.6] text-[#C9D1D8] lg:col-span-6 lg:col-start-7">
                Toiletter, vandvarmere, afløb og fjernvarme, og et par gange om året et helt badeværelse. Jordvarme og solvarme laver vi ikke, men vi giver dig gerne nummeret på en, der gør.
              </p>
            </div>
            <div className="mt-12 grid gap-x-10 gap-y-8 lg:grid-cols-12">
              <figure className="lg:col-span-8">
                <Img id="1690603935238-b60582bcb273" w={1400} alt="Nyt badeværelse med hvide fliser og bruseniche" className="aspect-[4/3] w-full object-cover sm:aspect-[3/2]" />
                <figcaption className="mt-3 text-[14px] text-[#A7B1BA]">Nyt badeværelse</figcaption>
              </figure>
              <figure className="lg:col-span-4 lg:self-end">
                <Img id="1768321913920-d3ac011e0683" w={900} alt="Nye vandrør og el-rør i en åben væg" className="aspect-[3/2] w-full object-cover lg:aspect-[4/5]" />
                <figcaption className="mt-3 text-[14px] text-[#A7B1BA]">Rør i væggen, før fliserne kommer på</figcaption>
              </figure>
            </div>
            <p className="mt-10 text-[14px] text-[#A7B1BA]">Fotos er pladsholdere fra Unsplash. På din side står billeder fra jeres egne opgaver.</p>
          </div>
        </section>

        {/* Price list */}
        <section id="priser" className={`${wrap} py-16 sm:py-24`}>
          <div className="grid gap-x-10 gap-y-4 lg:grid-cols-12">
            <h2 className={`${h2} lg:col-span-5`}>Priser</h2>
            <p className="max-w-[48ch] text-[17px] leading-[1.55] text-[#2E3A44] lg:col-span-6 lg:col-start-7">
              Eksempelpriser inkl. moms. Tiden står på regningen, og dele står med navn og pris.
            </p>
          </div>
          <div className="mt-10 grid gap-x-10 gap-y-12 lg:grid-cols-2">
            <Prices title="Timer og kørsel" rows={HOURLY} />
            <Prices title="Faste priser med kørsel og smådele" rows={FIXED} />
          </div>
          <div className="mt-14 border-t-2 border-[#101820] lg:ml-[calc(50%+1.25rem)]">
            {FAQ.map((f) => (
              <details key={f.q} className="group border-b border-[#C5CCD1]">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 text-[17px] font-bold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden className={`${mono} text-[22px] leading-[1.05] group-open:hidden`}>
                    +
                  </span>
                  <span aria-hidden className={`${mono} hidden text-[22px] leading-[1.05] group-open:inline`}>
                    –
                  </span>
                </summary>
                <p className="max-w-[56ch] pb-5 text-[17px] leading-[1.55] text-[#2E3A44]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-[#101820] pb-24 text-[15px] text-[#A7B1BA] sm:pb-0 [&_:focus-visible]:outline-white">
        <div className={`${wrap} flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-10`}>
          <span className="text-[22px] font-extrabold tracking-[-0.03em] text-white">Holm VVS</span>
          <span>{ADDRESS}</span>
          <span>CVR 00 00 00 00 (eksempel)</span>
          <a href={TEL} className={`${mono} font-bold text-white underline underline-offset-4`}>
            {PHONE}
          </a>
        </div>
      </footer>

      {/* Phone: the van's own colours, the number on the red button, and a photo by text as the quiet second choice */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-[#3A4651] bg-[#101820] px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 text-white sm:hidden [&_:focus-visible]:outline-white">
        <a href={TEL} className={`${red} h-[52px] min-w-0 flex-1 gap-2 text-[17px]`}>
          Ring <span className={mono}>{PHONE}</span>
        </a>
        <a href={SMS} aria-label="Send en SMS" className="inline-flex h-[52px] items-center whitespace-nowrap border-2 border-white px-5 text-[17px] font-bold hover:bg-white hover:text-[#101820]">
          SMS
        </a>
      </div>
    </div>
  );
}
