"use client";

import { useEffect, useState } from "react";
import { DemoNote, Img, SampleReviewsNote, Stars } from "./shared";

/*
 * Teglgaard Murer, built like a new joint in an old wall: lime white and brick red, a faint
 * running bond behind the quiet parts, a slab serif like the stamp on a brick, and a facade log
 * written as a table with house year and m². The diagnosis tool stays, but it says plainly that a
 * photo is not a survey. No cards, no shadows, no motion.
 */

const PHONE = "78 90 12 34";
const TEL = "tel:+4578901234";
const ADDRESS = "Bødkervej 7, 8361 Hasselager";

const slab = "font-(family-name:--font-teglgaard-slab)";

/** Running bond in thin lines: one tile is two courses, the head joints offset by half a brick. */
const bond = (stroke: string) =>
  ({
    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="40"><g stroke="${stroke}" stroke-width="1" fill="none"><path d="M0 .5H96M0 20.5H96M.5 0V20M48.5 20V40"/></g></svg>`,
    )}")`,
    backgroundSize: "96px 40px",
  }) as React.CSSProperties;

const LOG: { place: string; house: string; year: number; job: string; m2: string; time: string; when: string }[] = [
  { place: "Højbjerg", house: "Murermestervilla", year: 1934, job: "Omfugning med kalkmørtel, hele facaden", m2: "140", time: "9 dage", when: "sep. 2026" },
  { place: "Risskov", house: "Villa", year: 1928, job: "Afskallet cementpuds på soklen skiftet til kalkpuds", m2: "32", time: "4 dage", when: "aug. 2026" },
  { place: "Viby J", house: "Parcelhus", year: 1958, job: "Revne over stuevindue syet, 18 sten skiftet", m2: "6", time: "2 dage", when: "jul. 2026" },
  { place: "Frederiksbjerg", house: "Etageejendom", year: 1902, job: "Gavl omfuget fra lift", m2: "210", time: "3 uger", when: "jun. 2026" },
  { place: "Åbyhøj", house: "Villa", year: 1912, job: "Skorsten omfuget og ny afdækning", m2: "–", time: "1 dag", when: "maj 2026" },
  { place: "Lystrup", house: "Parcelhus", year: 1974, job: "Frostsprængte sten skiftet, facaden renset", m2: "95", time: "5 dage", when: "apr. 2026" },
];

/** "What's wrong with my wall?": the four things people ring a bricklayer about. */
const PROBLEMS = [
  {
    label: "Fugerne smuldrer",
    photo: "1612529505363-07a363324da7",
    alt: "Murværk med slidte og udvaskede fuger",
    cause: "Gamle kalkfuger bliver slidt af regn og frost. Når de er hule, trænger vandet ind, og stenene begynder at skalle.",
    fix: "Vi kradser de gamle fuger ud i 15–20 mm dybde og fuger om med en mørtel, der passer til husets alder.",
    price: "Fra 650 kr./m²",
  },
  {
    label: "Revner i muren",
    photo: "1746606512371-e14d7cb6e45a",
    alt: "Revne gennem fugerne i en murstensvæg",
    cause: "Revner kommer tit af sætninger, rustne murbindere eller en overligger over et vindue, der har givet sig.",
    fix: "Vi finder årsagen først. Er revnen stille, syr vi den med rustfri armering og murer de løse sten om.",
    price: "Fra 4.500 kr. pr. revne",
  },
  {
    label: "Pudsen skaller af",
    photo: "1533738630286-f1f4a61705f8",
    alt: "Mur med afskallet grå puds og røde sten bagved",
    cause: "Puds med for stærk cementmørtel kan ikke ånde. Fugten bliver fanget bag pudsen, og så slipper den.",
    fix: "Vi banker den løse puds af og pudser op igen med kalkmørtel, som muren kan tørre ud igennem.",
    price: "Fra 850 kr./m²",
  },
  {
    label: "Fugt og hvide pletter",
    photo: "1616282836245-5d98abee8d98",
    alt: "Brun og grå murstensvæg med lyse pletter",
    cause: "Hvide pletter er salte, som fugten trækker ud af muren. Der kommer vand ind et sted, tit fra sokkel, tag eller et utæt nedløb.",
    fix: "Vi går huset igennem og finder vandvejen. Nogle gange er det et nedløb, og så er det ikke murerarbejde.",
    price: "Gennemgang 850 kr.",
  },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
const FACADE_MONTHS = [3, 4, 5, 6, 7, 8, 9];

const PRICES: { what: string; note?: string; price: string }[] = [
  { what: "Besigtigelse", note: "i Aarhus Kommune, trækkes fra ved accept", price: "850 kr." },
  { what: "Timepris, murersvend", price: "585 kr." },
  { what: "Omfugning, facade", note: "uden stillads", price: "650–950 kr./m²" },
  { what: "Kalkpuds på sokkel", price: "850–1.100 kr./m²" },
  { what: "Stillads til 1½-plans hus", note: "opstilling og leje i 3 uger", price: "9.000–14.000 kr." },
];

const REVIEWS: { stars: number; date: string; text: string; name: string; reply?: string }[] = [
  { stars: 5, date: "29. sep. 2026", text: "Jens sagde selv, at vores revne ikke var farlig, og at vi godt kunne vente et par år. Det sætter jeg pris på.", name: "Anne og Jakob, Viby J" },
  {
    stars: 4,
    date: "3. sep. 2026",
    text: "Fugerne ser ud, som da huset var nyt. Men stilladset stod en uge længere end aftalt, fordi det regnede, og det blev ikke sagt før til sidst.",
    name: "Lene, Højbjerg",
    reply: "Vi må ikke fuge i regnvejr, men vi skulle have ringet, da vi kunne se, at det trak ud. Det har vi lovet hinanden at gøre fremover.",
  },
  { stars: 5, date: "14. aug. 2026", text: "Soklen var pudset med cement af den forrige ejer. Nu er den kalket, og kælderen lugter ikke længere af fugt.", name: "Peter, Risskov" },
  { stars: 5, date: "22. maj 2026", text: "Skorstenen klaret på en dag, og de fejede taget bagefter.", name: "Mette, Åbyhøj" },
];

const NAV = [
  ["#facader", "Facader"],
  ["#mur", "Hvad fejler muren?"],
  ["#priser", "Priser"],
  ["#kontakt", "Kontakt"],
] as const;

const wrap = "mx-auto max-w-[1200px] px-4 sm:px-8";
const h2 = `${slab} text-[34px] font-semibold leading-[1.05] tracking-[-0.01em] sm:text-[46px]`;
const btn = "items-center justify-center whitespace-nowrap bg-[#9E3B26] font-semibold text-white transition-colors hover:bg-[#82301E]";
const field = "w-full border border-[#A79E92] bg-white px-3 py-2.5 text-base text-[#2A221E] placeholder:text-[#8A8076]";

export function MurerSite() {
  const [menu, setMenu] = useState(false);
  const [problem, setProblem] = useState(0);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const p = PROBLEMS[problem];
  const now = 9; // October: the page is dated by its price list

  return (
    <div className="min-h-dvh overflow-x-clip bg-[#F2EEE6] font-(family-name:--font-teglgaard) text-[#2A221E] [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-[#9E3B26]">
      <DemoNote className="bg-[#2A221E] text-[#D8D0C4]" />

      <header className="relative z-40 border-b border-[#D6CEC2] bg-[#F2EEE6] sm:sticky sm:top-0">
        <div className={`${wrap} flex items-center justify-between gap-4 py-3`}>
          <a href="#top" className="flex min-w-0 flex-col leading-tight">
            <span className={`${slab} whitespace-nowrap text-[23px] font-bold sm:text-[26px]`}>Teglgaard Murer</span>
            <span className="whitespace-nowrap text-xs text-[#655A51]">Murermester i Aarhus · siden 1998</span>
          </a>
          <nav aria-label="Hovedmenu" className="hidden gap-7 whitespace-nowrap text-[15px] font-medium lg:flex">
            {NAV.map(([href, label]) => (
              <a key={href} href={href} className="underline-offset-4 hover:text-[#9E3B26] hover:underline">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-4">
            <a href={TEL} className="hidden whitespace-nowrap font-semibold sm:inline">
              {PHONE}
            </a>
            <a href="#kontakt" className={`${btn} hidden px-5 py-2.5 md:inline-flex`}>
              Book besigtigelse
            </a>
            <button
              type="button"
              aria-label={menu ? "Luk menu" : "Åbn menu"}
              aria-expanded={menu}
              aria-controls="teglgaard-menu"
              onClick={() => setMenu((m) => !m)}
              className="grid size-11 place-items-center border border-[#A79E92] lg:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
        {menu && (
          <nav id="teglgaard-menu" aria-label="Menu" className="border-t border-[#D6CEC2] lg:hidden">
            <ul className={`${wrap} py-2`}>
              {NAV.map(([href, label]) => (
                <li key={href}>
                  <a href={href} onClick={() => setMenu(false)} className="block border-b border-[#D6CEC2] py-3.5 text-lg font-medium">
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
        {/* Hero on the bond */}
        <section id="top" style={bond("rgba(42,34,30,0.055)")}>
          <div className={`${wrap} grid items-center gap-8 pb-14 pt-6 sm:pt-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16 lg:pb-24 lg:pt-16`}>
            <div className="flex flex-col gap-6">
              <h1 className={`${slab} max-w-[17ch] text-[42px] font-semibold leading-[1.02] sm:text-[58px] lg:text-[66px]`}>Gamle huse i Aarhus, fuget og pudset med kalk.</h1>
              <p className="max-w-[46ch] text-lg leading-[1.6] text-[#4A3F38] sm:text-xl">
                Vi er tre murere og en lærling. Det meste, vi laver, er huse fra før 1950, hvor muren skal kunne ånde. Så bruger vi kalkmørtel og ikke cement.
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <a href="#kontakt" className={`${btn} inline-flex px-6 py-4 text-[17px]`}>
                  Book besigtigelse
                </a>
                <p className="text-[#655A51]">
                  eller ring til Jens på{" "}
                  <a href={TEL} className="whitespace-nowrap font-semibold text-[#2A221E] underline underline-offset-2">
                    {PHONE}
                  </a>
                </p>
              </div>
              <p className="max-w-[48ch] border-t border-[#CFC6B9] pt-4 text-[15px] leading-normal text-[#4A3F38]">
                Besigtigelse koster 850 kr. inkl. moms i Aarhus Kommune. Siger du ja til tilbuddet, trækker vi beløbet fra. Næste ledige tid til facader er april 2027.
              </p>
            </div>
            <figure className="flex flex-col gap-2 max-lg:order-first max-sm:-mx-4">
              <Img priority id="1701850009190-2859ba2aeea6" w={1400} alt="Murer lægger mørtel på en ny række mursten" className="aspect-[4/3] w-full object-cover lg:aspect-[5/6]" />
              <figcaption className="flex flex-wrap justify-between gap-x-3 text-[13px] text-[#655A51] max-sm:px-4">
                <span>Ny gavl, Tilst</span>
                <span>Marts 2026 · 48 m²</span>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* The facade log */}
        <section id="facader" className="scroll-mt-20 border-y border-[#D6CEC2] bg-[#FBF9F5]">
          <div className={`${wrap} py-14 sm:py-20`}>
            <div className="flex max-w-[640px] flex-col gap-3">
              <h2 className={h2}>Facader og mure i år</h2>
              <p className="text-[17px] leading-[1.6] text-[#4A3F38]">Husets alder betyder mere end noget andet for, hvordan vi gør. Derfor står byggeåret ved hver opgave.</p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
              <figure className="flex flex-col gap-2">
                <Img id="1592795694703-24f1814cfb0a" w={1000} alt="Murværk med nye lyse fuger" className="aspect-[16/10] w-full object-cover" />
                <figcaption className="text-[13px] text-[#655A51]">Højbjerg, 1934 · 140 m² omfuget</figcaption>
              </figure>
              <figure className="flex flex-col gap-2">
                <Img id="1682366278673-71e92ce4f503" w={700} alt="Murer arbejder på en murstensvæg" className="aspect-[16/10] w-full object-cover sm:aspect-auto sm:h-full sm:min-h-0 sm:flex-1" />
                <figcaption className="text-[13px] text-[#655A51]">Viby J, 1958 · revne syet</figcaption>
              </figure>
            </div>

            <table className="mt-10 w-full border-collapse text-[15px]">
              <caption className="sr-only">Opgaver i 2026 med byggeår, areal og tid</caption>
              <thead className="max-md:sr-only">
                <tr className="border-y-2 border-[#2A221E] text-left text-[13px] text-[#655A51]">
                  <th scope="col" className="py-2.5 pr-4 font-semibold">Hus</th>
                  <th scope="col" className="py-2.5 pr-4 font-semibold">Bygget</th>
                  <th scope="col" className="py-2.5 pr-4 font-semibold">Opgave</th>
                  <th scope="col" className="py-2.5 pr-4 text-right font-semibold">m²</th>
                  <th scope="col" className="py-2.5 pr-4 text-right font-semibold">Tid</th>
                  <th scope="col" className="py-2.5 text-right font-semibold">Måned</th>
                </tr>
              </thead>
              <tbody>
                {LOG.map((l) => (
                  <tr key={l.place} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 border-b border-[#D6CEC2] py-4 max-md:first:border-t-2 max-md:first:border-t-[#2A221E] md:table-row md:py-0">
                    <th scope="row" className="text-left font-semibold md:py-3.5 md:pr-4">
                      {l.house}, {l.place}
                    </th>
                    <td className={`${slab} text-right text-lg font-semibold tabular-nums md:py-3.5 md:pr-4 md:text-left`}>{l.year}</td>
                    <td className="col-span-2 leading-snug md:py-3.5 md:pr-4">{l.job}</td>
                    <td className="col-span-2 text-sm text-[#655A51] md:hidden">
                      {l.m2 !== "–" && `${l.m2} m² · `}
                      {l.time} · {l.when}
                    </td>
                    <td className="text-right tabular-nums max-md:hidden md:py-3.5 md:pr-4">{l.m2}</td>
                    <td className="whitespace-nowrap text-right max-md:hidden md:py-3.5 md:pr-4">{l.time}</td>
                    <td className="whitespace-nowrap text-right text-[#655A51] max-md:hidden md:py-3.5">{l.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-5 text-[13px] text-[#655A51]">Fotos fra Unsplash som pladsholdere. På din side bruger vi dine egne billeder fra stilladset.</p>
          </div>
        </section>

        {/* What's wrong with the wall? */}
        <section id="mur" className="scroll-mt-20 bg-[#2A221E] text-[#F2EEE6] [&_:focus-visible]:outline-[#F2EEE6]">
          <div className={`${wrap} py-14 sm:py-20`}>
            <div className="flex max-w-[620px] flex-col gap-3">
              <h2 className={h2}>Hvad fejler muren?</h2>
              <p className="text-[17px] leading-[1.6] text-[#D8D0C4]">
                Vælg det, der ligner din mur mest. Det er et bud, ikke en diagnose. Vi skal se muren, før vi siger noget sikkert.
              </p>
            </div>
            <div role="group" aria-label="Vælg skade" className="mt-8 flex flex-wrap border-b border-[#5A4E46]">
              {PROBLEMS.map((pr, i) => (
                <button
                  key={pr.label}
                  type="button"
                  aria-pressed={problem === i}
                  onClick={() => setProblem(i)}
                  className={`-mb-px border-b-[3px] px-1 py-3 text-[15px] font-semibold mr-6 sm:text-base ${problem === i ? "border-[#D9785A] text-white" : "border-transparent text-[#B8AEA2] hover:text-white"}`}
                >
                  {pr.label}
                </button>
              ))}
            </div>
            <div aria-live="polite" className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-12">
              <Img id={p.photo} w={1000} alt={p.alt} className="aspect-[4/3] w-full object-cover" />
              <div className="flex flex-col gap-5">
                <h3 className={`${slab} text-[30px] font-semibold leading-tight`}>{p.label}</h3>
                <dl className="flex flex-col gap-4 leading-[1.6]">
                  <div>
                    <dt className="font-semibold text-white">Hvorfor sker det?</dt>
                    <dd className="text-[#D8D0C4]">{p.cause}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-white">Det gør vi</dt>
                    <dd className="text-[#D8D0C4]">{p.fix}</dd>
                  </div>
                  <div className="border-t border-[#5A4E46] pt-4">
                    <dt className="text-sm text-[#B8AEA2]">Typisk pris inkl. moms</dt>
                    <dd className={`${slab} text-[26px] font-semibold`}>{p.price}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* Season and prices */}
        <section id="priser" className="scroll-mt-20" style={bond("rgba(42,34,30,0.06)")}>
          <div className={`${wrap} grid gap-12 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16`}>
            <div className="flex flex-col gap-4">
              <h2 className={h2}>Hvornår kan vi komme?</h2>
              <p className="max-w-[46ch] text-[17px] leading-[1.6] text-[#4A3F38]">
                Mørtel må ikke få frost, før den er hærdet. Derfor fuger vi facader fra april til oktober. Om vinteren laver vi badeværelser og murerarbejde indenfor.
              </p>
              <div className="mt-2 bg-[#FBF9F5] p-4 sm:p-5">
                <ol className="grid grid-cols-6 gap-px bg-[#D6CEC2] sm:grid-cols-12" aria-label="Facadesæson">
                  {MONTHS.map((m, i) => {
                    const on = FACADE_MONTHS.includes(i);
                    return (
                      <li key={m} className={`relative flex h-14 items-end justify-center pb-1.5 text-[13px] ${on ? "bg-[#9E3B26] text-white" : "bg-[#FBF9F5] text-[#655A51]"}`}>
                        {i === now && <span className="absolute inset-x-0 top-0 h-1 bg-[#2A221E]" aria-hidden />}
                        <span>
                          {m}
                          {i === now && <span className="sr-only"> (nu)</span>}
                          {on && <span className="sr-only">, facadesæson</span>}
                        </span>
                      </li>
                    );
                  })}
                </ol>
                <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-[#655A51]">
                  <span className="inline-flex items-center gap-2">
                    <span className="size-3 bg-[#9E3B26]" aria-hidden /> Facader og fuger
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-1 w-3 bg-[#2A221E]" aria-hidden /> Nu
                  </span>
                </p>
              </div>
              <dl className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-6 gap-y-2 text-[15px]">
                <dt className="text-[#655A51]">Facader</dt>
                <dd>Vi booker nu til april 2027</dd>
                <dt className="text-[#655A51]">Bad og indvendigt</dt>
                <dd>Ca. 4 ugers ventetid</dd>
              </dl>
            </div>
            <table className="w-full self-start border-collapse bg-[#FBF9F5]">
              <caption className={`${slab} pb-3 text-left text-[22px] font-semibold`}>
                Priser
                <span className="block font-(family-name:--font-teglgaard) text-sm font-normal text-[#655A51]">Vejledende priser inkl. moms, oktober 2026</span>
              </caption>
              <tbody>
                {PRICES.map((pr) => (
                  <tr key={pr.what} className="border-b border-[#D6CEC2] first:border-t-2 first:border-t-[#2A221E]">
                    <th scope="row" className="px-4 py-3.5 text-left align-top font-medium">
                      {pr.what}
                      {pr.note && <span className="block text-sm font-normal text-[#655A51]">{pr.note}</span>}
                    </th>
                    <td className="whitespace-nowrap px-4 py-3.5 text-right align-top tabular-nums">{pr.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* The master */}
        <section className="border-y border-[#D6CEC2] bg-[#FBF9F5]">
          <div className={`${wrap} grid items-start gap-8 py-14 sm:py-20 md:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-16`}>
            <figure className="flex flex-col gap-2">
              <Img id="1682366278869-6c01b1517319" w={700} alt="Pladsholderfoto af en murer, der arbejder på en mur" className="aspect-[4/5] w-full object-cover max-md:aspect-[16/10]" />
              <figcaption className="text-[13px] text-[#655A51]">Pladsholderfoto · her kommer mesterens eget portræt</figcaption>
            </figure>
            <div className="flex max-w-[580px] flex-col gap-5">
              <h2 className={h2}>Jens Teglgaard, murermester</h2>
              <p className="text-[17px] leading-[1.65] text-[#4A3F38]">
                Jeg blev udlært i 1991 hos en murer i Trøjborg, der kun arbejdede med kalk. Det har jeg holdt fast i. Jeg kommer selv ud til besigtigelsen, og jeg er på pladsen hver dag, mens vi arbejder.
              </p>
              <p className="text-[17px] leading-[1.65] text-[#4A3F38]">Er det noget, der kan vente, siger jeg det. Er det et nedløb og ikke muren, siger jeg også det.</p>
              <dl className="mt-1 grid grid-cols-[max-content_minmax(0,1fr)] gap-x-6 gap-y-2.5 border-t border-[#D6CEC2] pt-5 text-[15px]">
                <dt className="text-[#655A51]">Adresse</dt>
                <dd>{ADDRESS}</dd>
                <dt className="text-[#655A51]">Telefon</dt>
                <dd>
                  <a href={TEL} className="font-semibold underline underline-offset-2">
                    {PHONE}
                  </a>
                  , hverdage 7–15.30
                </dd>
                <dt className="text-[#655A51]">CVR</dt>
                <dd>00 00 00 00 (eksempel)</dd>
                <dt className="text-[#655A51]">Garanti</dt>
                <dd>Byg Garanti (eksempel)</dd>
                <dt className="text-[#655A51]">Område</dt>
                <dd>Aarhus Kommune, Skanderborg og Hinnerup</dd>
              </dl>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className={`${wrap} py-14 sm:py-20`}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h2 className={h2}>Det skriver kunderne</h2>
            <SampleReviewsNote className="text-[#655A51]" />
          </div>
          <div className="mt-8 grid gap-x-12 md:grid-cols-2">
            {REVIEWS.map((r, i) => (
              <figure key={r.name} className={`flex flex-col gap-3 border-t-2 border-[#2A221E] py-6 ${i % 2 ? "md:mt-12" : ""}`}>
                <blockquote className={`${slab} text-[21px] font-medium leading-[1.4]`}>{r.text}</blockquote>
                <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] text-[#655A51]">
                  <span className="font-semibold text-[#2A221E]">{r.name}</span>
                  <span>{r.date}</span>
                  <Stars n={r.stars} className="text-[#9E3B26]" />
                </figcaption>
                {r.reply && (
                  <p className="border-l-2 border-[#9E3B26] pl-3.5 text-[15px] leading-[1.55] text-[#4A3F38]">
                    <b className="font-semibold">Svar fra Jens:</b> {r.reply}
                  </p>
                )}
              </figure>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="kontakt" className="scroll-mt-20 bg-[#9E3B26] text-white [&_:focus-visible]:outline-white">
          <div className={`${wrap} grid gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16`}>
            <div className="flex flex-col gap-4">
              <h2 className={h2}>Book en besigtigelse</h2>
              <p className="max-w-[44ch] text-[17px] leading-[1.6] text-[#F4DDD5]">
                Skriv, hvad du har set på muren, og hvornår huset er bygget, hvis du ved det. Jens ringer dig op inden for to hverdage og finder en tid. Haster det, så ring.
              </p>
              <p className={`${slab} text-[32px] font-semibold`}>
                <a href={TEL} className="whitespace-nowrap underline-offset-4 hover:underline">
                  {PHONE}
                </a>
              </p>
              <p className="text-sm text-[#F4DDD5]">Hverdage 7–15.30 · Besigtigelse 850 kr., trækkes fra</p>
            </div>
            <form
              className="flex flex-col gap-4 bg-[#F2EEE6] p-5 text-[#2A221E] sm:p-7 [&_:focus-visible]:outline-[#9E3B26]"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
                e.currentTarget.reset();
              }}
            >
              {sent && (
                <p role="status" className="border-l-4 border-[#9E3B26] bg-white p-4 leading-normal">
                  Tak. På en rigtig side ville Jens ringe dig op inden for to hverdage og aftale en tid. Dette er et eksempel, så der er ikke sendt noget.
                </p>
              )}
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
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_140px]">
                <label className="flex flex-col gap-1.5 text-[15px] font-medium">
                  Adresse
                  <input required name="adresse" autoComplete="street-address" className={field} />
                </label>
                <label className="flex flex-col gap-1.5 text-[15px] font-medium">
                  Byggeår, ca.
                  <input name="byggeaar" inputMode="numeric" pattern="\d{4}" maxLength={4} title="Fire cifre, fx 1934" placeholder="1934" className={field} />
                </label>
              </div>
              <label className="flex flex-col gap-1.5 text-[15px] font-medium">
                Hvad har du set?
                <textarea required name="besked" rows={4} placeholder="Fx fugerne drysser på vestsiden, og der er en revne over køkkenvinduet" className={`${field} resize-y`} />
              </label>
              <button type="submit" className={`${btn} inline-flex self-start px-6 py-3.5 text-[17px]`}>
                Book besigtigelse
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-[#2A221E] pb-24 text-[#D8D0C4] sm:pb-0">
        <div className={`${wrap} flex flex-wrap justify-between gap-x-8 gap-y-2 py-8 text-sm`}>
          <span className={`${slab} text-base font-semibold text-white`}>Teglgaard Murer</span>
          <span>{ADDRESS}</span>
          <span>CVR 00 00 00 00 (eksempel)</span>
          <a href={TEL} className="text-white underline underline-offset-2">
            {PHONE}
          </a>
        </div>
      </footer>

      {/* Phone: call or book, always within thumb's reach */}
      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2.5 border-t border-[#D6CEC2] bg-[#F2EEE6] px-4 pb-4 pt-3 sm:hidden">
        <a href={TEL} className="grid h-[52px] place-items-center whitespace-nowrap border border-[#2A221E] font-semibold">
          Ring til Jens
        </a>
        <a href="#kontakt" className={`${btn} inline-flex h-[52px]`}>
          <span className="min-[360px]:hidden">Book tid</span>
          <span className="hidden min-[360px]:inline">Book besigtigelse</span>
        </a>
      </div>
    </div>
  );
}
