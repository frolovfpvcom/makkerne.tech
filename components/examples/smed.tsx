"use client";

import { useEffect, useState } from "react";
import { DemoNote, Img, SampleReviewsNote, Stars } from "./shared";

/*
 * Nørbæk Smedie, built like a workshop drawing: steel grey, galvanised zinc and one red-oxide primer
 * colour, a firm grotesk and its mono for positions, measures and RAL codes. The facts sit in a title
 * block, the work is a parts list, and two small tools do real work: a gate you can colour in RAL
 * and an estimate for a railing that shows every line of the sum. No cards, no shadows, no motion.
 */

const PHONE = "98 76 54 32";
const TEL = "tel:+4598765432";
const ADDRESS = "Værkstedsvej 9, 8600 Silkeborg";

const mono = "font-(family-name:--font-norbaek-mono)";

/* ---------- Parts list ---------- */

const JOBS: { pos: string; what: string; size: string; finish: string; place: string; photo?: string; alt?: string }[] = [
  {
    pos: "01",
    what: "Udvendig trappe, 13 trin",
    size: "B 1.000 mm, trin i gitterrist",
    finish: "Varmgalvaniseret",
    place: "Gødvad · marts 2025",
    photo: "1523789248610-bb592e870951",
    alt: "Trappe i gråt stål med gitterristtrin",
  },
  {
    pos: "02",
    what: "Terrassegelænder, fladjern og rundstok",
    size: "14,5 m, H 1.000 mm",
    finish: "Varmgalv. + RAL 7016",
    place: "Virklund · juni 2026",
    photo: "1635348180022-2f7715fdecfa",
    alt: "Nærbillede af et håndlistegelænder i stål",
  },
  { pos: "03", what: "Altan på murværk, med glasværn", size: "1,4 × 3,2 m", finish: "Varmgalv. + RAL 9005", place: "Silkeborg C · august 2025" },
  {
    pos: "04",
    what: "Indkørselslåge, dobbelt",
    size: "2 × 1.600 × 1.200 mm",
    finish: "Varmgalv. + RAL 9005",
    place: "Them · oktober 2025",
    photo: "1580047750144-2c7790adf461",
    alt: "Sort stållåge foran grønne træer",
  },
  { pos: "05", what: "Carport, enkelt, stålstolper 100 × 100", size: "3,2 × 6,0 m", finish: "Varmgalvaniseret", place: "Kjellerup · april 2026" },
  {
    pos: "06",
    what: "Trappegelænder indendørs",
    size: "6,2 m, 2 reposer",
    finish: "Sortstål, klarlak",
    place: "Lysbro · januar 2026",
    photo: "1519737461811-29f817b5e61c",
    alt: "Trappe med gelænder i gråt stål",
  },
  { pos: "07", what: "Gammel smedejernslåge, repareret", size: "Nye hængsler og bundramme", finish: "Sandblæst + RAL 9005", place: "Sejs · september 2026" },
];

/* ---------- RAL gate ---------- */

const RAL: { code: string; name: string; hex: string; light?: boolean }[] = [
  { code: "7016", name: "Antracitgrå", hex: "#383E42" },
  { code: "9005", name: "Dybsort", hex: "#121214" },
  { code: "6009", name: "Grangrøn", hex: "#27352A" },
  { code: "3009", name: "Oxidrød", hex: "#6D342D" },
  { code: "7035", name: "Lysegrå", hex: "#CBD0CC", light: true },
  { code: "9010", name: "Renhvid", hex: "#F1EDE1", light: true },
  { code: "", name: "Kun galvaniseret", hex: "#A6ACAD", light: true },
];

type Style = "rundstok" | "fladjern";

function Gate({ hex, light, style }: { hex: string; light?: boolean; style: Style }) {
  const x0 = 74;
  const y0 = 40;
  const w = 260;
  const h = 312;
  const rail = 11;
  const n = 9;
  const step = (w - 2 * rail) / (n + 1);
  const bar = style === "rundstok" ? 4.5 : 10;
  const edge = light ? "#4A4F53" : "none";
  return (
    <svg viewBox="0 0 420 380" className="h-auto w-full max-w-[460px]" role="img" aria-label={`Tegning af en havelåge, 1.000 × 1.200 mm, med ${style === "rundstok" ? "lodrette rundstokke" : "lodrette fladjern"}`}>
      {/* posts */}
      <rect x="50" y="28" width="20" height="334" fill="#8C9294" />
      <rect x="338" y="28" width="20" height="334" fill="#8C9294" />
      {/* gate */}
      <g fill={hex} stroke={edge} strokeWidth="0.8">
        <rect x={x0} y={y0} width={w} height={rail} />
        <rect x={x0} y={y0 + h - rail} width={w} height={rail} />
        <rect x={x0} y={y0} width={rail} height={h} />
        <rect x={x0 + w - rail} y={y0} width={rail} height={h} />
        <rect x={x0} y={y0 + h * 0.62} width={w} height={rail * 0.8} />
        {Array.from({ length: n }, (_, i) => (
          <rect key={i} x={x0 + rail + step * (i + 1) - bar / 2} y={y0 + rail} width={bar} height={h - 2 * rail} />
        ))}
      </g>
      {/* hinges and latch */}
      <rect x="66" y="64" width="14" height="8" fill="#55595C" />
      <rect x="66" y="320" width="14" height="8" fill="#55595C" />
      <rect x="320" y="200" width="22" height="26" fill="#55595C" />
      {/* ground */}
      <line x1="20" y1="362.5" x2="400" y2="362.5" stroke="#1B1D1F" strokeWidth="1" />
      {Array.from({ length: 24 }, (_, i) => (
        <line key={i} x1={24 + i * 16} y1="363" x2={16 + i * 16} y2="371" stroke="#1B1D1F" strokeWidth="0.8" />
      ))}
      {/* dimensions */}
      <g stroke="#1B1D1F" strokeWidth="0.9">
        <line x1={x0} y1="16" x2={x0 + w} y2="16" />
        <line x1={x0} y1="10" x2={x0} y2="34" />
        <line x1={x0 + w} y1="10" x2={x0 + w} y2="34" />
        <line x1="384" y1={y0} x2="384" y2={y0 + h} />
        <line x1="364" y1={y0} x2="392" y2={y0} />
        <line x1="364" y1={y0 + h} x2="392" y2={y0 + h} />
      </g>
      <text x={x0 + w / 2} y="11" textAnchor="middle" fontSize="12" fill="#1B1D1F" className={mono}>
        1.000
      </text>
      <text x="398" y={y0 + h / 2} textAnchor="middle" fontSize="12" fill="#1B1D1F" className={mono} transform={`rotate(90 398 ${y0 + h / 2})`}>
        1.200
      </text>
    </svg>
  );
}

/* ---------- Estimate ---------- */

type Kind = "ude" | "inde";
const MAKE: Record<Kind, [number, number]> = { ude: [1900, 2400], inde: [2300, 2900] };
const FINISH: Record<Kind, { key: string; label: string; perM: number }[]> = {
  ude: [
    { key: "galv", label: "Varmgalvaniseret", perM: 350 },
    { key: "galvlak", label: "Varmgalv. + pulverlak", perM: 650 },
  ],
  inde: [
    { key: "klar", label: "Sortstål, klarlak", perM: 250 },
    { key: "lak", label: "Pulverlak", perM: 300 },
  ],
};
const MOUNT_BASE = 2800;
const MOUNT_PER_M = 250;

const kr = (n: number) => n.toLocaleString("da-DK") + " kr.";
const roundDown = (n: number) => Math.floor(n / 500) * 500;
const roundUp = (n: number) => Math.ceil(n / 500) * 500;

/* ---------- From sketch to mounting ---------- */

const STEPS: { week: string; title: string; text: string }[] = [
  { week: "Dag 1", title: "Du sender mål eller en skitse", text: "Et foto med en tommestok i billedet er nok til et overslag. Vi svarer inden for to hverdage." },
  { week: "Uge 1", title: "Opmåling", text: "Kim eller en af svendene kommer ud og måler. Det koster 450 kr. og trækkes fra, hvis du bestiller." },
  { week: "Uge 1–2", title: "Tegning og fast pris", text: "Du får en tegning med alle mål og en fast pris. Vi retter tegningen, til du er tilfreds." },
  { week: "Uge 3–4", title: "Værkstedet", text: "Vi skærer, bukker og svejser. Du er velkommen til at komme forbi og se det, før det bliver galvaniseret." },
  { week: "Uge 5", title: "Galvanisering og lak", text: "Varmforzinkning hos et forzinkeri i Midtjylland og pulverlak bagefter. Det tager 8–10 arbejdsdage." },
  { week: "Uge 6", title: "Montage", text: "Den svend, der har svejst det, sætter det op. Et gelænder tager typisk en dag." },
];

const REVIEWS: { stars: number; date: string; text: string; name: string; reply?: string }[] = [
  {
    stars: 5,
    date: "28. sep. 2026",
    text: "Trappen til kælderskakten blev målt op en tirsdag og sat op tre uger efter. Den passede, og Rasmus tog det gamle jern med.",
    name: "Lone, Gødvad",
  },
  {
    stars: 4,
    date: "14. aug. 2026",
    text: "Gelænderet er rigtig flot. Men galvaniseringen tog to uger længere end lovet, og vi fik først besked, da vi selv ringede.",
    name: "Peter, Virklund",
    reply: "Det er rigtigt, Peter. Forzinkeriet var bagud, og vi burde have ringet med det samme. Nu får kunden en sms, så snart vi kender en ny dato.",
  },
  { stars: 5, date: "2. jul. 2026", text: "Vi fik repareret vores gamle smedejernslåge i stedet for at købe en ny. Det var Kim, der foreslog det.", name: "Birthe, Sejs" },
  { stars: 5, date: "9. maj 2026", text: "Altanen blev godkendt af ingeniøren uden bemærkninger. Det var rart ikke at skulle være mellemmand.", name: "Søren, Silkeborg" },
];

const NAV = [
  ["#opgaver", "Opgaver"],
  ["#farver", "Farver"],
  ["#pris", "Pris"],
  ["#forloeb", "Forløb"],
  ["#kontakt", "Kontakt"],
] as const;

const wrap = "mx-auto max-w-[1240px] px-4 sm:px-8";
const h2 = "text-[30px] font-extrabold leading-[1.05] tracking-[-0.02em] sm:text-[42px]";
const kicker = `${mono} text-[12px] uppercase tracking-[0.08em] text-[#555A5E] sm:text-[13px]`;
const btn = "items-center justify-center whitespace-nowrap rounded-none bg-[#B0381C] font-bold text-white transition-colors hover:bg-[#932C14]";
const field = "w-full rounded-none border border-[#8E9396] bg-white px-3.5 py-3 text-base text-[#1B1D1F] placeholder:text-[#767B7F]";
const lbl = "flex flex-col gap-1.5 text-[15px] font-bold";

export function SmedSite() {
  const [menu, setMenu] = useState(false);
  const [ral, setRal] = useState(RAL[0]);
  const [style, setStyle] = useState<Style>("rundstok");
  const [len, setLen] = useState(8);
  const [kind, setKind] = useState<Kind>("ude");
  const [finish, setFinish] = useState(FINISH.ude[1].key);
  const [mount, setMount] = useState(true);
  const [files, setFiles] = useState<string[]>([]);
  const [sent, setSent] = useState<string | null>(null);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const fin = FINISH[kind].find((f) => f.key === finish) ?? FINISH[kind][0];
  const make: [number, number] = [MAKE[kind][0] * len, MAKE[kind][1] * len];
  const surface = fin.perM * len;
  const mounting = mount ? MOUNT_BASE + MOUNT_PER_M * len : 0;
  const low = roundDown(make[0] + surface + mounting);
  const high = roundUp(make[1] + surface + mounting);

  return (
    <div className="min-h-dvh overflow-x-clip bg-[#F0F0EC] font-(family-name:--font-norbaek) text-[#1B1D1F] [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-[#B0381C]">
      <DemoNote className={`bg-[#B0381C] text-white ${mono} text-[12px]!`} />

      {/* Header and hero share the dark steel */}
      <div className="bg-[#1D2023] text-[#ECEDEA] [&_:focus-visible]:outline-[#ECEDEA]">
        <header className="relative z-40 border-b border-[#3A3F43]">
          <div className={`${wrap} flex items-center justify-between gap-4 py-3 lg:py-4`}>
            <a href="#top" className="flex min-w-0 flex-col leading-tight">
              <span className="whitespace-nowrap text-lg font-black uppercase tracking-[0.04em] sm:text-xl">Nørbæk Smedie</span>
              <span className={`${mono} whitespace-nowrap text-[11px] uppercase tracking-[0.08em] text-[#A9AFB3] sm:text-xs`}>Klejnsmed · Silkeborg</span>
            </a>
            <nav aria-label="Hovedmenu" className="hidden gap-7 whitespace-nowrap font-medium lg:flex">
              {NAV.map(([href, label]) => (
                <a key={href} href={href} className="hover:underline hover:decoration-[#B0381C] hover:decoration-2 hover:underline-offset-[6px]">
                  {label}
                </a>
              ))}
            </nav>
            <div className="flex shrink-0 items-center gap-4 lg:gap-5">
              <a href={TEL} className={`${mono} hidden whitespace-nowrap font-medium hover:text-white sm:inline`}>
                {PHONE}
              </a>
              <a href="#kontakt" className={`${btn} hidden px-5 py-3 md:inline-flex`}>
                Send mål
              </a>
              <button
                type="button"
                aria-label={menu ? "Luk menu" : "Åbn menu"}
                aria-expanded={menu}
                aria-controls="norbaek-menu"
                onClick={() => setMenu((m) => !m)}
                className="grid size-11 place-items-center border border-[#5B6064] lg:hidden"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden>
                  {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
                </svg>
              </button>
            </div>
          </div>
          {menu && (
            <nav id="norbaek-menu" aria-label="Menu" className="border-t border-[#3A3F43] lg:hidden">
              <ul className={`${wrap} py-2`}>
                {NAV.map(([href, label]) => (
                  <li key={href}>
                    <a href={href} onClick={() => setMenu(false)} className="block border-b border-[#3A3F43] py-3.5 text-lg font-bold">
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

        <section id="top" className={`${wrap} grid gap-7 pb-12 pt-8 sm:pb-16 sm:pt-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-x-14 lg:gap-y-10 lg:pb-20 lg:pt-16`}>
          <div className="flex flex-col gap-5 lg:col-start-2 lg:row-start-1 lg:self-end">
            <h1 className="text-[38px] font-extrabold leading-[1.02] tracking-[-0.025em] sm:text-[54px] lg:text-[60px]">Hvert gelænder bliver målt op af den smed, der skal svejse det.</h1>
            <p className="max-w-[46ch] text-[17px] leading-[1.55] text-[#CDD0CF] sm:text-lg">
              Nørbæk Smedie er Kim Nørbæk og to svende på et værksted i Silkeborg. Vi laver gelændere, trapper, altaner, låger og carporte i stål til huse i Silkeborg-egnen, og vi monterer det selv.
            </p>
            <div className="hidden flex-wrap items-center gap-x-6 gap-y-3 sm:flex">
              <a href="#kontakt" className={`${btn} inline-flex px-6 py-4 text-lg`}>
                Send mål eller en skitse
              </a>
              <a href={TEL} className="whitespace-nowrap text-lg font-bold underline decoration-[#5B6064] underline-offset-4 hover:decoration-[#ECEDEA]">
                Ring {PHONE}
              </a>
            </div>
          </div>

          <figure className="-mx-4 flex flex-col gap-2 sm:mx-0 lg:col-start-1 lg:row-span-2 lg:row-start-1">
            <Img priority id="1558611997-dd5b20e08c71" w={1200} alt="Smed svejser en ramme i stål på værkstedet, gnisterne står" className="aspect-[4/3] w-full object-cover lg:aspect-[4/5]" />
            <figcaption className={`${mono} flex flex-wrap justify-between gap-x-4 px-4 text-[12px] text-[#A9AFB3] sm:px-0`}>
              <span>Værkstedet, Silkeborg</span>
              <span>Svejsning af altanramme</span>
            </figcaption>
          </figure>

          {/* Title block, as in the corner of a workshop drawing */}
          <dl className="grid grid-cols-2 border-l border-t border-[#4A5054] text-[15px] lg:col-start-2 lg:row-start-2 lg:self-start">
            {[
              ["Opmåling", "450 kr., trækkes fra"],
              ["Ventetid", "Ca. 4 uger til montage"],
              ["Overflade", "Varmgalv., RAL efter ønske"],
              ["Værksted", "Man–tors 7–15.30, fre 7–13"],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col gap-1 border-b border-r border-[#4A5054] px-3 py-2.5 sm:px-4 sm:py-3">
                <dt className={`${mono} text-[11px] uppercase tracking-[0.08em] text-[#A9AFB3]`}>{k}</dt>
                <dd className="font-medium leading-snug">{v}</dd>
              </div>
            ))}
            <div className="col-span-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-r border-[#4A5054] px-3 py-2.5 sm:px-4 sm:py-3">
              <dt className={`${mono} text-[11px] uppercase tracking-[0.08em] text-[#A9AFB3]`}>Firma</dt>
              <dd className={`${mono} text-[13px] text-[#CDD0CF]`}>Nørbæk Smedie · CVR 00 00 00 00 (eksempel)</dd>
            </div>
          </dl>
        </section>
      </div>

      <main>
        {/* Parts list */}
        <section id="opgaver" className={`${wrap} scroll-mt-4 py-14 sm:py-24`}>
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
            <div className="flex max-w-[600px] flex-col gap-3">
              <p className={kicker}>Stykliste</p>
              <h2 className={h2}>Det seneste fra værkstedet</h2>
              <p className="leading-[1.6] text-[#3B3F42]">Mål, overflade, sted og måned står ved hver opgave. Det meste kan ses fra vejen, hvis du vil kigge forbi.</p>
            </div>
          </div>

          <ul className="mt-9 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {JOBS.filter((j) => j.photo).map((j) => (
              <li key={j.pos}>
                <figure className="flex flex-col gap-2">
                  <Img id={j.photo!} w={700} alt={j.alt!} className="aspect-square w-full object-cover" />
                  <figcaption className={`${mono} text-[12px] text-[#555A5E] sm:text-[13px]`}>
                    Pos. {j.pos} · {j.place.split(" · ")[0]}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>

          <div className="mt-10" role="table" aria-label="Opgaver fra værkstedet">
            <div role="rowgroup" className="hidden border-b-2 border-[#1B1D1F] pb-2 md:block">
              <div role="row" className={`grid grid-cols-[56px_minmax(0,1.6fr)_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-x-5 ${kicker}`}>
                <span role="columnheader">Pos.</span>
                <span role="columnheader">Emne</span>
                <span role="columnheader">Mål</span>
                <span role="columnheader">Overflade</span>
                <span role="columnheader">Sted · tid</span>
              </div>
            </div>
            <div role="rowgroup" className="border-t-2 border-[#1B1D1F] md:border-t-0">
              {JOBS.map((j) => (
                <div
                  key={j.pos}
                  role="row"
                  className="grid grid-cols-[44px_minmax(0,1fr)] gap-x-3 gap-y-1 border-b border-[#C6C8C2] py-4 md:grid-cols-[56px_minmax(0,1.6fr)_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)] md:items-baseline md:gap-x-5"
                >
                  <span role="cell" className={`${mono} row-span-4 text-[15px] text-[#B0381C] md:row-span-1`}>
                    {j.pos}
                  </span>
                  <span role="cell" className="font-bold leading-snug">
                    {j.what}
                  </span>
                  <span role="cell" className={`${mono} text-[14px] text-[#3B3F42]`}>
                    {j.size}
                  </span>
                  <span role="cell" className={`${mono} text-[14px] text-[#3B3F42]`}>
                    {j.finish}
                  </span>
                  <span role="cell" className={`${mono} text-[14px] text-[#555A5E]`}>
                    {j.place}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className={`${mono} mt-5 text-[12px] text-[#555A5E]`}>Fotos fra Unsplash som pladsholdere. På din side bruger vi dine egne billeder fra værkstedet og fra montagen.</p>
        </section>

        {/* RAL colour on a gate */}
        <section id="farver" className="scroll-mt-4 border-y border-[#C6C8C2] bg-[#E5E6E1]">
          <div className={`${wrap} grid gap-6 py-14 sm:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-x-16 lg:gap-y-6`}>
            <div className="flex max-w-[500px] flex-col gap-4 lg:col-start-1 lg:row-start-1 lg:self-end">
              <p className={kicker}>Pulverlak</p>
              <h2 className={h2}>Prøv farven på en låge</h2>
              <p className="leading-[1.6]">
                Alt, vi lakerer til udendørs brug, er varmgalvaniseret først. Så ruster det ikke, hvis lakken får en ridse. Lakken koster det samme i alle RAL-farver.
              </p>
            </div>
            <div className="flex max-w-[500px] flex-col gap-4 lg:col-start-1 lg:row-start-2 lg:self-start">
              <fieldset>
                <legend className="text-[15px] font-bold">RAL-farve</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {RAL.map((r) => (
                    <button
                      key={r.name}
                      type="button"
                      aria-pressed={ral.name === r.name}
                      onClick={() => setRal(r)}
                      className={`flex items-center gap-2 whitespace-nowrap border py-2 pl-2 pr-3 text-left text-[15px] transition-colors ${
                        ral.name === r.name ? "border-[#1B1D1F] bg-white" : "border-[#B5B8B2] hover:border-[#1B1D1F]"
                      }`}
                    >
                      <span className="size-5 shrink-0 border border-[#1B1D1F]/30" style={{ background: r.hex }} aria-hidden />
                      {r.code && <span className={`${mono} text-[13px] text-[#555A5E]`}>{r.code}</span>}
                      <span>{r.name}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="text-[15px] font-bold">Stænger</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["rundstok", "fladjern"] as Style[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={style === s}
                      onClick={() => setStyle(s)}
                      className={`whitespace-nowrap border px-4 py-2.5 text-[15px] transition-colors ${style === s ? "border-[#1B1D1F] bg-[#1B1D1F] text-white" : "border-[#B5B8B2] hover:border-[#1B1D1F]"}`}
                    >
                      {s === "rundstok" ? "Rundstok Ø16" : "Fladjern 40 × 8"}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
            <figure className="flex flex-col lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center items-center gap-3 bg-[#F0F0EC] px-4 py-6 sm:px-8 sm:py-8">
              <Gate hex={ral.hex} light={ral.light} style={style} />
              <figcaption className={`${mono} w-full max-w-[460px] text-[13px] text-[#3B3F42]`} aria-live="polite">
                Havelåge 1.000 × 1.200 mm · {style === "rundstok" ? "rundstok Ø16" : "fladjern 40 × 8"} · {ral.code ? `varmgalv. + RAL ${ral.code} ${ral.name.toLowerCase()}` : "kun varmgalvaniseret"}
                <span className="mt-1.5 block text-[#555A5E]">Farven på skærmen er vejledende. Kom forbi og se RAL-kortet på værkstedet.</span>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Railing estimate */}
        <section id="pris" className={`${wrap} scroll-mt-4 py-14 sm:py-24`}>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
            <div className="flex max-w-[480px] flex-col gap-4">
              <p className={kicker}>Overslag</p>
              <h2 className={h2}>Hvad koster et gelænder?</h2>
              <p className="leading-[1.6]">
                Det er især meterne og overfladen, der flytter prisen. Montage er et fast beløb plus lidt pr. meter. Skal der bores i beton eller sættes beslag på en gammel trappe, ser vi på det ved opmålingen.
              </p>
              <p className="leading-[1.6] text-[#3B3F42]">Du får altid en fast pris på tegningen, før vi går i gang.</p>
            </div>

            <div className="border-2 border-[#1B1D1F] bg-white">
              <div className="flex flex-col gap-5 p-4 sm:p-6">
                <div role="group" aria-label="Hvor skal gelænderet sidde?" className="grid grid-cols-2 border border-[#1B1D1F]">
                  {(["ude", "inde"] as Kind[]).map((k) => (
                    <button
                      key={k}
                      type="button"
                      aria-pressed={kind === k}
                      onClick={() => {
                        setKind(k);
                        setFinish(FINISH[k][FINISH[k].length - 1].key);
                      }}
                      className={`whitespace-nowrap py-3 text-[15px] font-bold transition-colors ${kind === k ? "bg-[#1B1D1F] text-white" : "hover:bg-[#E5E6E1]"}`}
                    >
                      {k === "ude" ? "Udendørs" : "Indendørs"}
                    </button>
                  ))}
                </div>

                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <label htmlFor="norbaek-len" className="text-[15px] font-bold">
                      Længde
                    </label>
                    <output htmlFor="norbaek-len" className={`${mono} text-lg`}>
                      {len.toLocaleString("da-DK", { minimumFractionDigits: 1 })} m
                    </output>
                  </div>
                  <input
                    id="norbaek-len"
                    type="range"
                    min={1}
                    max={25}
                    step={0.5}
                    value={len}
                    onChange={(e) => setLen(Number(e.target.value))}
                    className="mt-2 w-full accent-[#B0381C]"
                  />
                </div>

                <fieldset>
                  <legend className="text-[15px] font-bold">Overflade</legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {FINISH[kind].map((f) => (
                      <button
                        key={f.key}
                        type="button"
                        aria-pressed={fin.key === f.key}
                        onClick={() => setFinish(f.key)}
                        className={`whitespace-nowrap border px-3.5 py-2.5 text-[15px] transition-colors ${fin.key === f.key ? "border-[#1B1D1F] bg-[#1B1D1F] text-white" : "border-[#B5B8B2] hover:border-[#1B1D1F]"}`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <label className="flex cursor-pointer items-center gap-3 text-[15px] font-bold">
                  <input type="checkbox" checked={mount} onChange={(e) => setMount(e.target.checked)} className="size-5 accent-[#B0381C]" />
                  Vi monterer
                </label>
              </div>

              <dl className={`${mono} border-t-2 border-[#1B1D1F] px-4 py-4 text-[13px] sm:px-6 sm:text-[14px]`} aria-live="polite">
                <div className="flex justify-between gap-4 py-1">
                  <dt>Fremstilling, {len.toLocaleString("da-DK")} m</dt>
                  <dd className="whitespace-nowrap text-right">
                    {make[0].toLocaleString("da-DK")}–{kr(make[1])}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-1">
                  <dt>{fin.label}</dt>
                  <dd className="whitespace-nowrap text-right">{kr(surface)}</dd>
                </div>
                <div className="flex justify-between gap-4 py-1">
                  <dt>{mount ? "Montage" : "Du henter selv"}</dt>
                  <dd className="whitespace-nowrap text-right">{mount ? kr(mounting) : "0 kr."}</dd>
                </div>
                <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-[#C6C8C2] pt-3">
                  <dt className="font-(family-name:--font-norbaek) text-[15px] font-bold">I alt, ca.</dt>
                  <dd className="whitespace-nowrap font-(family-name:--font-norbaek) text-[24px] font-extrabold tracking-[-0.01em] sm:text-[28px]">
                    {low.toLocaleString("da-DK")}–{high.toLocaleString("da-DK")} kr.
                  </dd>
                </div>
              </dl>
              <p className={`${mono} border-t border-[#C6C8C2] px-4 py-3 text-[12px] text-[#555A5E] sm:px-6`}>Vejledende priser inkl. moms, oktober 2026. Opmåling 450 kr., trækkes fra.</p>
            </div>
          </div>
        </section>

        {/* From sketch to mounting */}
        <section id="forloeb" className="scroll-mt-4 bg-[#1D2023] text-[#ECEDEA]">
          <div className={`${wrap} py-14 sm:py-24`}>
            <div className="flex max-w-[620px] flex-col gap-3">
              <p className={`${kicker} text-[#A9AFB3]!`}>Forløb</p>
              <h2 className={h2}>Fra skitse til montage på seks uger</h2>
              <p className="leading-[1.6] text-[#CDD0CF]">Sådan går et typisk gelænder eller en trappe. Om sommeren kan galvaniseringen tage en uge mere.</p>
            </div>
            <ol className="mt-10 grid gap-0 md:grid-cols-3 lg:grid-cols-6">
              {STEPS.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[72px_minmax(0,1fr)] gap-x-4 border-t border-[#4A5054] py-5 md:block md:pr-6">
                  <p className={`${mono} flex items-center gap-2 text-[13px] text-[#E4846A]`}>
                    <span className="hidden size-2 bg-[#B0381C] md:block" aria-hidden />
                    {s.week}
                  </p>
                  <div className="md:mt-4">
                    <h3 className="text-lg font-bold leading-snug">
                      <span className="sr-only">Trin {i + 1}: </span>
                      {s.title}
                    </h3>
                    <p className="mt-1.5 text-[15px] leading-[1.55] text-[#CDD0CF]">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Kim */}
        <section id="om" className={`${wrap} grid items-start gap-8 py-14 sm:py-24 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16`}>
          <div className="flex max-w-[620px] flex-col gap-4">
            <p className={kicker}>Mester</p>
            <h2 className={h2}>Kim Nørbæk, klejnsmed</h2>
            <p className="leading-[1.65]">
              Jeg blev udlært i 1999 og startede for mig selv i 2006. Rasmus har været her siden 2012 og Jonas siden 2019. Vi laver mest til private: gelændere, trapper, altaner og låger. Store stålkonstruktioner til erhverv siger vi nej til. Dem er andre bedre til.
            </p>
            <p className="leading-[1.65]">Den, der svejser dit gelænder, er også den, der sætter det op. Passer noget ikke, er det os selv, vi skal snakke med.</p>
            <dl className="mt-3 grid grid-cols-[max-content_minmax(0,1fr)] gap-x-6 gap-y-2.5 border-t border-[#C6C8C2] pt-5 text-[15px] sm:text-base">
              <dt className="text-[#555A5E]">Værksted</dt>
              <dd>{ADDRESS}</dd>
              <dt className="text-[#555A5E]">Åbent</dt>
              <dd>Man–tors kl. 7–15.30, fre kl. 7–13</dd>
              <dt className="text-[#555A5E]">CVR</dt>
              <dd className={mono}>00 00 00 00 (eksempel)</dd>
              <dt className="text-[#555A5E]">Certificeret</dt>
              <dd>
                EN 1090, EXC2, til trapper og altaner <span className={`${mono} text-[13px] text-[#555A5E]`}>(eksempel)</span>
              </dd>
              <dt className="text-[#555A5E]">Kører til</dt>
              <dd>Silkeborg, Them, Kjellerup, Ry, Bryrup og Viborg</dd>
            </dl>
          </div>
          <figure className="flex items-end gap-3 sm:flex-col sm:items-stretch sm:gap-2.5 lg:pt-10">
            <Img id="1507497806295-753c4108560c" w={800} alt="Pladsholderfoto af en smed med svejsehjelm" className="aspect-square w-[140px] shrink-0 object-cover sm:aspect-[4/5] sm:w-full sm:max-w-[400px]" />
            <figcaption className={`${mono} text-[12px] leading-snug text-[#555A5E]`}>Pladsholderfoto · her kommer mesterens eget portræt</figcaption>
          </figure>
        </section>

        {/* Reviews */}
        <section className="border-t border-[#C6C8C2] bg-[#E5E6E1]">
          <div className={`${wrap} py-14 sm:py-24`}>
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 sm:mb-8">
              <h2 className={h2}>Det skriver kunderne</h2>
              <SampleReviewsNote className={`${mono} text-[12px]! text-[#555A5E]`} />
            </div>
            <div className="grid gap-x-12 md:grid-cols-2">
              {REVIEWS.map((r) => (
                <figure key={r.name} className="flex flex-col gap-2.5 border-t border-[#B5B8B2] py-6">
                  <p className={`${mono} flex flex-wrap items-center gap-x-3 text-[13px] text-[#555A5E]`}>
                    <Stars n={r.stars} className="text-[#B0381C]" />
                    <span>{r.date}</span>
                  </p>
                  <blockquote className="text-[17px] leading-[1.6]">{r.text}</blockquote>
                  <figcaption className="text-[15px] text-[#555A5E]">{r.name}</figcaption>
                  {r.reply && (
                    <p className="mt-1 border-l-2 border-[#B0381C] pl-3.5 text-[15px] leading-[1.55]">
                      <b className="font-bold">Svar fra Kim:</b> {r.reply}
                    </p>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Contact with drawing upload */}
        <section id="kontakt" className={`${wrap} grid scroll-mt-4 gap-10 py-14 sm:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16`}>
          <div className="flex max-w-[440px] flex-col gap-4">
            <p className={kicker}>Kontakt</p>
            <h2 className={h2}>Send mål, skitse eller et foto</h2>
            <p className="leading-[1.6]">Ring, hvis det er en reparation, eller hvis det haster. Skriv, hvis du har mål eller en tegning, så kan vi give et overslag med det samme.</p>
            <p className="text-[30px] font-extrabold tracking-[-0.01em]">
              <a href={TEL} className="whitespace-nowrap hover:text-[#B0381C]">
                {PHONE}
              </a>
            </p>
            <p className={`${mono} text-[13px] leading-relaxed text-[#555A5E]`}>
              Man–tors 7–15.30 · fre 7–13
              <br />
              {ADDRESS}
            </p>
          </div>
          <form
            className="flex max-w-[560px] flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(files.length ? files.join(", ") : "");
              setFiles([]);
              e.currentTarget.reset();
            }}
          >
            {sent !== null && (
              <p role="status" className="border-l-4 border-[#B0381C] bg-[#E5E6E1] p-4">
                Tak. På en rigtig side ville Kim kigge på {sent ? `din tegning (${sent})` : "dine mål"} og ringe dig op inden for to hverdage med et overslag. Dette er et eksempel, så der er ikke sendt noget.
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
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
              Postnummer
              <input required name="postnr" type="text" inputMode="numeric" maxLength={4} pattern="\d{4}" title="Fire cifre" autoComplete="postal-code" className={`${field} max-w-[160px]`} />
            </label>
            <label className={lbl}>
              Hvad skal laves?
              <textarea required name="opgave" rows={3} placeholder="Fx gelænder til terrasse, ca. 6 m, 1 m højt, antracitgrå" className={`${field} resize-y`} />
            </label>
            <div>
              <div className="relative border border-dashed border-[#8E9396] bg-white px-4 py-4 focus-within:border-[#1B1D1F] hover:border-[#1B1D1F]">
                <label htmlFor="norbaek-file" className="cursor-pointer text-[15px] font-bold after:absolute after:inset-0">
                  Vedhæft tegning, skitse eller foto
                </label>
                <p className={`${mono} mt-1 truncate text-[13px] text-[#555A5E]`}>{files.length ? files.join(", ") : "Valgfrit · PDF eller billede"}</p>
                <input id="norbaek-file" type="file" accept="image/*,.pdf" multiple aria-describedby="norbaek-file-hint" className="sr-only" onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((f) => f.name))} />
              </div>
              <p id="norbaek-file-hint" className="mt-2 text-[14px] leading-snug text-[#555A5E]">Et foto med en tommestok i billedet er nok til et overslag.</p>
            </div>
            <button type="submit" className={`${btn} inline-flex self-start px-6 py-4 text-lg`}>
              Send til værkstedet
            </button>
          </form>
        </section>
      </main>

      <footer className="bg-[#1D2023] pb-24 text-[#CDD0CF] sm:pb-0">
        <div className={`${wrap} flex flex-wrap justify-between gap-x-8 gap-y-3 py-10 text-[15px]`}>
          <span className="font-black uppercase tracking-[0.04em] text-[#ECEDEA]">Nørbæk Smedie</span>
          <span>{ADDRESS}</span>
          <span className={mono}>CVR 00 00 00 00 (eksempel)</span>
          <a href={TEL} className="text-[#ECEDEA] underline underline-offset-2">
            {PHONE}
          </a>
        </div>
      </footer>

      {/* Phone: call or send measurements */}
      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2.5 border-t border-[#3A3F43] bg-[#1D2023] px-4 pb-4 pt-3 sm:hidden">
        <a href={TEL} className="grid h-[52px] place-items-center whitespace-nowrap border border-[#ECEDEA] font-bold text-[#ECEDEA]">
          Ring til Kim
        </a>
        <a href="#kontakt" className={`${btn} flex h-[52px]`}>
          Send mål
        </a>
      </div>
    </div>
  );
}
