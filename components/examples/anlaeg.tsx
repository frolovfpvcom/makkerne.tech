"use client";

import { useEffect, useState } from "react";
import { DemoNote, Img } from "./shared";

/*
 * Lindholm Anlæg is a walk through gardens: wide photos edge to edge, a line of italic under each,
 * and very little in between. Gravel, hedge green and soil, one light book serif. The only thing to
 * do on the page is book a visit, and the only switch on it shows the same driveway half done and
 * finished. What can be done in which month is stated as plain fact, never as "booking now".
 */

const PHONE = "90 12 34 56";
const TEL = "tel:+4590123456";
const ADDRESS = "Grusgravvej 6, 7100 Vejle";

// Colours: gravel #EEEAE2, ink #1F2520, hedge #24362A (dark sections and the button), sand #DDD5C4,
// line #C9C3B5, muted #5C5F57, on hedge #E9E5DC and #B5B9AE.

const wrap = "mx-auto w-full max-w-[1320px] px-5 sm:px-10";
const h2 = "text-[38px] font-light leading-[1.02] tracking-[-0.02em] sm:text-[56px]";
const cap = "italic text-[17px] leading-[1.4] sm:text-[19px]";
const btn = "inline-flex items-center justify-center whitespace-nowrap bg-[#24362A] font-medium text-[#EEEAE2] transition-colors hover:bg-[#1A2A1F]";
const field = "w-full border-0 border-b-2 border-[#1F2520] bg-transparent px-0 py-2.5 text-[19px] text-[#1F2520] placeholder:text-[#7A7B72] focus-visible:border-[#24362A]";

const NAV = [
  ["#haver", "Haver"],
  ["#foer-efter", "Før og efter"],
  ["#priser", "Priser"],
  ["#kontakt", "Kontakt"],
] as const;

const PRICES: { what: string; note?: string; price: string }[] = [
  { what: "Opmåling og tilbud", note: "trækkes fra, hvis du siger ja", price: "500 kr." },
  { what: "Timepris, anlægsgartner", price: "545 kr." },
  { what: "Terrasse i betonfliser", note: "med udgravning og bortkørsel af jord", price: "950–1.300 kr./m²" },
  { what: "Indkørsel i betonsten", note: "med udgravning, kantsten og bortkørsel", price: "1.150–1.550 kr./m²" },
  { what: "Granit chaussésten", price: "1.900–2.600 kr./m²" },
  { what: "Træterrasse i lærk", price: "1.800–2.400 kr./m²" },
  { what: "Bøgehæk, barrodsplanter", note: "5 planter pr. meter, i ny muld", price: "325–425 kr./m" },
  { what: "Rullegræs", note: "med 10 cm muld og planering", price: "210–290 kr./m²" },
];

const LAYERS: [string, string][] = [
  ["Betonsten", "8 cm"],
  ["Afretningsgrus", "3 cm"],
  ["Stabilgrus, komprimeret i tre lag", "25 cm"],
];

const PLEJE: [string, string][] = [
  ["Rækkehushave, under 200 m²", "650 kr."],
  ["200–500 m²", "1.150 kr."],
  ["500–900 m²", "1.650 kr."],
];

const VIEWS = [
  { done: false, label: "Under arbejdet" },
  { done: true, label: "Færdig" },
];

const SEASONS: [string, string][] = [
  ["Belægning og indkørsler", "Hele året, når jorden ikke er frossen"],
  ["Træterrasser", "Marts til november"],
  ["Bøgehæk med bare rødder", "Oktober til april"],
  ["Rullegræs", "April til juni og august til september"],
  ["Klippe hæk", "Juni og igen i august"],
  ["Beskære træer og buske", "November til marts"],
];

export function AnlaegSite() {
  const [menu, setMenu] = useState(false);
  const [done, setDone] = useState(true);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  return (
    <div className="min-h-dvh overflow-x-clip bg-[#EEEAE2] font-(family-name:--font-lindholm) text-[18px] text-[#1F2520] [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-[#24362A]">
      <DemoNote className="bg-[#24362A] text-[#B5B9AE]" />

      <header className="relative z-40 border-b border-[#C9C3B5] bg-[#EEEAE2] sm:sticky sm:top-0">
        <div className={`${wrap} flex items-center justify-between gap-4 py-3.5`}>
          <a href="#top" className="whitespace-nowrap text-[23px] font-medium leading-none tracking-[-0.01em]">
            Lindholm Anlæg
          </a>
          <nav aria-label="Hovedmenu" className="hidden gap-8 whitespace-nowrap text-[17px] lg:flex">
            {NAV.map(([href, label]) => (
              <a key={href} href={href} className="underline-offset-4 hover:underline">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-5">
            <a href={TEL} className="whitespace-nowrap text-[17px] underline-offset-4 hover:underline max-sm:hidden">
              {PHONE}
            </a>
            <a href="#kontakt" className={`${btn} h-11 px-5 text-[16px] max-sm:hidden`}>
              Book opmåling
            </a>
            <button
              type="button"
              aria-label={menu ? "Luk menu" : "Åbn menu"}
              aria-expanded={menu}
              aria-controls="lindholm-menu"
              onClick={() => setMenu((m) => !m)}
              className="grid size-11 place-items-center border border-[#1F2520] lg:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
                {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
              </svg>
            </button>
          </div>
        </div>
        {menu && (
          <nav id="lindholm-menu" aria-label="Menu" className="border-t border-[#C9C3B5] lg:hidden">
            <ul className={`${wrap} py-2`}>
              {NAV.map(([href, label]) => (
                <li key={href}>
                  <a href={href} onClick={() => setMenu(false)} className="block border-b border-[#C9C3B5] py-3.5 text-[20px]">
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <a href={TEL} className="block py-3.5 text-[20px] font-medium">
                  Ring {PHONE}
                </a>
              </li>
            </ul>
          </nav>
        )}
      </header>

      <main>
        {/* A few words, then the garden, edge to edge */}
        <section id="top">
          <div className={`${wrap} grid gap-x-10 gap-y-8 pb-10 pt-12 sm:pb-14 sm:pt-20 lg:grid-cols-12 lg:items-end`}>
            <div className="lg:col-span-8">
              <p className="text-[17px] italic text-[#5C5F57]">Anlægsgartner i Vejle</p>
              <h1 className="mt-3 text-[46px] font-light leading-[0.98] tracking-[-0.03em] sm:text-[76px] lg:text-[92px]">Indkørsler, terrasser, hække og plæner.</h1>
            </div>
            <div className="flex flex-col gap-5 lg:col-span-4 lg:pb-3">
              <p className="max-w-[34ch] text-[19px] leading-[1.5]">Fra Fredericia til Give. Vi kommer ud og måler op for 500 kr., og dem trækker vi fra, hvis du siger ja.</p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 max-sm:hidden">
                <a href="#kontakt" className={`${btn} h-14 px-7 text-[18px]`}>
                  Book en opmåling
                </a>
                <a href={TEL} className="whitespace-nowrap text-[18px] underline underline-offset-4">
                  Ring {PHONE}
                </a>
              </div>
            </div>
          </div>
          <Img
            priority
            id="1668120089662-42642838cfef"
            w={2400}
            alt="Stor græsplæne med buske og træer"
            className="aspect-[4/5] w-full object-cover sm:aspect-[16/9] lg:aspect-[21/9]"
          />
        </section>

        {/* The gardens, as wide as they are */}
        <section id="haver" className="pt-20 sm:pt-32">
          <h2 className={`${wrap} ${h2}`}>Haver, vi har lavet</h2>

          <figure className="mt-10 sm:mt-14">
            <Img id="1700689807667-82630348b301" w={2400} alt="Sti af tegl gennem en have med blomster og træer" className="aspect-[4/3] w-full object-cover sm:aspect-[21/9]" />
            <figcaption className={`${wrap} mt-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8`}>
              <span className={cap}>Teglsti og nye bede, Jelling</span>
              <span className="text-[16px] text-[#5C5F57]">26 m² sti og 40 m² bede · 6 dage</span>
            </figcaption>
          </figure>

          <div className={`${wrap} mt-16 grid gap-x-6 gap-y-10 sm:mt-24 sm:grid-cols-12`}>
            <figure className="sm:col-span-7 sm:self-end">
              <Img id="1761489356802-afe917fe7ad2" w={1400} alt="Træbænk i en have med klippede hække" className="aspect-[4/3] w-full object-cover" />
              <figcaption className="mt-4 flex flex-col gap-1">
                <span className={cap}>Bøgehæk og plads til en bænk, Egtved</span>
                <span className="text-[16px] text-[#5C5F57]">46 m hæk · 2 dage</span>
              </figcaption>
            </figure>
            <figure className="sm:col-span-5 sm:self-end">
              <Img id="1776757845288-3e71e234e3d3" w={1000} alt="Have med grussti mellem blomstrende bede" className="aspect-[4/5] w-full object-cover" />
              <figcaption className="mt-4 flex flex-col gap-1">
                <span className={cap}>Grussti og regnvandsbed, Vejle Ø</span>
                <span className="text-[16px] text-[#5C5F57]">18 m² bed med vand fra garagetaget</span>
              </figcaption>
            </figure>
          </div>

          <figure className="mt-16 sm:mt-24">
            <Img id="1760552268175-431696421106" w={2400} alt="Træterrasse omgivet af store, grønne træer" className="aspect-[4/3] w-full object-cover sm:aspect-[21/9]" />
            <figcaption className={`${wrap} mt-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8`}>
              <span className={cap}>Træterrasse mellem gamle bøge, Skibet</span>
              <span className="text-[16px] text-[#5C5F57]">32 m² sibirisk lærk · 5 dage</span>
            </figcaption>
          </figure>
          <p className={`${wrap} mt-10 text-[15px] text-[#5C5F57]`}>Haverne er eksempler, og fotos er pladsholdere fra Unsplash. På din side står jeres egne haver.</p>
        </section>

        {/* Half done and finished, at full size */}
        <section id="foer-efter" className="mt-20 bg-[#24362A] text-[#E9E5DC] sm:mt-32 [&_:focus-visible]:outline-[#E9E5DC]">
          <div className={`${wrap} flex flex-col gap-6 pb-8 pt-16 sm:flex-row sm:items-end sm:justify-between sm:pt-24`}>
            <div>
              <h2 className={h2}>Indkørsel i Bredballe</h2>
              <p className="mt-3 text-[18px] text-[#B5B9AE]">74 m² betonsten på 36 cm grus · 8 dage</p>
            </div>
            <div role="group" aria-label="Vis indkørslen" className="flex shrink-0 border border-[#E9E5DC]">
              {VIEWS.map((v) => (
                <button
                  key={v.label}
                  type="button"
                  aria-pressed={done === v.done}
                  onClick={() => setDone(v.done)}
                  className={`h-12 flex-1 whitespace-nowrap px-5 text-[17px] transition-colors sm:flex-none ${done === v.done ? "bg-[#E9E5DC] text-[#24362A]" : "hover:bg-[#2F4636]"}`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
            <div aria-hidden={done} className={`absolute inset-0 transition-opacity duration-300 ${done ? "opacity-0" : "opacity-100"}`}>
              <Img id="1725586660046-0c2bea151543" w={2400} alt="Under arbejdet: en gartner lægger sten på et afrettet grusbed" className="size-full object-cover" />
            </div>
            <div aria-hidden={!done} className={`absolute inset-0 transition-opacity duration-300 ${done ? "opacity-100" : "opacity-0"}`}>
              <Img id="1743802969597-cded1a7356bd" w={2400} alt="Færdig: belægning af grå sten" className="size-full object-cover" />
            </div>
          </div>
          <p className={`${wrap} py-6 text-[15px] text-[#B5B9AE]`}>Pladsholder: to forskellige fotos. På din side står to fotos fra den samme opgave.</p>
        </section>

        {/* Prices, and what can be done when */}
        <section id="priser" className={`${wrap} grid gap-x-10 gap-y-20 py-20 sm:py-32 lg:grid-cols-12`}>
          <div className="lg:col-span-7">
            <h2 className={h2}>Priser</h2>
            <p className="mt-4 max-w-[46ch] text-[18px] leading-[1.5] text-[#5C5F57]">Eksempelpriser inkl. moms. Den faste pris får du efter opmålingen.</p>
            <table className="mt-10 w-full border-collapse">
              <tbody>
                {PRICES.map((p) => (
                  <tr key={p.what} className="border-t border-[#C9C3B5] first:border-t-[#1F2520] last:border-b">
                    <th scope="row" className="py-3.5 pr-4 text-left align-top font-normal">
                      {p.what}
                      {p.note && <span className="block text-[15px] italic text-[#5C5F57]">{p.note}</span>}
                    </th>
                    <td className="whitespace-nowrap py-3.5 text-right align-top tabular-nums">{p.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-8">
              <details className="group border-b border-[#C9C3B5]">
                <summary className="flex cursor-pointer list-none items-baseline justify-between gap-4 py-4 text-[19px] [&::-webkit-details-marker]:hidden">
                  En indkørsel starter 36 cm under jorden
                  <span aria-hidden className="text-[24px] leading-none transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="pb-6">
                  <dl className="grid max-w-[460px] grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-2 tabular-nums">
                    {LAYERS.map(([what, cm]) => (
                      <div key={what} className="contents">
                        <dt>{what}</dt>
                        <dd className="text-right">{cm}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-4 max-w-[52ch] text-[17px] leading-[1.5] text-[#5C5F57]">Det er gruset, der bærer bilen. Sparer man på det, synker stenene i hjulsporene efter et par vintre.</p>
                </div>
              </details>
              <details className="group border-b border-[#C9C3B5]">
                <summary className="flex cursor-pointer list-none items-baseline justify-between gap-4 py-4 text-[19px] [&::-webkit-details-marker]:hidden">
                  Havepleje hver måned
                  <span aria-hidden className="text-[24px] leading-none transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="pb-6">
                  <dl className="grid max-w-[460px] grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-2 tabular-nums">
                    {PLEJE.map(([size, price]) => (
                      <div key={size} className="contents">
                        <dt>{size}</dt>
                        <dd className="whitespace-nowrap text-right">{price}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-4 max-w-[52ch] text-[17px] leading-[1.5] text-[#5C5F57]">Pr. måned fra april til oktober. Større haver efter et besøg.</p>
                </div>
              </details>
            </div>
          </div>

          <div id="aaret" className="lg:col-span-4 lg:col-start-9">
            <h2 className="text-[30px] font-light leading-[1.1] tracking-[-0.015em] sm:text-[36px]">Hvornår på året?</h2>
            <dl className="mt-8 border-t border-[#1F2520]">
              {SEASONS.map(([task, when]) => (
                <div key={task} className="border-b border-[#C9C3B5] py-3.5">
                  <dt>{task}</dt>
                  <dd className="mt-0.5 italic text-[#5C5F57]">{when}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Book a visit */}
        <section id="kontakt" className="bg-[#DDD5C4]">
          <div className={`${wrap} grid gap-x-10 gap-y-14 py-20 sm:py-32 lg:grid-cols-12`}>
            <div className="lg:col-span-6">
              <h2 className={h2}>Book en opmåling</h2>
              <p className="mt-4 max-w-[40ch] text-[19px] leading-[1.5]">Skriv, hvad du har i tankerne, så ringer vi og finder en dag, hvor vi kan komme ud.</p>
              <form
                className="mt-10 flex flex-col gap-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                  e.currentTarget.reset();
                }}
              >
                <label className="flex flex-col gap-1 text-[16px] text-[#5C5F57]">
                  Hvad skal laves?
                  <textarea required name="opgave" rows={2} placeholder="Fx ny indkørsel, ca. 70 m²" className={`${field} resize-none`} />
                </label>
                <label className="flex flex-col gap-1 text-[16px] text-[#5C5F57]">
                  Dit telefonnummer
                  <input required name="telefon" type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9 +]{8,}" title="Skriv et telefonnummer på mindst 8 cifre" className={`${field} sm:max-w-[320px]`} />
                </label>
                <div className="flex flex-col items-start gap-4">
                  <button type="submit" className={`${btn} h-14 px-8 text-[18px]`}>
                    Book opmåling
                  </button>
                  {sent && (
                    <p role="status" className="max-w-[48ch] text-[17px] italic leading-[1.5]">
                      Tak. På en rigtig side ville vi nu ringe dig op og finde en dag. Dette er et eksempel, så der er ikke sendt noget.
                    </p>
                  )}
                </div>
              </form>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <a href={TEL} className="whitespace-nowrap text-[40px] font-light leading-none tracking-[-0.02em] underline-offset-[6px] hover:underline sm:text-[52px]">
                {PHONE}
              </a>
              <p className="mt-3 text-[17px] text-[#5C5F57]">Hverdage kl. 7–15.30</p>
              <dl className="mt-10 grid grid-cols-[max-content_minmax(0,1fr)] gap-x-6 gap-y-2.5 border-t border-[#1F2520] pt-5 text-[17px]">
                <dt className="text-[#5C5F57]">Område</dt>
                <dd>Fra Fredericia til Give</dd>
                <dt className="text-[#5C5F57]">Adresse</dt>
                <dd>{ADDRESS}</dd>
                <dt className="text-[#5C5F57]">Garanti</dt>
                <dd>Byg Garanti (eksempel)</dd>
                <dt className="text-[#5C5F57]">CVR</dt>
                <dd>00 00 00 00 (eksempel)</dd>
              </dl>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#24362A] pb-24 text-[16px] text-[#B5B9AE] sm:pb-0 [&_:focus-visible]:outline-[#E9E5DC]">
        <div className={`${wrap} flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-10`}>
          <span className="text-[20px] font-medium text-[#E9E5DC]">Lindholm Anlæg</span>
          <span>{ADDRESS}</span>
          <span>CVR 00 00 00 00 (eksempel)</span>
          <a href={TEL} className="text-[#E9E5DC] underline underline-offset-4">
            {PHONE}
          </a>
        </div>
      </footer>

      {/* Phone: book the visit, or call */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-[#C9C3B5] bg-[#EEEAE2] px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 sm:hidden">
        <a href="#kontakt" className={`${btn} h-[52px] flex-1 text-[17px]`}>
          Book opmåling
        </a>
        <a href={TEL} className="grid h-[52px] place-items-center whitespace-nowrap border border-[#1F2520] px-5 text-[17px] font-medium">
          Ring
        </a>
      </div>
    </div>
  );
}
