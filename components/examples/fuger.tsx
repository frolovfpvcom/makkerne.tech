"use client";

import { useEffect, useState } from "react";
import { DemoNote, Img } from "./shared";

/*
 * Fugefirmaet Tæt keeps the firm in one column that never scrolls away on a big screen: name, what
 * we do, send a photo, call. Everything else passes by on the right, one place in the house at a
 * time, each with its price per running metre on the same line as its name. Concrete white,
 * anthracite and the blue of the masking tape on either side of a joint, used only for "send".
 */

const PHONE = "89 01 23 45";
const TEL = "tel:+4589012345";
const SMS = "sms:+4589012345";
const ADDRESS = "Darumvej 12, 6700 Esbjerg";

// Colours: concrete #F3F3F1, ink #1E2226, tape blue #2F6EBA, line #CCD1D0, muted #565E63,
// on ink #E6E9E8 and #A9B0B3.

const display = "font-(family-name:--font-taet)";
const pad = "px-5 sm:px-10 lg:px-16";
const h2 = `${display} text-[36px] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[52px]`;
const btn = "inline-flex items-center justify-center whitespace-nowrap bg-[#2F6EBA] font-semibold text-white transition-colors hover:bg-[#245A9C]";
const field = "w-full border border-[#1E2226] bg-white px-4 py-3 text-[17px] text-[#1E2226] placeholder:text-[#7A8286]";

const NAV = [
  ["#hvor", "Hvor sidder fugen?"],
  ["#tjek", "Skal den skiftes?"],
  ["#priser", "Priser"],
  ["#kontakt", "Send billeder"],
] as const;

type Place = { name: string; price: string; mass: string; lasts: string; typical: string; photo?: { id: string; alt: string } };
const PLACES: Place[] = [
  {
    name: "Bad",
    price: "115 kr./lbm",
    mass: "Sanitær silikone med middel mod skimmel",
    lasts: "5–8 år",
    typical: "18–25 lbm i et almindeligt bad",
    photo: { id: "1611066415956-91ab6f1f57cc", alt: "Bruser på en væg med hvide fliser" },
  },
  {
    name: "Køkken",
    price: "105 kr./lbm",
    mass: "Silikone ved vask og bordplade, akryl hvor der skal males",
    lasts: "8–10 år",
    typical: "6–12 lbm",
  },
  {
    name: "Vinduer udvendigt",
    price: "165–210 kr./lbm",
    mass: "Elastisk fugemasse på bundstop, indvendigt akryl",
    lasts: "10–15 år",
    typical: "60–90 lbm på et rækkehus",
    photo: { id: "1630699376059-b781970715b1", alt: "Vindue med hvid trækarm" },
  },
  {
    name: "Betonfacader",
    price: "220–320 kr./lbm",
    mass: "Polyuretan eller MS-polymer med primer",
    lasts: "15–20 år",
    typical: "For boligforeninger og ejerforeninger, lift kommer oveni",
  },
];

const SIGNS: [string, string][] = [
  ["Sorte prikker, der ikke kan vaskes af", "Skimlen sidder inde i silikonen. Fugen skal skæres ud og laves ny."],
  ["Fugen slipper i kanten", "Så løber der vand ind bag den. I et bad skal det ikke vente længe."],
  ["Revner, eller fugen er blevet hård", "Den kan ikke længere følge med, når huset arbejder."],
  ["Huset er fra 1950–1977, og fugerne er de gamle", "De kan indeholde PCB. Vi tager en prøve, før vi skærer noget ud."],
];

const TERMS: { what: string; note?: string; price: string }[] = [
  { what: "Pris ud fra billeder", note: "bad og køkken", price: "0 kr." },
  { what: "Opmåling på stedet", note: "trækkes fra, hvis du siger ja", price: "500 kr." },
  { what: "Mindstepris pr. besøg", price: "1.650 kr." },
  { what: "Timepris", note: "til det, der ikke kan måles i meter", price: "595 kr." },
  { what: "PCB-prøve med analyse", price: "1.150 kr." },
  { what: "Lift, en hel dag", note: "facader over 1. sal", price: "2.400–3.200 kr." },
  { what: "Fanø", note: "tillæg for færgen", price: "250 kr." },
];

export function FugerSite() {
  const [menu, setMenu] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  return (
    <div className="min-h-dvh overflow-x-clip bg-[#F3F3F1] font-(family-name:--font-taet-sans) text-[17px] text-[#1E2226] [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-[#2F6EBA]">
      <DemoNote className="bg-[#1E2226] text-[#A9B0B3]" />

      {/* Phone and tablet: a plain bar with the menu. On a big screen the left column does this job. */}
      <header className="relative z-40 border-b border-[#CCD1D0] bg-[#F3F3F1] lg:hidden">
        <div className={`${pad} flex items-center justify-between gap-4 py-3`}>
          <a href="#top" className={`${display} whitespace-nowrap text-[22px] font-bold tracking-[-0.02em]`}>
            Fugefirmaet Tæt
          </a>
          <div className="flex shrink-0 items-center gap-3">
            <a href={TEL} className="whitespace-nowrap font-semibold underline-offset-4 hover:underline max-sm:hidden">
              {PHONE}
            </a>
            <button
              type="button"
              aria-label={menu ? "Luk menu" : "Åbn menu"}
              aria-expanded={menu}
              aria-controls="taet-menu"
              onClick={() => setMenu((m) => !m)}
              className="grid size-11 place-items-center border border-[#1E2226]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
        {menu && (
          <nav id="taet-menu" aria-label="Menu" className="border-t border-[#CCD1D0]">
            <ul className={`${pad} py-2`}>
              {NAV.map(([href, label]) => (
                <li key={href}>
                  <a href={href} onClick={() => setMenu(false)} className="block border-b border-[#CCD1D0] py-3.5 text-lg font-medium">
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

      <div className="mx-auto max-w-[1480px] lg:grid lg:grid-cols-[400px_minmax(0,1fr)] xl:grid-cols-[440px_minmax(0,1fr)]">
        {/* The firm, which stays put on a big screen */}
        <div id="top" className={`${pad} pb-10 pt-10 sm:pb-14 sm:pt-14 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:self-start lg:flex-col lg:justify-between lg:gap-8 lg:overflow-y-auto lg:border-r lg:border-[#CCD1D0] lg:px-10 lg:py-8`}>
          <div>
            <a href="#top" className={`${display} hidden whitespace-nowrap text-[24px] font-bold tracking-[-0.02em] lg:block`}>
              Fugefirmaet Tæt
            </a>
            <p className="text-[15px] text-[#565E63] lg:mt-1">Fugemand i Esbjerg</p>
            <h1 className={`${display} mt-4 text-[44px] font-semibold leading-[0.98] tracking-[-0.035em] sm:text-[64px] lg:mt-8 lg:text-[48px] xl:text-[54px] [@media(min-width:1024px)_and_(max-height:760px)]:text-[42px]`}>
              Fuger i bad, køkken og vinduer.
            </h1>
            <p className="mt-5 max-w-[34ch] text-[19px] leading-[1.45]">Send et billede af fugerne, så får du en pris. Vinduer og facader måler vi op for 500 kr.</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 max-sm:hidden lg:mt-6">
              <a href={SMS} className={`${btn} h-14 px-7 text-[18px]`}>
                Send billeder på SMS
              </a>
              <a href={TEL} className="whitespace-nowrap text-[18px] font-semibold underline underline-offset-4">
                Ring {PHONE}
              </a>
            </div>
          </div>
          <div className="hidden border-t border-[#1E2226] pt-4 lg:block">
            <nav aria-label="Hovedmenu" className="flex flex-wrap gap-x-5 gap-y-1.5 text-[16px] font-medium">
              {NAV.map(([href, label]) => (
                <a key={href} href={href} className="whitespace-nowrap underline-offset-4 hover:underline">
                  {label}
                </a>
              ))}
            </nav>
            <p className="mt-3 text-[15px] text-[#565E63]">Hverdage kl. 7–15.30</p>
          </div>
        </div>

        <main className="min-w-0">
          <Img
            priority
            id="1786204697642-328c597b6f05"
            w={1600}
            alt="Håndværker lægger en ny fuge langs en vindueskarm i et køkken"
            className="aspect-[4/3] w-full object-cover lg:aspect-[16/11]"
          />

          {/* One place in the house at a time */}
          <section id="hvor" className={`${pad} py-16 sm:py-24`}>
            <h2 className={h2}>Hvor sidder fugen?</h2>
            <div className="mt-10 flex flex-col gap-16 sm:mt-14 sm:gap-20">
              {PLACES.map((p) => (
                <article key={p.name}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b-2 border-[#1E2226] pb-3">
                    <h3 className={`${display} text-[30px] font-semibold leading-[1.05] tracking-[-0.025em] sm:text-[40px]`}>{p.name}</h3>
                    <p className={`${display} whitespace-nowrap text-[22px] font-medium tabular-nums sm:text-[28px]`}>{p.price}</p>
                  </div>
                  {p.photo && <Img id={p.photo.id} w={1400} alt={p.photo.alt} className="mt-5 aspect-[3/2] w-full object-cover" />}
                  <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-3">
                    <div>
                      <dt className="text-[14px] text-[#565E63]">Fugemasse</dt>
                      <dd className="mt-0.5 leading-[1.4]">{p.mass}</dd>
                    </div>
                    <div>
                      <dt className="text-[14px] text-[#565E63]">Holder</dt>
                      <dd className="mt-0.5 leading-[1.4]">{p.lasts}</dd>
                    </div>
                    <div>
                      <dt className="text-[14px] text-[#565E63]">Typisk</dt>
                      <dd className="mt-0.5 leading-[1.4]">{p.typical}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
            <p className="mt-14 text-[15px] text-[#565E63]">Eksempelpriser inkl. moms. Fotos er pladsholdere fra Unsplash. På din side står jeres egne opgaver.</p>
          </section>

          {/* When it is time */}
          <section id="tjek" className={`${pad} bg-[#1E2226] py-16 text-[#E6E9E8] sm:py-24 [&_:focus-visible]:outline-[#E6E9E8]`}>
            <h2 className={h2}>Skal fugen skiftes?</h2>
            <dl className="mt-10 border-t border-[#E6E9E8]">
              {SIGNS.map(([sign, means]) => (
                <div key={sign} className="grid gap-x-8 gap-y-1 border-b border-[#3B4146] py-5 md:grid-cols-2">
                  <dt className="text-[19px] font-semibold leading-[1.35]">{sign}</dt>
                  <dd className="leading-[1.5] text-[#A9B0B3]">{means}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* What is not metres */}
          <section id="priser" className={`${pad} py-16 sm:py-24`}>
            <h2 className={h2}>Det, der ikke er meter</h2>
            <table className="mt-10 w-full border-collapse">
              <caption className="pb-3 text-left text-[15px] text-[#565E63]">Eksempelpriser inkl. moms</caption>
              <tbody>
                {TERMS.map((t) => (
                  <tr key={t.what} className="border-t border-[#CCD1D0] first:border-t-2 first:border-t-[#1E2226] last:border-b">
                    <th scope="row" className="py-3.5 pr-4 text-left align-top font-medium">
                      {t.what}
                      {t.note && <span className="block text-[15px] font-normal text-[#565E63]">{t.note}</span>}
                    </th>
                    <td className="whitespace-nowrap py-3.5 text-right align-top font-semibold tabular-nums">{t.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Send photos */}
          <section id="kontakt" className={`${pad} border-t-[6px] border-[#2F6EBA] bg-white py-16 sm:py-24`}>
            <h2 className={h2}>Send billeder af fugerne</h2>
            <p className="mt-4 max-w-[44ch] text-[19px] leading-[1.45]">Bad og køkken kan vi tit sætte pris på ud fra et par billeder. Det koster ikke noget.</p>
            <a href={SMS} className={`${btn} mt-8 h-14 px-7 text-[18px] max-sm:hidden`}>
              Send billeder på SMS
            </a>
            <div className="mt-12 grid gap-x-12 gap-y-12 xl:grid-cols-[minmax(0,1fr)_300px]">
              <form
                className="flex flex-col gap-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                  e.currentTarget.reset();
                }}
              >
                <p className="font-semibold">Eller skriv her</p>
                <label className="flex flex-col gap-2 text-[15px] text-[#565E63]">
                  Hvad skal fuges?
                  <textarea required name="opgave" rows={3} placeholder="Fx bruseniche og gulv i badet" className={`${field} resize-y`} />
                </label>
                <label className="flex flex-col gap-2 text-[15px] text-[#565E63]">
                  Billeder (kan udelades)
                  <input
                    name="billeder"
                    type="file"
                    accept="image/*"
                    multiple
                    className="text-[15px] text-[#1E2226] file:mr-3 file:border file:border-[#1E2226] file:bg-white file:px-3 file:py-2 file:text-[15px] file:font-medium file:text-[#1E2226]"
                  />
                </label>
                <label className="flex flex-col gap-2 text-[15px] text-[#565E63]">
                  Dit telefonnummer
                  <input required name="telefon" type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9 +]{8,}" title="Skriv et telefonnummer på mindst 8 cifre" className={`${field} sm:max-w-[320px]`} />
                </label>
                <button type="submit" className="inline-flex h-14 items-center self-start whitespace-nowrap bg-[#1E2226] px-9 text-[18px] font-semibold text-white hover:bg-[#33393E]">
                  Send
                </button>
                {sent && (
                  <p role="status" className="max-w-[48ch] border-l-4 border-[#2F6EBA] pl-4 leading-[1.5]">
                    Tak. På en rigtig side ville vi nu ringe dig op med en pris. Dette er et eksempel, så der er ikke sendt noget.
                  </p>
                )}
              </form>
              <dl className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-6 gap-y-2.5 self-start border-t-2 border-[#1E2226] pt-4 text-[16px] xl:grid-cols-1 xl:gap-y-0">
                <dt className="text-[#565E63]">Telefon</dt>
                <dd className="xl:mb-3">
                  <a href={TEL} className="whitespace-nowrap font-semibold underline underline-offset-4">
                    {PHONE}
                  </a>
                </dd>
                <dt className="text-[#565E63]">Hverdage</dt>
                <dd className="xl:mb-3">Kl. 7–15.30</dd>
                <dt className="text-[#565E63]">Område</dt>
                <dd className="xl:mb-3">Esbjerg og op til en times kørsel, Fanø med</dd>
                <dt className="text-[#565E63]">Adresse</dt>
                <dd className="xl:mb-3">{ADDRESS}</dd>
                <dt className="text-[#565E63]">Garanti</dt>
                <dd className="xl:mb-3">Byg Garanti (eksempel)</dd>
                <dt className="text-[#565E63]">CVR</dt>
                <dd>00 00 00 00 (eksempel)</dd>
              </dl>
            </div>
          </section>
        </main>
      </div>

      <footer className="bg-[#1E2226] pb-24 text-[15px] text-[#A9B0B3] sm:pb-0 [&_:focus-visible]:outline-[#E6E9E8]">
        <div className={`${pad} mx-auto flex max-w-[1480px] flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-10 lg:px-10`}>
          <span className={`${display} text-[20px] font-bold text-[#E6E9E8]`}>Fugefirmaet Tæt</span>
          <span>{ADDRESS}</span>
          <span>CVR 00 00 00 00 (eksempel)</span>
          <a href={TEL} className="font-semibold text-[#E6E9E8] underline underline-offset-4">
            {PHONE}
          </a>
        </div>
      </footer>

      {/* Phone: send a photo, or call */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-[#CCD1D0] bg-[#F3F3F1] px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 sm:hidden">
        <a href={SMS} className={`${btn} h-[52px] flex-1 text-[17px]`}>
          Send billeder på SMS
        </a>
        <a href={TEL} className="grid h-[52px] place-items-center whitespace-nowrap border border-[#1E2226] px-5 font-semibold">
          Ring
        </a>
      </div>
    </div>
  );
}
