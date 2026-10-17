"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import painterPhoto from "@/public/examples/maler-hero.jpg";
import { DemoNote, Img } from "./shared";

/*
 * Malerfirmaet Kulør in Odense, set like a home magazine: a fine Bodoni over warm white walls,
 * finished rooms large, and the colour written next to each one so you can buy it again. The
 * page takes its tones from the rooms: one dark spread in the umbra of an office, the calculator
 * on pale plaster. Chips only where a colour code is the point.
 */

const PHONE = "34 56 78 90";
const TEL = "tel:+4534567890";
const ADDRESS = "Svendborgvej 214, 5260 Odense S";

const NAV = [
  ["#rum", "Rum"],
  ["#pris", "Pris på et rum"],
  ["#kontakt", "Kontakt"],
] as const;

type Room = { place: string; room: string; code: string; name: string; hex: string; gloss: string; before: string; text: string; photo: string; alt: string };

const HUNDERUP: Room = {
  place: "Hunderup",
  room: "Stue",
  code: "NCS S 5020-G30Y",
  name: "Mosgrøn",
  hex: "#6F7A57",
  gloss: "glans 5",
  before: "Tapet med gule striber",
  text: "Hun ville have en mørk stue, der ikke blev tung. Vi malede to prøver op på hver væg og så på dem morgen og aften, før hun valgte.",
  photo: "1676136449197-babffb1125f0",
  alt: "Stue med grønne vægge og en gul sofa",
};

const PAIR: Room[] = [
  {
    place: "Bolbro",
    room: "Køkken-alrum",
    code: "NCS S 1510-G10Y",
    name: "Lys mynte",
    hex: "#C8D3BE",
    gloss: "glans 25",
    before: "Hvid, glans 5",
    text: "Glans 25, så væggen bag spisebordet kan vaskes. Vægge og loft blev helspartlet først.",
    photo: "1758945631095-fff5c72fa3ed",
    alt: "Stue med lyse mintgrønne vægge og billeder",
  },
  {
    place: "Dalum",
    room: "Soveværelse",
    code: "NCS S 3020-B",
    name: "Dueblå",
    hex: "#8EA2B4",
    gloss: "glans 5",
    before: "Brækket hvid",
    text: "Mat blå vægge og hvidt loft. Fire stikkontaktrammer, der var malet over flere gange, blev skiftet.",
    photo: "1634207523205-cf9ef97a31d1",
    alt: "Soveværelse med blå vægge og en hvid seng",
  },
];

const UMBRA: Room = {
  place: "Odense C",
  room: "Kontor",
  code: "NCS S 7010-Y70R",
  name: "Mørk umbra",
  hex: "#4C4541",
  gloss: "glans 10",
  before: "Hvide vægge, fyrretræsreoler",
  text: "Vægge og reoler i samme farve, så rummet bliver roligt. Reolerne fik glans 40, så de tåler bøger, der bliver taget ud og sat ind.",
  photo: "1767020990995-64203b0a9cb4",
  alt: "Mørkt rum med en stor reol og en sofa",
};

/** Prices per m², incl. moms and paint, two coats. */
const WALL = { 5: 95, 10: 95, 25: 115 } as const;
type Gloss = keyof typeof WALL;
const GLOSS: { value: Gloss; where: string }[] = [
  { value: 5, where: "Stue og soveværelse" },
  { value: 10, where: "Gang og børneværelse" },
  { value: 25, where: "Køkken og bryggers" },
];
const FILL = [
  { label: "Ingen", rate: 0 },
  { label: "Pletspartling", rate: 35 },
  { label: "Helspartling", rate: 145 },
];
const CEILING = 115;
const DOOR = 1150;
const SETUP = 900;

const PRICES: { what: string; price: string }[] = [
  { what: "Opmåling og farveprøver", price: "450 kr." },
  { what: "Timepris, malersvend", price: "545 kr." },
  { what: "Vindue indvendigt, med kitning", price: "650–900 kr." },
  { what: "Facade og udvendigt træværk", price: "Efter opmåling" },
];

const kr = (n: number) => `${(Math.round(n / 100) * 100).toLocaleString("da-DK")} kr.`;
const num = (s: string) => Math.max(0, Number(s.replace(",", ".")) || 0);

// Warm white #FBF8F3, ink #22201E, warm grey #6B6660, plaster #F1E4DA; the rooms bring the rest.
const wrap = "mx-auto w-full max-w-[1320px] px-5 sm:px-10";
const serif = "font-(family-name:--font-kulor-serif)";
const h2 = `${serif} text-[38px] font-medium leading-[1.05] tracking-[-0.02em] sm:text-[52px]`;
const btn = "inline-flex items-center justify-center whitespace-nowrap bg-[#22201E] font-semibold text-[#FBF8F3] transition-colors hover:bg-[#45413C]";
const field = "w-full border-0 border-b border-[#22201E]/40 bg-transparent px-0 py-2 text-lg text-[#22201E] placeholder:text-[#6B6660] focus:border-[#22201E] focus:outline-none";
const seg = (on: boolean) =>
  `flex min-h-11 cursor-pointer items-center justify-center whitespace-nowrap border px-3 text-[15px] font-medium transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-[#22201E] ${
    on ? "border-[#22201E] bg-[#22201E] text-[#FBF8F3]" : "border-[#22201E]/25 hover:border-[#22201E]"
  }`;

/** The colour as it was written on the job card, with a chip because the code is the point. */
function Colour({ room, dark = false }: { room: Room; dark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span aria-hidden className={`size-10 shrink-0 border ${dark ? "border-white/30" : "border-[#22201E]/15"}`} style={{ background: room.hex }} />
      <p className="text-[14px] leading-snug">
        <span className="font-semibold">{room.name}</span>, {room.gloss}
        <span className={`block tabular-nums ${dark ? "text-[#CFC6BE]" : "text-[#6B6660]"}`}>{room.code}</span>
      </p>
    </div>
  );
}

function RoomText({ room, dark = false, className = "" }: { room: Room; dark?: boolean; className?: string }) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <p className={`text-[13px] font-medium uppercase tracking-[0.12em] ${dark ? "text-[#CFC6BE]" : "text-[#6B6660]"}`}>
        {room.room} · {room.place}
      </p>
      <p className={`${serif} text-[24px] leading-[1.3] sm:text-[28px]`}>{room.text}</p>
      <p className={`text-[15px] ${dark ? "text-[#CFC6BE]" : "text-[#6B6660]"}`}>Før: {room.before.toLowerCase()}</p>
      <Colour room={room} dark={dark} />
    </div>
  );
}

export function MalerSite() {
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

  const useNumbers = () => {
    setMessage(
      `Et rum på ca. ${len} × ${wid} m, ${hgt} m til loftet. Vægge i glans ${gloss}${ceiling ? " og loft" : ""}, ${FILL[fill].label.toLowerCase()}, ${doors} ${doors === 1 ? "dør" : "døre"}. Beregneren sagde ca. ${kr(total * 0.9)} til ${kr(total * 1.1)}.`,
    );
    document.getElementById("kontakt")?.scrollIntoView();
    document.getElementById("kulor-besked")?.focus({ preventScroll: true });
  };

  return (
    <div className="min-h-dvh overflow-x-clip bg-[#FBF8F3] font-(family-name:--font-kulor) text-[#22201E] [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-[#22201E]">
      <DemoNote className="bg-[#22201E] text-[#DDD6CD]" />

      {/* A masthead: the name in the middle, like the cover of a home magazine */}
      <header className="border-b border-[#22201E]/12">
        <div className={`${wrap} flex items-center justify-between gap-4 py-4 sm:py-5 lg:grid lg:grid-cols-[1fr_auto_1fr]`}>
          <nav aria-label="Hovedmenu" className="hidden gap-8 text-[15px] font-medium lg:flex">
            {NAV.map(([href, label]) => (
              <a key={href} href={href} className="underline-offset-[6px] hover:underline">
                {label}
              </a>
            ))}
          </nav>
          <a href="#top" className="flex flex-col leading-none lg:items-center">
            <span className={`${serif} text-[32px] font-medium tracking-[-0.01em] sm:text-[40px]`}>Kulør</span>
            <span className="mt-1 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.16em] text-[#6B6660]">Malerfirma i Odense</span>
          </a>
          <div className="flex items-center justify-end gap-5">
            <a href={TEL} className="hidden whitespace-nowrap font-semibold sm:inline">
              {PHONE}
            </a>
            <button
              type="button"
              aria-label={menu ? "Luk menu" : "Åbn menu"}
              aria-expanded={menu}
              aria-controls="kulor-menu"
              onClick={() => setMenu((m) => !m)}
              className="-mr-2 grid size-11 place-items-center lg:hidden"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 9h18M3 15h18" />}
              </svg>
            </button>
          </div>
        </div>
        {menu && (
          <nav id="kulor-menu" aria-label="Menu" className="border-t border-[#22201E]/12 lg:hidden">
            <ul className={`${wrap} py-3`}>
              {NAV.map(([href, label]) => (
                <li key={href}>
                  <a href={href} onClick={() => setMenu(false)} className={`${serif} block py-3 text-[30px]`}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      <main>
        {/* One finished room, large, and the sample patches that came before it */}
        <section id="top" className={`${wrap} grid gap-10 pb-24 pt-8 sm:pt-12 lg:grid-cols-12 lg:gap-x-10 lg:pb-32 lg:pt-14`}>
          <figure className="-mx-5 sm:mx-0 lg:col-span-7 lg:row-span-2">
            <Img priority id={HUNDERUP.photo} w={1800} alt={HUNDERUP.alt} className="aspect-[4/5] w-full object-cover sm:aspect-[5/4] lg:aspect-[4/5]" />
            <figcaption className="mt-4 px-5 sm:px-0">
              <Colour room={HUNDERUP} />
            </figcaption>
          </figure>
          <div className="flex flex-col max-lg:order-first lg:col-span-5 lg:col-start-8 lg:pt-6">
            <h1 className={`${serif} text-[44px] font-medium leading-[1.04] tracking-[-0.025em] sm:text-[64px] lg:text-[clamp(52px,4.8vw,72px)]`}>
              Vi maler prøven op på din væg, før du vælger.
            </h1>
            <p className="mt-6 max-w-[36ch] text-lg leading-[1.55] sm:text-xl">
              Indvendigt, træværk og facader i Odense og omegn. Opmåling og farveprøver koster 450 kr. og trækkes fra, hvis vi maler.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href="#kontakt" className={`${btn} h-14 px-7 text-[17px]`}>
                Book opmåling og prøver
              </a>
              <a href={TEL} className="whitespace-nowrap font-semibold underline underline-offset-4">
                {PHONE}
              </a>
            </div>
          </div>
          <figure className="ml-auto w-2/3 sm:w-1/2 lg:col-span-5 lg:col-start-8 lg:w-full lg:self-end">
            <Img id="1760101187116-fa8409c3d9ac" w={900} alt="Farveprøver malet op på en gammel væg ved siden af en dør" className="aspect-[3/2] w-full object-cover" />
            <figcaption className="mt-2 text-[13px] text-[#6B6660]">Prøverne bliver hængende, til du har set dem i både morgen- og aftenlys.</figcaption>
          </figure>
        </section>

        {/* Two rooms side by side, at different heights, like a spread */}
        <section id="rum" className={`${wrap} pb-24 sm:pb-36`}>
          <div className="grid gap-4 lg:grid-cols-12 lg:gap-x-10">
            <h2 className={`${h2} lg:col-span-6`}>Rum, vi har malet</h2>
            <p className="max-w-[40ch] text-[15px] leading-[1.55] text-[#6B6660] lg:col-span-4 lg:col-start-9 lg:self-end">
              Koden står ved hvert rum, så du kan købe den samme maling til en plet. Farverne på skærmen er kun omtrentlige.
            </p>
          </div>
          <div className="mt-12 grid gap-16 sm:mt-16 lg:grid-cols-12 lg:gap-x-10">
            <figure className="lg:col-span-5">
              <Img id={PAIR[0].photo} w={1200} alt={PAIR[0].alt} className="aspect-[4/5] w-full object-cover" />
              <figcaption className="mt-6">
                <RoomText room={PAIR[0]} />
              </figcaption>
            </figure>
            <figure className="lg:col-span-6 lg:col-start-7 lg:mt-40">
              <Img id={PAIR[1].photo} w={1400} alt={PAIR[1].alt} className="aspect-[4/3] w-full object-cover" />
              <figcaption className="mt-6">
                <RoomText room={PAIR[1]} />
              </figcaption>
            </figure>
          </div>
        </section>

        {/* The dark room gets a dark spread, in its own colour */}
        <section className="bg-[#4C4541] text-[#F3EEE8] [&_:focus-visible]:outline-[#F3EEE8]">
          <div className="grid lg:grid-cols-2">
            <Img id={UMBRA.photo} w={1600} alt={UMBRA.alt} className="aspect-[4/3] w-full object-cover lg:order-last lg:aspect-auto lg:h-full lg:min-h-[680px]" />
            <div className="flex items-center px-5 py-16 sm:px-10 sm:py-24 lg:px-16 xl:px-24">
              <RoomText room={UMBRA} dark className="max-w-[30rem]" />
            </div>
          </div>
        </section>
        <p className={`${wrap} mt-4 text-[13px] text-[#6B6660]`}>Rummene er eksempler, og fotos er pladsholdere fra Unsplash. På din side står jeres egne opgaver.</p>

        {/* What a room costs, worked out the way we would on the day */}
        <section id="pris" className="mt-24 bg-[#F1E4DA] sm:mt-32">
          <div className={`${wrap} grid gap-14 py-20 sm:py-28 lg:grid-cols-12 lg:gap-x-10`}>
            <div className="flex flex-col gap-8 lg:col-span-6">
              <div className="flex flex-col gap-4">
                <h2 className={h2}>Hvad koster et rum?</h2>
                <p className="max-w-[40ch] text-lg leading-[1.55]">Mål rummet med en tommestok. Vi regner, som vi gør, når vi står hos dig.</p>
              </div>

              <fieldset>
                <legend className="mb-1 font-semibold">Rummets mål i meter</legend>
                <div className="grid grid-cols-3 gap-4 sm:gap-6">
                  {(
                    [
                      ["Længde", len, setLen],
                      ["Bredde", wid, setWid],
                      ["Til loftet", hgt, setHgt],
                    ] as const
                  ).map(([label, v, set]) => (
                    <label key={label} className="flex flex-col text-sm text-[#6B6660]">
                      {label}
                      <input inputMode="decimal" value={v} onChange={(e) => set(e.target.value.replace(/[^\d,.]/g, ""))} className={`${field} tabular-nums`} />
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-3 font-semibold">Glans på væggene</legend>
                <div className="grid grid-cols-3 gap-2">
                  {GLOSS.map((g) => (
                    <label key={g.value} className={seg(gloss === g.value)}>
                      <input type="radio" name="glans" checked={gloss === g.value} onChange={() => setGloss(g.value)} className="sr-only" />
                      Glans {g.value}
                    </label>
                  ))}
                </div>
                <p className="mt-2 text-sm text-[#6B6660]">{GLOSS.find((g) => g.value === gloss)?.where}</p>
              </fieldset>

              <fieldset>
                <legend className="mb-3 font-semibold">Spartling</legend>
                <div className="grid grid-cols-3 gap-2">
                  {FILL.map((f, i) => (
                    <label key={f.label} className={seg(fill === i)}>
                      <input type="radio" name="spartel" checked={fill === i} onChange={() => setFill(i)} className="sr-only" />
                      <span className="max-[380px]:hidden">{f.label}</span>
                      <span className="min-[381px]:hidden">{["Ingen", "Plet", "Hel"][i]}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
                <label className="flex cursor-pointer items-center gap-3 font-medium">
                  <input type="checkbox" checked={ceiling} onChange={(e) => setCeiling(e.target.checked)} className="size-5 accent-[#22201E]" />
                  Loftet skal også males
                </label>
                <div className="flex items-center gap-3">
                  <span id="kulor-doors" className="font-medium">
                    Døre
                  </span>
                  <div role="group" aria-labelledby="kulor-doors" className="flex items-center border border-[#22201E]/25">
                    <button type="button" aria-label="Færre døre" onClick={() => setDoors((d) => Math.max(0, d - 1))} className="grid size-11 place-items-center text-lg">
                      −
                    </button>
                    <span className="w-8 text-center font-semibold tabular-nums" aria-live="polite">
                      {doors}
                    </span>
                    <button type="button" aria-label="Flere døre" onClick={() => setDoors((d) => Math.min(6, d + 1))} className="grid size-11 place-items-center text-lg">
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* The estimate, line by line, like the offer you would get */}
            <div className="flex flex-col gap-6 lg:sticky lg:top-10 lg:col-span-5 lg:col-start-8 lg:self-start">
              {valid ? (
                <>
                  <div aria-live="polite">
                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#6B6660]">Typisk pris for rummet</p>
                    <p className={`${serif} mt-2 whitespace-nowrap text-[40px] font-medium leading-none tracking-[-0.02em] min-[400px]:text-[48px] sm:text-[60px]`}>{kr(total)}</p>
                    <p className="mt-2 text-[15px] text-[#6B6660]">
                      Mellem {kr(total * 0.9)} og {kr(total * 1.1)}, inkl. moms og maling.
                    </p>
                  </div>
                  <table className="w-full border-collapse text-[15px]">
                    <caption className="sr-only">Overslag linje for linje</caption>
                    <tbody>
                      {lines.map(([what, calc, sum]) => (
                        <tr key={what} className="border-t border-[#22201E]/15">
                          <th scope="row" className="py-2.5 pr-4 text-left align-top font-medium">
                            {what}
                            <span className="block text-[13px] font-normal tabular-nums text-[#6B6660]">{calc}</span>
                          </th>
                          <td className="whitespace-nowrap py-2.5 text-right align-top tabular-nums">{sum.toLocaleString("da-DK")} kr.</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <p className="text-lg text-[#6B6660]">Skriv rummets mål i meter, fx 4,5. Rum over 15 meter regner vi på, når vi har set dem.</p>
              )}
              <button type="button" disabled={!valid} onClick={useNumbers} className={`${btn} h-14 self-start px-6 disabled:opacity-40`}>
                Send målene med i en besked
              </button>
              <details className="group border-t border-[#22201E]/15">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium [&::-webkit-details-marker]:hidden">
                  Andre priser
                  <span aria-hidden className="text-xl leading-none transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <dl className="pb-2 text-[15px]">
                  {PRICES.map((p) => (
                    <div key={p.what} className="flex justify-between gap-4 border-t border-[#22201E]/10 py-2.5">
                      <dt>{p.what}</dt>
                      <dd className="whitespace-nowrap text-right">{p.price}</dd>
                    </div>
                  ))}
                </dl>
                <p className="pb-4 text-[13px] text-[#6B6660]">Eksempelpriser inkl. moms. På din side står dine egne.</p>
              </details>
            </div>
          </div>
        </section>

        {/* Contact, with the people who come out */}
        <section id="kontakt" className={`${wrap} grid gap-14 py-24 sm:py-32 lg:grid-cols-12 lg:gap-x-10`}>
          <figure className="order-last w-2/3 sm:w-1/2 lg:order-none lg:col-span-4 lg:w-full">
            <Image
              src={painterPhoto}
              alt="Maler i hvidt arbejdstøj med malerrulle og spand foran et hvidt hus"
              sizes="(min-width: 1024px) 400px, 66vw"
              className="aspect-[3/4] w-full object-cover object-[50%_25%]"
            />
            <figcaption className="mt-2 text-[13px] text-[#6B6660]">Pladsholderfoto. Her kommer et billede af jer selv.</figcaption>
          </figure>
          <div className="lg:col-span-7 lg:col-start-6">
            <h2 className={h2}>Book opmåling og prøver</h2>
            <p className="mt-4 max-w-[44ch] text-lg leading-[1.55]">Vi kommer med farveprøverne og maler dem op på dine vægge. Det koster 450 kr., som trækkes fra, hvis vi maler.</p>
            <form
              className="mt-10 flex flex-col gap-7"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
                setMessage("");
                e.currentTarget.reset();
              }}
            >
              <label className="flex flex-col gap-1 font-semibold">
                Hvad skal males?
                <textarea
                  id="kulor-besked"
                  required
                  name="besked"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Fx stue og gang, ca. 60 m² vægge"
                  className={`${field} resize-y font-normal`}
                />
              </label>
              <label className="flex flex-col gap-1 font-semibold">
                Telefon
                <input required name="telefon" type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9 +]{8,}" title="Skriv et telefonnummer på mindst 8 cifre" className={`${field} font-normal`} />
              </label>
              <div className="flex flex-col items-start gap-4">
                <button type="submit" className={`${btn} h-14 px-8 text-[17px]`}>
                  Send
                </button>
                {sent && (
                  <p role="status" className="text-[15px] leading-[1.5]">
                    Tak. På en rigtig side ville vi ringe dig op og finde en tid. Dette er et eksempel, så der er ikke sendt noget.
                  </p>
                )}
              </div>
            </form>
            <dl className="mt-14 grid grid-cols-[max-content_minmax(0,1fr)] gap-x-6 gap-y-2.5 border-t border-[#22201E]/15 pt-6 text-[15px]">
              <dt className="text-[#6B6660]">Telefon</dt>
              <dd>
                <a href={TEL} className="font-semibold underline underline-offset-2">
                  {PHONE}
                </a>
                , hverdage kl. 7–16
              </dd>
              <dt className="text-[#6B6660]">Værksted</dt>
              <dd>{ADDRESS}</dd>
              <dt className="text-[#6B6660]">Område</dt>
              <dd>Odense, Nyborg og Assens</dd>
              <dt className="text-[#6B6660]">Garanti</dt>
              <dd>Byg Garanti (eksempel)</dd>
              <dt className="text-[#6B6660]">CVR</dt>
              <dd>00 00 00 00 (eksempel)</dd>
            </dl>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#22201E]/12 pb-24 sm:pb-0">
        <div className={`${wrap} flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-10 text-sm text-[#6B6660]`}>
          <span className={`${serif} text-2xl text-[#22201E]`}>Kulør</span>
          <span>{ADDRESS}</span>
          <span>CVR 00 00 00 00 (eksempel)</span>
          <a href={TEL} className="font-semibold text-[#22201E] underline underline-offset-2">
            {PHONE}
          </a>
        </div>
      </footer>

      {/* Phone: call, or book the samples */}
      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-[auto_1fr] gap-2 border-t border-[#22201E]/12 bg-[#FBF8F3] px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 sm:hidden">
        <a href={TEL} className="grid h-[52px] place-items-center whitespace-nowrap border border-[#22201E] px-5 font-semibold">
          Ring
        </a>
        <a href="#kontakt" className={`${btn} h-[52px]`}>
          <span className="min-[360px]:hidden">Book prøver</span>
          <span className="hidden min-[360px]:inline">Book opmåling og prøver</span>
        </a>
      </div>
    </div>
  );
}
