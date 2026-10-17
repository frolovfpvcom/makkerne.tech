"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import heroPhoto from "@/public/examples/maler-hero.jpg";
import { DemoNote, Img, SampleReviewsNote, Stars } from "./shared";

/*
 * Malerfirmaet Kulør, built like a colour card on a white wall: neutral paper and ink so the
 * customers' own colours carry the page, every finished room written down with its NCS code and
 * gloss level, and a calculator that prices a room from its measurements the way a painter would.
 * Masking tape is the one decoration. No cards, no shadows, no motion.
 */

const PHONE = "34 56 78 90";
const TEL = "tel:+4534567890";
const ADDRESS = "Svendborgvej 214, 5260 Odense S";

const display = "font-(family-name:--font-kulor-display)";

/** Colours from recent jobs. Hex values are screen approximations of the NCS codes. */
const ROOMS: {
  code: string;
  hex: string;
  dark: boolean;
  name: string;
  room: string;
  place: string;
  when: string;
  gloss: string;
  note: string;
  photo: string | null;
  alt: string;
}[] = [
  {
    code: "NCS S 5020-G30Y",
    hex: "#6F7A57",
    dark: true,
    name: "Mosgrøn",
    room: "Stue",
    place: "Hunderup",
    when: "september 2026",
    gloss: "Glans 5",
    note: "Kunden ville have en mørk stue uden at den blev tung. Vi lagde to prøver op på hver væg og kiggede på dem morgen og aften, før hun valgte.",
    photo: "1676136449197-babffb1125f0",
    alt: "Stue med grønne vægge og en gul sofa",
  },
  {
    code: "NCS S 1510-G10Y",
    hex: "#C8D3BE",
    dark: false,
    name: "Lys mynte",
    room: "Køkken-alrum",
    place: "Bolbro",
    when: "august 2026",
    gloss: "Glans 25",
    note: "Glans 25 i køkkenet, fordi væggen skal kunne tåle at blive vasket. Vægge og loft helspartlet først, 3 dage i alt.",
    photo: "1758945631095-fff5c72fa3ed",
    alt: "Stue med lyse mintgrønne vægge og billeder",
  },
  {
    code: "NCS S 3020-B",
    hex: "#8EA2B4",
    dark: false,
    name: "Dueblå",
    room: "Soveværelse",
    place: "Dalum",
    when: "juni 2026",
    gloss: "Glans 5",
    note: "Mat blå vægge og hvidt loft. Vi skiftede også fire gamle stikkontaktrammer, som var malet over flere gange.",
    photo: "1634207523205-cf9ef97a31d1",
    alt: "Soveværelse med blå vægge og en hvid seng",
  },
  {
    code: "NCS S 0502-Y",
    hex: "#F1EEE5",
    dark: false,
    name: "Varm hvid",
    room: "Hele 1. salen",
    place: "Fruens Bøge",
    when: "maj 2026",
    gloss: "Glans 5",
    note: "Tre værelser og en gang i et hus fra 1936. Revner over dørene blev skåret op og fyldt med elastisk fugemasse, før vi spartlede.",
    photo: "1774437290582-1e859402001f",
    alt: "Lyst soveværelse med en redt seng",
  },
  {
    code: "NCS S 7010-Y70R",
    hex: "#4C4541",
    dark: true,
    name: "Mørk umbra",
    room: "Kontor",
    place: "Odense C",
    when: "marts 2026",
    gloss: "Glans 10",
    note: "Mørke vægge og reoler i samme farve. Træværket fik glans 40, så det tåler bøger, der bliver taget ud og sat ind.",
    photo: "1767020990995-64203b0a9cb4",
    alt: "Mørkt rum med en stor reol og en sofa",
  },
  {
    code: "NCS S 0500-N",
    hex: "#F4F4F1",
    dark: false,
    name: "Loftshvid",
    room: "Lofter",
    place: "alle opgaverne",
    when: "",
    gloss: "Glans 2",
    note: "Den hvide, vi bruger på lofter, hvis du ikke vælger andet. Helt mat, så samlinger og lys fra vinduet ikke kaster skygger.",
    photo: null,
    alt: "",
  },
];

/** Prices per m², incl. moms and paint, two coats. The firm's own list. */
const WALL = { 5: 95, 10: 95, 25: 115 } as const;
type Gloss = keyof typeof WALL;
const GLOSS: { value: Gloss; label: string; where: string }[] = [
  { value: 5, label: "Glans 5", where: "Stue og soveværelse. Mat og roligt." },
  { value: 10, label: "Glans 10", where: "Gang og børneværelse. Tåler en klud." },
  { value: 25, label: "Glans 25", where: "Køkken og bryggers. Kan vaskes." },
];
const FILL = [
  { label: "Ingen", where: "Væggene er hele", rate: 0 },
  { label: "Pletspartling", where: "Huller efter søm og små revner", rate: 35 },
  { label: "Helspartling", where: "Ujævne vægge eller efter tapet", rate: 145 },
];
const CEILING = 115;
const DOOR = 1150;
const SETUP = 900;

const PRICES: { what: string; note?: string; price: string }[] = [
  { what: "Opmåling og farveprøver", note: "trækkes fra, hvis du siger ja", price: "450 kr." },
  { what: "Timepris, malersvend", price: "545 kr." },
  { what: "Dør med karm, begge sider", price: "1.150 kr." },
  { what: "Vindue indvendigt, med kitning", price: "650–900 kr." },
  { what: "Facade og udvendigt træværk", note: "afhænger af stillads og stand", price: "Efter opmåling" },
];

const REVIEWS: { stars: number; date: string; text: string; name: string; reply?: string }[] = [
  { stars: 5, date: "22. sep. 2026", text: "Søren tog prøver med ud og satte dem op på væggen i stedet for at vise os en vifte. Det gjorde det meget lettere at vælge.", name: "Signe, Hunderup" },
  {
    stars: 4,
    date: "18. aug. 2026",
    text: "Flot arbejde i køkkenet. Men vi fik ikke at vide, at spartelmassen skulle tørre en ekstra dag, så vi var uden køkken længere end planlagt.",
    name: "Morten, Bolbro",
    reply: "Det skulle vi have sagt fra starten. Nu står tørretiden i tilbuddet, når der skal helspartles.",
  },
  { stars: 5, date: "30. jun. 2026", text: "Alt blev dækket af, også klaveret. Og vi fik et lille kort med farverne, så vi kan købe den rigtige maling til pletterne.", name: "Hanne og Ole, Dalum" },
  { stars: 5, date: "12. maj 2026", text: "Prisen var den, der stod i tilbuddet. De var færdige en dag før.", name: "Jakob, Fruens Bøge" },
];

const NAV = [
  ["#farver", "Farver"],
  ["#pris", "Pris på et rum"],
  ["#om", "Om os"],
  ["#kontakt", "Kontakt"],
] as const;

const kr = (n: number) => `${(Math.round(n / 100) * 100).toLocaleString("da-DK")} kr.`;
const num = (s: string) => Math.max(0, Number(s.replace(",", ".")) || 0);

const wrap = "mx-auto max-w-[1180px] px-4 sm:px-8";
const h2 = `${display} text-[32px] font-semibold leading-[1.05] tracking-[-0.025em] sm:text-[44px]`;
const btn = "items-center justify-center whitespace-nowrap rounded-[2px] bg-[#22211F] font-semibold text-[#FAF9F6] transition-colors hover:bg-[#3A3835]";
const field = "w-full rounded-[2px] border border-[#B4AFA6] bg-white px-3 py-2.5 text-base text-[#22211F] placeholder:text-[#8C877E]";
/** A strip of paper masking tape with torn ends. */
const tape = "bg-[#E6DDBE] [clip-path:polygon(0_8%,3%_0,97%_6%,100%_0,99%_92%,96%_100%,2%_94%,0_100%)]";

export function MalerSite() {
  const [pick, setPick] = useState(0);
  const [menu, setMenu] = useState(false);
  const [len, setLen] = useState("4,5");
  const [wid, setWid] = useState("3,5");
  const [hgt, setHgt] = useState("2,5");
  const [ceiling, setCeiling] = useState(true);
  const [gloss, setGloss] = useState<Gloss>(5);
  const [fill, setFill] = useState(1);
  const [doors, setDoors] = useState(1);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const L = num(len);
  const B = num(wid);
  const H = num(hgt);
  // Walls minus roughly a tenth for doors and windows.
  const walls = Math.round(2 * (L + B) * H * 0.9);
  const ceil = Math.round(L * B);
  const lines: [string, string, number][] = [
    ["Vægge, 2 lag", `${walls} m² × ${WALL[gloss]} kr.`, walls * WALL[gloss]],
    ...(ceiling ? ([["Loft, 2 lag", `${ceil} m² × ${CEILING} kr.`, ceil * CEILING]] as [string, string, number][]) : []),
    ...(FILL[fill].rate ? ([[FILL[fill].label, `${walls} m² × ${FILL[fill].rate} kr.`, walls * FILL[fill].rate]] as [string, string, number][]) : []),
    ...(doors ? ([[`${doors === 1 ? "Dør" : "Døre"} med karm`, `${doors} × ${DOOR.toLocaleString("da-DK")} kr.`, doors * DOOR]] as [string, string, number][]) : []),
    ["Afdækning og oprydning", "pr. rum", SETUP],
  ];
  const total = lines.reduce((s, l) => s + l[2], 0);
  const valid = L > 0 && B > 0 && H > 0 && L <= 15 && B <= 15 && H <= 5;
  const days = Math.max(1, Math.ceil(total / 5500)) + (fill === 2 ? 1 : 0);
  const room = ROOMS[pick];

  const useNumbers = () => {
    setMessage(
      `Et rum på ca. ${len} × ${wid} m, ${hgt} m til loftet. Vægge i glans ${gloss}${ceiling ? " og loft" : ""}, ${FILL[fill].label.toLowerCase()}, ${doors} ${doors === 1 ? "dør" : "døre"}. Beregneren sagde ca. ${kr(total * 0.9)} til ${kr(total * 1.1)}.`,
    );
    document.getElementById("kontakt")?.scrollIntoView();
    document.getElementById("kulor-besked")?.focus({ preventScroll: true });
  };

  return (
    <div className="min-h-dvh overflow-x-clip bg-[#FAF9F6] font-(family-name:--font-kulor) text-[#22211F] [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-[#22211F]">
      <DemoNote className="bg-[#22211F] text-[#D9D5CC]" />

      <header className="relative z-40 border-b border-[#DDD9D0] bg-[#FAF9F6] sm:sticky sm:top-0">
        <div className={`${wrap} flex items-center justify-between gap-4 py-3`}>
          <a href="#top" className="flex min-w-0 flex-col leading-tight">
            <span className={`${display} whitespace-nowrap text-[22px] font-bold tracking-[-0.02em] sm:text-2xl`}>Kulør</span>
            <span className="whitespace-nowrap text-xs text-[#66625A]">Malerfirma i Odense · siden 1998</span>
          </a>
          <nav aria-label="Hovedmenu" className="hidden gap-7 whitespace-nowrap text-[15px] font-medium lg:flex">
            {NAV.map(([href, label]) => (
              <a key={href} href={href} className="underline-offset-4 hover:underline">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-4">
            <a href={TEL} className="hidden whitespace-nowrap font-semibold sm:inline">
              {PHONE}
            </a>
            <a href="#kontakt" className={`${btn} hidden px-5 py-2.5 md:inline-flex`}>
              Book opmåling
            </a>
            <button
              type="button"
              aria-label={menu ? "Luk menu" : "Åbn menu"}
              aria-expanded={menu}
              aria-controls="kulor-menu"
              onClick={() => setMenu((m) => !m)}
              className="grid size-11 place-items-center rounded-[2px] border border-[#B4AFA6] lg:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
        {menu && (
          <nav id="kulor-menu" aria-label="Menu" className="border-t border-[#DDD9D0] lg:hidden">
            <ul className={`${wrap} py-2`}>
              {NAV.map(([href, label]) => (
                <li key={href}>
                  <a href={href} onClick={() => setMenu(false)} className="block border-b border-[#DDD9D0] py-3.5 text-lg font-medium">
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
        {/* Hero: what we do and what you get afterwards, beside the painter */}
        <section id="top" className={`${wrap} grid gap-8 pb-14 pt-6 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-16 lg:pb-24 lg:pt-16`}>
          <div className="flex flex-col gap-6 lg:pt-6">
            <h1 className={`${display} max-w-[15ch] text-[42px] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[60px] lg:text-[72px]`}>
              Vi maler. Du får farverne skrevet ned.
            </h1>
            <p className="max-w-[46ch] text-lg leading-[1.55] text-[#3D3A35] sm:text-xl">
              Indvendigt og udvendigt i Odense og omegn. Når vi går, får du et kort med farvekode og glans for hvert rum, så du kan købe den rigtige maling, når der skal tages en plet.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href="#kontakt" className={`${btn} inline-flex px-6 py-4 text-[17px]`}>
                Book opmåling
              </a>
              <p className="text-[#66625A]">
                eller ring{" "}
                <a href={TEL} className="whitespace-nowrap font-semibold text-[#22211F] underline underline-offset-2">
                  {PHONE}
                </a>
                , hverdage 7–16
              </p>
            </div>
            <dl className="mt-2 grid max-w-[560px] gap-x-8 gap-y-3 border-t border-[#DDD9D0] pt-5 text-[15px] sm:grid-cols-2">
              <div>
                <dt className="text-[#66625A]">Opmåling hjemme hos dig</dt>
                <dd className="font-semibold">450 kr. inkl. moms, trækkes fra</dd>
              </div>
              <div>
                <dt className="text-[#66625A]">Vi kan starte</dt>
                <dd className="font-semibold">Om ca. 2 uger</dd>
              </div>
            </dl>
          </div>
          <figure className="relative max-lg:-mx-4 max-lg:order-first sm:max-lg:mx-0 sm:max-lg:max-w-[420px]">
            <Image
              src={heroPhoto}
              alt="Maler i hvidt arbejdstøj med malerrulle og spand foran et hvidt hus og en varevogn"
              sizes="(min-width: 1024px) 420px, (min-width: 640px) 420px, 100vw"
              priority
              fetchPriority="high"
              loading="eager"
              className="aspect-[4/5] w-full object-cover object-[50%_25%] max-sm:aspect-[5/4] sm:rounded-[2px]"
            />
            <figcaption className={`${tape} absolute -bottom-3 left-5 rotate-[-1.5deg] px-4 py-2 text-[13px] text-[#3D3A35]`}>
              Pladsholderfoto · her kommer mesterens eget portræt
            </figcaption>
          </figure>
        </section>

        {/* The colour card: recent rooms with their codes */}
        <section id="farver" className="scroll-mt-20 border-y border-[#DDD9D0] bg-white">
          <div className={`${wrap} py-14 sm:py-20`}>
            <div className="flex flex-col gap-3">
              <h2 className={h2}>Farver fra de seneste opgaver</h2>
              <p className="max-w-[60ch] text-[17px] leading-[1.55] text-[#3D3A35]">
                Det står på kortet, kunden fik. Tryk på en farve for at se rummet. Farverne på skærmen er kun omtrentlige, så se altid en prøve på din egen væg.
              </p>
            </div>

            <div role="group" aria-label="Vælg en farve" className="mt-8 grid grid-cols-3 border border-[#DDD9D0] sm:grid-cols-6">
              {ROOMS.map((r, i) => (
                <div key={r.code} className={`flex flex-col ${i % 3 ? "border-l" : ""} ${i >= 3 ? "max-sm:border-t" : ""} ${i ? "sm:border-l" : ""} border-[#DDD9D0] ${pick === i ? "bg-[#F1EFEA]" : ""}`}>
                  <button type="button" aria-pressed={pick === i} onClick={() => setPick(i)} className="group flex flex-col text-left">
                    <span
                      className={`relative block h-24 w-full border-b border-[#DDD9D0] sm:h-36 ${pick === i ? `after:absolute after:left-2 after:top-2 after:h-1.5 after:w-8 ${r.dark ? "after:bg-[#FAF9F6]" : "after:bg-[#22211F]"}` : ""}`}
                      style={{ background: r.hex }}
                    />
                    <span className="truncate whitespace-nowrap px-2.5 pt-2.5 text-sm font-semibold group-hover:underline sm:px-3 sm:text-[15px]">{r.name}</span>
                  </button>
                  <p className="px-2.5 pb-2.5 text-[11px] tabular-nums leading-snug text-[#66625A] sm:px-3 sm:text-xs">{r.code.replace("NCS ", "")}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-12" aria-live="polite">
              {room.photo ? (
                <Img id={room.photo} w={1200} alt={room.alt} className="aspect-[3/2] w-full rounded-[2px] object-cover" />
              ) : (
                <div className="grid aspect-[3/2] w-full place-items-center rounded-[2px] border border-[#DDD9D0]" style={{ background: room.hex }}>
                  <span className="text-sm text-[#66625A]">Lofter fotograferer sig dårligt</span>
                </div>
              )}
              <div className="flex flex-col gap-4">
                <p className="text-sm text-[#66625A]">
                  {room.room}, {room.place}
                  {room.when && ` · ${room.when}`}
                </p>
                <h3 className={`${display} text-[30px] font-semibold leading-tight tracking-[-0.02em]`}>{room.name}</h3>
                <dl className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-6 gap-y-2 border-y border-[#DDD9D0] py-4 text-[15px]">
                  <dt className="text-[#66625A]">Farvekode</dt>
                  <dd className="font-semibold tabular-nums">{room.code}</dd>
                  <dt className="text-[#66625A]">Glans</dt>
                  <dd className="font-semibold">{room.gloss}</dd>
                </dl>
                <p className="max-w-[48ch] leading-[1.6] text-[#3D3A35]">{room.note}</p>
              </div>
            </div>
            <p className="mt-6 text-[13px] text-[#66625A]">Fotos fra Unsplash som pladsholdere, og farverne i dem passer ikke præcist til koderne. På din side bruger vi dine egne billeder fra opgaverne.</p>
          </div>
        </section>

        {/* Calculator: one room from its measurements */}
        <section id="pris" className={`${wrap} grid scroll-mt-20 gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16`}>
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-3">
              <h2 className={h2}>Hvad koster et rum?</h2>
              <p className="max-w-[48ch] text-[17px] leading-[1.55] text-[#3D3A35]">
                Mål rummet op med en tommestok. Vi regner, som vi gør, når vi står hos dig, bare uden at have set væggene.
              </p>
            </div>

            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 font-semibold">Rummets mål i meter</legend>
              <div className="grid grid-cols-3 gap-3">
                {(
                  [
                    ["Længde", len, setLen],
                    ["Bredde", wid, setWid],
                    ["Til loftet", hgt, setHgt],
                  ] as const
                ).map(([label, v, set]) => (
                  <label key={label} className="flex flex-col gap-1 text-sm text-[#66625A]">
                    {label}
                    <input inputMode="decimal" value={v} onChange={(e) => set(e.target.value.replace(/[^\d,.]/g, ""))} className={`${field} tabular-nums`} />
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-2 font-semibold">Glans på væggene</legend>
              <div className="flex flex-col border-t border-[#DDD9D0]">
                {GLOSS.map((g) => (
                  <div key={g.value} className="flex flex-wrap items-baseline gap-x-3 border-b border-[#DDD9D0] py-2.5">
                    <label className="flex w-[104px] shrink-0 cursor-pointer items-baseline gap-3 whitespace-nowrap font-medium">
                      <input type="radio" name="glans" checked={gloss === g.value} onChange={() => setGloss(g.value)} aria-describedby={`glans-${g.value}`} className="translate-y-0.5 accent-[#22211F]" />
                      {g.label}
                    </label>
                    <p id={`glans-${g.value}`} className="text-[15px] text-[#66625A] max-sm:basis-full max-sm:pl-[25px]">
                      {g.where}
                    </p>
                  </div>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-2 font-semibold">Spartling</legend>
              <div className="flex flex-col border-t border-[#DDD9D0]">
                {FILL.map((f, i) => (
                  <div key={f.label} className="flex flex-wrap items-baseline gap-x-3 border-b border-[#DDD9D0] py-2.5">
                    <label className="flex w-[140px] shrink-0 cursor-pointer items-baseline gap-3 whitespace-nowrap font-medium">
                      <input type="radio" name="spartel" checked={fill === i} onChange={() => setFill(i)} aria-describedby={`spartel-${i}`} className="translate-y-0.5 accent-[#22211F]" />
                      {f.label}
                    </label>
                    <p id={`spartel-${i}`} className="text-[15px] text-[#66625A] max-sm:basis-full max-sm:pl-[25px]">
                      {f.where}
                    </p>
                  </div>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <label className="flex cursor-pointer items-center gap-2.5 font-medium">
                <input type="checkbox" checked={ceiling} onChange={(e) => setCeiling(e.target.checked)} className="size-4 accent-[#22211F]" />
                Loftet skal også males
              </label>
              <div className="flex items-center gap-3">
                <span id="kulor-doors" className="font-medium">
                  Døre
                </span>
                <div role="group" aria-labelledby="kulor-doors" className="flex items-center border border-[#B4AFA6]">
                  <button type="button" aria-label="Færre døre" onClick={() => setDoors((d) => Math.max(0, d - 1))} className="grid size-10 place-items-center text-lg">
                    −
                  </button>
                  <span className="w-8 text-center font-semibold tabular-nums" aria-live="polite">
                    {doors}
                  </span>
                  <button type="button" aria-label="Flere døre" onClick={() => setDoors((d) => Math.min(6, d + 1))} className="grid size-10 place-items-center text-lg">
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* The worksheet: line by line, like the offer you would get */}
          <div className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
            <div className="border border-[#22211F] bg-white">
              <p className="border-b border-[#22211F] px-5 py-3 text-sm font-semibold">Overslag på ét rum</p>
              {valid ? (
                <>
                  <table className="w-full border-collapse text-[15px]">
                    <caption className="sr-only">Overslag linje for linje</caption>
                    <tbody>
                      {lines.map(([what, calc, sum]) => (
                        <tr key={what} className="border-b border-[#DDD9D0]">
                          <th scope="row" className="px-5 py-2.5 text-left align-top font-medium">
                            {what}
                            <span className="block text-[13px] font-normal tabular-nums text-[#66625A]">{calc}</span>
                          </th>
                          <td className="whitespace-nowrap px-5 py-2.5 text-right align-top tabular-nums">{sum.toLocaleString("da-DK")} kr.</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 pb-2 pt-4">
                    <span className="font-semibold">Typisk pris</span>
                    <span className={`${display} whitespace-nowrap text-[28px] font-semibold tabular-nums tracking-[-0.02em] sm:text-[32px]`}>
                      {kr(total * 0.9)} – {kr(total * 1.1)}
                    </span>
                  </div>
                  <p className="px-5 pb-5 text-sm text-[#66625A]">
                    Inkl. moms og maling. Ca. {days} {days === 1 ? "arbejdsdag" : "arbejdsdage"} for én maler{fill === 2 && ", fordi spartlen skal tørre"}.
                  </p>
                </>
              ) : (
                <p className="px-5 py-8 text-[#66625A]">Skriv rummets mål i meter, fx 4,5. Rum over 15 meter regner vi på, når vi har set dem.</p>
              )}
            </div>
            <button type="button" disabled={!valid} onClick={useNumbers} className={`${btn} inline-flex self-start px-6 py-3.5 disabled:opacity-40`}>
              Send målene med i en besked
            </button>
            <p className="text-sm leading-normal text-[#66625A]">
              Almindeligt malerarbejde giver ikke håndværkerfradrag i 2026. Se reglerne på skat.dk.
            </p>
          </div>
        </section>

        {/* Price list, the master and the facts */}
        <section id="om" className="scroll-mt-20 bg-[#22211F] text-[#FAF9F6] [&_:focus-visible]:outline-[#FAF9F6]">
          <div className={`${wrap} grid gap-12 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16`}>
            <div className="flex flex-col gap-5">
              <h2 className={h2}>Søren Kragh, malermester</h2>
              <p className="max-w-[52ch] text-[17px] leading-[1.6] text-[#D9D5CC]">
                Jeg overtog firmaet efter min far i 2014. Vi er fire malere og en lærling, og det er os selv, der maler. Vi tager ikke opgaver, hvor vi skal leje folk ind.
              </p>
              <p className="max-w-[52ch] text-[17px] leading-[1.6] text-[#D9D5CC]">
                Om vinteren maler vi mest indenfor. Facader og vinduer tager vi fra april til september, når træet er tørt.
              </p>
              <dl className="mt-3 grid grid-cols-[max-content_minmax(0,1fr)] gap-x-6 gap-y-2.5 border-t border-[#4A4743] pt-5 text-[15px]">
                <dt className="text-[#A8A399]">Adresse</dt>
                <dd>{ADDRESS}</dd>
                <dt className="text-[#A8A399]">Telefon</dt>
                <dd>
                  <a href={TEL} className="underline underline-offset-2">
                    {PHONE}
                  </a>
                  , man–fre kl. 7–16
                </dd>
                <dt className="text-[#A8A399]">CVR</dt>
                <dd>00 00 00 00 (eksempel)</dd>
                <dt className="text-[#A8A399]">Medlem af</dt>
                <dd>Danske Malermestre (eksempel)</dd>
                <dt className="text-[#A8A399]">Område</dt>
                <dd>Odense, Kerteminde, Nyborg og Faaborg</dd>
              </dl>
            </div>
            <table className="w-full self-start border-collapse">
              <caption className="pb-3 text-left text-sm text-[#A8A399]">Vejledende priser inkl. moms, oktober 2026</caption>
              <tbody>
                {PRICES.map((p) => (
                  <tr key={p.what} className="border-y border-[#4A4743]">
                    <th scope="row" className="py-3.5 pr-4 text-left align-top font-medium">
                      {p.what}
                      {p.note && <span className="block text-sm font-normal text-[#A8A399]">{p.note}</span>}
                    </th>
                    <td className="whitespace-nowrap py-3.5 text-right align-top tabular-nums">{p.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Reviews */}
        <section className={`${wrap} grid gap-8 py-14 sm:py-20 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-16`}>
          <div className="flex flex-col gap-3">
            <h2 className={h2}>Det skriver kunderne</h2>
            <SampleReviewsNote className="text-[#66625A]" />
          </div>
          <ul className="flex flex-col">
            {REVIEWS.map((r) => (
              <li key={r.name} className="grid gap-2 border-t border-[#DDD9D0] py-6 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-6">
                <p className="flex gap-3 text-sm text-[#66625A] sm:flex-col sm:gap-1">
                  <Stars n={r.stars} className="text-[#22211F]" />
                  <span>{r.date}</span>
                </p>
                <figure className="flex flex-col gap-2">
                  <blockquote className="max-w-[60ch] text-[17px] leading-[1.6]">{r.text}</blockquote>
                  <figcaption className="text-[15px] text-[#66625A]">{r.name}</figcaption>
                  {r.reply && (
                    <p className="mt-1 max-w-[60ch] border-l-2 border-[#B4AFA6] pl-3.5 text-[15px] leading-[1.55] text-[#3D3A35]">
                      <b className="font-semibold">Svar fra Søren:</b> {r.reply}
                    </p>
                  )}
                </figure>
              </li>
            ))}
          </ul>
        </section>

        {/* Contact */}
        <section id="kontakt" className="scroll-mt-20 border-t border-[#DDD9D0] bg-white">
          <div className={`${wrap} grid gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16`}>
            <div className="flex flex-col gap-4">
              <h2 className={h2}>Skal vi komme og måle op?</h2>
              <p className="max-w-[44ch] text-[17px] leading-[1.6] text-[#3D3A35]">
                Ring, hvis du har spørgsmål. Skriv, hvis du vil have en tid. Vi tager farveprøver med, så du kan se dem på dine egne vægge.
              </p>
              <p className={`${display} text-[30px] font-semibold`}>
                <a href={TEL} className="whitespace-nowrap underline-offset-4 hover:underline">
                  {PHONE}
                </a>
              </p>
              <p className="text-sm text-[#66625A]">Man–fre kl. 7–16 · {ADDRESS}</p>
            </div>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
                setMessage("");
                e.currentTarget.reset();
              }}
            >
              {sent && (
                <p role="status" className="border-l-4 border-[#22211F] bg-[#F1EFEA] p-4 leading-normal">
                  Tak. På en rigtig side ville Søren ringe dig op inden for en hverdag og aftale en tid til opmåling. Dette er et eksempel, så der er ikke sendt noget.
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
              <label className="flex flex-col gap-1.5 text-[15px] font-medium">
                Adresse, hvor der skal males
                <input required name="adresse" autoComplete="street-address" placeholder="Fx Hunderupvej 40, 5230 Odense M" className={field} />
              </label>
              <label className="flex flex-col gap-1.5 text-[15px] font-medium">
                Hvad skal males?
                <textarea
                  id="kulor-besked"
                  required
                  name="besked"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Fx stue og gang, vægge og loft. Der er revner over døren."
                  className={`${field} resize-y`}
                />
              </label>
              <button type="submit" className={`${btn} inline-flex self-start px-6 py-3.5 text-[17px]`}>
                Send forespørgsel
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#DDD9D0] pb-24 sm:pb-0">
        <div className={`${wrap} flex flex-wrap justify-between gap-x-8 gap-y-2 py-8 text-sm text-[#66625A]`}>
          <span className="font-semibold text-[#22211F]">Malerfirmaet Kulør</span>
          <span>{ADDRESS}</span>
          <span>CVR 00 00 00 00 (eksempel)</span>
          <a href={TEL} className="text-[#22211F] underline underline-offset-2">
            {PHONE}
          </a>
        </div>
      </footer>

      {/* Phone: call or book, always within thumb's reach */}
      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2.5 border-t border-[#DDD9D0] bg-[#FAF9F6] px-4 pb-4 pt-3 sm:hidden">
        <a href={TEL} className="grid h-[52px] place-items-center whitespace-nowrap rounded-[2px] border border-[#22211F] font-semibold">
          Ring til Søren
        </a>
        <a href="#kontakt" className={`${btn} inline-flex h-[52px]`}>
          <span className="min-[360px]:hidden">Book tid</span>
          <span className="hidden min-[360px]:inline">Book opmåling</span>
        </a>
      </div>
    </div>
  );
}
