"use client";

import { useEffect, useState } from "react";
import { DemoNote, Img } from "./shared";

/*
 * Nørbæk Smedie is shown the way steel is: black, heavy and exact. The page is dark, the photos are
 * big, and the measurements sit under them the way they would on a drawing. The heading sits on the
 * photo itself, with only a shade behind it. One light section does the arithmetic for a railing, line by line.
 * Red-oxide primer is the only colour, kept for "send us the measurements".
 */

const PHONE = "98 76 54 32";
const TEL = "tel:+4598765432";
const SMS = "sms:+4598765432";
const ADDRESS = "Værkstedsvej 9, 8600 Silkeborg";

// Colours: black #151617, steel #222527, line on dark #3A3E41, text #EDEDEA, zinc #A8AEB0,
// light section #E9E9E5 with muted #54595C, primer red #B0381C for the one action.

const display = "font-(family-name:--font-norbaek-display) uppercase";
const wrap = "mx-auto w-full max-w-[1320px] px-5 sm:px-10";
const h2 = `${display} text-[52px] font-extrabold leading-[0.95] tracking-[0.005em] sm:text-[80px]`;
const btn = "inline-flex items-center justify-center whitespace-nowrap bg-[#B0381C] font-bold text-white transition-colors hover:bg-[#932C14]";
const field = "w-full border border-[#A8AEB0] bg-[#1C1E20] px-4 py-3 text-[17px] text-[#EDEDEA] placeholder:text-[#7F868A]";

const NAV = [
  ["#opgaver", "Opgaver"],
  ["#pris", "Pris på gelænder"],
  ["#kontakt", "Send mål"],
] as const;

const SHOWN: { photo: string; alt: string; what: string; size: string; finish: string; place: string }[] = [
  { photo: "1523789248610-bb592e870951", alt: "Trappe i gråt stål med gitterristtrin", what: "Udvendig trappe, 13 trin", size: "B 1.000 mm, trin i gitterrist", finish: "Varmgalvaniseret", place: "Gødvad" },
  { photo: "1635348180022-2f7715fdecfa", alt: "Nærbillede af et håndlistegelænder i stål", what: "Terrassegelænder", size: "14,5 m, H 1.000 mm", finish: "Varmgalv. + RAL 7016", place: "Virklund" },
  { photo: "1580047750144-2c7790adf461", alt: "Sort stållåge foran grønne træer", what: "Indkørselslåge, dobbelt", size: "2 × 1.600 × 1.200 mm", finish: "Varmgalv. + RAL 9005", place: "Them" },
];

const LISTED: { what: string; size: string; finish: string; place: string }[] = [
  { what: "Altan på murværk med glasværn", size: "1,4 × 3,2 m", finish: "Varmgalv. + RAL 9005", place: "Silkeborg C" },
  { what: "Carport med stålstolper", size: "3,2 × 6,0 m", finish: "Varmgalvaniseret", place: "Kjellerup" },
  { what: "Gammel smedejernslåge, repareret", size: "Nye hængsler og bundramme", finish: "Sandblæst + RAL 9005", place: "Sejs" },
];

/* ---------- Railing estimate: every line of the sum, example prices incl. moms ---------- */

type Kind = "ude" | "inde";
const MAKE: Record<Kind, [number, number]> = { ude: [1900, 2400], inde: [2300, 2900] };
const FINISH: Record<Kind, { key: string; label: string; perM: number }[]> = {
  ude: [
    { key: "galv", label: "Varmgalvaniseret", perM: 350 },
    { key: "galvlak", label: "Galvaniseret og lakeret", perM: 650 },
  ],
  inde: [
    { key: "klar", label: "Sortstål med klarlak", perM: 250 },
    { key: "lak", label: "Pulverlak", perM: 300 },
  ],
};
const MOUNT_BASE = 2800;
const MOUNT_PER_M = 250;

const RAL: { code: string; name: string; hex: string }[] = [
  { code: "7016", name: "Antracitgrå", hex: "#383E42" },
  { code: "9005", name: "Dybsort", hex: "#121214" },
  { code: "6009", name: "Grangrøn", hex: "#27352A" },
  { code: "3009", name: "Oxidrød", hex: "#6D342D" },
  { code: "7035", name: "Lysegrå", hex: "#CBD0CC" },
  { code: "9010", name: "Renhvid", hex: "#F1EDE1" },
];

const kr = (n: number) => n.toLocaleString("da-DK") + " kr.";
const roundDown = (n: number) => Math.floor(n / 500) * 500;
const roundUp = (n: number) => Math.ceil(n / 500) * 500;

export function SmedSite() {
  const [menu, setMenu] = useState(false);
  const [len, setLen] = useState(8);
  const [kind, setKind] = useState<Kind>("ude");
  const [finish, setFinish] = useState(FINISH.ude[1].key);
  const [mount, setMount] = useState(true);
  const [sent, setSent] = useState(false);

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
  const metres = len.toLocaleString("da-DK", { minimumFractionDigits: 1 });

  return (
    <div className="min-h-dvh overflow-x-clip bg-[#151617] font-(family-name:--font-norbaek) text-[17px] text-[#EDEDEA] [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-[#EDEDEA]">
      <DemoNote className="bg-black text-[#A8AEB0]" />

      <header className="relative z-40 border-b border-[#3A3E41] bg-[#151617] sm:sticky sm:top-0">
        <div className={`${wrap} flex items-center justify-between gap-4 py-3`}>
          <a href="#top" className={`${display} whitespace-nowrap text-[28px] font-black leading-none tracking-[0.02em]`}>
            Nørbæk Smedie
          </a>
          <nav aria-label="Hovedmenu" className="hidden gap-7 whitespace-nowrap text-[16px] font-medium lg:flex">
            {NAV.map(([href, label]) => (
              <a key={href} href={href} className="underline-offset-4 hover:underline">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-5">
            <a href={TEL} className="whitespace-nowrap font-semibold underline-offset-4 hover:underline max-sm:hidden">
              {PHONE}
            </a>
            <button
              type="button"
              aria-label={menu ? "Luk menu" : "Åbn menu"}
              aria-expanded={menu}
              aria-controls="norbaek-menu"
              onClick={() => setMenu((m) => !m)}
              className="grid size-11 place-items-center border border-[#EDEDEA] lg:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden>
                {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
        {menu && (
          <nav id="norbaek-menu" aria-label="Menu" className="border-t border-[#3A3E41] lg:hidden">
            <ul className={`${wrap} py-2`}>
              {NAV.map(([href, label]) => (
                <li key={href}>
                  <a href={href} onClick={() => setMenu(false)} className="block border-b border-[#3A3E41] py-3.5 text-lg font-medium">
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
        {/* The workshop, with the heading set straight onto the photo */}
        <section id="top" className="relative">
          <div className="relative">
            <Img
              priority
              id="1558611997-dd5b20e08c71"
              w={2400}
              alt="Smed svejser en ramme i stål på værkstedet"
              className="aspect-[4/5] max-h-[78vh] w-full object-cover sm:aspect-[16/9] lg:aspect-auto lg:h-[calc(100svh-89px)] lg:max-h-[1040px] lg:min-h-[600px]"
            />
            {/* Shade, not a box: the photo darkens toward the page below it, and on a big screen also toward the text on the left, so the white type stays readable while the work shows through. */}
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,#151617_0%,rgb(21_22_23/0.7)_22%,rgb(21_22_23/0)_55%)] lg:bg-[linear-gradient(to_top,rgb(21_22_23/0.85)_0%,rgb(21_22_23/0.35)_45%,rgb(21_22_23/0)_70%),linear-gradient(to_right,rgb(21_22_23/0.8)_0%,rgb(21_22_23/0.55)_40%,rgb(21_22_23/0)_68%)]" />
          </div>
          <div className="relative -mt-20 sm:-mt-36 lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0">
            <div className={wrap}>
              <div className="relative lg:w-fit lg:pb-14 lg:pr-12">
                <div className="relative w-fit pr-6 pt-6 [text-shadow:0_1px_12px_rgb(21_22_23/0.6)] sm:pr-10 sm:pt-9">
                  <p className="text-[16px] text-[#A8AEB0]">Klejnsmed i Silkeborg</p>
                  <h1 className={`${display} mt-2 text-[48px] font-black leading-[0.94] tracking-[0.005em] min-[360px]:text-[56px] sm:text-[104px] lg:text-[112px] xl:text-[128px] [@media(min-width:1024px)_and_(max-height:820px)]:text-[92px]`}>
                    Gelændere,
                    <br /> trapper og
                    <br /> låger i stål.
                  </h1>
                </div>
                <p className="mt-6 max-w-[44ch] text-[19px] leading-[1.45] text-[#CFD2D0]">Vi måler op, tegner, svejser og sætter op. Du får en fast pris på tegningen, før vi går i gang.</p>
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 max-sm:hidden">
                  <a href="#kontakt" className={`${btn} h-14 px-7 text-[18px]`}>
                    Send mål eller et foto
                  </a>
                  <a href={TEL} className="whitespace-nowrap text-[18px] font-semibold underline underline-offset-4">
                    Ring {PHONE}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Three jobs at full height, with the drawing's measurements underneath */}
        <section id="opgaver" className={`${wrap} pb-20 pt-24 sm:pb-28 sm:pt-32`}>
          <h2 className={h2}>Opgaver</h2>
          <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 sm:mt-14 lg:grid-cols-3 lg:gap-x-5">
            {SHOWN.map((j, i) => (
              <figure key={j.what} className={i === 0 ? "col-span-2 lg:col-span-1" : ""}>
                <Img id={j.photo} w={1000} alt={j.alt} className={`w-full object-cover ${i === 0 ? "aspect-[4/5] lg:aspect-[3/4]" : "aspect-[3/4]"}`} />
                <figcaption className="mt-4 border-t border-[#3A3E41] pt-3">
                  <span className="block font-semibold leading-[1.3]">{j.what}</span>
                  <span className="mt-1 block text-[15px] leading-[1.45] text-[#A8AEB0]">
                    {j.size}
                    <br />
                    {j.finish} · {j.place}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
          <table className="mt-14 w-full border-collapse text-[16px]">
            <caption className="sr-only">Flere opgaver</caption>
            <tbody>
              {LISTED.map((j) => (
                <tr key={j.what} className="block border-t border-[#3A3E41] py-3.5 leading-[1.45] last:border-b md:table-row md:py-0">
                  <th scope="row" className="block text-left font-semibold md:table-cell md:py-3.5 md:pr-6">
                    {j.what}
                  </th>
                  <td className="inline text-[15px] text-[#A8AEB0] md:table-cell md:py-3.5 md:pr-6 md:text-[16px]">{j.size}</td>
                  <td className="inline text-[15px] text-[#A8AEB0] md:table-cell md:py-3.5 md:pr-6 md:text-[16px]">
                    <span aria-hidden className="md:hidden">, </span>
                    {j.finish}
                  </td>
                  <td className="inline text-[15px] text-[#A8AEB0] md:table-cell md:py-3.5 md:text-right md:text-[16px]">
                    <span aria-hidden className="md:hidden"> · </span>
                    {j.place}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-8 text-[15px] text-[#A8AEB0]">Opgaverne er eksempler, og fotos er pladsholdere fra Unsplash. På din side står jeres egne opgaver.</p>
        </section>

        {/* The arithmetic for a railing, in daylight */}
        <section id="pris" className="bg-[#E9E9E5] text-[#151617] [&_:focus-visible]:outline-[#151617]">
          <div className={`${wrap} grid gap-x-12 gap-y-12 py-20 sm:py-28 lg:grid-cols-12`}>
            <div className="lg:col-span-5 lg:row-start-1">
              <h2 className={h2}>Hvad koster et gelænder?</h2>
              <p className="mt-5 max-w-[40ch] text-[18px] leading-[1.5] text-[#3B3F42]">Det er især meterne og overfladen, der flytter prisen. Skal der bores i beton, ser vi på det ved opmålingen.</p>
            </div>

            <div className="lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1">
              <div role="group" aria-label="Hvor skal gelænderet sidde?" className="grid grid-cols-2 border-2 border-[#151617]">
                {(["ude", "inde"] as Kind[]).map((k) => (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={kind === k}
                    onClick={() => {
                      setKind(k);
                      setFinish(FINISH[k][FINISH[k].length - 1].key);
                    }}
                    className={`h-12 whitespace-nowrap text-[16px] font-bold transition-colors ${kind === k ? "bg-[#151617] text-[#EDEDEA]" : "hover:bg-[#DCDCD7]"}`}
                  >
                    {k === "ude" ? "Udendørs" : "Indendørs"}
                  </button>
                ))}
              </div>

              <div className="mt-7">
                <div className="flex items-baseline justify-between gap-4">
                  <label htmlFor="norbaek-len" className="font-bold">
                    Længde
                  </label>
                  <output htmlFor="norbaek-len" className="text-[20px] font-bold tabular-nums">
                    {metres} m
                  </output>
                </div>
                <input id="norbaek-len" type="range" min={1} max={25} step={0.5} value={len} onChange={(e) => setLen(Number(e.target.value))} className="mt-3 w-full accent-[#B0381C]" />
              </div>

              <fieldset className="mt-7">
                <legend className="font-bold">Overflade</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {FINISH[kind].map((f) => (
                    <button
                      key={f.key}
                      type="button"
                      aria-pressed={fin.key === f.key}
                      onClick={() => setFinish(f.key)}
                      className={`h-11 flex-1 whitespace-nowrap border-2 px-4 text-[16px] transition-colors sm:flex-none ${fin.key === f.key ? "border-[#151617] bg-[#151617] text-[#EDEDEA]" : "border-[#9EA3A5] hover:border-[#151617]"}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="mt-7 flex cursor-pointer items-center gap-3 font-bold">
                <input type="checkbox" checked={mount} onChange={(e) => setMount(e.target.checked)} className="size-5 accent-[#B0381C]" />
                Vi sætter det op
              </label>

              <dl className="mt-8 border-t-2 border-[#151617] pt-3 text-[16px] tabular-nums" aria-live="polite">
                <div className="flex justify-between gap-4 py-1.5">
                  <dt>Fremstilling, {metres} m</dt>
                  <dd className="whitespace-nowrap text-right">
                    {make[0].toLocaleString("da-DK")}–{kr(make[1])}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-1.5">
                  <dt>{fin.label}</dt>
                  <dd className="whitespace-nowrap text-right">{kr(surface)}</dd>
                </div>
                <div className="flex justify-between gap-4 py-1.5">
                  <dt>{mount ? "Montage" : "Du henter selv"}</dt>
                  <dd className="whitespace-nowrap text-right">{kr(mounting)}</dd>
                </div>
                <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 border-t border-[#B9BCB8] pt-3">
                  <dt className="font-bold">I alt, ca.</dt>
                  <dd className={`${display} whitespace-nowrap text-[38px] font-extrabold leading-none min-[360px]:text-[44px] sm:text-[56px]`}>
                    {low.toLocaleString("da-DK")}–{high.toLocaleString("da-DK")} kr.
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-[15px] text-[#54595C]">Eksempelpriser inkl. moms. Opmåling 450 kr., trækkes fra, hvis du bestiller.</p>
            </div>

            <div className="border-t border-[#B9BCB8] pt-8 lg:col-span-5 lg:row-start-2 lg:self-end">
              <p className="font-bold">Pulverlak i alle RAL-farver. Dem, vi oftest bruger:</p>
              <ul className="mt-5 grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-6 lg:grid-cols-3">
                {RAL.map((c) => (
                  <li key={c.code}>
                    <span aria-hidden className="block h-14 border border-[#151617]/20" style={{ background: c.hex }} />
                    <span className="mt-2 block text-[15px] font-semibold tabular-nums">RAL {c.code}</span>
                    <span className="block text-[14px] text-[#54595C]">{c.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Send measurements */}
        <section id="kontakt" className={`${wrap} grid gap-x-12 gap-y-14 py-20 sm:py-28 lg:grid-cols-12`}>
          <div className="lg:col-span-6">
            <h2 className={h2}>Send mål eller et foto</h2>
            <p className="mt-5 max-w-[40ch] text-[19px] leading-[1.45] text-[#CFD2D0]">Et foto med en tommestok i billedet er nok til et overslag.</p>
            <a href={SMS} className={`${btn} mt-8 h-14 px-7 text-[18px] max-sm:hidden`}>
              Send på SMS
            </a>
            <form
              className="mt-8 flex flex-col gap-5 sm:mt-12"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
                e.currentTarget.reset();
              }}
            >
              <p className="font-semibold max-sm:hidden">Eller skriv her</p>
              <label className="flex flex-col gap-2 text-[15px] text-[#A8AEB0]">
                Hvad skal laves?
                <textarea required name="opgave" rows={3} placeholder="Fx gelænder til terrassen, ca. 9 m" className={`${field} resize-y`} />
              </label>
              <label className="flex flex-col gap-2 text-[15px] text-[#A8AEB0]">
                Foto eller skitse (kan udelades)
                <input
                  name="filer"
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  className="text-[15px] text-[#EDEDEA] file:mr-3 file:border file:border-[#EDEDEA] file:bg-transparent file:px-3 file:py-2 file:text-[15px] file:font-medium file:text-[#EDEDEA]"
                />
              </label>
              <label className="flex flex-col gap-2 text-[15px] text-[#A8AEB0]">
                Dit telefonnummer
                <input required name="telefon" type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9 +]{8,}" title="Skriv et telefonnummer på mindst 8 cifre" className={`${field} sm:max-w-[320px]`} />
              </label>
              <button type="submit" className="inline-flex h-14 items-center self-start whitespace-nowrap border-2 border-[#EDEDEA] px-9 text-[18px] font-bold hover:bg-[#EDEDEA] hover:text-[#151617]">
                Send
              </button>
              {sent && (
                <p role="status" className="max-w-[48ch] border-l-4 border-[#B0381C] pl-4 leading-[1.5]">
                  Tak. På en rigtig side ville vi nu ringe dig op. Dette er et eksempel, så der er ikke sendt noget.
                </p>
              )}
            </form>
          </div>
          <dl className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-6 gap-y-3 self-start border-t-2 border-[#EDEDEA] pt-5 text-[16px] lg:col-span-5 lg:col-start-8">
            <dt className="text-[#A8AEB0]">Telefon</dt>
            <dd>
              <a href={TEL} className="whitespace-nowrap font-semibold underline underline-offset-4">
                {PHONE}
              </a>
            </dd>
            <dt className="text-[#A8AEB0]">Værksted</dt>
            <dd>
              {ADDRESS}
              <span className="block text-[15px] text-[#A8AEB0]">Hverdage kl. 7–15.30</span>
            </dd>
            <dt className="text-[#A8AEB0]">Område</dt>
            <dd>Silkeborg, Skanderborg og Herning</dd>
            <dt className="text-[#A8AEB0]">Opmåling</dt>
            <dd>450 kr., trækkes fra</dd>
            <dt className="text-[#A8AEB0]">Svejsning</dt>
            <dd>EN 1090-certificeret (eksempel)</dd>
            <dt className="text-[#A8AEB0]">CVR</dt>
            <dd>00 00 00 00 (eksempel)</dd>
          </dl>
        </section>
      </main>

      <footer className="border-t border-[#3A3E41] bg-black pb-24 text-[15px] text-[#A8AEB0] sm:pb-0">
        <div className={`${wrap} flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-10`}>
          <span className={`${display} text-[24px] font-black text-[#EDEDEA]`}>Nørbæk Smedie</span>
          <span>{ADDRESS}</span>
          <span>CVR 00 00 00 00 (eksempel)</span>
          <a href={TEL} className="font-semibold text-[#EDEDEA] underline underline-offset-4">
            {PHONE}
          </a>
        </div>
      </footer>

      {/* Phone: send the measurements, or call */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-[#3A3E41] bg-[#151617] px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 sm:hidden">
        <a href={SMS} className={`${btn} h-[52px] flex-1 text-[17px]`}>
          Send mål på SMS
        </a>
        <a href={TEL} className="grid h-[52px] place-items-center whitespace-nowrap border border-[#EDEDEA] px-5 font-semibold">
          Ring
        </a>
      </div>
    </div>
  );
}
