"use client";

import { useEffect, useState } from "react";
import { DemoNote, Img } from "./shared";

/*
 * Teglgaard Murer in Aarhus, for old houses. Heavy type that sits like a stone lintel, lime white,
 * yellow brick and dark wet slate. The wall comes first as material: one wide facade and two
 * close-ups. Then what is wrong with your wall, the houses we have worked on ordered by the year
 * they were built, and prices on a field of yellow brick.
 */

const PHONE = "78 90 12 34";
const TEL = "tel:+4578901234";
const ADDRESS = "Bødkervej 7, 8361 Hasselager";

const NAV = [
  ["#mur", "Hvad fejler muren?"],
  ["#huse", "Huse"],
  ["#priser", "Priser"],
  ["#kontakt", "Kontakt"],
] as const;

/** What people ring a bricklayer about, with a close-up of each. */
const PROBLEMS = [
  {
    label: "Fugerne smuldrer",
    photo: "1612529505363-07a363324da7",
    alt: "Murværk med slidte og udvaskede fuger",
    cause: "Kalkfuger bliver slidt af regn og frost. Når de er hule, trænger vandet ind bag stenene.",
    fix: "Vi kradser fugerne ud i 15–20 mm dybde og fuger om med en mørtel, der passer til husets alder.",
    price: "Fra 650 kr. pr. m²",
  },
  {
    label: "Revner i muren",
    photo: "1746606512371-e14d7cb6e45a",
    alt: "Revne gennem fugerne i en murstensvæg",
    cause: "Tit en sætning, rustne murbindere eller en overligger over et vindue, der har givet sig.",
    fix: "Vi finder årsagen først. Står revnen stille, syr vi den med rustfri armering og murer de løse sten om.",
    price: "Fra 4.500 kr. pr. revne",
  },
  {
    label: "Pudsen skaller af",
    photo: "1533738630286-f1f4a61705f8",
    alt: "Mur med afskallet grå puds og røde sten bagved",
    cause: "Cementpuds kan ikke ånde. Fugten bliver fanget bagved, og så slipper pudsen.",
    fix: "Vi banker den løse puds af og pudser op med kalk, som muren kan tørre ud igennem.",
    price: "Fra 850 kr. pr. m²",
  },
  {
    label: "Hvide pletter",
    photo: "1616282836245-5d98abee8d98",
    alt: "Murstensvæg med lyse saltpletter",
    cause: "Pletterne er salte, som fugten trækker ud. Vandet kommer ind et sted, tit ved sokkel, tag eller nedløb.",
    fix: "Vi finder vandvejen. Er det et utæt nedløb, siger vi det, for så er det ikke murerarbejde.",
    price: "Gennemgang 850 kr.",
  },
];

const HOUSES: { year: number; place: string; house: string; job: string; facts: string; photo?: string; alt?: string }[] = [
  { year: 1902, place: "Frederiksbjerg", house: "Etageejendom", job: "Gavlen omfuget fra lift", facts: "210 m² · 3 uger · juni 2026" },
  { year: 1912, place: "Åbyhøj", house: "Villa", job: "Skorstenen omfuget og ny afdækning", facts: "1 dag · maj 2026", photo: "1782565076449-a977ce04bd84", alt: "Gammelt rødt tegltag med skorstene" },
  { year: 1928, place: "Risskov", house: "Villa", job: "Cementpuds på soklen skiftet til kalkpuds", facts: "32 m² · 4 dage · august 2026" },
  { year: 1934, place: "Højbjerg", house: "Murermestervilla", job: "Hele facaden omfuget med kalkmørtel", facts: "140 m² · 9 dage · september 2026", photo: "1592795694703-24f1814cfb0a", alt: "Murværk med nye lyse fuger" },
  { year: 1958, place: "Viby J", house: "Parcelhus", job: "Revne over stuevinduet syet og 18 sten skiftet", facts: "2 dage · juli 2026" },
];

const PRICES: { what: string; note?: string; price: string }[] = [
  { what: "Gennemgang af muren", note: "Trækkes fra, hvis du siger ja til tilbuddet.", price: "850 kr." },
  { what: "Timepris, murersvend", price: "585 kr." },
  { what: "Omfugning af facade", note: "Uden stillads.", price: "650–950 kr. pr. m²" },
  { what: "Kalkpuds på sokkel", price: "850–1.100 kr. pr. m²" },
  { what: "Stillads til et 1½-plans hus", note: "Opstilling og tre ugers leje.", price: "9.000–14.000 kr." },
];

// Lime white #F3F1EC, wet slate #24221F, yellow brick #D9AE57, mortar grey #6B655C.
const wrap = "mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12";
const label = "text-xs font-bold uppercase tracking-[0.14em]";
const h2 = "text-[40px] font-extrabold leading-[0.95] tracking-[-0.035em] sm:text-[56px] lg:text-[64px]";
const btn = "inline-flex items-center justify-center whitespace-nowrap bg-[#24221F] font-bold text-[#F3F1EC] transition-colors hover:bg-[#45413B]";
const field = "w-full border-2 border-[#24221F] bg-[#FBFAF7] px-4 py-3 text-lg text-[#24221F] placeholder:text-[#6B655C]";

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

  return (
    <div className="min-h-dvh overflow-x-clip bg-[#F3F1EC] font-(family-name:--font-teglgaard) text-[#24221F] [&_:focus-visible]:outline-[3px] [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-[#B8862B]">
      <DemoNote className="bg-[#24221F] text-[#CFCAC1]" />

      <header className={`${wrap} flex items-center justify-between gap-6 py-4 sm:py-5`}>
        <a href="#top" className="flex items-baseline gap-3 whitespace-nowrap">
          <span className="text-[24px] font-black uppercase tracking-[-0.02em] sm:text-[28px]">Teglgaard</span>
          <span className="hidden text-sm font-medium text-[#6B655C] sm:inline">Murer i Aarhus</span>
        </a>
        <nav aria-label="Hovedmenu" className="hidden gap-8 text-[15px] font-semibold lg:flex">
          {NAV.map(([href, text]) => (
            <a key={href} href={href} className="underline-offset-[6px] hover:underline">
              {text}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-5">
          <a href={TEL} className="hidden whitespace-nowrap text-lg font-extrabold sm:inline">
            {PHONE}
          </a>
          <button
            type="button"
            aria-label={menu ? "Luk menu" : "Åbn menu"}
            aria-expanded={menu}
            aria-controls="teglgaard-menu"
            onClick={() => setMenu((m) => !m)}
            className="-mr-2 grid size-11 place-items-center lg:hidden"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 7h18M3 12h18M3 17h18" />}
            </svg>
          </button>
        </div>
      </header>
      {menu && (
        <nav id="teglgaard-menu" aria-label="Menu" className="bg-[#24221F] text-[#F3F1EC] [&_:focus-visible]:outline-[#D9AE57] lg:hidden">
          <ul className={`${wrap} py-4`}>
            {NAV.map(([href, text]) => (
              <li key={href}>
                <a href={href} onClick={() => setMenu(false)} className="block py-3 text-[28px] font-extrabold tracking-[-0.02em]">
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <main>
        {/* The words, heavy, then the wall as material */}
        <section id="top">
          <div className={`${wrap} pb-10 pt-8 sm:pb-14 sm:pt-14 lg:pt-16`}>
            <h1 className="text-[56px] font-extrabold leading-[0.9] tracking-[-0.045em] min-[400px]:text-[64px] sm:text-[104px] lg:text-[clamp(112px,11vw,168px)]">
              Murer til
              <br />
              gamle huse.
            </h1>
            <div className="mt-8 grid gap-8 sm:mt-12 lg:grid-cols-12 lg:items-end lg:gap-x-8">
              <p className="max-w-[36ch] text-lg leading-[1.5] sm:text-xl lg:col-span-5">
                Omfugning, kalkpuds, revner og skorstene i Aarhus og omegn. Vi bruger den slags mørtel, huset blev bygget med.
              </p>
              <div className="flex flex-col items-start gap-3 lg:col-span-5 lg:col-start-8">
                <a href="#kontakt" className={`${btn} h-14 px-7 text-[17px]`}>
                  Få muren set efter
                </a>
                <p className="text-[15px] text-[#6B655C]">Gennemgang 850 kr. Trækkes fra, hvis vi laver opgaven.</p>
              </div>
            </div>
          </div>

          <div className={`${wrap} grid grid-cols-[3fr_2fr] items-start gap-3 lg:grid-cols-12 lg:gap-4`}>
            <Img
              priority
              id="1759057059370-25e721c3408f"
              w={1800}
              alt="Hus i gule mursten med vedbend omkring vinduerne"
              className="col-span-2 -mx-5 aspect-[4/5] w-[calc(100%+2.5rem)] max-w-none object-cover sm:-mx-8 sm:aspect-[16/10] sm:w-[calc(100%+4rem)] lg:col-span-8 lg:row-span-2 lg:mx-0 lg:aspect-auto lg:h-full lg:w-full"
            />
            <Img id="1522171856693-d07aeb685da8" w={900} alt="Nærbillede af røde mursten og fuger" className="aspect-square w-full object-cover lg:col-span-4" />
            <Img id="1704005445445-2747074be8ac" w={900} alt="Murske og mørtel på en mur under arbejde" className="mt-12 aspect-[4/5] w-full object-cover lg:col-span-4 lg:mt-0 lg:aspect-square" />
          </div>
          <p className={`${wrap} mt-3 text-[13px] text-[#6B655C]`}>Fotos er pladsholdere fra Unsplash. På din side bruger vi billeder af jeres egne mure.</p>
        </section>

        {/* What's wrong with my wall? Pick what you see */}
        <section id="mur" className="mt-24 bg-[#24221F] text-[#F3F1EC] [&_:focus-visible]:outline-[#D9AE57] sm:mt-32">
          <div className={`${wrap} grid gap-10 py-20 sm:py-28 lg:grid-cols-12 lg:gap-x-8`}>
            <div className="lg:col-span-5">
              <h2 className={h2}>Hvad fejler muren?</h2>
              <p className="mt-5 max-w-[34ch] text-lg leading-[1.5] text-[#CFCAC1]">Vælg det, du kan se. Vi siger, hvad det plejer at være, og hvad det koster.</p>
              <div role="group" aria-label="Hvad kan du se på muren?" className="mt-10 flex flex-col border-b border-[#F3F1EC]/15">
                {PROBLEMS.map((x, i) => (
                  <button
                    key={x.label}
                    type="button"
                    aria-pressed={i === problem}
                    onClick={() => setProblem(i)}
                    className={`flex items-center justify-between gap-4 border-t border-[#F3F1EC]/15 py-4 text-left text-[26px] font-extrabold leading-tight tracking-[-0.02em] transition-colors sm:text-[32px] ${
                      i === problem ? "text-[#D9AE57]" : "text-[#F3F1EC]/60 hover:text-[#F3F1EC]"
                    }`}
                  >
                    {x.label}
                    <span aria-hidden className={`text-xl ${i === problem ? "" : "invisible"}`}>
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div aria-live="polite" className="lg:col-span-6 lg:col-start-7">
              <Img id={p.photo} w={1200} alt={p.alt} className="aspect-[4/3] w-full object-cover" />
              <dl className="mt-8 grid gap-6 sm:grid-cols-2 sm:gap-8">
                <div>
                  <dt className={`${label} text-[#B3ADA3]`}>Det er tit</dt>
                  <dd className="mt-2 text-lg leading-[1.5]">{p.cause}</dd>
                </div>
                <div>
                  <dt className={`${label} text-[#B3ADA3]`}>Det gør vi</dt>
                  <dd className="mt-2 text-lg leading-[1.5]">{p.fix}</dd>
                </div>
                <div className="border-t border-[#F3F1EC]/15 pt-5 sm:col-span-2">
                  <dt className="sr-only">Typisk pris</dt>
                  <dd className="text-[32px] font-extrabold tracking-[-0.02em] sm:text-[40px]">{p.price}</dd>
                </div>
              </dl>
              <p className="mt-4 text-[15px] leading-[1.5] text-[#B3ADA3]">Et foto er ikke en besigtigelse. Vi ser altid muren, før du får en fast pris.</p>
            </div>
          </div>
        </section>

        {/* Houses by the year they were built */}
        <section id="huse" className={`${wrap} py-20 sm:py-32`}>
          <div className="grid gap-4 lg:grid-cols-12 lg:gap-x-8">
            <h2 className={`${h2} lg:col-span-7`}>Huse, vi har arbejdet på</h2>
            <p className="max-w-[34ch] text-lg leading-[1.5] text-[#6B655C] lg:col-span-4 lg:col-start-9 lg:self-end">Ordnet efter det år, huset blev bygget. Jo ældre mur, jo blødere mørtel.</p>
          </div>
          <ol className="mt-12 border-b-2 border-[#24221F] sm:mt-16">
            {HOUSES.map((h) => (
              <li key={h.year} className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-5 border-t-2 border-[#24221F] py-6 sm:gap-x-8 sm:py-8 lg:grid-cols-12">
                <p className="text-[44px] font-extrabold leading-[0.85] tracking-[-0.045em] sm:text-[72px] lg:col-span-3 lg:text-[80px] xl:text-[104px]">{h.year}</p>
                <div className="flex flex-col gap-1.5 pt-0.5 lg:col-span-5 lg:pt-2">
                  <p className={`${label} text-[#6B655C]`}>
                    {h.place} · {h.house}
                  </p>
                  <p className="text-xl font-bold leading-snug sm:text-2xl">{h.job}</p>
                  <p className="text-[15px] text-[#6B655C]">{h.facts}</p>
                </div>
                {h.photo && <Img id={h.photo} w={800} alt={h.alt ?? ""} className="col-span-2 mt-5 aspect-[16/10] w-full object-cover sm:col-start-2 sm:col-span-1 lg:col-span-4 lg:col-start-9 lg:mt-0" />}
              </li>
            ))}
          </ol>
          <p className="mt-4 text-[13px] text-[#6B655C]">Husene er eksempler. På din side står jeres egne opgaver.</p>
        </section>

        {/* Prices and the season, on yellow brick */}
        <section id="priser" className="bg-[#D9AE57] [&_:focus-visible]:outline-[#24221F]">
          <div className={`${wrap} grid gap-12 py-20 sm:py-28 lg:grid-cols-12 lg:gap-x-8`}>
            <div className="flex flex-col gap-5 lg:col-span-5">
              <h2 className={h2}>Priser</h2>
              <p className="max-w-[36ch] text-lg leading-[1.5]">
                Facader fuger vi fra april til oktober. Mørtlen tåler ikke frost, før den er hærdet, så om vinteren laver vi det, der er indenfor.
              </p>
            </div>
            <div className="lg:col-span-7">
              <dl className="border-b-2 border-[#24221F]">
                {PRICES.map((x) => (
                  <div key={x.what} className="grid gap-x-6 gap-y-1 border-t-2 border-[#24221F] py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:py-5">
                    <dt className="text-lg font-bold sm:text-xl">{x.what}</dt>
                    <dd className="text-lg font-extrabold tracking-[-0.01em] sm:text-right sm:text-2xl">{x.price}</dd>
                    {x.note && <dd className="text-[15px] sm:col-span-2">{x.note}</dd>}
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-[13px]">Eksempelpriser inkl. moms. På din side står dine egne.</p>
            </div>
          </div>
        </section>

        {/* Contact: one line to fill in, and the facts underneath */}
        <section id="kontakt" className={`${wrap} py-20 sm:py-28`}>
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
            <h2 className={h2}>Skal vi se på muren?</h2>
            <a href={TEL} className="whitespace-nowrap text-[32px] font-extrabold tracking-[-0.03em] underline-offset-[6px] hover:underline sm:text-[44px]">
              {PHONE}
            </a>
          </div>
          <form
            className="mt-10 grid gap-4 sm:mt-14 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_auto] lg:items-end"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              e.currentTarget.reset();
            }}
          >
            <label className="flex flex-col gap-2 font-semibold">
              Hvad ser du på muren?
              <input required name="opgave" type="text" placeholder="Fx revne over vinduet" className={field} />
            </label>
            <label className="flex flex-col gap-2 font-semibold">
              Telefon
              <input required name="telefon" type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9 +]{8,}" title="Skriv et telefonnummer på mindst 8 cifre" className={field} />
            </label>
            <button type="submit" className={`${btn} h-[56px] px-8 text-[17px]`}>
              Send
            </button>
            {sent && (
              <p role="status" className="text-[15px] leading-[1.5] lg:col-span-3">
                Tak. På en rigtig side ville vi ringe dig op. Dette er et eksempel, så der er ikke sendt noget.
              </p>
            )}
          </form>
          <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-6 border-t-2 border-[#24221F] pt-6 text-[15px] sm:grid-cols-3 lg:grid-cols-5">
            <div>
              <dt className={`${label} text-[#6B655C]`}>Telefon</dt>
              <dd className="mt-1.5">Hverdage kl. 7–15.30</dd>
            </div>
            <div>
              <dt className={`${label} text-[#6B655C]`}>Værksted</dt>
              <dd className="mt-1.5">{ADDRESS}</dd>
            </div>
            <div>
              <dt className={`${label} text-[#6B655C]`}>Område</dt>
              <dd className="mt-1.5">Aarhus, Skanderborg og Odder</dd>
            </div>
            <div>
              <dt className={`${label} text-[#6B655C]`}>Garanti</dt>
              <dd className="mt-1.5">Byg Garanti (eksempel)</dd>
            </div>
            <div>
              <dt className={`${label} text-[#6B655C]`}>CVR</dt>
              <dd className="mt-1.5">00 00 00 00 (eksempel)</dd>
            </div>
          </dl>
        </section>
      </main>

      <footer className="bg-[#24221F] pb-24 text-[#CFCAC1] sm:pb-0">
        <div className={`${wrap} flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-10 text-sm`}>
          <span className="text-lg font-black uppercase tracking-[-0.01em] text-[#F3F1EC]">Teglgaard</span>
          <span>{ADDRESS}</span>
          <span>CVR 00 00 00 00 (eksempel)</span>
          <a href={TEL} className="font-bold text-[#F3F1EC] underline underline-offset-2">
            {PHONE}
          </a>
        </div>
      </footer>

      {/* Phone: call, or jump to the form */}
      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-[1fr_auto] gap-2 bg-[#24221F] px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 [&_:focus-visible]:outline-[#D9AE57] sm:hidden">
        <a href={TEL} className="grid h-[52px] place-items-center whitespace-nowrap bg-[#D9AE57] text-[17px] font-extrabold text-[#24221F]">
          Ring {PHONE}
        </a>
        <a href="#kontakt" className="grid h-[52px] place-items-center whitespace-nowrap border-2 border-[#F3F1EC]/60 px-5 font-bold text-[#F3F1EC]">
          Skriv
        </a>
      </div>
    </div>
  );
}
