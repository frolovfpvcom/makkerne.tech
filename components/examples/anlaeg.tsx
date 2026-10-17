"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { DemoNote, Img, SampleReviewsNote, Stars } from "./shared";

/*
 * Lindholm Anlæg, built like a garden plan in an old handbook: granite-dust paper, muld brown and one
 * hedge green, a calligraphic serif for headings and italic captions. Two things carry it: a cross
 * section of what lies under the stones (with the price per m² beside it), and a year plan that says
 * what can be done in which month. No cards, no shadows, no motion.
 */

const PHONE = "90 12 34 56";
const TEL = "tel:+4590123456";
const ADDRESS = "Grusgravvej 6, 7100 Vejle";

const serif = "font-(family-name:--font-lindholm)";
const cap = `${serif} italic`;

/* ---------- What lies under the stones ---------- */

type Layer = { name: string; cm: number; note: string; kind: "flise" | "sten" | "granit" | "afret" | "saette" | "stabil" };
type Build = { key: string; label: string; title: string; layers: Layer[]; price: string; note: string };

const BUILDS: Build[] = [
  {
    key: "indkorsel",
    label: "Indkørsel",
    title: "Indkørsel i betonsten",
    layers: [
      { name: "Betonsten, 8 cm", cm: 8, note: "Tåler en personbil og en varevogn hver dag.", kind: "sten" },
      { name: "Afretningsgrus 2–5 mm", cm: 3, note: "Trækkes af med en lægte, så stenene ligger i plan.", kind: "afret" },
      { name: "Stabilgrus", cm: 25, note: "Komprimeres i tre lag med pladevibrator.", kind: "stabil" },
    ],
    price: "1.150–1.550 kr./m²",
    note: "Fald væk fra huset på 2 cm pr. meter, og kantsten i beton hele vejen rundt.",
  },
  {
    key: "terrasse",
    label: "Terrasse",
    title: "Terrasse i betonfliser",
    layers: [
      { name: "Betonfliser, 5 cm", cm: 5, note: "Fx 40 × 40 cm eller 30 × 60 cm.", kind: "flise" },
      { name: "Afretningsgrus 2–5 mm", cm: 3, note: "Trækkes af med en lægte.", kind: "afret" },
      { name: "Stabilgrus", cm: 15, note: "Komprimeres i to lag. Der skal kun gås på den.", kind: "stabil" },
    ],
    price: "950–1.300 kr./m²",
    note: "Fald væk fra huset på 2 cm pr. meter, så vandet ikke løber ind under døren.",
  },
  {
    key: "granit",
    label: "Granit",
    title: "Gårdsplads i chaussésten",
    layers: [
      { name: "Granit chaussésten 9/11", cm: 10, note: "Lagt i buer eller i rækker. Hver sten sættes for hånd.", kind: "granit" },
      { name: "Sættegrus 0–8 mm", cm: 4, note: "Stenene bankes ned, og fugerne fyldes med grus.", kind: "saette" },
      { name: "Stabilgrus", cm: 25, note: "Komprimeres i tre lag.", kind: "stabil" },
    ],
    price: "1.900–2.600 kr./m²",
    note: "Holder i mange år og kan tages op og lægges igen, hvis der skal graves.",
  },
];

const SWATCH: Record<Layer["kind"], string> = {
  flise: "#A3A199",
  sten: "#8F8D86",
  granit: "#7D7B78",
  afret: "#D8CBAE",
  saette: "#C9BDA3",
  stabil: "#B5A88F",
};

const PX = 6; // px per cm in the drawing

function Section({ build }: { build: Build }) {
  const total = build.layers.reduce((s, l) => s + l.cm, 0);
  const W = 168;
  const ground = 36;
  const tops = build.layers.map((_, i) => build.layers.slice(0, i).reduce((s, l) => s + l.cm * PX, 0));
  return (
    <svg width={W + 46} height={total * PX + ground} viewBox={`0 0 ${W + 46} ${total * PX + ground}`} role="img" aria-label={`Snit gennem ${build.title.toLowerCase()}: ${total} cm i alt`} className="shrink-0">
      <defs>
        <pattern id="lh-dots" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="0.9" fill="#6B5F4B" />
          <circle cx="4.5" cy="4.5" r="0.7" fill="#6B5F4B" />
        </pattern>
        <pattern id="lh-fine" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.5" fill="#7A6D55" />
          <circle cx="3" cy="3" r="0.5" fill="#7A6D55" />
        </pattern>
        <pattern id="lh-earth" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#3E3024" strokeWidth="1.4" />
        </pattern>
      </defs>
      {build.layers.map((l, li) => {
        const top = tops[li];
        const h = l.cm * PX;
        const joint = l.kind === "granit" ? 15 : l.kind === "flise" ? 44 : 22;
        return (
          <g key={l.name}>
            <rect x="0" y={top} width={W} height={h} fill={SWATCH[l.kind]} />
            {(l.kind === "afret" || l.kind === "saette") && <rect x="0" y={top} width={W} height={h} fill="url(#lh-fine)" />}
            {l.kind === "stabil" && <rect x="0" y={top} width={W} height={h} fill="url(#lh-dots)" />}
            {(l.kind === "sten" || l.kind === "flise" || l.kind === "granit") &&
              Array.from({ length: Math.floor(W / joint) }, (_, i) => (
                <line key={i} x1={(i + 1) * joint - (l.kind === "granit" && i % 2 ? 4 : 0)} y1={top} x2={(i + 1) * joint - (l.kind === "granit" && i % 2 ? 4 : 0)} y2={top + h} stroke="#F2F3EE" strokeWidth="1.5" />
              ))}
            <line x1="0" y1={top + h} x2={W} y2={top + h} stroke="#24211C" strokeWidth="0.75" />
          </g>
        );
      })}
      <rect x="0" y={total * PX} width={W} height={ground} fill="#6E5640" />
      <rect x="0" y={total * PX} width={W} height={ground} fill="url(#lh-earth)" opacity="0.45" />
      <line x1="0" y1="0.5" x2={W} y2="0.5" stroke="#24211C" strokeWidth="1" />
      {/* Dimension line for the total depth */}
      <g stroke="#24211C" strokeWidth="1">
        <line x1={W + 14} y1="0" x2={W + 14} y2={total * PX} />
        <line x1={W + 8} y1="0.5" x2={W + 20} y2="0.5" />
        <line x1={W + 8} y1={total * PX - 0.5} x2={W + 20} y2={total * PX - 0.5} />
      </g>
      <text x={W + 24} y={(total * PX) / 2 + 5} fontSize="15" fill="#24211C" className={serif}>
        {total}
      </text>
      <text x={W + 24} y={(total * PX) / 2 + 20} fontSize="12" fill="#5F615A">
        cm
      </text>
    </svg>
  );
}

/* ---------- Gardens ---------- */

const GARDENS: { photo: string; alt: string; title: string; place: string; when: string; facts: string }[] = [
  {
    photo: "1713383659120-5d8013d3348a",
    alt: "Sti af tegl gennem en frodig have med høje stauder",
    title: "Teglsti og nye bede",
    place: "Jelling",
    when: "juni 2026",
    facts: "26 m² sti i teglklinker på afretningsgrus, 40 m² bede · 6 dage",
  },
  {
    photo: "1760552268175-431696421106",
    alt: "Træterrasse omgivet af store, grønne træer",
    title: "Træterrasse mellem gamle bøge",
    place: "Skibet",
    when: "august 2025",
    facts: "32 m² sibirisk lærk på punktfundament · 5 dage",
  },
  {
    photo: "1734079692079-aae7e24a7035",
    alt: "Hænder med jord trykker et stykke rullegræs på plads",
    title: "Ny plæne med rullegræs",
    place: "Børkop",
    when: "maj 2026",
    facts: "210 m² rullegræs på 10 cm ny muld · 2 dage",
  },
  {
    photo: "1776757845288-3e71e234e3d3",
    alt: "Have med grussti mellem blomstrende bede",
    title: "Grussti og regnvandsbed",
    place: "Vejle Ø",
    when: "september 2025",
    facts: "18 m² regnvandsbed med vand fra garagetaget · 4 dage",
  },
  {
    photo: "1761489356802-afe917fe7ad2",
    alt: "Træbænk i en have med klippede hække",
    title: "Bøgehæk og plads til en bænk",
    place: "Egtved",
    when: "november 2024",
    facts: "46 m bøgehæk, barrodsplanter 80–100 cm · 2 dage",
  },
];

/* ---------- The year ---------- */

const MONTHS = ["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december"];

// 2 = god tid, 1 = kan godt lade sig gøre, 0 = det venter vi med
const YEAR: { task: string; now: string; m: number[] }[] = [
  { task: "Belægning og indkørsler", now: "belægning", m: [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1] },
  { task: "Træterrasser", now: "træterrasser", m: [0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0] },
  { task: "Plante hæk (barrod)", now: "hækplantning", m: [1, 1, 2, 2, 0, 0, 0, 0, 0, 1, 2, 1] },
  { task: "Rullegræs", now: "rullegræs", m: [0, 0, 1, 2, 2, 2, 1, 2, 2, 1, 0, 0] },
  { task: "Klippe hæk", now: "hækklipning", m: [0, 0, 0, 0, 0, 2, 1, 2, 2, 0, 0, 0] },
  { task: "Regnvandsbed og stauder", now: "regnvandsbede", m: [0, 0, 1, 2, 2, 1, 1, 1, 2, 2, 1, 0] },
  { task: "Beskære træer og buske", now: "beskæring", m: [1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 1] },
];

const subscribeNever = () => () => {};
/** The current month, read on the client only, so the server render never guesses. */
function useMonth() {
  return useSyncExternalStore(
    subscribeNever,
    () => new Date().getMonth(),
    () => -1,
  );
}

function Cell({ v }: { v: number }) {
  if (v === 2) return <span className="block h-4 bg-[#2F4A2B] sm:h-5" />;
  if (v === 1) return <span className="block h-4 border border-[#2F4A2B] bg-[repeating-linear-gradient(135deg,#2F4A2B_0_1.5px,transparent_1.5px_5px)] sm:h-5" />;
  return <span className="block h-4 sm:h-5" />;
}

/* ---------- Prices, reviews ---------- */

const PRICES: { what: string; note?: string; price: string }[] = [
  { what: "Opmåling og tilbud", note: "trækkes fra, hvis du siger ja", price: "500 kr." },
  { what: "Timepris, anlægsgartner", price: "545 kr." },
  { what: "Terrasse i betonfliser", note: "inkl. udgravning og bortkørsel af jord", price: "950–1.300 kr./m²" },
  { what: "Indkørsel i betonsten", note: "inkl. udgravning, kantsten og bortkørsel", price: "1.150–1.550 kr./m²" },
  { what: "Granit chaussésten", note: "gårdsplads eller sti", price: "1.900–2.600 kr./m²" },
  { what: "Træterrasse i lærk", note: "på punktfundament", price: "1.800–2.400 kr./m²" },
  { what: "Bøgehæk, barrodsplanter", note: "5 planter pr. meter, i ny muld", price: "325–425 kr./m" },
  { what: "Rullegræs", note: "inkl. 10 cm muld og planering", price: "210–290 kr./m²" },
];

const PLEJE: { size: string; price: string }[] = [
  { size: "Rækkehushave, under 200 m²", price: "650 kr." },
  { size: "200–500 m²", price: "1.150 kr." },
  { size: "500–900 m²", price: "1.650 kr." },
  { size: "Over 900 m²", price: "Efter et besøg" },
];

const REVIEWS: { stars: number; date: string; text: string; name: string; reply?: string }[] = [
  {
    stars: 5,
    date: "3. okt. 2026",
    text: "Indkørslen blev lagt i april og har ikke rykket sig, selvom der kører en varevogn ind hver dag. Niels forklarede det med gruset meget grundigt. Måske lidt for grundigt.",
    name: "Henrik, Bredballe",
  },
  {
    stars: 4,
    date: "11. sep. 2026",
    text: "Flot terrasse og pænt arbejde. Men der lå jord på fortovet i to dage, efter de var færdige, og vi måtte selv ringe.",
    name: "Karina, Vejle Ø",
    reply: "Det var for dårligt, Karina. Fejemaskinen stod på et andet job, og det skulle vi have sagt. Nu fejer vi, før vi kører hjem.",
  },
  { stars: 5, date: "19. aug. 2026", text: "Vi har haft plejeaftale i to år. Sofie sender en sms dagen før, hun kommer, og hækken er blevet tæt hele vejen ned.", name: "Ole, Jelling" },
  { stars: 5, date: "2. jun. 2026", text: "Rullegræs på 200 m². Det var dyrere end at så, men vi kunne bruge plænen efter tre uger.", name: "Mette, Børkop" },
];

const NAV = [
  ["#belaegning", "Belægning"],
  ["#priser", "Priser"],
  ["#aaret", "Årets gang"],
  ["#pleje", "Havepleje"],
  ["#kontakt", "Kontakt"],
] as const;

const wrap = "mx-auto max-w-[1180px] px-4 sm:px-8";
const h2 = `${serif} text-[32px] font-medium leading-[1.08] tracking-[-0.01em] sm:text-[44px]`;
const btn = "items-center justify-center whitespace-nowrap rounded-[2px] bg-[#2F4A2B] font-bold text-white transition-colors hover:bg-[#223820]";
const field = "w-full rounded-[2px] border border-[#9C9E95] bg-white px-3.5 py-3 text-base text-[#24211C] placeholder:text-[#7A7C74]";
const lbl = "flex flex-col gap-1.5 text-base font-medium";

export function AnlaegSite() {
  const [build, setBuild] = useState(BUILDS[0].key);
  const [menu, setMenu] = useState(false);
  const [sent, setSent] = useState(false);
  const month = useMonth();

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const b = BUILDS.find((x) => x.key === build) ?? BUILDS[0];
  const total = b.layers.reduce((s, l) => s + l.cm, 0);
  const now = month >= 0 ? YEAR.filter((r) => r.m[month] === 2).map((r) => r.now) : [];

  return (
    <div className="min-h-dvh overflow-x-clip bg-[#F2F3EE] font-(family-name:--font-lindholm-sans) text-[18px] text-[#24211C] [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-[#2F4A2B]">
      <DemoNote className="bg-[#2F4A2B] text-[#E4EADF]" />

      <header className="relative z-40 border-b border-[#D3D5CC] bg-[#F2F3EE]">
        <div className={`${wrap} flex items-center justify-between gap-4 py-3.5 lg:py-5`}>
          <a href="#top" className="flex min-w-0 flex-col leading-tight">
            <span className={`${serif} whitespace-nowrap text-[22px] font-bold sm:text-[26px]`}>Lindholm Anlæg</span>
            <span className="whitespace-nowrap text-[13px] text-[#5F615A] sm:text-sm">Anlægsgartner i Vejle</span>
          </a>
          <nav aria-label="Hovedmenu" className="hidden gap-7 whitespace-nowrap text-[17px] font-medium xl:flex">
            {NAV.map(([href, label]) => (
              <a key={href} href={href} className="hover:text-[#2F4A2B] hover:underline hover:underline-offset-4">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-4 xl:gap-6">
            <a href={TEL} className="hidden whitespace-nowrap text-lg font-bold hover:text-[#2F4A2B] sm:inline">
              {PHONE}
            </a>
            <a href="#kontakt" className={`${btn} hidden px-5 py-3 md:inline-flex`}>
              Book opmåling
            </a>
            <button
              type="button"
              aria-label={menu ? "Luk menu" : "Åbn menu"}
              aria-expanded={menu}
              aria-controls="lindholm-menu"
              onClick={() => setMenu((m) => !m)}
              className="grid size-11 place-items-center rounded-[2px] border border-[#9C9E95] xl:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
        {menu && (
          <nav id="lindholm-menu" aria-label="Menu" className="border-t border-[#D3D5CC] xl:hidden">
            <ul className={`${wrap} py-2`}>
              {NAV.map(([href, label]) => (
                <li key={href}>
                  <a href={href} onClick={() => setMenu(false)} className={`${serif} block border-b border-[#D3D5CC] py-3.5 text-xl`}>
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <a href={TEL} className="block py-3.5 text-lg font-bold">
                  Ring {PHONE}
                </a>
              </li>
            </ul>
          </nav>
        )}
      </header>

      <main>
        {/* Hero: one plain fact a garden firm would say, then the photo across the full width */}
        <section id="top">
          <div className={`${wrap} grid gap-6 pb-8 pt-8 sm:pb-12 sm:pt-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-end lg:gap-16 lg:pb-14 lg:pt-20`}>
            <div className="flex flex-col gap-5">
              <h1 className={`${serif} text-[42px] font-medium leading-[1.02] tracking-[-0.015em] sm:text-[60px] lg:text-[72px]`}>
                En indkørsel starter 36 cm under jorden.
              </h1>
              <p className="max-w-[40ch] text-lg leading-[1.5] sm:text-[21px]">
                Lindholm Anlæg er Niels Lindholm og tre gartnere fra Vejle. Vi lægger indkørsler og terrasser, planter hæk og passer haver fast fra Fredericia til Give.
              </p>
            </div>
            <div className="flex flex-col gap-4 lg:pb-2">
              <div className="hidden flex-wrap items-center gap-x-5 gap-y-3 sm:flex">
                <a href="#kontakt" className={`${btn} inline-flex px-6 py-4 text-lg`}>
                  Book en opmåling
                </a>
                <a href={TEL} className="whitespace-nowrap text-lg font-bold underline decoration-[#9C9E95] underline-offset-4 hover:decoration-[#24211C]">
                  Ring {PHONE}
                </a>
              </div>
              <p className="max-w-[44ch] border-l-2 border-[#2F4A2B] pl-4 text-base leading-normal text-[#4A4C46] sm:text-base">
                Opmåling og tilbud koster 500 kr. inkl. moms. Siger du ja, trækker vi beløbet fra. Niels tager telefonen hverdage kl. 7–15.30.
              </p>
            </div>
          </div>
          <figure>
            <Img
              priority
              id="1725586660046-0c2bea151543"
              w={2000}
              alt="Gartner lægger sten på et afrettet grusbed foran en trillebør"
              className="aspect-[4/3] w-full object-cover sm:aspect-[21/9]"
            />
            <figcaption className={`${wrap} flex flex-wrap justify-between gap-x-6 gap-y-1 pt-2.5 text-base text-[#4A4C46] ${cap}`}>
              <span>Indkørsel i Bredballe, april 2026</span>
              <span>74 m² betonsten · 36 cm opbygning · 8 arbejdsdage</span>
            </figcaption>
          </figure>
        </section>

        {/* The cross section: what you pay for per m² */}
        <section id="belaegning" className={`${wrap} scroll-mt-4 py-14 sm:py-24`}>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
            <div className="flex max-w-[480px] flex-col gap-4">
              <h2 className={h2}>Det, der ligger under stenene</h2>
              <p className="leading-[1.6]">
                Det meste af prisen på en belægning er det, man ikke kan se. Hvis der er for lidt stabilgrus, sætter stenene sig efter et par vintre, og så skal det hele op igen.
              </p>
              <p className="leading-[1.6]">
                Har du fået et tilbud, der er meget billigere end vores, så spørg, hvor mange centimeter grus der er regnet med. Vi skriver det altid i tilbuddet.
              </p>
              <div role="group" aria-label="Vælg belægning" className="mt-3 flex flex-wrap gap-2">
                {BUILDS.map((x) => (
                  <button
                    key={x.key}
                    type="button"
                    aria-pressed={build === x.key}
                    onClick={() => setBuild(x.key)}
                    className={`whitespace-nowrap rounded-[2px] border px-4 py-2.5 transition-colors ${
                      build === x.key ? "border-[#24211C] bg-[#24211C] text-[#F2F3EE]" : "border-[#9C9E95] hover:border-[#24211C]"
                    }`}
                  >
                    {x.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t-2 border-[#24211C] pt-5" aria-live="polite">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className={`${serif} text-2xl font-medium sm:text-[28px]`}>{b.title}</h3>
                <p className={`${cap} text-[#4A4C46]`}>Snit, målt i cm</p>
              </div>
              <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:gap-8">
                <Section build={b} />
                <ol className="flex min-w-0 flex-1 flex-col">
                  {b.layers.map((l) => (
                    <li key={l.name} className="grid grid-cols-[14px_minmax(0,1fr)] gap-x-3 border-b border-[#D3D5CC] py-3 first:pt-0">
                      <span className="mt-1.5 size-3.5 border border-[#24211C]/40" style={{ background: SWATCH[l.kind] }} aria-hidden />
                      <div>
                        <p className="font-bold">{l.name.includes(`${l.cm} cm`) ? l.name : `${l.name}, ${l.cm} cm`}</p>
                        <p className="text-base leading-snug text-[#4A4C46]">{l.note}</p>
                      </div>
                    </li>
                  ))}
                  <li className="grid grid-cols-[14px_minmax(0,1fr)] gap-x-3 py-3">
                    <span className="mt-1.5 size-3.5 border border-[#24211C]/40 bg-[#6E5640]" aria-hidden />
                    <div>
                      <p className="font-bold">Fast bund</p>
                      <p className="text-base leading-snug text-[#4A4C46]">Vi graver {total} cm ud og kører muld og jord væk.</p>
                    </div>
                  </li>
                </ol>
              </div>
              <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 bg-[#E4E6DE] px-4 py-4 sm:px-5">
                <p className="text-base text-[#4A4C46]">Pris inkl. udgravning, grus og sten</p>
                <p className={`${serif} whitespace-nowrap text-[26px] font-medium`}>{b.price}</p>
                <p className="w-full text-base leading-snug text-[#4A4C46]">{b.note}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Gardens: a fixed-format gallery with italic captions, like a plant book */}
        <section id="haver" className="border-t border-[#D3D5CC] bg-[#FAFAF7]">
          <div className={`${wrap} py-14 sm:py-24`}>
            <div className="flex max-w-[620px] flex-col gap-3">
              <h2 className={h2}>Haver, vi har lavet</h2>
              <p className="leading-[1.6] text-[#4A4C46]">Sted, måned og mål står under hvert billede. Flere af kunderne viser gerne, hvordan det ser ud i dag. Spørg, så ringer vi til dem.</p>
            </div>
            <ul className="mt-9 grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-12 lg:gap-y-12">
              {GARDENS.map((g, i) => (
                <li key={g.title} className={i === 0 ? "sm:col-span-2 lg:col-span-7 lg:row-span-2" : i < 3 ? "lg:col-span-5" : "lg:col-span-6"}>
                  <figure className="flex h-full flex-col gap-3">
                    <Img id={g.photo} w={i === 0 ? 1400 : 900} alt={g.alt} className={`w-full object-cover ${i === 0 ? "aspect-[4/3] lg:aspect-auto lg:min-h-0 lg:flex-1" : "aspect-[3/2]"}`} />
                    <figcaption className="flex flex-col gap-0.5">
                      <span className={`${serif} text-[22px] font-medium leading-tight`}>{g.title}</span>
                      <span className={`${cap} text-[#4A4C46]`}>
                        {g.place}, {g.when}
                      </span>
                      <span className="text-base text-[#4A4C46]">{g.facts}</span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
            <p className={`mt-8 text-base text-[#5F615A] ${cap}`}>Fotos fra Unsplash som pladsholdere. På din side bruger vi dine egne billeder fra haverne.</p>
          </div>
        </section>

        {/* Prices */}
        <section id="priser" className="scroll-mt-4 bg-[#2A2620] text-[#EDEBE4] [&_:focus-visible]:outline-[#EDEBE4]">
          <div className={`${wrap} grid gap-8 py-14 sm:gap-14 sm:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]`}>
            <div className="flex max-w-[440px] flex-col gap-4">
              <h2 className={h2}>Hvad koster det?</h2>
              <p className="leading-[1.6] text-[#CFCABE]">
                Du får en fast pris efter opmålingen. Priserne her er dem, vi typisk ender på i Vejle-området. Adgangsforhold og hvor meget jord der skal køres væk, trækker mest op eller ned.
              </p>
            </div>
            <table className="w-full border-collapse">
              <caption className={`pb-3 text-left text-base text-[#B3AD9F] ${cap}`}>Vejledende priser inkl. moms, oktober 2026</caption>
              <tbody>
                {PRICES.map((p) => (
                  <tr key={p.what} className="border-y border-[#4A443A]">
                    <th scope="row" className="py-3.5 pr-4 text-left align-top font-medium">
                      {p.what}
                      {p.note && <span className="block text-base font-normal text-[#B3AD9F]">{p.note}</span>}
                    </th>
                    <td className="whitespace-nowrap py-3.5 text-right align-top tabular-nums">{p.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* The year plan */}
        <section id="aaret" className={`${wrap} scroll-mt-4 py-14 sm:py-24`}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
            <div className="flex max-w-[520px] flex-col gap-3">
              <h2 className={h2}>Årets gang</h2>
              <p className="leading-[1.6]">
                Hæk plantes bedst, når bladene er faldet, og rullegræs skal ikke lægges i en tør juli. Her kan du se, hvornår vi helst laver hvad.
              </p>
            </div>
            <p className="min-h-[3lh] max-w-[46ch] border-l-2 border-[#2F4A2B] pl-4 leading-normal lg:mb-1" aria-live="polite">
              {month >= 0 && (
                <>
                  <b className="font-bold">Nu i {MONTHS[month]}</b> er det god tid til {now.length ? now.slice(0, -1).join(", ") + (now.length > 1 ? " og " : "") + now[now.length - 1] : "at planlægge næste år"}.
                </>
              )}
            </p>
          </div>

          <div className="mt-9 overflow-x-auto">
            <table className="w-full min-w-[300px] table-fixed border-collapse text-base">
              <caption className="sr-only">Hvornår på året vi laver hvad. Fyldt felt: god tid. Skraveret felt: kan godt lade sig gøre.</caption>
              <thead>
                <tr>
                  <th scope="col" className="w-[38%] pb-2 text-left font-normal text-[#5F615A] sm:w-[26%]">
                    <span className="sr-only">Opgave</span>
                  </th>
                  {MONTHS.map((m, i) => (
                    <th key={m} scope="col" className={`pb-2 text-center font-medium ${i === month ? "text-[#2F4A2B]" : "text-[#5F615A]"}`}>
                      <abbr title={m} className="no-underline">
                        <span className="sm:hidden">{m[0].toUpperCase()}</span>
                        <span className="hidden sm:inline">{m.slice(0, 3)}</span>
                      </abbr>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {YEAR.map((r) => (
                  <tr key={r.task} className="border-t border-[#D3D5CC]">
                    <th scope="row" className="py-2.5 pr-3 text-left font-medium leading-tight">
                      {r.task}
                    </th>
                    {r.m.map((v, i) => (
                      <td key={i} className={`px-px py-2.5 ${i === month ? "bg-[#E0E5D9]" : ""}`}>
                        <span className="sr-only">{MONTHS[i]}: {v === 2 ? "god tid" : v === 1 ? "kan godt" : "venter"}</span>
                        <Cell v={v} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-base text-[#4A4C46]" aria-hidden>
            <span className="flex items-center gap-2">
              <span className="block h-3.5 w-6 bg-[#2F4A2B]" /> God tid
            </span>
            <span className="flex items-center gap-2">
              <span className="block h-3.5 w-6 border border-[#2F4A2B] bg-[repeating-linear-gradient(135deg,#2F4A2B_0_1.5px,transparent_1.5px_5px)]" /> Kan godt, hvis vejret er til det
            </span>
          </div>
        </section>

        {/* Garden care at a fixed monthly price */}
        <section id="pleje" className="scroll-mt-4 border-y border-[#D3D5CC] bg-[#FAFAF7]">
          <div className={`${wrap} grid gap-10 py-14 sm:py-24 lg:grid-cols-2 lg:gap-16`}>
            <div className="flex max-w-[520px] flex-col gap-4">
              <h2 className={h2}>Havepleje til fast pris hver måned</h2>
              <p className="leading-[1.6]">
                Sofie Krogh står for plejehaverne. Hun kommer på faste dage og sender en sms dagen før. Du betaler det samme hver måned hele året, også om vinteren, så der ikke kommer en stor regning i juni.
              </p>
              <ul className="mt-1 flex flex-col border-t border-[#D3D5CC]">
                {[
                  "Græsslåning hver 14. dag fra april til oktober",
                  "Hækklipning i juni og i september",
                  "Lugning af bede en gang om måneden i sæsonen",
                  "Løv revet sammen og kørt væk i november",
                  "Opsiges med en måneds varsel",
                ].map((t) => (
                  <li key={t} className="border-b border-[#D3D5CC] py-2.5">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-4 lg:pt-3">
              <table className="w-full border-collapse">
                <caption className={`pb-3 text-left text-base text-[#4A4C46] ${cap}`}>Pris pr. måned inkl. moms, med op til 30 m hæk</caption>
                <tbody>
                  {PLEJE.map((p) => (
                    <tr key={p.size} className="border-y border-[#D3D5CC]">
                      <th scope="row" className="py-4 pr-4 text-left font-medium">
                        {p.size}
                      </th>
                      <td className={`${serif} whitespace-nowrap py-4 text-right text-[22px] ${p.price.includes("kr") ? "" : "text-lg text-[#4A4C46]"}`}>{p.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-base leading-normal text-[#4A4C46]">
                Vi kigger på haven, før vi laver en aftale. Det er gratis, når det gælder havepleje. Om du kan trække noget fra i skat, kan du se på skat.dk.
              </p>
              <p className="text-base leading-normal text-[#4A4C46]">Lige nu har Sofie plads til fire nye haver fra april 2027.</p>
            </div>
          </div>
        </section>

        {/* Niels */}
        <section id="om" className={`${wrap} grid items-start gap-8 py-14 sm:py-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16`}>
          <figure className="flex flex-col gap-2.5">
            <Img id="1605117882932-f9e32b03fea9" w={900} alt="Pladsholderfoto af en gartner med en spade" className="aspect-[4/5] w-full max-w-[420px] object-cover" />
            <figcaption className={`text-base text-[#5F615A] ${cap}`}>Pladsholderfoto · her kommer mesterens eget portræt</figcaption>
          </figure>
          <div className="flex max-w-[600px] flex-col gap-4 lg:pt-6">
            <h2 className={h2}>Niels Lindholm, anlægsgartnermester</h2>
            <p className="leading-[1.65]">
              Jeg blev udlært i 2004 og startede for mig selv i 2011 med en minigraver og en trailer. I dag er vi fire. Anders har lagt sten sammen med mig i ti år, Sofie passer plejehaverne, og Mikkel er i lære.
            </p>
            <p className="leading-[1.65]">
              Det er mig, der kommer ud og måler op, og jeg er på pladsen hver dag, mens vi arbejder. Vi lejer ikke folk ind i højsæsonen. Derfor kan der være ventetid i foråret.
            </p>
            <dl className="mt-3 grid grid-cols-[max-content_minmax(0,1fr)] gap-x-6 gap-y-2.5 border-t border-[#D3D5CC] pt-5 text-[17px]">
              <dt className="text-[#5F615A]">Adresse</dt>
              <dd>{ADDRESS}</dd>
              <dt className="text-[#5F615A]">Telefon</dt>
              <dd>
                <a href={TEL} className="font-bold underline underline-offset-2">
                  {PHONE}
                </a>
                , hverdage kl. 7–15.30
              </dd>
              <dt className="text-[#5F615A]">CVR</dt>
              <dd>00 00 00 00 (eksempel)</dd>
              <dt className="text-[#5F615A]">Medlem af</dt>
              <dd>
                Danske Anlægsgartnere <span className={`${cap} text-[#5F615A]`}>(eksempel)</span>
              </dd>
              <dt className="text-[#5F615A]">Kører til</dt>
              <dd>Vejle, Fredericia, Jelling, Børkop, Egtved og Give</dd>
              <dt className="text-[#5F615A]">Ventetid nu</dt>
              <dd>Belægning fra uge 46. Hæk kan plantes i november.</dd>
            </dl>
          </div>
        </section>

        {/* Reviews */}
        <section className="border-t border-[#D3D5CC]">
          <div className={`${wrap} py-14 sm:py-24`}>
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 sm:mb-8">
              <h2 className={h2}>Det skriver kunderne</h2>
              <SampleReviewsNote className={`text-base! text-[#5F615A] ${cap}`} />
            </div>
            <div className="columns-1 gap-x-14 md:columns-2">
              {REVIEWS.map((r) => (
                <figure key={r.name} className="mb-8 flex break-inside-avoid flex-col gap-2.5 border-t border-[#D3D5CC] pt-5">
                  <p className="flex flex-wrap items-center gap-x-3 text-base text-[#5F615A]">
                    <Stars n={r.stars} className="text-[#2F4A2B]" />
                    <span>{r.date}</span>
                  </p>
                  <blockquote className={`${serif} text-[20px] leading-[1.45]`}>{r.text}</blockquote>
                  <figcaption className="text-base text-[#5F615A]">{r.name}</figcaption>
                  {r.reply && (
                    <p className="mt-1 border-l-2 border-[#2F4A2B] pl-3.5 text-[17px] leading-[1.55]">
                      <b className="font-bold">Svar fra Niels:</b> {r.reply}
                    </p>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="kontakt" className="scroll-mt-4 bg-[#E4E6DE]">
          <div className={`${wrap} grid gap-10 py-14 sm:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16`}>
            <div className="flex max-w-[440px] flex-col gap-4">
              <h2 className={h2}>Book en opmåling</h2>
              <p className="leading-[1.6]">
                Ring, hvis du vil snakke det igennem først. Skriv, hvis du ved, hvad du vil have, og fortæl gerne cirka hvor mange m² det drejer sig om.
              </p>
              <p className={`${serif} text-[32px] font-medium`}>
                <a href={TEL} className="whitespace-nowrap hover:text-[#2F4A2B]">
                  {PHONE}
                </a>
              </p>
              <p className="text-base text-[#4A4C46]">
                Hverdage kl. 7–15.30
                <br />
                {ADDRESS}
              </p>
            </div>
            <form
              className="flex max-w-[540px] flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
                e.currentTarget.reset();
              }}
            >
              {sent && (
                <p role="status" className="rounded-[2px] border-l-4 border-[#2F4A2B] bg-[#F2F3EE] p-4">
                  Tak. På en rigtig side ville Niels ringe dig op inden for to hverdage og aftale en dag, hvor han kommer ud og måler op. Dette er et eksempel, så der er ikke sendt noget.
                </p>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={lbl}>
                  Navn
                  <input required name="navn" type="text" autoComplete="name" className={field} />
                </label>
                <label className={lbl}>
                  Telefon
                  <input required name="telefon" type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9 +]{8,}" title="Skriv et telefonnummer på mindst 8 cifre" className={field} />
                </label>
              </div>
              <label className={lbl}>
                Adresse
                <input required name="adresse" type="text" autoComplete="street-address" placeholder="Vej, husnummer og postnummer" className={field} />
              </label>
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                <label className={lbl}>
                  Hvad skal laves?
                  <select required name="opgave" defaultValue="" className={`${field} h-[52px]`}>
                    <option value="" disabled>
                      Vælg
                    </option>
                    <option>Indkørsel eller gårdsplads</option>
                    <option>Terrasse</option>
                    <option>Hæk</option>
                    <option>Plæne</option>
                    <option>Havepleje</option>
                    <option>Andet</option>
                  </select>
                </label>
                <label className={lbl}>
                  Cirka m²
                  <input name="m2" type="text" inputMode="numeric" placeholder="Valgfrit" className={field} />
                </label>
              </div>
              <label className={lbl}>
                Lidt om opgaven
                <textarea name="besked" rows={4} placeholder="Fx gammel flisegang skal op, og der skal være plads til to biler" className={`${field} resize-y`} />
              </label>
              <button type="submit" className={`${btn} inline-flex self-start px-6 py-4 text-lg`}>
                Book opmåling
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-[#2A2620] pb-24 text-[#CFCABE] sm:pb-0">
        <div className={`${wrap} flex flex-wrap justify-between gap-x-8 gap-y-3 py-10 text-base`}>
          <span className={`${serif} text-lg font-bold text-[#EDEBE4]`}>Lindholm Anlæg</span>
          <span>{ADDRESS}</span>
          <span>CVR 00 00 00 00 (eksempel)</span>
          <a href={TEL} className="text-[#EDEBE4] underline underline-offset-2">
            {PHONE}
          </a>
        </div>
      </footer>

      {/* Phone: call or book, within thumb's reach */}
      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2.5 border-t border-[#D3D5CC] bg-[#F2F3EE] px-4 pb-4 pt-3 sm:hidden">
        <a href={TEL} className="grid h-[52px] place-items-center whitespace-nowrap rounded-[2px] border border-[#24211C] font-bold">
          Ring til Niels
        </a>
        <a href="#kontakt" className={`${btn} flex h-[52px]`}>
          <span className="min-[360px]:hidden">Opmåling</span>
          <span className="hidden min-[360px]:inline">Book opmåling</span>
        </a>
      </div>
    </div>
  );
}
