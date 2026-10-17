"use client";

import { useEffect, useState } from "react";
import { DemoNote, Img, SampleReviewsNote, Stars } from "./shared";

/*
 * Bøgh Gulve, built like light falling across a freshly sanded floor: white walls, raw oak, one dark
 * oiled-oak colour for the buttons, a quiet book serif for headings. The page is organised around the
 * customer's own question ("what does my floor need, what does it cost, how long can't we use the room")
 * and the job list is cut as long planks, laid with staggered ends like a real floor.
 */

const PHONE = "67 89 01 23";
const TEL = "tel:+4567890123";
const ADDRESS = "Kornmarken 7B, 3400 Hillerød";

const serif = "font-(family-name:--font-boegh-serif)";

type TreatId = "lak" | "olie" | "saebe" | "nyt";

const TREATS: {
  id: TreatId;
  name: string;
  when: string;
  rate: number | null;
  days: number;
  use: string;
}[] = [
  {
    id: "lak",
    name: "Slibning og lak",
    when: "Lakken er slidt grå i gangzonen, eller der er ridser fra stoleben. Lak er det mest slidstærke og det letteste at holde rent.",
    rate: 235,
    days: 2,
    use: "I kan gå på gulvet i strømpesokker dagen efter sidste lag. Møbler med filtdupper efter tre døgn. Tæpper først efter to uger, når lakken er hærdet.",
  },
  {
    id: "olie",
    name: "Slibning og olie",
    when: "Du vil have en mat overflade, hvor man kan se træet. Olie kan pletrepareres, men skal have plejeolie en til to gange om året.",
    rate: 250,
    days: 2,
    use: "Gulvet kan betrædes forsigtigt efter et døgn. Vask det ikke med vand den første uge.",
  },
  {
    id: "saebe",
    name: "Slibning og sæbe",
    when: "Til lyse gulve i fyr eller eg, der skal blive lyse. Den gamle nordiske behandling. Gulvet skal vaskes med sæbespåner hver anden uge eller deromkring.",
    rate: 215,
    days: 1,
    use: "Rummet kan bruges samme aften. Gulvet bliver først rigtigt mættet efter de første fem til ti vaske.",
  },
  {
    id: "nyt",
    name: "Nyt gulv",
    when: "Planker, parket eller sildeben. Prisen afhænger meget af træet og af underlaget, så den regner vi ud, når vi har set rummet.",
    rate: null,
    days: 0,
    use: "",
  },
];

const MIN_PRICE = 3800;
const kr = (n: number) => `${n.toLocaleString("da-DK")} kr.`;

// Planks: long, narrow crops, laid with staggered ends.
const JOBS: { photo: string; alt: string; title: string; place: string; when: string; facts: string; text: string; offset: string }[] = [
  {
    photo: "1668910242969-bd2933e7a5cf",
    alt: "Stue med trægulv og et vindue ud mod et hus og træer",
    title: "Gamle fyrreplanker i et husmandssted",
    place: "Alsønderup",
    when: "september 2026",
    facts: "64 m² · lud og sæbe · 2 dage",
    text: "Plankerne var malet brune i 70'erne. Vi sleb malingen af i tre omgange, ludbehandlede og sæbede. Et par planker ved brændeovnen blev skiftet med genbrugstræ fra samme hus.",
    offset: "lg:mr-[14%]",
  },
  {
    photo: "1761053130711-2515ef532bb5",
    alt: "Sildebensgulv i eg set tæt på",
    title: "Sildeben i eg i en nyistandsat lejlighed",
    place: "Hillerød C",
    when: "august 2026",
    facts: "38 m² · lagt og olieret · 6 dage",
    text: "Lagt på et nyt, afrettet undergulv med en bort af to planker langs væggene. Det tog en hel dag bare at sætte midterlinjen ud.",
    offset: "lg:ml-[10%]",
  },
  {
    photo: "1721395290083-895bf53d6178",
    alt: "Tomt rum med lyst trægulv og hvide vægge",
    title: "Børneværelser i et rækkehus, mens familien var på ferie",
    place: "Fredensborg",
    when: "juli 2026",
    facts: "2 rum · 24 m² · slibning og olie · 2 dage",
    text: "Nøglen lå i postkassen. Vi sendte billeder hver aften, så de kunne se, hvordan det gik.",
    offset: "lg:mr-[6%]",
  },
  {
    photo: "1598718544285-7180f670198b",
    alt: "Stue med brunt parketgulv og hvide vægge",
    title: "Parket fra 1978, slebet for første gang",
    place: "Allerød",
    when: "juni 2026",
    facts: "52 m² · slibning og lak · 3 dage",
    text: "Der var stadig nok slidlag til en slibning, men kun lige. Vi sleb forsigtigt og lagde tre lag mat lak. Næste gang skal der nok nyt gulv.",
    offset: "lg:ml-[18%]",
  },
];

const PRICES: { what: string; note?: string; price: string }[] = [
  { what: "Opmåling og besigtigelse", note: "trækkes fra, hvis du siger ja", price: "450 kr." },
  { what: "Slibning og lak", price: "235 kr./m²" },
  { what: "Slibning og olie", price: "250 kr./m²" },
  { what: "Slibning og sæbe", price: "215 kr./m²" },
  { what: "Hvidpigment i lak eller olie", note: "tillæg", price: "40 kr./m²" },
  { what: "Trappe, slibning og lak", price: "650 kr. pr. trin" },
  { what: "Mindstepris pr. opgave", price: kr(MIN_PRICE) },
  { what: "Nyt plankegulv eller parket", note: "arbejdsløn, træet kommer oveni", price: "320–420 kr./m²" },
  { what: "Sildeben", note: "arbejdsløn, træet kommer oveni", price: "750–950 kr./m²" },
];

const DAYS: { when: string; text: string }[] = [
  { when: "Dag 1, kl. 7.30", text: "Vi dækker døre og stikkontakter af, tager fodlister løs, hvor det er nødvendigt, og grovsliber. Sidst på dagen kitter vi revner og huller fra gamle søm." },
  { when: "Dag 1, eftermiddag", text: "Finslibning med kantmaskine langs væggene og i hjørnerne. Så støvsuger vi to gange og tørrer gulvet af." },
  { when: "Dag 2", text: "Grundbehandling og første lag. Lakken skal tørre mellem hvert lag, så vi går ud af huset et par timer ad gangen." },
  { when: "Dag 2, sidst", text: "Sidste lag. Vi sætter fodlister på igen, hvis de ikke skal males, og lægger en seddel om, hvornår I må flytte ind igen." },
];

const REVIEWS: { stars: number; date: string; text: string; name: string; reply?: string }[] = [
  { stars: 5, date: "22. sep. 2026", text: "Vi var sikre på, at gulvet var for slidt. Anders kiggede på det i ti minutter og sagde, at der var en slibning til. Han fik ret.", name: "Kirsten, Allerød" },
  {
    stars: 4,
    date: "9. aug. 2026",
    text: "Gulvet er blevet flot, og de var søde og ryddelige. Der lå dog mere støv på reolerne i stuen ved siden af, end vi havde regnet med.",
    name: "Peter, Hillerød",
    reply: "Tak, Peter. Døren til stuen skulle have været tapet til, og det glemte vi. Vi har sat det på vores tjekliste for første dag.",
  },
  { stars: 5, date: "30. jun. 2026", text: "Sildeben i hele lejligheden. Det tog en dag mere end aftalt, men vi fik besked om morgenen og ingen ekstra regning.", name: "Sanne, Hillerød" },
  { stars: 5, date: "11. maj 2026", text: "Fik slebet og sæbebehandlet vores gamle fyrregulv. Nikolaj viste os, hvordan vi skal vaske det. Det havde ingen fortalt os før.", name: "Jonas, Gilleleje" },
];

const NAV = [
  ["#beregn", "Hvad koster det"],
  ["#opgaver", "Opgaver"],
  ["#om", "Om os"],
  ["#kontakt", "Kontakt"],
] as const;

const wrap = "mx-auto max-w-[1180px] px-4 sm:px-8";
const h2 = `${serif} text-[32px] font-normal leading-[1.08] tracking-[-0.01em] sm:text-[44px]`;
const btn = "inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[#3E2C1E] font-bold text-[#FBF8F2] transition-colors hover:bg-[#2A1D12]";
const field = "w-full rounded-[4px] border border-[#B9AD99] bg-white px-3.5 py-3 text-base font-normal text-[#2B2620] placeholder:text-[#8E8475]";
const muted = "text-[#685E52]";

export function GulvSite() {
  const [menu, setMenu] = useState(false);
  const [treat, setTreat] = useState<TreatId>("lak");
  const [m2, setM2] = useState("24");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const t = TREATS.find((x) => x.id === treat)!;
  const area = Math.max(0, Math.min(400, Number(m2.replace(",", ".")) || 0));
  const raw = t.rate ? area * t.rate : 0;
  const price = Math.max(MIN_PRICE, Math.round(raw / 100) * 100);
  const days = t.days + (area > 60 ? 1 : 0) + (area > 120 ? 1 : 0);

  return (
    <div className="min-h-dvh overflow-x-clip bg-[#F6F4EF] font-(family-name:--font-boegh) text-[#2B2620] [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-[#3E2C1E]">
      <DemoNote className="bg-[#2B2620] text-[#E2D8C6]" />

      <header className="relative z-40 border-b border-[#DDD4C5] bg-[#F6F4EF]">
        <div className={`${wrap} flex items-center justify-between gap-4 py-3.5 lg:py-5`}>
          <a href="#top" className="flex min-w-0 items-baseline gap-2.5 whitespace-nowrap">
            <span className={`${serif} text-[26px] leading-none sm:text-[30px]`}>Bøgh Gulve</span>
            <span className={`hidden text-sm sm:inline ${muted}`}>Hillerød</span>
          </a>
          <nav aria-label="Hovedmenu" className="hidden gap-7 whitespace-nowrap lg:flex">
            {NAV.map(([href, label]) => (
              <a key={href} href={href} className="underline-offset-4 hover:underline">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-4">
            <a href={TEL} className="hidden whitespace-nowrap font-bold sm:inline">
              {PHONE}
            </a>
            <button
              type="button"
              aria-label={menu ? "Luk menu" : "Åbn menu"}
              aria-expanded={menu}
              aria-controls="boegh-menu"
              onClick={() => setMenu((m) => !m)}
              className="grid size-11 place-items-center rounded-full border border-[#B9AD99] lg:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
              </svg>
            </button>
          </div>
        </div>
        {menu && (
          <nav id="boegh-menu" aria-label="Menu" className="border-t border-[#DDD4C5] lg:hidden">
            <ul className={`${wrap} py-2`}>
              {NAV.map(([href, label]) => (
                <li key={href}>
                  <a href={href} onClick={() => setMenu(false)} className={`${serif} block border-b border-[#DDD4C5] py-3.5 text-[22px]`}>
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
        {/* Hero: the sentence first, then the floor in a long low crop, the way light lies across it */}
        <section id="top" className="pb-12 pt-8 sm:pb-20 sm:pt-14">
          <div className={`${wrap} grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-end lg:gap-16`}>
            <h1 className={`${serif} text-[42px] font-normal leading-[1.02] tracking-[-0.015em] sm:text-[60px] lg:text-[72px]`}>
              Vi sliber gulvet den ene dag og lakerer det den næste.
            </h1>
            <div className="flex flex-col gap-5 lg:pb-2">
              <p className="text-[17px] leading-[1.6] sm:text-lg">
                Bøgh Gulve sliber, olierer, sæber og lægger trægulve i Hillerød og resten af Nordsjælland. Det er Anders eller Nikolaj, der kommer, og de har gjort det sammen siden 2014.
              </p>
              <div className="hidden flex-wrap items-center gap-x-5 gap-y-3 sm:flex">
                <a href="#beregn" className={`${btn} px-7 py-4 text-[17px]`}>
                  Regn din pris ud
                </a>
                <a href={TEL} className="whitespace-nowrap font-bold underline underline-offset-4">
                  eller ring {PHONE}
                </a>
              </div>
            </div>
          </div>
          <figure className="mx-auto mt-8 max-w-[1400px] sm:mt-12 sm:px-8">
            <Img
              priority
              id="1562582664-8a8803c031ca"
              w={1800}
              alt="Trægulv med sollys, der falder ind over plankerne"
              className="aspect-[16/9] w-full object-cover sm:aspect-[21/8] sm:rounded-[2px]"
            />
            <figcaption className={`mt-2.5 flex flex-wrap justify-between gap-x-4 px-4 text-[13px] sm:px-0 ${muted}`}>
              <span>Egeplanker efter slibning og to lag olie, Hillerød</span>
              <span>Oktober 2026 · 31 m²</span>
            </figcaption>
          </figure>
        </section>

        {/* What does my floor need, and what does it cost */}
        <section id="beregn" className="scroll-mt-4 bg-[#E9DFCC]">
          <div className={`${wrap} grid gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16`}>
            <div>
              <h2 className={h2}>Hvad skal dit gulv have?</h2>
              <p className="mt-4 max-w-[52ch] leading-[1.6] sm:text-[17px]">
                Vælg det, der passer bedst, og skriv hvor mange kvadratmeter. Er du i tvivl, så tag et billede af gulvet i dagslys og send det til os.
              </p>
              <fieldset className="mt-7">
                <legend className="sr-only">Behandling</legend>
                <div className="border-t border-[#2B2620]">
                  {TREATS.map((x) => (
                    <label key={x.id} className={`flex cursor-pointer gap-4 border-b border-[#CDBFA6] py-4 transition-colors ${treat === x.id ? "" : "hover:bg-[#E2D6C0]"}`}>
                      <input
                        type="radio"
                        name="treat"
                        value={x.id}
                        checked={treat === x.id}
                        onChange={() => setTreat(x.id)}
                        className="mt-1.5 size-[18px] shrink-0 accent-[#3E2C1E]"
                      />
                      <div className="min-w-0">
                        <b className={`${serif} block text-[22px] font-medium leading-tight`}>{x.name}</b>
                        <small className="mt-1.5 block text-[15px] leading-[1.55] text-[#4A4238]">{x.when}</small>
                      </div>
                      {x.rate && <b className="ml-auto shrink-0 whitespace-nowrap pt-1 text-[15px] font-medium tabular-nums">{x.rate} kr./m²</b>}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="lg:pt-[92px]">
              <div className="border-y-2 border-[#2B2620] bg-[#F6F4EF] px-5 py-6 sm:px-7 sm:py-8 lg:sticky lg:top-6">
                {t.rate ? (
                  <>
                    <label htmlFor="m2" className="block font-bold">
                      Gulvareal
                    </label>
                    <div className="mt-2 flex items-center gap-3">
                      <input
                        id="m2"
                        inputMode="decimal"
                        value={m2}
                        onChange={(e) => setM2(e.target.value.replace(/[^\d,.]/g, "").slice(0, 5))}
                        className={`${field} max-w-[140px] text-xl tabular-nums`}
                      />
                      <span className="text-lg">m²</span>
                    </div>
                    <dl className="mt-6 flex flex-col gap-4" aria-live="polite">
                      <div>
                        <dt className={`text-sm ${muted}`}>{t.name}, ca. pris inkl. moms</dt>
                        <dd className={`${serif} mt-0.5 text-[44px] leading-none tabular-nums`}>{area ? kr(price) : "–"}</dd>
                        {area > 0 && raw < MIN_PRICE && <dd className={`mt-1.5 text-sm ${muted}`}>Mindstepris for en opgave er {kr(MIN_PRICE)}.</dd>}
                      </div>
                      <div className="border-t border-[#DDD4C5] pt-4">
                        <dt className={`text-sm ${muted}`}>Vi er hos dig</dt>
                        <dd className="mt-0.5 text-lg font-bold">
                          {days} {days === 1 ? "arbejdsdag" : "arbejdsdage"}
                        </dd>
                      </div>
                      <div className="border-t border-[#DDD4C5] pt-4">
                        <dt className={`text-sm ${muted}`}>Bagefter</dt>
                        <dd className="mt-0.5 leading-[1.55]">{t.use}</dd>
                      </div>
                    </dl>
                    <p className={`mt-6 text-sm leading-[1.55] ${muted}`}>
                      Vejledende priser inkl. moms. Den faste pris får du efter opmålingen. Møblerne skal være ude af rummet, inden vi kommer.
                    </p>
                  </>
                ) : (
                  <>
                    <p className={`${serif} text-[26px] leading-tight`}>Nyt gulv regner vi ud på stedet.</p>
                    <p className="mt-3 leading-[1.6]">
                      Arbejdslønnen for et plankegulv er typisk 320–420 kr./m² og for sildeben 750–950 kr./m², inkl. moms. Træet kommer oveni, og prisen på eg svinger meget. Vi tager prøver med ud, så du kan se træet i dit eget lys.
                    </p>
                  </>
                )}
                <a href="#kontakt" className={`${btn} mt-6 w-full px-6 py-4 text-[17px]`}>
                  Book opmåling, 450 kr.
                </a>
                <p className={`mt-2.5 text-center text-sm ${muted}`}>Beløbet trækkes fra, hvis du siger ja.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How the days go */}
        <section className={`${wrap} grid gap-8 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16`}>
          <div className="flex flex-col gap-4">
            <h2 className={h2}>Sådan går de to dage</h2>
            <p className="leading-[1.6] sm:text-[17px]">For et almindeligt rum på 20–40 m² med lak. Olie går lige så hurtigt, sæbe en dag hurtigere.</p>
            <p className={`border-l-2 border-[#B9AD99] pl-4 leading-[1.6] ${muted}`}>
              <b className="font-bold text-[#2B2620]">Om støv:</b> Vores slibemaskiner har sugeren koblet direkte på. Det er ikke helt støvfrit, men der ligger ikke et lag på reolerne bagefter. Luk dørene til de andre rum, så taper vi dem til.
            </p>
          </div>
          <ol className="border-t border-[#2B2620]">
            {DAYS.map((d) => (
              <li key={d.when} className="grid gap-1 border-b border-[#DDD4C5] py-5 sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-6">
                <p className={`${serif} text-[20px] italic leading-snug`}>{d.when}</p>
                <p className="leading-[1.6]">{d.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Jobs, cut as planks */}
        <section id="opgaver" className="scroll-mt-4 border-t border-[#DDD4C5] py-14 sm:py-20">
          <div className={wrap}>
            <div className="flex max-w-[640px] flex-col gap-3">
              <h2 className={h2}>Gulve fra i år</h2>
              <p className="leading-[1.6] sm:text-[17px]">Sted, måned, størrelse og behandling. Vil du se et af gulvene i virkeligheden, så spørg. De fleste kunder siger ja.</p>
            </div>
            <ul className="mt-10 flex flex-col gap-10 sm:gap-14">
              {JOBS.map((j) => (
                <li key={j.title} className={j.offset}>
                  <Img id={j.photo} w={1600} alt={j.alt} className="aspect-[2/1] w-full rounded-[2px] object-cover sm:aspect-[4/1]" />
                  <div className="mt-3.5 grid gap-x-10 gap-y-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
                    <div>
                      <p className={`text-sm ${muted}`}>
                        {j.place} · {j.when}
                      </p>
                      <h3 className={`${serif} mt-1 text-[24px] leading-tight sm:text-[28px]`}>{j.title}</h3>
                      <p className="mt-1.5 text-[15px] font-bold">{j.facts}</p>
                    </div>
                    <p className="max-w-[56ch] leading-[1.6] text-[#4A4238] md:pt-6">{j.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className={`mt-10 text-sm ${muted}`}>Fotos fra Unsplash som pladsholdere. På din side bruger vi billeder af dine egne gulve.</p>
          </div>
        </section>

        {/* Prices as a plain list */}
        <section className="bg-[#2B2620] text-[#F1EBDF] [&_:focus-visible]:outline-[#F1EBDF]">
          <div className={`${wrap} grid gap-8 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-16`}>
            <div className="flex flex-col gap-4">
              <h2 className={h2}>Prisliste</h2>
              <p className="max-w-[44ch] leading-[1.6] text-[#CFC4B2]">
                Det, vi typisk tager. Er gulvet meget ujævnt, malet eller fuld af gamle søm, tager slibningen længere, og det siger vi, når vi har set det.
              </p>
              <p className="max-w-[44ch] text-sm leading-[1.6] text-[#CFC4B2]">
                Slibning giver normalt ikke håndværkerfradrag. Se reglerne på skat.dk.
              </p>
            </div>
            <table className="w-full border-collapse">
              <caption className="pb-3 text-left text-sm text-[#B5A994]">Vejledende priser inkl. moms, oktober 2026</caption>
              <tbody>
                {PRICES.map((p) => (
                  <tr key={p.what} className="border-y border-[#4D453B]">
                    <th scope="row" className="py-3.5 pr-4 text-left align-top font-normal">
                      {p.what}
                      {p.note && <span className="block text-sm text-[#B5A994]">{p.note}</span>}
                    </th>
                    <td className="whitespace-nowrap py-3.5 text-right align-top font-bold tabular-nums">{p.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* The two who come */}
        <section id="om" className={`${wrap} grid scroll-mt-4 gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-16`}>
          <div className="flex max-w-[600px] flex-col gap-5">
            <h2 className={h2}>Anders Bøgh og Nikolaj Friis</h2>
            <p className="text-[17px] leading-[1.65] sm:text-lg">
              Jeg blev udlært gulvlægger i 2006 og startede for mig selv i 2014. Nikolaj kom med året efter. Vi er to, og det bliver vi ved med at være. Så ved du, hvem der står i din stue.
            </p>
            <p className="text-[17px] leading-[1.65] sm:text-lg">
              Det meste, vi laver, er slibning af gamle gulve i villaer og rækkehuse. Om vinteren lægger vi nye gulve, og sildeben er det, vi helst laver.
            </p>
            <p className={`${serif} text-[22px] italic`}>Anders</p>
          </div>
          <dl className="grid grid-cols-[max-content_minmax(0,1fr)] content-start gap-x-6 gap-y-3 border-t border-[#2B2620] pt-5 text-[15px]">
            <dt className={muted}>Adresse</dt>
            <dd>{ADDRESS}</dd>
            <dt className={muted}>Telefon</dt>
            <dd>
              <a href={TEL} className="font-bold underline underline-offset-2">
                {PHONE}
              </a>
              , man–fre kl. 7–15.30
            </dd>
            <dt className={muted}>Kører til</dt>
            <dd>Hillerød, Allerød, Fredensborg, Gribskov og Halsnæs</dd>
            <dt className={muted}>Ventetid nu</dt>
            <dd>Slibning ca. 2 uger, nye gulve ca. 5 uger</dd>
            <dt className={muted}>CVR</dt>
            <dd>00 00 00 00 (eksempel)</dd>
            <dt className={muted}>Medlem af</dt>
            <dd>Gulvbranchen og Byg Garanti (eksempel)</dd>
          </dl>
        </section>

        {/* Reviews */}
        <section className="border-t border-[#DDD4C5] bg-[#FBFAF6]">
          <div className={`${wrap} py-14 sm:py-20`}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
              <h2 className={h2}>Det skriver kunderne</h2>
              <SampleReviewsNote className={muted} />
            </div>
            <div className="mt-8 grid gap-x-14 md:grid-cols-2">
              {REVIEWS.map((r) => (
                <figure key={r.name} className="flex flex-col gap-2.5 border-t border-[#DDD4C5] py-6">
                  <p className={`flex flex-wrap items-center gap-x-3 text-sm ${muted}`}>
                    <Stars n={r.stars} className="text-[#3E2C1E]" />
                    <span>{r.date}</span>
                  </p>
                  <blockquote className={`${serif} text-[20px] leading-[1.45]`}>{r.text}</blockquote>
                  <figcaption className={`text-[15px] ${muted}`}>{r.name}</figcaption>
                  {r.reply && (
                    <p className="mt-1 border-l-2 border-[#B9AD99] pl-4 text-[15px] leading-[1.55]">
                      <b className="font-bold">Svar fra Anders:</b> {r.reply}
                    </p>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="kontakt" className="scroll-mt-4 border-t border-[#DDD4C5]">
          <div className={`${wrap} grid gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16`}>
            <div className="flex max-w-[460px] flex-col gap-4">
              <h2 className={h2}>Book en opmåling</h2>
              <p className="text-[17px] leading-[1.6]">
                Vi kommer ud, måler op og kigger på slidlaget. Det koster 450 kr. inkl. moms, og beløbet trækkes fra, hvis du siger ja. Du har en fast pris dagen efter.
              </p>
              <p className="leading-[1.6]">Ring, hvis du har spørgsmål. Skriv, hvis du vil have en tid.</p>
              <p className={`${serif} text-[34px]`}>
                <a href={TEL} className="whitespace-nowrap hover:underline">
                  {PHONE}
                </a>
              </p>
              <p className={`text-sm ${muted}`}>Man–fre kl. 7–15.30 · {ADDRESS}</p>
            </div>
            <form
              className="grid gap-4 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
                e.currentTarget.reset();
              }}
            >
              {sent && (
                <p role="status" className="rounded-[4px] bg-[#E9DFCC] p-4 leading-[1.55] sm:col-span-2">
                  Tak. På en rigtig side ville Anders ringe dig op inden for et døgn og aftale en tid. Dette er et eksempel, så der er ikke sendt noget.
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
                Postnummer
                <input required name="postnr" inputMode="numeric" pattern="\d{4}" maxLength={4} title="Fire cifre" className={field} />
              </label>
              <label className="flex flex-col gap-1.5 font-bold">
                Behandling
                <select name="behandling" defaultValue={t.name} key={t.id} className={field}>
                  {TREATS.map((x) => (
                    <option key={x.id}>{x.name}</option>
                  ))}
                  <option>Ved ikke endnu</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5 font-bold sm:col-span-2">
                Om gulvet
                <textarea name="besked" rows={4} placeholder="Fx parket fra 80'erne i stue og køkken, ca. 45 m²" className={`${field} resize-y`} />
              </label>
              <div className="sm:col-span-2">
                <button type="submit" className={`${btn} px-7 py-4 text-[17px]`}>
                  Send
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#DDD4C5] pb-28 sm:pb-0">
        <div className={`${wrap} flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 py-10 text-sm ${muted}`}>
          <span className={`${serif} text-xl text-[#2B2620]`}>Bøgh Gulve</span>
          <span>{ADDRESS}</span>
          <span>CVR 00 00 00 00 (eksempel)</span>
          <a href={TEL} className="font-bold text-[#2B2620] underline underline-offset-2">
            {PHONE}
          </a>
        </div>
      </footer>

      {/* Phone: call or book, within thumb's reach */}
      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2.5 border-t border-[#DDD4C5] bg-[#F6F4EF] px-4 pb-4 pt-3 sm:hidden">
        <a href={TEL} className="grid h-[52px] place-items-center whitespace-nowrap rounded-full border border-[#2B2620] font-bold">
          Ring til Anders
        </a>
        <a href="#beregn" className={`${btn} h-[52px]`}>
          <span className="min-[360px]:hidden">Pris</span>
          <span className="hidden min-[360px]:inline">Regn prisen ud</span>
        </a>
      </div>
    </div>
  );
}
