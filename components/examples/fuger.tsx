"use client";

import { useEffect, useState } from "react";
import { DemoNote, Img, SampleReviewsNote, Stars } from "./shared";

/*
 * Fugefirmaet Tæt, built like a fugemand's opmålingsseddel: concrete white, anthracite and the blue
 * of the masking tape that goes on either side of every joint. Everything measured is set in mono
 * (løbende meter, prices, dates). The page answers what a customer actually asks a fugemand:
 * which sealant goes where, does my joint need redoing, and what is the price per meter.
 */

const PHONE = "89 01 23 45";
const TEL = "tel:+4589012345";
const ADDRESS = "Darumvej 12, 6700 Esbjerg";

const mono = "font-(family-name:--font-taet-mono)";

type Place = { id: string; tab: string; photo: string; alt: string; caption: string; mass: string; where: string; lasts: string; price: string; typical: string; note: string };

const PLACES: Place[] = [
  {
    id: "bad",
    tab: "Bad",
    photo: "1611066415956-91ab6f1f57cc",
    alt: "Bruser på en væg med hvide fliser",
    caption: "Bruseniche, Jerne · sep. 2026 · 22 lbm",
    mass: "Sanitær silikone med middel mod skimmel",
    where: "Hjørner i brusenichen, mod badekar og kar, langs gulvet og rundt om toilettet.",
    lasts: "5–8 år, kortere i et bad, der bruges af en hel familie",
    price: "115 kr./lbm",
    typical: "Et almindeligt bad har 18–25 lbm fuger",
    note: "Vi skærer den gamle fuge helt ud og renser med sprit. Silikone hæfter ikke på gammel silikone. Lad den nye fuge tørre et døgn, før I går i bad.",
  },
  {
    id: "koekken",
    tab: "Køkken",
    photo: "1580398562556-d33329a0f29b",
    alt: "Hvide og grå keramiske fliser på en væg",
    caption: "Stænkplade, Esbjerg V · sep. 2026 · 9 lbm",
    mass: "Transparent eller hvid silikone ved vask og bordplade. Akryl mod væggen, hvis den skal males.",
    where: "Bordplade mod væg, rundt om vasken, mellem stænkplade og overskabe.",
    lasts: "8–10 år",
    price: "105 kr./lbm",
    typical: "Et køkken har typisk 6–12 lbm",
    note: "Skal køkkenet males, så fuger vi med akryl efter maleren har spartlet og før sidste hånd maling.",
  },
  {
    id: "vinduer",
    tab: "Vinduer",
    photo: "1630699376059-b781970715b1",
    alt: "Vindue med hvid trækarm",
    caption: "Byhus fra 1912, Ribe · sep. 2026 · 74 lbm",
    mass: "Udvendigt elastisk fugemasse (MS-polymer) på bundstop. Indvendigt akryl, der kan males.",
    where: "Mellem karm og mur udvendigt, og mellem karm og væg eller lysning indvendigt.",
    lasts: "10–15 år udvendigt, alt efter hvor meget sol og vind fugen får",
    price: "165–210 kr./lbm udvendigt, 75 kr./lbm indvendigt",
    typical: "Et rækkehus har 60–90 lbm fuger rundt om vinduer og døre",
    note: "Over 1. sal arbejder vi fra lift eller stillads. Det står som en særskilt linje i tilbuddet, så du kan se, hvad den koster.",
  },
  {
    id: "beton",
    tab: "Betonelementer",
    photo: "1566787020216-3e4f973ec5ec",
    alt: "Række af etagebyggerier i beton",
    caption: "Boligforening, Kvaglund · okt. 2026 · 412 lbm",
    mass: "Elastisk fuge i polyuretan eller MS-polymer på bundstop, med primer på betonen",
    where: "Lodrette og vandrette fuger mellem facadeelementer, og ved altaner og vinduesbånd.",
    lasts: "15–20 år",
    price: "220–320 kr./lbm, lift kommer oveni",
    typical: "Mest for boligforeninger, ejerforeninger og erhverv",
    note: "Byggeri fra 1950 til 1977 kan have PCB i de gamle fuger. Vi tager en prøve og sender den til analyse, før vi skærer noget ud.",
  },
];

const SIGNS: { id: string; text: string; means: string }[] = [
  { id: "skimmel", text: "Sorte prikker, der ikke kan vaskes af", means: "Skimmel sidder inde i silikonen og går ikke væk med rengøring. Fugen skal skæres ud og laves ny." },
  { id: "slip", text: "Fugen er løs i kanten, man kan stikke en negl ind", means: "Når fugen slipper, løber der vand ind bag den. I et bad kan det give fugt i væggen, så vent ikke for længe." },
  { id: "revner", text: "Revner, eller fugen er blevet hård og sprød", means: "Fugen er udtjent og kan ikke længere følge med, når huset arbejder. Den skal skiftes." },
  { id: "traek", text: "Træk eller fugt ved vinduet indvendigt", means: "Det kan være den udvendige fuge, men også selve vinduet. Vi kigger på begge dele, når vi er ude." },
  { id: "pcb", text: "Huset er bygget mellem 1950 og 1977, og fugerne er de gamle", means: "Fuger fra de år kan indeholde PCB. Vi tager en prøve først, så du ved, hvad der skal ske med dem." },
];

const LOG: { date: string; place: string; job: string; mass: string; lbm: number }[] = [
  { date: "06.10.26", place: "Kvaglund", job: "Boligforening, blok 4, facadefuger", mass: "PU, grå", lbm: 412 },
  { date: "29.09.26", place: "Jerne", job: "Bad, bruseniche og gulv", mass: "Sanitær silikone, hvid", lbm: 22 },
  { date: "17.09.26", place: "Ribe", job: "Byhus fra 1912, vinduer udvendigt", mass: "MS-polymer, grå", lbm: 74 },
  { date: "08.09.26", place: "Esbjerg V", job: "Køkken, bordplade og stænkplade", mass: "Silikone, transparent", lbm: 9 },
  { date: "26.08.26", place: "Hjerting", job: "Sommerhus, vinduer og døre ude", mass: "MS-polymer, sort", lbm: 96 },
  { date: "12.08.26", place: "Bramming", job: "6 rækkehuse, vinduer. PCB-prøve først", mass: "MS-polymer, grå", lbm: 318 },
  { date: "31.07.26", place: "Fanø, Nordby", job: "Bad i sommerhus", mass: "Sanitær silikone, grå", lbm: 16 },
];

const TERMS: { what: string; note?: string; price: string }[] = [
  { what: "Opmåling på stedet", note: "trækkes fra, hvis du siger ja", price: "500 kr." },
  { what: "Pris ud fra billeder", note: "bad og køkken", price: "0 kr." },
  { what: "Mindstepris pr. besøg", price: "1.650 kr." },
  { what: "Timepris", note: "til det, der ikke kan måles i meter", price: "595 kr." },
  { what: "PCB-prøve", note: "inkl. analyse på laboratorium", price: "1.150 kr." },
  { what: "Lift, hel dag", note: "til facader over 1. sal", price: "2.400–3.200 kr." },
  { what: "Fanø", note: "tillæg for færgen", price: "250 kr." },
];

const REVIEWS: { stars: number; date: string; text: string; name: string; reply?: string }[] = [
  { stars: 5, date: "2. okt. 2026", text: "Sendte fire billeder af badet om søndagen og havde en pris mandag morgen. Lars kom torsdagen efter og var færdig til frokost.", name: "Mette, Jerne" },
  {
    stars: 4,
    date: "19. sep. 2026",
    text: "Pæne fuger rundt om alle vinduerne. Liften stod dog i vores indkørsel to dage længere end aftalt, og vi måtte parkere på vejen.",
    name: "Henrik, Ribe",
    reply: "Det er rigtigt, Henrik. Udlejeren kunne først hente den om tirsdagen, og det skulle vi have sagt med det samme. Vi trak en dags leje fra regningen.",
  },
  { stars: 5, date: "28. aug. 2026", text: "De tog en PCB-prøve, før de gik i gang. Det havde den forrige fugemand aldrig nævnt.", name: "Afdelingsbestyrelsen, Bramming" },
  { stars: 5, date: "14. jul. 2026", text: "Lille opgave i køkkenet, men de tog den alligevel og sagde præcis, hvad det kostede i telefonen.", name: "Birgit, Esbjerg V" },
];

const NAV = [
  ["#fuger", "Hvilken fuge"],
  ["#tjek", "Skal den skiftes"],
  ["#log", "Opgaver"],
  ["#priser", "Priser"],
  ["#kontakt", "Kontakt"],
] as const;

const wrap = "mx-auto max-w-[1200px] px-4 sm:px-8";
const h2 = "text-[30px] font-extrabold leading-[1.08] tracking-[-0.02em] sm:text-[42px]";
const btn = "items-center justify-center whitespace-nowrap rounded-[2px] bg-[#1F57A0] font-bold text-white transition-colors hover:bg-[#17467F]";
const field = "w-full rounded-[2px] border border-[#9AA3A6] bg-white px-3.5 py-3 text-base font-normal text-[#1C2023] placeholder:text-[#7D868A]";
const muted = "text-[#555D62]";

/** Two strips of blue tape with the joint between them. Marks the start of each section. */
function Tape({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 10" className={`h-2.5 w-10 ${className}`} aria-hidden>
      <rect width="17" height="10" fill="#2F6EBA" />
      <rect x="17" y="3" width="6" height="4" fill="#9AA1A4" />
      <rect x="23" width="17" height="10" fill="#2F6EBA" />
    </svg>
  );
}

export function FugerSite() {
  const [menu, setMenu] = useState(false);
  const [place, setPlace] = useState(PLACES[0].id);
  const [checked, setChecked] = useState<string[]>([]);
  const [files, setFiles] = useState<string[]>([]);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const p = PLACES.find((x) => x.id === place)!;
  const hits = SIGNS.filter((s) => checked.includes(s.id));
  const redo = hits.some((s) => s.id !== "pcb");

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = PLACES[(i + d + PLACES.length) % PLACES.length];
    setPlace(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  };

  return (
    <div className="min-h-dvh overflow-x-clip bg-[#EFF1F0] font-(family-name:--font-taet) text-[#1C2023] [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-[#1F57A0]">
      <DemoNote className={`bg-[#1C2023] text-[#D5DBDA] ${mono}`} />

      <header className="relative z-40 border-b-4 border-[#2F6EBA] bg-white">
        <div className={`${wrap} flex items-center justify-between gap-4 py-3 lg:py-4`}>
          <a href="#top" className="flex min-w-0 flex-col leading-tight">
            <span className="whitespace-nowrap text-[19px] font-extrabold tracking-[-0.01em] sm:text-[22px]">Fugefirmaet Tæt</span>
            <span className={`whitespace-nowrap text-[11px] sm:text-xs ${muted} ${mono}`}>Esbjerg · fuger siden 2011</span>
          </a>
          <nav aria-label="Hovedmenu" className="hidden gap-6 whitespace-nowrap text-[15px] font-medium xl:flex">
            {NAV.map(([href, label]) => (
              <a key={href} href={href} className="hover:text-[#1F57A0]">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-4">
            <a href={TEL} className={`hidden whitespace-nowrap text-[17px] font-medium sm:inline ${mono}`}>
              {PHONE}
            </a>
            <a href="#kontakt" className={`${btn} hidden px-5 py-3 md:inline-flex`}>
              Send billeder
            </a>
            <button
              type="button"
              aria-label={menu ? "Luk menu" : "Åbn menu"}
              aria-expanded={menu}
              aria-controls="taet-menu"
              onClick={() => setMenu((m) => !m)}
              className="grid size-11 place-items-center rounded-[2px] border border-[#9AA3A6] xl:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden>
                {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
        {menu && (
          <nav id="taet-menu" aria-label="Menu" className="border-t border-[#CDD3D2] xl:hidden">
            <ul className={`${wrap} py-2`}>
              {NAV.map(([href, label]) => (
                <li key={href}>
                  <a href={href} onClick={() => setMenu(false)} className="block border-b border-[#CDD3D2] py-3.5 text-lg font-bold">
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <a href={TEL} className={`block py-3.5 text-lg ${mono}`}>
                  Ring {PHONE}
                </a>
              </li>
            </ul>
          </nav>
        )}
      </header>

      <main>
        {/* Hero: the photo on the left, the text and a small measuring slip on the right */}
        <section id="top" className={`${wrap} grid gap-6 pb-12 sm:gap-10 sm:pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14 lg:pb-20 lg:pt-14`}>
          <figure className="-mx-4 flex flex-col gap-2 sm:mx-0">
            <Img
              priority
              id="1786204697642-328c597b6f05"
              w={1400}
              alt="Håndværker lægger en ny fuge langs en vindueskarm i et køkken"
              className="aspect-[4/3] w-full object-cover lg:aspect-[4/5]"
            />
            <figcaption className={`px-4 text-[12px] sm:px-0 sm:text-[13px] ${muted} ${mono}`}>Karm mod væg, Jerne · sep. 2026 · 7 lbm akryl</figcaption>
          </figure>
          <div className="flex flex-col gap-6 lg:pt-6">
            <h1 className="text-[40px] font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-[56px] lg:text-[58px]">Fuger i bad, vinduer og facader. Prisen er pr. løbende meter.</h1>
            <p className="max-w-[44ch] text-[17px] leading-[1.6] sm:text-lg">
              Vi skærer de gamle fuger ud, renser og lægger nye med den fugemasse, der passer til stedet. Det er Lars eller Mikkel, der kommer, i Esbjerg og op til en times kørsel herfra.
            </p>
            <dl className={`border-y border-[#1C2023] text-[15px] ${mono}`}>
              {[
                ["Bad, silikone", "115 kr./lbm"],
                ["Vinduer udvendigt", "fra 165 kr./lbm"],
                ["Opmåling", "500 kr., trækkes fra"],
                ["Ventetid nu", "bad 1 uge, facader 4 uger"],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-wrap justify-between gap-x-4 border-b border-dashed border-[#B9C1C3] py-2.5 last:border-b-0">
                  <dt className={muted}>{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="hidden flex-wrap items-center gap-x-6 gap-y-3 sm:flex">
              <a href="#kontakt" className={`${btn} inline-flex px-7 py-4 text-[17px]`}>
                Send billeder af fugerne
              </a>
              <p className={muted}>
                eller ring{" "}
                <a href={TEL} className={`whitespace-nowrap font-medium text-[#1C2023] underline underline-offset-4 ${mono}`}>
                  {PHONE}
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Which joint where: tabs */}
        <section id="fuger" className="scroll-mt-4 border-t border-[#CDD3D2] bg-white">
          <div className={`${wrap} py-14 sm:py-20`}>
            <Tape />
            <h2 className={`${h2} mt-4`}>Hvilken fuge skal hvor?</h2>
            <p className="mt-3 max-w-[56ch] leading-[1.6] sm:text-[17px]">Det er ikke den samme fugemasse i brusenichen som rundt om et vindue. Her er, hvad vi bruger, og hvad det koster.</p>

            <div role="tablist" aria-label="Sted" className="-mx-4 mt-8 flex overflow-x-auto border-b border-[#CDD3D2] px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
              {PLACES.map((x, i) => (
                <button
                  key={x.id}
                  id={`tab-${x.id}`}
                  role="tab"
                  type="button"
                  aria-selected={place === x.id}
                  aria-controls="fuge-panel"
                  tabIndex={place === x.id ? 0 : -1}
                  onClick={() => setPlace(x.id)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={`shrink-0 whitespace-nowrap border-b-4 px-3 py-3 text-[17px] font-bold transition-colors sm:px-5 ${
                    place === x.id ? "border-[#2F6EBA] text-[#1C2023]" : `border-transparent ${muted} hover:text-[#1C2023]`
                  }`}
                >
                  {x.tab}
                </button>
              ))}
            </div>

            <div id="fuge-panel" role="tabpanel" aria-labelledby={`tab-${p.id}`} className="grid gap-8 pt-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-14">
              <dl className="flex flex-col">
                {[
                  ["Fugemasse", p.mass],
                  ["Hvor", p.where],
                  ["Holder ca.", p.lasts],
                  ["Pris", p.price],
                  ["Omfang", p.typical],
                ].map(([k, v]) => (
                  <div key={k} className="grid gap-x-8 gap-y-0.5 border-t border-[#CDD3D2] py-3 sm:grid-cols-[150px_minmax(0,1fr)]">
                    <dt className={`text-sm sm:pt-0.5 ${muted}`}>{k}</dt>
                    <dd className={`leading-[1.55] ${k === "Pris" ? `${mono} text-[17px] font-medium` : ""}`}>{v}</dd>
                  </div>
                ))}
                <p className="mt-3 border-l-4 border-[#2F6EBA] pl-4 leading-[1.6]">{p.note}</p>
              </dl>
              <figure className="flex flex-col gap-2">
                <Img id={p.photo} w={1000} alt={p.alt} className="aspect-[4/3] w-full object-cover" />
                <figcaption className={`text-[12px] sm:text-[13px] ${muted} ${mono}`}>{p.caption}</figcaption>
              </figure>
            </div>
            <p className={`mt-8 text-[12px] sm:text-[13px] ${muted} ${mono}`}>Vejledende priser inkl. moms, oktober 2026. Fotos fra Unsplash som pladsholdere. På din side bruger vi billeder fra dine egne opgaver.</p>
          </div>
        </section>

        {/* Self check */}
        <section id="tjek" className="scroll-mt-4 bg-[#22282C] text-[#E4E8E7] [&_:focus-visible]:outline-[#E4E8E7]">
          <div className={`${wrap} grid gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16`}>
            <div>
              <Tape />
              <h2 className={`${h2} mt-4`}>Skal fugen skiftes?</h2>
              <p className="mt-3 max-w-[48ch] leading-[1.6] text-[#B9C2C4]">Gå hen til fugen og sæt kryds ved det, du kan se. Tryk gerne på den med en finger.</p>
              <fieldset className="mt-7 border-t border-[#454D52]">
                <legend className="sr-only">Det kan jeg se</legend>
                {SIGNS.map((s) => (
                  <label key={s.id} className="flex cursor-pointer items-start gap-4 border-b border-[#454D52] py-4">
                    <input
                      type="checkbox"
                      checked={checked.includes(s.id)}
                      onChange={(e) => setChecked((c) => (e.target.checked ? [...c, s.id] : c.filter((x) => x !== s.id)))}
                      className="mt-1 size-5 shrink-0 accent-[#5B93D6]"
                    />
                    <b className="text-[17px] font-normal leading-snug">{s.text}</b>
                  </label>
                ))}
              </fieldset>
            </div>
            <div className="lg:pt-[118px]" aria-live="polite">
              {hits.length === 0 ? (
                <p className="text-[22px] font-medium leading-[1.45]">
                  Ser fugen fin ud, kan den sikkert holde lidt endnu. Vask den med en blød børste og eddikevand, og tør hjørnerne af efter badet.
                </p>
              ) : (
                <div className="flex flex-col gap-5">
                  <p className="text-[26px] font-extrabold leading-tight">{redo ? "Den skal nok skiftes." : "Det skal vi tjekke først."}</p>
                  <ul className="flex flex-col gap-4">
                    {hits.map((s) => (
                      <li key={s.id} className="border-l-4 border-[#5B93D6] pl-4 leading-[1.6]">
                        {s.means}
                      </li>
                    ))}
                  </ul>
                  <a href="#kontakt" className={`${btn} inline-flex self-start px-6 py-4 text-[17px]`}>
                    Send billeder, så får du en pris
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Job log by running meter */}
        <section id="log" className={`${wrap} scroll-mt-4 py-14 sm:py-20`}>
          <Tape />
          <div className="mt-4 flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
            <h2 className={h2}>Fuget de seneste uger</h2>
            <p className={`max-w-[46ch] leading-[1.6] ${muted}`}>Fra vores egen opgaveliste. Løbende meter er det, der stod på fakturaen.</p>
          </div>
          <table className="mt-8 w-full border-collapse text-left">
            <thead className={`hidden text-[13px] md:table-header-group ${muted} ${mono}`}>
              <tr className="border-b border-[#1C2023]">
                <th scope="col" className="py-2.5 pr-4 font-normal">Dato</th>
                <th scope="col" className="py-2.5 pr-4 font-normal">Sted</th>
                <th scope="col" className="py-2.5 pr-4 font-normal">Opgave</th>
                <th scope="col" className="py-2.5 pr-4 font-normal">Fugemasse</th>
                <th scope="col" className="py-2.5 text-right font-normal">Løbende meter</th>
              </tr>
            </thead>
            <tbody className="border-t border-[#1C2023] md:border-t-0">
              {LOG.map((r) => (
                <tr key={r.date + r.place} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 border-b border-[#CDD3D2] py-3.5 md:table-row md:py-0">
                  <td className={`text-[13px] md:py-3.5 md:pr-4 md:text-[15px] ${muted} ${mono}`}>
                    {r.date}
                    <span className="md:hidden"> · {r.place}</span>
                  </td>
                  <td className={`row-span-3 self-center text-right text-[22px] font-medium md:hidden ${mono}`}>{r.lbm}</td>
                  <td className="hidden py-3.5 pr-4 md:table-cell">{r.place}</td>
                  <td className="font-bold md:py-3.5 md:pr-4 md:font-medium">{r.job}</td>
                  <td className={`text-sm md:py-3.5 md:pr-4 md:text-[15px] ${muted}`}>{r.mass}</td>
                  <td className={`hidden py-3.5 text-right text-[17px] font-medium md:table-cell ${mono}`}>{r.lbm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Terms and fixed prices */}
        <section id="priser" className="scroll-mt-4 border-t border-[#CDD3D2] bg-white">
          <div className={`${wrap} grid gap-8 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-16`}>
            <div className="flex flex-col gap-4">
              <Tape />
              <h2 className={h2}>Det, der ikke er meter</h2>
              <p className="max-w-[44ch] leading-[1.6]">
                Meterprisen for hver slags fuge står ovenfor. Her er resten. For bad og køkken kan vi som regel give en fast pris ud fra billeder, så slipper du for opmålingen.
              </p>
              <p className={`max-w-[44ch] text-sm leading-[1.6] ${muted}`}>
                Fuger alene giver normalt ikke håndværkerfradrag. Er de en del af nye vinduer, kan det være anderledes. Se reglerne på skat.dk.
              </p>
            </div>
            <table className="w-full border-collapse">
              <caption className={`pb-3 text-left text-[13px] ${muted} ${mono}`}>Vejledende priser inkl. moms, oktober 2026</caption>
              <tbody>
                {TERMS.map((t) => (
                  <tr key={t.what} className="border-y border-[#CDD3D2]">
                    <th scope="row" className="py-3.5 pr-4 text-left align-top font-bold">
                      {t.what}
                      {t.note && <span className={`block text-sm font-normal ${muted}`}>{t.note}</span>}
                    </th>
                    <td className={`whitespace-nowrap py-3.5 text-right align-top ${mono}`}>{t.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Who comes */}
        <section className={`${wrap} grid gap-8 py-14 sm:py-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16`}>
          <figure className="flex flex-col gap-2">
            <Img id="1560755341-c5417203d21c" w={900} alt="Fugepistol i sort og gul" className="aspect-[3/2] w-full object-cover" />
            <figcaption className={`text-[12px] sm:text-[13px] ${muted} ${mono}`}>Pladsholderfoto · her kommer et billede af Lars og Mikkel på en opgave</figcaption>
          </figure>
          <div className="flex flex-col gap-5">
            <h2 className={h2}>Lars Rask og Mikkel Juhl</h2>
            <p className="text-[17px] leading-[1.65]">
              Jeg har fuget i 19 år. De første ti var hos en entreprenør, hvor vi mest lavede elementfuger på nybyggeri. I 2011 startede jeg for mig selv, og Mikkel har været med siden 2016.
            </p>
            <p className="text-[17px] leading-[1.65]">
              I dag laver vi lige så mange badeværelser som facader. Vi tager også de små opgaver, men så ligger de typisk på en fredag.
            </p>
            <dl className="mt-1 grid grid-cols-[max-content_minmax(0,1fr)] gap-x-6 gap-y-2.5 border-t border-[#1C2023] pt-5 text-[15px]">
              <dt className={muted}>Adresse</dt>
              <dd>{ADDRESS}</dd>
              <dt className={muted}>Telefon</dt>
              <dd>
                <a href={TEL} className={`underline underline-offset-2 ${mono}`}>
                  {PHONE}
                </a>
                , man–tor 7–16, fre 7–14
              </dd>
              <dt className={muted}>Kører til</dt>
              <dd>Esbjerg, Varde, Ribe, Bramming og Fanø</dd>
              <dt className={muted}>CVR</dt>
              <dd className={mono}>00 00 00 00 (eksempel)</dd>
              <dt className={muted}>Medlem af</dt>
              <dd>Byg Garanti (eksempel)</dd>
            </dl>
          </div>
        </section>

        {/* Reviews */}
        <section className="border-t border-[#CDD3D2] bg-white">
          <div className={`${wrap} py-14 sm:py-20`}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
              <h2 className={h2}>Det skriver kunderne</h2>
              <SampleReviewsNote className={`text-[13px]! ${muted} ${mono}`} />
            </div>
            <div className="mt-8 grid gap-x-12 md:grid-cols-2">
              {REVIEWS.map((r) => (
                <figure key={r.name} className="flex flex-col gap-2.5 border-t border-[#CDD3D2] py-6">
                  <p className={`flex flex-wrap items-center gap-x-3 text-[13px] ${muted} ${mono}`}>
                    <Stars n={r.stars} className="text-[#1F57A0]" />
                    <span>{r.date}</span>
                  </p>
                  <blockquote className="text-[17px] leading-[1.6]">{r.text}</blockquote>
                  <figcaption className={`text-[15px] ${muted}`}>{r.name}</figcaption>
                  {r.reply && (
                    <p className="mt-1 border-l-4 border-[#2F6EBA] pl-4 text-[15px] leading-[1.55]">
                      <b className="font-bold">Svar fra Lars:</b> {r.reply}
                    </p>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="kontakt" className="scroll-mt-4 border-t-4 border-[#2F6EBA]">
          <div className={`${wrap} grid gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16`}>
            <div className="flex max-w-[440px] flex-col gap-4">
              <h2 className={h2}>Send billeder af fugerne</h2>
              <p className="text-[17px] leading-[1.6]">
                Tag et billede på afstand og et helt tæt på, og skriv cirka hvor mange meter, hvis du ved det. Så vender Lars tilbage med en pris inden for to hverdage.
              </p>
              <p className="leading-[1.6]">Ring, hvis det drypper. Skriv, hvis det kan vente en uge.</p>
              <p className={`text-[32px] font-medium ${mono}`}>
                <a href={TEL} className="whitespace-nowrap hover:text-[#1F57A0]">
                  {PHONE}
                </a>
              </p>
              <p className={`text-[13px] ${muted} ${mono}`}>Man–tor 7–16, fre 7–14 · {ADDRESS}</p>
            </div>
            <form
              className="grid gap-4 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
                setFiles([]);
                e.currentTarget.reset();
              }}
            >
              {sent && (
                <p role="status" className="border-l-4 border-[#2F6EBA] bg-white p-4 leading-[1.55] sm:col-span-2">
                  Tak. På en rigtig side ville Lars se på billederne og sende en pris inden for to hverdage. Dette er et eksempel, så der er ikke sendt noget.
                </p>
              )}
              <label className="flex flex-col gap-1.5 font-bold">
                Navn
                <input required name="navn" autoComplete="name" className={field} />
              </label>
              <label className="flex flex-col gap-1.5 font-bold">
                Telefon
                <input required name="telefon" type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9 +]{8,}" title="Skriv et telefonnummer på mindst 8 cifre" className={field} />
              </label>
              <label className="flex flex-col gap-1.5 font-bold">
                Hvor er fugerne?
                <select name="sted" defaultValue={p.tab} key={p.id} className={field}>
                  {PLACES.map((x) => (
                    <option key={x.id}>{x.tab}</option>
                  ))}
                  <option>Andet</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5 font-bold">
                Ca. løbende meter
                <input name="meter" inputMode="numeric" placeholder="Ved ikke" className={field} />
              </label>
              <label className="flex flex-col gap-1.5 font-bold sm:col-span-2">
                Adresse
                <input required name="adresse" autoComplete="street-address" className={field} />
              </label>
              <label className="flex cursor-pointer flex-col gap-1.5 font-bold sm:col-span-2">
                Billeder
                <b className={`${field} block border-dashed font-normal ${files.length ? "" : muted}`}>{files.length ? files.join(", ") : "Vælg billeder fra din telefon"}</b>
                <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((f) => f.name))} />
              </label>
              <label className="flex flex-col gap-1.5 font-bold sm:col-span-2">
                Andet, vi skal vide
                <textarea name="besked" rows={3} placeholder="Fx bruseniche i et bad fra 2009, sort i hjørnerne" className={`${field} resize-y`} />
              </label>
              <div className="sm:col-span-2">
                <button type="submit" className={`${btn} inline-flex px-7 py-4 text-[17px]`}>
                  Send
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-[#1C2023] pb-28 text-[#C3CBCD] sm:pb-0">
        <div className={`${wrap} flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 py-10 text-sm`}>
          <span className="text-base font-extrabold text-white">Fugefirmaet Tæt</span>
          <span>{ADDRESS}</span>
          <span className={mono}>CVR 00 00 00 00 (eksempel)</span>
          <a href={TEL} className={`text-white underline underline-offset-2 ${mono}`}>
            {PHONE}
          </a>
        </div>
      </footer>

      {/* Phone: call or send photos, within thumb's reach */}
      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2.5 border-t border-[#CDD3D2] bg-white px-4 pb-4 pt-3 sm:hidden">
        <a href={TEL} className="grid h-[52px] place-items-center whitespace-nowrap rounded-[2px] border-2 border-[#1C2023] font-bold">
          Ring til Lars
        </a>
        <a href="#kontakt" className={`${btn} flex h-[52px]`}>
          <span className="min-[360px]:hidden">Billeder</span>
          <span className="hidden min-[360px]:inline">Send billeder</span>
        </a>
      </div>
    </div>
  );
}
