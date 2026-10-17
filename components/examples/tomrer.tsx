"use client";

import { useEffect, useState } from "react";
import { DemoNote, Img, SampleReviewsNote, Stars } from "./shared";

/*
 * Egholm Tømrer & Snedker, built as a job log: paper, ink and one forest green, a plain grotesk and
 * a mono for places, dates and sizes. No cards, no shadows, no motion. What makes it feel real is
 * the facts: who comes out, what a site visit costs, what was built where and how long it took.
 */

const PHONE = "23 45 67 89";
const TEL = "tel:+4523456789";
const ADDRESS = "Håndværkervej 8, 4000 Roskilde";

const mono = "font-(family-name:--font-egholm-mono)";

type Kind = "Tag" | "Tilbygning" | "Terrasse" | "Indretning";

const JOBS: { kind: Kind; photo: string | null; alt: string; place: string; when: string; size: string; title: string; text: string }[] = [
  {
    kind: "Tilbygning",
    photo: "1587582423116-ec07293f0395",
    alt: "Tømrer på toppen af et nyt vægskelet til en tilbygning",
    place: "Svogerslev",
    when: "august 2026",
    size: "32 m² · 7 uger",
    title: "Tilbygning med nyt soveværelse",
    text: "Vægge og spær rejst på ni dage. Familien boede hjemme hele vejen, så vi lukkede huset af hver aften.",
  },
  {
    kind: "Tag",
    photo: "1676802037786-3697d60497ae",
    alt: "Nye tagspær rejst på et hus mod blå himmel",
    place: "Viby Sj.",
    when: "oktober 2025",
    size: "160 m² · 3 uger",
    title: "Nyt tag på parcelhus fra 1968",
    text: "De gamle spær var rådne i den ene side. Vi skiftede dem, efterisolerede og lagde nyt tegltag.",
  },
  {
    kind: "Terrasse",
    photo: "1624409990662-03f19cc0e0cc",
    alt: "Færdig terrasse med lyskæde, grill og loungesofa",
    place: "Trekroner",
    when: "juni 2025",
    size: "38 m² · 6 arbejdsdage",
    title: "Hævet terrasse med rækværk",
    text: "Bygget hen over en skrånende græsplæne. Stolperne til lyskæden var kundens idé, og den var god.",
  },
  {
    kind: "Indretning",
    photo: null,
    alt: "",
    place: "Roskilde C",
    when: "marts 2025",
    size: "9 dage",
    title: "Køkken i massiv eg",
    text: "Snedkerlavet på værkstedet og monteret på to dage. Bordpladen er olieret og skal efterbehandles en gang om året. Kunden ville ikke have sit køkken på nettet, så her er intet foto.",
  },
  {
    kind: "Tag",
    photo: "1673978482989-5eb3b350be2d",
    alt: "Tag under udskiftning med stillads rundt om huset",
    place: "Jyllinge",
    when: "januar 2025",
    size: "2 dage",
    title: "Stormskade efter januarstormen",
    text: "Presenning på samme aften og nye lægter og tagsten ugen efter. Vi tog billeder til forsikringen undervejs.",
  },
  {
    kind: "Indretning",
    photo: "1728025801541-20b44f6ed5f3",
    alt: "Stue med synlige loftsbjælker i træ",
    place: "Gadstrup",
    when: "november 2024",
    size: "48 m² · 2 uger",
    title: "Bjælkeloft frilagt i gammelt stuehus",
    text: "Vi tog det nedhængte loft ned og fandt bjælker fra 1890'erne. To af dem var knækket og blev skiftet med genbrugstræ.",
  },
];

const KINDS = ["Alle", "Tag", "Tilbygning", "Terrasse", "Indretning"] as const;

const PRICES: { what: string; note?: string; price: string }[] = [
  { what: "Besigtigelse", note: "trækkes fra, hvis du siger ja", price: "750 kr." },
  { what: "Timepris, svend", price: "625 kr." },
  { what: "Terrasse, trykimprægneret", note: "inkl. materialer", price: "1.900–2.400 kr./m²" },
  { what: "Nyt tag på et parcelhus", note: "ca. 150 m², med stillads", price: "260.000–380.000 kr." },
  { what: "Nye vinduer og døre", note: "kan give håndværkerfradrag", price: "Efter besigtigelse" },
];

const REVIEWS: { stars: number; date: string; text: string; name: string; reply?: string }[] = [
  { stars: 5, date: "14. sep. 2026", text: "Tilbygningen blev færdig en uge før aftalt. Mads ryddede op hver dag, også selvom vi sagde, at det var fint.", name: "Louise, Svogerslev" },
  {
    stars: 4,
    date: "2. jul. 2026",
    text: "Flot terrasse og fair pris. Træk en stjerne, fordi de startede fire dage senere end lovet, og vi selv måtte ringe for at høre hvorfor.",
    name: "Morten, Trekroner",
    reply: "Det har du ret i, Morten. Vi skulle have ringet, da det forrige job trak ud. Det gør vi nu.",
  },
  { stars: 5, date: "20. maj 2026", text: "Jens kom ud dagen efter stormen og fik lagt presenning på, inden det begyndte at regne igen.", name: "Hanne, Jyllinge" },
  { stars: 5, date: "3. apr. 2026", text: "Nyt køkken i eg. Det var dyrere end et fra byggemarkedet, men det kan man også se.", name: "Torben, Roskilde" },
];

const NAV = [
  ["#opgaver", "Opgaver"],
  ["#priser", "Priser"],
  ["#om", "Om os"],
  ["#kontakt", "Kontakt"],
] as const;

const wrap = "mx-auto max-w-[1200px] px-4 sm:px-8";
const h2 = "text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[40px]";
const btn = "items-center justify-center whitespace-nowrap rounded-[3px] bg-[#2E4A3B] font-semibold text-white transition-colors hover:bg-[#1F3A2C]";
const field = "rounded-[3px] border border-[#A39B8A] bg-white px-3.5 py-3 text-base font-normal text-[#1E1C18] placeholder:text-[#8A8273]";

export function TomrerSite() {
  const [kind, setKind] = useState<(typeof KINDS)[number]>("Alle");
  const [menu, setMenu] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const jobs = JOBS.filter((j) => kind === "Alle" || j.kind === kind);

  return (
    <div className="min-h-dvh overflow-x-clip bg-[#F3F0E8] font-(family-name:--font-egholm) text-[#1E1C18] [&_:focus-visible]:outline-[#2E4A3B]">
      <DemoNote className={`bg-[#1E1C18] text-[#CFC8B8] ${mono}`} />

      <header className="relative z-40 border-b border-[#D8D2C4] sm:sticky sm:top-0 bg-[#F3F0E8]">
        <div className={`${wrap} flex items-center justify-between gap-4 py-3 lg:py-4`}>
          <a href="#top" className="flex min-w-0 flex-col gap-0.5 leading-tight">
            <span className="whitespace-nowrap text-lg font-bold tracking-[-0.01em] sm:text-[22px]">
              Egholm Tømrer<span className="hidden sm:inline"> &amp; Snedker</span>
            </span>
            <span className={`whitespace-nowrap text-[11px] text-[#5E5850] sm:text-xs ${mono}`}>Roskilde · siden 2003</span>
          </a>
          <nav aria-label="Hovedmenu" className="hidden gap-7 whitespace-nowrap font-medium lg:flex">
            {NAV.map(([href, label]) => (
              <a key={href} href={href} className="hover:text-[#2E4A3B]">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-4 lg:gap-5">
            <a href={TEL} className="hidden whitespace-nowrap font-semibold hover:text-[#2E4A3B] sm:inline">
              {PHONE}
            </a>
            <a href="#kontakt" className={`${btn} hidden px-5 py-3 md:inline-flex`}>
              Book besigtigelse
            </a>
            <button
              type="button"
              aria-label={menu ? "Luk menu" : "Åbn menu"}
              aria-expanded={menu}
              aria-controls="egholm-menu"
              onClick={() => setMenu((m) => !m)}
              className="grid size-11 place-items-center rounded-[3px] border border-[#BDB5A4] lg:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
        {menu && (
          <nav id="egholm-menu" aria-label="Menu" className="border-t border-[#D8D2C4] lg:hidden">
            <ul className={`${wrap} py-2`}>
              {NAV.map(([href, label]) => (
                <li key={href}>
                  <a href={href} onClick={() => setMenu(false)} className="block border-b border-[#D8D2C4] py-3.5 text-lg font-medium">
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
        {/* Hero: the photo of a real-looking job comes first on the phone, beside the text on a computer */}
        <section id="top" className={`${wrap} grid items-end gap-6 pb-10 sm:gap-10 sm:pt-10 lg:grid-cols-2 lg:gap-14 lg:pb-[88px] lg:pt-[72px]`}>
          <div className="flex flex-col gap-5 sm:gap-7">
            <h1 className="text-[40px] font-semibold leading-[1.04] tracking-[-0.025em] sm:text-[56px] lg:text-[clamp(52px,5.4vw,68px)] lg:leading-[1.02]">
              Tømrer i Roskilde siden 2003.
            </h1>
            <p className="max-w-[34ch] text-[17px] leading-[1.55] sm:text-xl">
              Tag, tilbygninger, terrasser og køkkener. Det er Jens og de fire svende, der kommer ud og kigger på opgaven, og det er også dem, der laver den.
            </p>
            <div className="hidden flex-wrap items-center gap-x-5 gap-y-3 sm:flex">
              <a href="#kontakt" className={`${btn} inline-flex px-[26px] py-4 text-lg`}>
                Book en besigtigelse
              </a>
              <p className="text-[#5E5850]">
                eller ring på{" "}
                <a href={TEL} className="whitespace-nowrap font-semibold text-[#1E1C18] underline underline-offset-2">
                  {PHONE}
                </a>
                .<br />
                Jens tager telefonen kl. 7–16.
              </p>
            </div>
            <p className="max-w-[46ch] border-t border-[#D8D2C4] pt-4 text-sm leading-normal text-[#5E5850] sm:pt-5 sm:text-[15px]">
              Besigtigelse koster 750 kr. inkl. moms i Roskilde Kommune. Siger du ja til tilbuddet, trækker vi beløbet fra.
            </p>
          </div>
          <figure className="-mx-4 flex flex-col gap-2 max-sm:order-first sm:mx-0 sm:gap-2.5">
            <Img
              priority
              id="1773430272653-375174373c4f"
              w={1400}
              alt="Tre tømrere lægger strøer til et nyt terrassedæk bag et træhus"
              className="aspect-[3/2] w-full object-cover sm:rounded-[2px]"
            />
            <figcaption className={`flex flex-wrap justify-between gap-x-3 px-4 text-[11px] text-[#5E5850] sm:px-0 sm:text-[13px] ${mono}`}>
              <span>Terrassedæk, Himmelev</span>
              <span>Maj 2026 · 42 m² · 6 arbejdsdage</span>
            </figcaption>
          </figure>
        </section>

        {/* The job log */}
        <section id="opgaver" className="scroll-mt-20 border-y border-[#D8D2C4] bg-[#FBFAF6]">
          <div className={`${wrap} py-12 sm:py-20`}>
            <div className="mb-7 flex flex-wrap items-end justify-between gap-6 sm:mb-9">
              <div className="flex max-w-[560px] flex-col gap-2.5">
                <h2 className={h2}>Seneste opgaver</h2>
                <p className="text-base leading-[1.55] text-[#5E5850] sm:text-[17px]">
                  Sted, måned og størrelse står ved hver opgave. Skriv, hvis du vil se en af dem i virkeligheden. De fleste kunder siger gerne ja.
                </p>
              </div>
              <div role="group" aria-label="Vis opgaver" className="flex flex-wrap gap-2">
                {KINDS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={kind === k}
                    onClick={() => setKind(k)}
                    className={`whitespace-nowrap rounded-[3px] border px-4 py-2.5 text-[15px] transition-colors ${
                      kind === k ? "border-[#1E1C18] bg-[#1E1C18] text-[#F3F0E8]" : "border-[#BDB5A4] hover:border-[#1E1C18]"
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
            <ol className="border-t border-[#1E1C18]" aria-live="polite">
              {jobs.map((j) => (
                <li key={j.title} className="grid grid-cols-[112px_minmax(0,1fr)] gap-x-4 border-b border-[#D8D2C4] py-4 sm:grid-cols-[200px_minmax(0,1fr)] sm:items-center sm:gap-x-6 sm:py-[22px] lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-x-10">
                  {j.photo ? (
                    <Img id={j.photo} w={700} alt={j.alt} className="aspect-[4/3] w-full rounded-[2px] object-cover" />
                  ) : (
                    <div className={`grid aspect-[4/3] w-full place-items-center rounded-[2px] border border-dashed border-[#BDB5A4] p-2 text-center text-[11px] text-[#5E5850] sm:text-xs ${mono}`}>
                      Intet foto
                    </div>
                  )}
                  <div className="flex min-w-0 flex-col gap-1 sm:gap-2">
                    <p className={`text-[11px] text-[#5E5850] sm:text-[13px] ${mono}`}>
                      {j.place} · {j.when}
                      <span className="hidden sm:inline"> · {j.size}</span>
                    </p>
                    <h3 className="text-[17px] font-semibold leading-tight sm:text-2xl">{j.title}</h3>
                    <p className="text-sm text-[#3D3832] sm:hidden">{j.size}</p>
                    <p className="hidden max-w-[52ch] leading-[1.55] text-[#3D3832] sm:block">{j.text}</p>
                  </div>
                  <p className="col-span-2 mt-3 text-[15px] leading-[1.55] text-[#3D3832] sm:hidden">{j.text}</p>
                </li>
              ))}
            </ol>
            <p className={`mt-5 text-xs text-[#5E5850] ${mono}`}>
              Fotos fra Unsplash som pladsholdere. På din side bruger vi dine egne billeder fra pladsen.
            </p>
          </div>
        </section>

        {/* The master */}
        <section id="om" className={`${wrap} grid scroll-mt-20 items-start gap-6 py-12 sm:gap-10 sm:py-[88px] lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)] lg:gap-14`}>
          <figure className="flex items-end gap-3 sm:max-w-[460px] sm:flex-col sm:items-stretch sm:gap-2.5">
            <Img
              id="1661447133325-a4a73386b9e4"
              w={900}
              alt="Pladsholderfoto af en ældre håndværker i et værksted"
              className="aspect-square w-[140px] shrink-0 rounded-[2px] object-cover object-top sm:w-full"
            />
            <figcaption className={`text-[11px] leading-snug text-[#5E5850] sm:text-[13px] ${mono}`}>
              Pladsholderfoto · her kommer mesterens eget portræt fra værkstedet
            </figcaption>
          </figure>
          <div className="flex max-w-[560px] flex-col gap-4 sm:gap-[22px]">
            <h2 className={h2}>Jens Egholm, tømrermester</h2>
            <p className="text-base leading-[1.6] sm:text-lg">
              Jeg startede firmaet i 2003 med en varebil og en rundsav. I dag er vi fem, og Kasper og Mads har været med i over ti år. Vi tager ikke flere opgaver, end vi selv kan nå. Derfor kan der være et par ugers ventetid om sommeren.
            </p>
            <p className="text-base leading-[1.6] sm:text-lg">
              Murer, elektriker og VVS&apos;er er de samme, vi har brugt i mange år. Du har én at ringe til hele vejen, og det er mig.
            </p>
            <dl className="mt-2 grid grid-cols-[max-content_minmax(0,1fr)] gap-x-6 gap-y-2.5 border-t border-[#D8D2C4] pt-5 text-[15px]">
              <dt className="text-[#5E5850]">Adresse</dt>
              <dd>{ADDRESS}</dd>
              <dt className="text-[#5E5850]">Telefon</dt>
              <dd>Man–fre kl. 7–16</dd>
              <dt className="text-[#5E5850]">CVR</dt>
              <dd className={mono}>00 00 00 00 (eksempel)</dd>
              <dt className="text-[#5E5850]">Garanti</dt>
              <dd>
                Byg Garanti <span className={`text-[13px] text-[#5E5850] ${mono}`}>(eksempel)</span>
              </dd>
              <dt className="text-[#5E5850]">Ventetid nu</dt>
              <dd>Ca. 3 uger til opstart</dd>
            </dl>
          </div>
        </section>

        {/* Prices */}
        <section id="priser" className="scroll-mt-20 bg-[#1E1C18] text-[#F3F0E8] [&_:focus-visible]:outline-[#F3F0E8]">
          <div className={`${wrap} grid gap-8 py-12 sm:gap-14 sm:py-[88px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]`}>
            <div className="flex max-w-[460px] flex-col gap-4">
              <h2 className={h2}>Hvad koster det?</h2>
              <p className="leading-[1.6] text-[#CFC8B8] sm:text-[17px]">
                Hver opgave får en fast pris efter besigtigelsen. Tallene her er, hvad vi typisk ender på, så du har en idé om niveauet, før du ringer.
              </p>
            </div>
            <table className="w-full border-collapse sm:text-base">
              <caption className={`pb-3 text-left text-xs text-[#A39B8A] ${mono}`}>Vejledende priser inkl. moms, oktober 2026</caption>
              <tbody>
                {PRICES.map((p) => (
                  <tr key={p.what} className="border-y border-[#4A443B]">
                    <th scope="row" className="py-3.5 pr-4 text-left align-top font-medium">
                      {p.what}
                      {p.note && <span className="block text-sm font-normal text-[#A39B8A]">{p.note}</span>}
                    </th>
                    <td className={`whitespace-nowrap py-3.5 text-right align-top text-sm sm:text-base ${p.price.includes("kr") ? mono : "text-[#CFC8B8]"}`}>{p.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Reviews */}
        <section className={`${wrap} py-12 sm:py-[88px]`}>
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 sm:mb-8">
            <h2 className={h2}>Hvad kunderne skriver</h2>
            <SampleReviewsNote className={`text-[13px]! text-[#5E5850] ${mono}`} />
          </div>
          <div className="grid gap-x-12 md:grid-cols-2">
            {REVIEWS.map((r) => (
              <figure key={r.name} className="flex flex-col gap-2.5 border-t border-[#D8D2C4] py-6">
                <p className={`flex flex-wrap items-center gap-x-3 text-[13px] text-[#5E5850] ${mono}`}>
                  <Stars n={r.stars} className="text-[#2E4A3B]" />
                  <span>{r.date}</span>
                </p>
                <blockquote className="text-base leading-[1.6] sm:text-[17px]">{r.text}</blockquote>
                <figcaption className="text-[15px] text-[#5E5850]">{r.name}</figcaption>
                {r.reply && (
                  <p className="mt-1.5 border-l-2 border-[#BDB5A4] pl-3.5 text-[15px] leading-[1.55] text-[#3D3832]">
                    <b className="font-semibold">Svar fra Jens:</b> {r.reply}
                  </p>
                )}
              </figure>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="kontakt" className="scroll-mt-20 border-t border-[#D8D2C4] bg-[#FBFAF6]">
          <div className={`${wrap} grid gap-10 py-12 sm:gap-14 sm:py-[88px] lg:grid-cols-2`}>
            <div className="flex max-w-[440px] flex-col gap-4 sm:gap-[18px]">
              <h2 className={h2}>Skal vi komme ud og kigge?</h2>
              <p className="text-base leading-[1.6] sm:text-lg">
                Ring direkte, hvis det haster. Skriv, hvis opgaven er større, og fortæl gerne lidt om huset. Vi svarer samme dag på hverdage.
              </p>
              <p className="text-[28px] font-semibold">
                <a href={TEL} className="whitespace-nowrap hover:text-[#2E4A3B]">
                  {PHONE}
                </a>
              </p>
              <p className={`text-[13px] text-[#5E5850] ${mono}`}>Man–fre kl. 7–16 · {ADDRESS}</p>
            </div>
            <form
              className="flex max-w-[520px] flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
                e.currentTarget.reset();
              }}
            >
              {sent && (
                <p role="status" className="rounded-[3px] bg-[#E4ECE6] p-4 text-[#1F3A2C]">
                  Tak. På en rigtig side ville Jens ringe dig op i dag eller i morgen formiddag. Dette er et eksempel, så der er ikke sendt noget.
                </p>
              )}
              <label className="flex flex-col gap-1.5 text-[15px] font-medium">
                Navn
                <input required name="navn" type="text" autoComplete="name" className={field} />
              </label>
              <label className="flex flex-col gap-1.5 text-[15px] font-medium">
                Telefon
                <input required name="telefon" type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9 +]{8,}" title="Skriv et telefonnummer på mindst 8 cifre" className={field} />
              </label>
              <label className="flex flex-col gap-1.5 text-[15px] font-medium">
                Hvad drejer det sig om?
                <textarea required name="opgave" rows={4} placeholder="Fx nyt tag på et parcelhus fra 1972 i Svogerslev" className={`${field} resize-y`} />
              </label>
              <button type="submit" className={`${btn} inline-flex self-start px-6 py-[15px] text-[17px]`}>
                Send forespørgsel
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-[#1E1C18] pb-24 text-[#CFC8B8] sm:pb-0">
        <div className={`${wrap} flex flex-wrap justify-between gap-x-8 gap-y-3 py-10 text-sm`}>
          <span className="font-semibold text-[#F3F0E8]">Egholm Tømrer &amp; Snedker</span>
          <span>{ADDRESS}</span>
          <span className={mono}>CVR 00 00 00 00 (eksempel)</span>
          <a href={TEL} className="text-[#F3F0E8] underline underline-offset-2">
            {PHONE}
          </a>
        </div>
      </footer>

      {/* Phone: call or book, always within thumb's reach */}
      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2.5 border-t border-[#D8D2C4] bg-[#F3F0E8] px-4 pb-4 pt-3 sm:hidden">
        <a href={TEL} className="grid h-[52px] place-items-center whitespace-nowrap rounded-[3px] border border-[#1E1C18] font-semibold">
          Ring til Jens
        </a>
        <a href="#kontakt" className={`${btn} flex h-[52px]`}>
          <span className="min-[360px]:hidden">Book tid</span>
          <span className="hidden min-[360px]:inline">Book besigtigelse</span>
        </a>
      </div>
    </div>
  );
}
