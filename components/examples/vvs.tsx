"use client";

import { useEffect, useState } from "react";
import { DemoNote, Img, SampleReviewsNote, Stars, useOpenNow, type Hours } from "./shared";

/*
 * Holm VVS, built like the side of the service van and the invoice that follows it: marine blue,
 * white tiles and copper, with alarm orange kept for one thing only, calling the emergency line.
 * Condensed caps for the lettering, a plain sans for prices and instructions. No cards, no shadows,
 * no motion. What a customer needs at 3 a.m. comes first: who answers, what it costs, what to do now.
 */

const PHONE = "12 34 56 78";
const TEL = "tel:+4512345678";
const ADDRESS = "Kobbervej 7, 2730 Herlev";

// Colours: van marine #0F2742 (deep #0A1B2F), alarm orange #F26419 for calling only, copper #9A4E25,
// tile white #F6F7F5, grout #D5DADC, muted text #4A5868.

const display = "font-(family-name:--font-holm-display) uppercase";

const HOURS: Hours = [
  { day: "Mandag", open: "07:00", close: "16:00" },
  { day: "Tirsdag", open: "07:00", close: "16:00" },
  { day: "Onsdag", open: "07:00", close: "16:00" },
  { day: "Torsdag", open: "07:00", close: "16:00" },
  { day: "Fredag", open: "07:00", close: "14:00" },
  { day: "Lørdag", open: "", close: "" },
  { day: "Søndag", open: "", close: "" },
];

const STEPS: { title: string; text: string }[] = [
  { title: "Du ringer", text: "Den, der har vagten, tager telefonen selv. Også kl. 3 om natten. Der er ingen telefonsvarer." },
  { title: "Vi spørger ind", text: "Vi spørger, hvad der sker, og siger, hvad du kan gøre, mens du venter. Som regel er det at lukke for hovedhanen." },
  { title: "Bilen kører", text: "I Herlev og nabokommunerne er vi typisk hos dig inden for en time. Vi ringer, når vi drejer ind på din vej." },
  { title: "Prisen", text: "Aften, nat og weekend koster fremmøde 1.495 kr. med den første halve time. Ser det ud til at tage mere end en time, siger vi prisen, før vi går i gang." },
];

const WHILE_YOU_WAIT: { title: string; text: string }[] = [
  {
    title: "Luk for hovedhanen",
    text: "Den sidder ved vandmåleren: i bryggerset, i kælderen eller under køkkenvasken i en lejlighed. Drej med uret, til den stopper. Sidder den fast, så lad være med at tvinge den.",
  },
  {
    title: "Slå strømmen fra til vandvarmeren",
    text: "Hvis det er en el-vandvarmer, der lækker. Sikringen er tit mærket ”VVB” eller ”Vandvarmer” i eltavlen.",
  },
  {
    title: "Luk fjernvarmen ved unitten",
    text: "Er vandet varmt, kommer det fra varmen. Der sidder to haner ved måleren, frem og retur. Luk dem begge.",
  },
  {
    title: "Tag billeder, før du tørrer op",
    text: "Forsikringen vil gerne se skaden. Vi kan tit se på et billede, hvilke dele vi skal have med i bilen.",
  },
  {
    title: "Hæld ikke afløbsrens i",
    text: "Et stoppet afløb bliver sjældent bedre af det, og vi skal arbejde i det bagefter.",
  },
];

type Row = { what: string; note?: string; price: string };
const PRICES: { group: string; rows: Row[] }[] = [
  {
    group: "Timer og kørsel",
    rows: [
      { what: "Kørsel", note: "Herlev og nabokommuner", price: "395 kr." },
      { what: "VVS-montør", note: "pr. påbegyndt halve time", price: "795 kr./t" },
      { what: "Lærling", price: "450 kr./t" },
    ],
  },
  {
    group: "Døgnvagt, aften, nat og weekend",
    rows: [
      { what: "Fremmøde", note: "med den første halve time", price: "1.495 kr." },
      { what: "Timepris derefter", price: "1.195 kr./t" },
    ],
  },
  {
    group: "Faste priser, med kørsel og smådele",
    rows: [
      { what: "Skift af blandingsbatteri", note: "køkken eller bad, du køber batteriet", price: "1.450 kr." },
      { what: "Nyt toilet monteret", note: "hvidt gulvtoilet, det gamle kører vi væk", price: "7.900 kr." },
      { what: "Ny skyllemekanisme i cisterne", price: "1.150 kr." },
      { what: "Stoppet håndvask eller køkkenafløb", price: "fra 1.190 kr." },
      { what: "Eftersyn af fjernvarmeunit", price: "1.395 kr." },
      { what: "Udluftning og indregulering af radiatorer", note: "parcelhus", price: "1.850 kr." },
    ],
  },
  {
    group: "Større opgaver",
    rows: [{ what: "Nyt badeværelse", note: "besigtigelse 595 kr., trækkes fra, hvis du siger ja", price: "Fast pris" }],
  },
];

const INVOICE: [string, string][] = [
  ["Kørsel, Herlev", "395,00"],
  ["VVS-montør, 1 time", "795,00"],
  ["Kuglehane ½″ og to fittings", "186,00"],
];

const WEEK: { day: string; place: string; job: string; time: string; night?: boolean }[] = [
  { day: "Man 5.10", place: "Herlev", job: "Stoppet køkkenafløb, renset fra rensestykket", time: "1 t" },
  { day: "Man 5.10", place: "Skovlunde", job: "Nyt toilet i rækkehus fra 1971", time: "2,5 t" },
  { day: "Tir 6.10", place: "Hjortespring", job: "Ny varmtvandsbeholder, 110 liter", time: "6 t" },
  { day: "Ons 7.10", place: "Søborg", job: "Badeværelse, dag 4 af 9: nye rør i væggen", time: "8 t" },
  { day: "Tor 8.10", place: "Herlev", job: "Utæt ventil under køkkenvask", time: "1 t" },
  { day: "Tor 8.10, kl. 02.40", place: "Herlev", job: "Utæt samling på radiatorrør, vand gennem loftet", time: "1,5 t", night: true },
  { day: "Fre 9.10", place: "Ballerup", job: "Eftersyn af fjernvarmeunit", time: "1 t" },
  { day: "Lør 10.10", place: "Gladsaxe", job: "Toilet løb over, stop i faldstammen", time: "2 t", night: true },
];

const REVIEWS: { stars: number; date: string; text: string; name: string; reply?: string }[] = [
  {
    stars: 5,
    date: "11. okt. 2026",
    text: "Ringede kl. 6.40 en søndag med vand ned gennem loftet. Kasper var her kl. 7.30 og forklarede, hvad der var sket, før han gik i gang.",
    name: "Mette, Herlev",
  },
  {
    stars: 4,
    date: "22. sep. 2026",
    text: "Det nye badeværelse er rigtig fint, og prisen holdt. En stjerne trækkes, fordi vi stod uden toilet en dag længere end aftalt.",
    name: "Lars, Ballerup",
    reply:
      "Det er rigtigt, Lars. Toilettet kom ikke fra grossisten, og det skulle vi have sagt om morgenen og ikke sidst på dagen. Nu stiller vi et midlertidigt toilet op, når det sker.",
  },
  {
    stars: 5,
    date: "3. sep. 2026",
    text: "Fik skiftet blandingsbatteri. Han lagde en klud i vasken, så skruerne ikke forsvandt i afløbet. Den slags lægger man mærke til.",
    name: "Aisha, Gladsaxe",
  },
  {
    stars: 5,
    date: "14. aug. 2026",
    text: "Fjernvarmeunitten larmede. Ali fandt luft i systemet og var færdig på 40 minutter. Regningen var på det, han havde sagt.",
    name: "Peter, Husum",
  },
];

const NAV = [
  ["#mens-du-venter", "Mens du venter"],
  ["#priser", "Priser"],
  ["#opgaver", "Opgaver"],
  ["#om", "Om os"],
  ["#kontakt", "Kontakt"],
] as const;

const TILES = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cpath d='M64 0V64H0' fill='none' stroke='%23D5DADC' stroke-width='1.5'/%3E%3C/svg%3E")`;

const wrap = "mx-auto max-w-[1200px] px-4 sm:px-8";
const h2 = `${display} text-[40px] font-bold leading-[1] tracking-[0.01em] sm:text-[56px]`;
const callBtn = "items-center justify-center whitespace-nowrap rounded-[2px] bg-[#F26419] font-bold text-[#0F2742] transition-colors hover:bg-[#FF7A33]";
const field = "w-full rounded-[2px] border border-[#8C99A6] bg-white px-3.5 py-3 text-base text-[#0F2742] placeholder:text-[#6B7785]";

function PhoneGlyph({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </svg>
  );
}

/** Who answers right now: the office in working hours, the on-call plumber the rest of the day. */
function OnCallStatus() {
  const state = useOpenNow(HOURS);
  if (!state) return <p className="text-[15px] leading-snug text-[#C9D3DD]">Kontoret har åbent på hverdage. Resten af døgnet tager vagten telefonen.</p>;
  return (
    <p className="flex items-start gap-2.5 text-[15px] leading-snug text-white">
      <span className={`mt-1.5 size-2.5 shrink-0 rounded-full ${state.open ? "bg-[#7FD18B]" : "bg-[#F26419]"}`} aria-hidden />
      {state.open ? "Kontoret har åbent nu. Lene tager telefonen og sender den nærmeste bil." : "Kontoret er lukket nu. Den, der har vagten, tager telefonen."}
    </p>
  );
}

export function VvsSite() {
  const [menu, setMenu] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  return (
    <div className="min-h-dvh overflow-x-clip bg-white font-(family-name:--font-holm) text-[#0F2742] [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-[#0F2742]">
      <DemoNote className="bg-[#0A1B2F] text-[#C9D3DD]" />

      <header className="relative z-40 border-b border-[#D5DADC] bg-white sm:sticky sm:top-0">
        <div className={`${wrap} flex items-center justify-between gap-4 py-3`}>
          <a href="#top" className="flex min-w-0 flex-col leading-none">
            <span className={`${display} whitespace-nowrap text-[30px] font-extrabold tracking-[0.02em]`}>Holm VVS</span>
            <span className="mt-1 whitespace-nowrap text-[11px] font-medium text-[#4A5868] sm:text-xs">Aut. VVS-installatør · Herlev</span>
          </a>
          <nav aria-label="Hovedmenu" className="hidden gap-6 whitespace-nowrap text-[15px] font-medium lg:flex">
            {NAV.map(([href, label]) => (
              <a key={href} href={href} className="hover:text-[#9A4E25]">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-3">
            <a href={TEL} className={`${callBtn} hidden gap-2 px-4 py-2.5 text-[15px] sm:inline-flex`}>
              <PhoneGlyph className="size-4" />
              Døgnvagt {PHONE}
            </a>
            <button
              type="button"
              aria-label={menu ? "Luk menu" : "Åbn menu"}
              aria-expanded={menu}
              aria-controls="holm-menu"
              onClick={() => setMenu((m) => !m)}
              className="grid size-11 place-items-center rounded-[2px] border border-[#8C99A6] lg:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
        {menu && (
          <nav id="holm-menu" aria-label="Menu" className="border-t border-[#D5DADC] lg:hidden">
            <ul className={`${wrap} py-2`}>
              {NAV.map(([href, label]) => (
                <li key={href}>
                  <a href={href} onClick={() => setMenu(false)} className="block border-b border-[#D5DADC] py-3.5 text-lg font-medium">
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <a href={TEL} className="block py-3.5 text-lg font-bold">
                  Ring {PHONE}, døgnvagt
                </a>
              </li>
            </ul>
          </nav>
        )}
      </header>

      <main>
        {/* Hero: the van lettering on the left, the on-call board on the right */}
        <section id="top" className={`${wrap} grid gap-8 pb-10 pt-8 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-x-16 lg:gap-y-10 lg:pb-14 lg:pt-16`}>
          <div className="flex flex-col gap-6">
            <h1 className="flex flex-col gap-3">
              <span className={`${display} text-[72px] font-extrabold leading-[0.85] tracking-[0.005em] sm:text-[112px] lg:text-[136px]`}>Holm VVS</span>
              <span className="max-w-[22ch] text-[22px] font-semibold leading-[1.2] tracking-[-0.01em] sm:text-[28px]">Vand, varme og afløb i Herlev og nabokommunerne</span>
            </h1>
            <p className="max-w-[48ch] text-[17px] leading-[1.6] text-[#24384F] sm:text-lg">
              Vi er fem: Jonas, Kasper, Ali, lærlingen Emil og Lene på kontoret. Vi laver alt fra et toilet, der løber, til et nyt badeværelse, og vi har døgnvagt alle årets dage.
            </p>
            <dl className="grid max-w-[560px] grid-cols-[max-content_minmax(0,1fr)] gap-x-5 gap-y-1.5 border-t-2 border-[#9A4E25] pt-4 text-[15px]">
              <dt className="text-[#4A5868]">Autorisation</dt>
              <dd>VVS-installatør nr. 00000 (eksempel)</dd>
              <dt className="text-[#4A5868]">Kontor</dt>
              <dd>Hverdage kl. 7–16, fredag til 14</dd>
              <dt className="text-[#4A5868]">Værksted</dt>
              <dd>{ADDRESS}</dd>
            </dl>
          </div>

          <section aria-labelledby="vagt" className="flex flex-col gap-5 self-start lg:col-start-2 lg:row-span-2 lg:row-start-1 rounded-[2px] bg-[#0F2742] p-5 text-white sm:p-7">
            <div className="flex flex-col gap-3">
              <h2 id="vagt" className={`${display} text-[34px] font-bold leading-none tracking-[0.02em]`}>
                Døgnvagt
              </h2>
              <OnCallStatus />
            </div>
            <a href={TEL} className={`${callBtn} flex h-14 gap-2.5 text-xl`}>
              <PhoneGlyph />
              Ring {PHONE}
            </a>
            <ol className="flex flex-col border-t border-[#2C4561]">
              {STEPS.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[28px_minmax(0,1fr)] gap-x-2 border-b border-[#2C4561] py-3.5">
                  <span className="pt-px font-semibold tabular-nums text-[#E2A27C]">{i + 1}</span>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold">{s.title}</h3>
                    <p className="text-[15px] leading-[1.5] text-[#C9D3DD]">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="text-sm leading-normal text-[#C9D3DD]">
              Ikke akut?{" "}
              <a href="#kontakt" className="font-semibold text-white underline underline-offset-2">
                Skriv til Lene
              </a>
              , så finder vi en tid på en hverdag.
            </p>
          </section>

          <figure className="-mx-4 flex flex-col gap-2 sm:mx-0 lg:col-start-1 lg:row-start-2">
            <Img
              priority
              id="1676210134190-3f2c0d5cf58d"
              w={1400}
              alt="VVS-montør skifter en varmtvandsbeholder i et teknikrum"
              className="aspect-[3/2] w-full object-cover sm:rounded-[2px] lg:aspect-[16/10]"
            />
            <figcaption className="flex flex-wrap justify-between gap-x-4 px-4 text-[13px] text-[#4A5868] sm:px-0">
              <span>Ny varmtvandsbeholder, Hjortespring</span>
              <span>Oktober 2026 · 110 liter · 6 timer</span>
            </figcaption>
          </figure>
        </section>


        {/* What to do while we drive */}
        <section id="mens-du-venter" className="scroll-mt-20 border-y border-[#D5DADC] bg-[#F6F7F5] sm:mt-20" style={{ backgroundImage: TILES }}>
          <div className={`${wrap} grid gap-8 py-12 sm:py-20 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-16`}>
            <div className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
              <h2 className={h2}>Mens du venter på os</h2>
              <p className="max-w-[40ch] text-[17px] leading-[1.6] text-[#24384F]">
                Det meste af en vandskade sker i minutterne, før vi kommer. Find din hovedhane i dag, mens der ikke er travlt.
              </p>
            </div>
            <ol className="flex flex-col bg-white">
              {WHILE_YOU_WAIT.map((w, i) => (
                <li key={w.title} className="grid grid-cols-[40px_minmax(0,1fr)] gap-x-3 border border-b-0 border-[#D5DADC] px-4 py-5 last:border-b sm:grid-cols-[56px_minmax(0,1fr)] sm:px-6">
                  <span className={`${display} text-[32px] font-bold leading-none text-[#9A4E25]`}>{i + 1}</span>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-lg font-semibold leading-snug">{w.title}</h3>
                    <p className="max-w-[60ch] leading-[1.6] text-[#24384F]">{w.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Price list and an example invoice */}
        <section id="priser" className={`${wrap} grid scroll-mt-20 gap-10 py-12 sm:py-20 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16`}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h2 className={h2}>Prisliste</h2>
              <p className="max-w-[56ch] text-[17px] leading-[1.6] text-[#24384F]">
                Vi skriver tiden på regningen og tager betaling for hver påbegyndt halve time. Skal der dele til, står de med navn og pris.
              </p>
            </div>
            <table className="w-full border-collapse text-[15px] sm:text-base">
              <caption className="pb-2 text-left text-[13px] text-[#4A5868]">Vejledende priser inkl. moms, oktober 2026</caption>
              {PRICES.map((g) => (
                <tbody key={g.group}>
                  <tr>
                    <th colSpan={2} scope="colgroup" className="border-b-2 border-[#0F2742] pb-2 pt-6 text-left text-[13px] font-semibold uppercase tracking-[0.08em] text-[#9A4E25]">
                      {g.group}
                    </th>
                  </tr>
                  {g.rows.map((r) => (
                    <tr key={r.what} className="border-b border-[#D5DADC]">
                      <th scope="row" className="py-3 pr-4 text-left align-top font-medium">
                        {r.what}
                        {r.note && <span className="block text-sm font-normal text-[#4A5868]">{r.note}</span>}
                      </th>
                      <td className="whitespace-nowrap py-3 text-right align-top font-semibold tabular-nums">{r.price}</td>
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>

          <aside aria-labelledby="regning" className="flex flex-col gap-3 self-start lg:sticky lg:top-28">
            <h3 id="regning" className="text-lg font-semibold">
              Sådan ser en regning ud
            </h3>
            <div className="border border-[#8C99A6] bg-[#F6F7F5] p-5 text-[15px] sm:p-6">
              <div className="flex justify-between gap-4 border-b border-[#D5DADC] pb-3">
                <div className="flex flex-col">
                  <span className={`${display} text-2xl font-extrabold leading-none`}>Holm VVS</span>
                  <span className="mt-1 text-[13px] text-[#4A5868]">CVR 00 00 00 00 (eksempel)</span>
                </div>
                <span className="text-right text-[13px] text-[#4A5868]">
                  Faktura 2611
                  <br />
                  8. okt. 2026
                </span>
              </div>
              <p className="py-3 text-[#24384F]">Utæt ventil under køkkenvask, Herlev. Ventil skiftet, tæt ved aflevering.</p>
              <table className="w-full border-collapse tabular-nums">
                <tbody>
                  {INVOICE.map(([what, kr]) => (
                    <tr key={what} className="border-t border-[#D5DADC]">
                      <th scope="row" className="py-2 pr-3 text-left font-normal">
                        {what}
                      </th>
                      <td className="whitespace-nowrap py-2 text-right">{kr}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-[#0F2742]">
                    <th scope="row" className="py-2 pr-3 text-left font-semibold">
                      I alt inkl. moms
                    </th>
                    <td className="whitespace-nowrap py-2 text-right font-semibold">1.376,00 kr.</td>
                  </tr>
                  <tr>
                    <th scope="row" className="pr-3 text-left text-[13px] font-normal text-[#4A5868]">
                      heraf moms
                    </th>
                    <td className="whitespace-nowrap text-right text-[13px] text-[#4A5868]">275,20 kr.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm leading-normal text-[#4A5868]">
              Tilslutning til fjernvarme kan give håndværkerfradrag for arbejdslønnen. Service og badeværelser giver ikke fradrag. Se reglerne på skat.dk.
            </p>
          </aside>
        </section>

        {/* A normal week, from the driving logs */}
        <section id="opgaver" className="scroll-mt-20 bg-[#0F2742] text-white [&_:focus-visible]:outline-white">
          <div className={`${wrap} flex flex-col gap-8 py-12 sm:py-20`}>
            <div className="flex max-w-[640px] flex-col gap-3">
              <h2 className={h2}>Uge 41 i bilerne</h2>
              <p className="text-[17px] leading-[1.6] text-[#C9D3DD]">
                Det meste, vi laver, er små opgaver. Her er en helt almindelig uge, skrevet af fra køresedlerne. Opgaverne med orange streg var døgnvagt.
              </p>
            </div>
            <table className="w-full border-collapse text-[15px] sm:text-base">
              <caption className="sr-only">Opgaver i uge 41, 2026</caption>
              <thead className="hidden sm:table-header-group">
                <tr className="border-b-2 border-white text-left text-[13px] uppercase tracking-[0.08em] text-[#C9D3DD]">
                  <th scope="col" className="py-2 pl-4 pr-4 font-semibold">
                    Dag
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    Sted
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    Opgave
                  </th>
                  <th scope="col" className="py-2 text-right font-semibold">
                    Tid
                  </th>
                </tr>
              </thead>
              <tbody>
                {WEEK.map((w) => (
                  <tr key={w.day + w.job} className={`grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 border-b border-[#2C4561] py-3 sm:table-row sm:py-0 border-l-4 pl-3 sm:pl-0 ${w.night ? "border-l-[#F26419]" : "border-l-transparent"}`}>
                    <td className="text-[13px] tabular-nums text-[#C9D3DD] sm:w-[170px] sm:py-3.5 sm:pl-3 sm:pr-4 sm:text-[15px]">
                      {w.day}
                      <span className="sm:hidden"> · {w.place}</span>
                    </td>
                    <td className="row-span-2 self-center text-right tabular-nums sm:hidden">{w.time}</td>
                    <td className="hidden py-3.5 pr-4 sm:table-cell">{w.place}</td>
                    <td className="font-medium sm:py-3.5 sm:pr-4">{w.job}</td>
                    <td className="hidden py-3.5 text-right tabular-nums sm:table-cell">{w.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
              <figure className="flex flex-col gap-2">
                <Img id="1690603935238-b60582bcb273" w={1200} alt="Nyt badeværelse med hvide fliser og bruseniche" className="aspect-[4/3] w-full rounded-[2px] object-cover" />
                <figcaption className="flex flex-wrap justify-between gap-x-4 text-[13px] text-[#C9D3DD]">
                  <span>Badeværelse, Søborg</span>
                  <span>Oktober 2026 · 6 m² · 9 arbejdsdage</span>
                </figcaption>
              </figure>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                <figure className="flex flex-col gap-2">
                  <Img id="1768321913920-d3ac011e0683" w={800} alt="Nye vandrør og el-rør i en åben væg, før der kommer fliser på" className="aspect-[16/9] w-full rounded-[2px] object-cover" />
                  <figcaption className="text-[13px] text-[#C9D3DD]">Samme badeværelse, dag 4: rør i væggen</figcaption>
                </figure>
                <figure className="flex flex-col gap-2">
                  <Img id="1650551182956-47efa0f90b64" w={800} alt="Rør, ventiler og manometre i et teknikrum" className="aspect-[16/9] w-full rounded-[2px] object-cover" />
                  <figcaption className="text-[13px] text-[#C9D3DD]">Ny fjernvarmeunit, Herlev · august 2026 · 1 dag</figcaption>
                </figure>
              </div>
            </div>
            <p className="text-[13px] text-[#C9D3DD]">Fotos fra Unsplash som pladsholdere. På din side bruger vi dine egne billeder fra opgaverne.</p>
          </div>
        </section>

        {/* The master */}
        <section id="om" className={`${wrap} grid scroll-mt-20 gap-8 py-12 sm:py-20 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-16`}>
          <figure className="flex items-end gap-3 sm:flex-col sm:items-stretch sm:gap-2">
            <Img
              id="1772442198677-10c8e7b46a5f"
              w={800}
              alt="Pladsholderfoto af en mand i blåt arbejdstøj ved et vindue"
              className="aspect-[4/5] w-[132px] shrink-0 rounded-[2px] object-cover sm:w-full"
            />
            <figcaption className="text-[13px] leading-snug text-[#4A5868]">Pladsholderfoto · her kommer mesterens eget portræt</figcaption>
          </figure>
          <div className="flex max-w-[620px] flex-col gap-5">
            <h2 className={h2}>Jonas Holm</h2>
            <p className="text-[17px] leading-[1.65] sm:text-lg">
              Jeg blev udlært hos en VVS&apos;er i Ballerup og startede for mig selv i 2009 med én bil og en lærling. Vi er stadig små, og det er med vilje. Den, der kommer ud til dig, er en af os fire, og Lene ved altid, hvor bilerne er.
            </p>
            <p className="text-[17px] leading-[1.65] sm:text-lg">
              Vi laver ikke jordvarme og solvarme. Spørger du, giver vi dig nummeret på en, der gør det godt.
            </p>
            <dl className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-6 gap-y-2.5 border-t-2 border-[#9A4E25] pt-5 text-[15px]">
              <dt className="text-[#4A5868]">Autorisation</dt>
              <dd>
                VVS-installatør nr. 00000 (eksempel)
                <span className="block text-[13px] text-[#4A5868]">På din side linker vi til Sikkerhedsstyrelsens register, så kunden selv kan tjekke det.</span>
              </dd>
              <dt className="text-[#4A5868]">Garanti</dt>
              <dd>TEKNIQ Installatørernes garantiordning (eksempel)</dd>
              <dt className="text-[#4A5868]">CVR</dt>
              <dd>00 00 00 00 (eksempel)</dd>
              <dt className="text-[#4A5868]">Ventetid nu</dt>
              <dd>Service samme eller næste hverdag. Nye badeværelser fra uge 47.</dd>
            </dl>
          </div>
        </section>

        {/* Reviews */}
        <section className="border-t border-[#D5DADC] bg-[#F6F7F5]">
          <div className={`${wrap} py-12 sm:py-20`}>
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h2 className={h2}>Kunderne skriver</h2>
              <SampleReviewsNote className="text-[13px]! text-[#4A5868]" />
            </div>
            <ul className="border-t-2 border-[#0F2742]">
              {REVIEWS.map((r) => (
                <li key={r.name} className="grid gap-x-10 gap-y-2 border-b border-[#D5DADC] py-6 md:grid-cols-[200px_minmax(0,1fr)]">
                  <div className="flex flex-wrap items-center gap-x-3 text-[13px] text-[#4A5868] md:flex-col md:items-start md:gap-1">
                    <Stars n={r.stars} className="text-[15px] text-[#9A4E25]" />
                    <span>{r.date}</span>
                    <span className="font-medium text-[#0F2742] md:text-[15px]">{r.name}</span>
                  </div>
                  <div className="flex max-w-[68ch] flex-col gap-3">
                    <blockquote className="text-[17px] leading-[1.6]">{r.text}</blockquote>
                    {r.reply && (
                      <p className="border-l-2 border-[#9A4E25] pl-3.5 text-[15px] leading-[1.55] text-[#24384F]">
                        <b className="font-semibold">Svar fra Jonas:</b> {r.reply}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Contact */}
        <section id="kontakt" className="scroll-mt-20 border-t border-[#D5DADC]">
          <div className={`${wrap} grid gap-10 py-12 sm:py-20 lg:grid-cols-2 lg:gap-16`}>
            <div className="flex max-w-[460px] flex-col gap-4">
              <h2 className={h2}>Ikke akut? Skriv til Lene</h2>
              <p className="text-[17px] leading-[1.6]">
                Ring, hvis det haster. Skriv, hvis det kan vente til i morgen, og send gerne et billede af det, der drypper. Lene svarer på hverdage inden kl. 16.
              </p>
              <a href={TEL} className={`${display} self-start whitespace-nowrap text-[44px] font-bold leading-none hover:text-[#9A4E25]`}>
                {PHONE}
              </a>
              <p className="text-[15px] text-[#4A5868]">
                Døgnvagt alle dage · Kontor hverdage kl. 7–16, fredag til 14
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
                <p role="status" className="rounded-[2px] border-l-4 border-[#0F2742] bg-[#E7ECF1] p-4 leading-normal">
                  Tak. På en rigtig side ville Lene ringe dig op inden kl. 16 og aftale en tid. Dette er et eksempel, så der er ikke sendt noget.
                </p>
              )}
              <label className="flex flex-col gap-1.5 text-[15px] font-medium">
                Navn
                <input required name="navn" type="text" autoComplete="name" className={field} />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-[15px] font-medium">
                  Telefon
                  <input required name="telefon" type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9 +]{8,}" title="Skriv et telefonnummer på mindst 8 cifre" className={field} />
                </label>
                <label className="flex flex-col gap-1.5 text-[15px] font-medium">
                  Adresse
                  <input required name="adresse" type="text" autoComplete="street-address" className={field} />
                </label>
              </div>
              <label className="flex flex-col gap-1.5 text-[15px] font-medium">
                Hvad drejer det sig om?
                <textarea required name="opgave" rows={4} placeholder="Fx toilettet løber hele tiden, rækkehus i Skovlunde" className={`${field} resize-y`} />
              </label>
              <label className="flex flex-col gap-1.5 text-[15px] font-medium">
                <span>
                  Billede <span className="font-normal text-[#4A5868]">(kan udelades)</span>
                </span>
                <input name="billede" type="file" accept="image/*" className="text-[15px] font-normal file:mr-3 file:rounded-[2px] file:border file:border-[#8C99A6] file:bg-white file:px-3 file:py-2 file:text-[15px] file:font-medium file:text-[#0F2742]" />
              </label>
              <button type="submit" className="inline-flex h-[52px] items-center self-start whitespace-nowrap rounded-[2px] bg-[#0F2742] px-6 text-[17px] font-semibold text-white transition-colors hover:bg-[#0A1B2F]">
                Send til Lene
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-[#0A1B2F] pb-24 text-[15px] text-[#C9D3DD] sm:pb-0">
        <div className={`${wrap} flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 py-10`}>
          <span className={`${display} text-2xl font-extrabold text-white`}>Holm VVS</span>
          <span>{ADDRESS}</span>
          <span>CVR 00 00 00 00 (eksempel)</span>
          <span>Aut. nr. 00000 (eksempel)</span>
          <a href={TEL} className="font-semibold text-white underline underline-offset-2">
            {PHONE}
          </a>
        </div>
      </footer>

      {/* Phone: emergency call and the written route, always within thumb's reach */}
      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-[1.3fr_1fr] gap-2.5 border-t border-[#D5DADC] bg-white px-4 pb-4 pt-3 sm:hidden">
        <a href={TEL} className={`${callBtn} flex h-[52px] gap-2`}>
          <PhoneGlyph className="size-4" />
          <span className="min-[360px]:hidden">Ring</span>
          <span className="hidden min-[360px]:inline">Ring døgnvagt</span>
        </a>
        <a href="#kontakt" className="grid h-[52px] place-items-center whitespace-nowrap rounded-[2px] border border-[#0F2742] font-semibold">
          <span className="min-[360px]:hidden">Skriv</span>
          <span className="hidden min-[360px]:inline">Skriv til os</span>
        </a>
      </div>
    </div>
  );
}
