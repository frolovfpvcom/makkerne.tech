"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EMAIL, TEAM } from "@/lib/content";
import { ACCENT } from "@/lib/accent";
import { useLang } from "./lang";
import { BrowserSite, usePreloadShots } from "./live-site";
import { CurvedRow } from "./curved-row";
import { Logo } from "./header";
import { QuoteCard } from "./quote-card";
import { setTrade, useTrade } from "./trade-store";
import { useStage } from "./progress-store";

function SectionHead({ title, lead, small = false }: { title: string; lead?: string; small?: boolean }) {
  // `small` tightens the heading on phones only, so more of what follows fits on the screen.
  return (
    <div className={`max-w-2xl ${small ? "mb-5 sm:mb-10" : "mb-10"}`}>
      <h2 className={`text-balance font-cond font-bold leading-[1.02] tracking-tight sm:text-[3.25rem] ${small ? "text-[1.75rem]" : "text-4xl"}`}>{title}</h2>
      {lead && <p className={`text-pretty leading-relaxed text-ink/70 ${small ? "mt-2 text-base sm:mt-4 sm:text-lg" : "mt-4 text-lg"}`}>{lead}</p>}
    </div>
  );
}

/**
 * Landing page: the ten examples as screenshots running slowly round a curved row. Hovering one
 * stops the row and names it; clicking opens it.
 */
export function Examples() {
  const { t } = useLang();
  const e = t.examples;
  const [hover, setHover] = useState<number | null>(null);
  const tiles = useMemo(() => e.items.map((it) => ({ src: `/examples/shots/${it.slug}.webp`, href: it.href })), [e.items]);
  const on = hover === null ? null : e.items[hover];
  // Coming straight to /#eksempler, the browser jumps before the hero has its final height on a
  // phone; jump again once it has, so the heading is not left under the header.
  useEffect(() => {
    if (window.location.hash !== "#eksempler") return;
    const id = requestAnimationFrame(() => document.getElementById("eksempler")?.scrollIntoView({ behavior: "instant" }));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <section id="eksempler" className="overflow-hidden bg-navy py-10 text-ink sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <SectionHead title={e.title} lead={e.rowLead} />
      </div>
      <CurvedRow items={tiles} onHover={setHover} className="h-[180px] sm:h-[280px] lg:h-[380px] 2xl:h-[460px]" />
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <p aria-hidden className="mt-4 hidden min-h-7 text-center [@media(hover:hover)]:block font-cond text-xl font-semibold">
          {on && (
            <>
              {on.name} <span className="text-ink/55">· {on.industry} · {on.place}</span>
            </>
          )}
        </p>
        <nav aria-label={e.pick} className="sr-only">
          <ul>
            {e.items.map((it) => (
              <li key={it.slug}>
                <a href={it.href}>
                  {it.name}, {it.industry}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {/* Half of the visitors scroll this far; the price is one click back up from here. */}
        <a href="#beregner" className="mt-8 inline-flex items-center gap-3 rounded-full bg-brand px-6 py-3.5 font-cond text-lg font-semibold text-black transition hover:bg-brand hover:text-black-dark">
          {t.calc.head} <span aria-hidden>↑</span>
        </a>
        <p className="mt-6 text-sm text-ink/55">{e.disclaimer}</p>
      </div>
    </section>
  );
}

/**
 * One example at a time, picked by trade. On the examples page (`side`) the trades are a dark menu
 * down the far left edge of the screen on a computer, like a shop's category list; on the front page
 * and on phones they are a row of tabs.
 */
export function ExamplePicker({ side = false, front = false }: { side?: boolean; front?: boolean }) {
  const { t } = useLang();
  const e = t.examples;
  const head = <SectionHead title={front ? e.pickTitle : e.title} lead={front ? e.pickLead : e.lead} small />;
  if (!side)
    return (
      <section className={front ? "" : "pt-18"}>
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-24">
          {head}
          <ExampleCarousel />
          {!front && <p className="mt-10 text-sm text-ink/55">{e.disclaimer}</p>}
        </div>
      </section>
    );
  return (
    <section className="pt-18 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <TradeMenu />
      <div className="min-w-0 px-4 py-16 sm:px-8 sm:py-20 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-6xl">
          {head}
          <ExampleCarousel side />
          <p className="mt-10 text-sm text-ink/55">{e.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}

/**
 * The trades as a dark list pinned to the left edge while the examples are on screen. Hovering a
 * trade lights it up with a yellow arrow; clicking shows that example.
 */
function TradeMenu() {
  const { t } = useLang();
  const e = t.examples;
  const sel = useTrade();
  return (
    <nav aria-label={e.pick} className="sticky top-18 hidden h-[calc(100dvh-4.5rem)] self-start overflow-y-auto bg-[#060912] text-ink lg:block">
      <ul role="tablist" aria-orientation="vertical" className="pt-6">
        {e.items.map((it, i) => (
          <li key={it.slug}>
            <button
              type="button"
              role="tab"
              aria-selected={i === sel}
              onClick={() => setTrade(i)}
              className={`group flex h-11 w-full cursor-pointer items-center justify-between gap-3 border-l-2 pl-7 pr-6 text-left text-[15px] transition-colors ${
                i === sel ? "border-brand bg-white/[0.06] text-ink" : "border-transparent text-ink/60 hover:bg-white/[0.04] hover:text-ink"
              }`}
            >
              {it.trade}
              <svg
                aria-hidden
                viewBox="0 0 10 14"
                className={`h-2.5 w-2 shrink-0 fill-brand transition ${i === sel ? "opacity-100" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}`}
              >
                <path d="M0 0l10 7-10 7z" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * One example at a time: the live site in a browser window with its text beside it. Trade tabs and
 * arrows move between them, and the hero's trade buttons pick one too. A site is only loaded the
 * first time it is shown, then stays mounted (stacked on top of the others), so switching back is
 * instant and the box never jumps in height. With `side`, the tabs give way to the left menu on a
 * computer.
 */
function ExampleCarousel({ side = false }: { side?: boolean }) {
  const { t } = useLang();
  const e = t.examples;
  const n = e.items.length;
  const sel = useTrade();
  const [dir, setDir] = useState(1);
  const [seen, setSeen] = useState<number[]>([0]);
  if (!seen.includes(sel)) setSeen([...seen, sel]);
  // The pictures of the examples either side, so an arrow shows the next one at once.
  usePreloadShots([sel - 1, sel + 1].map((i) => e.items[((i % n) + n) % n].slug), "desktop", "mobile");
  const go = (i: number) => {
    setDir(i > sel ? 1 : -1);
    setTrade(((i % n) + n) % n);
  };
  const arrow = "grid size-10 sm:size-12 place-items-center rounded-full border border-ink/20 bg-card transition hover:border-ink hover:bg-brand";
  return (
    <div>
      <div className={`flex items-center gap-3 ${side ? "lg:hidden" : ""}`}>
        <div role="tablist" aria-label={e.pick} className={`${side ? "lg:hidden " : ""}-mx-4 flex flex-1 gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0`}>
          {e.items.map((it, i) => (
            <button
              key={it.slug}
              type="button"
              role="tab"
              aria-selected={i === sel}
              onClick={() => go(i)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-semibold transition sm:px-4 sm:py-2 sm:text-base ${i === sel ? "border-ink bg-ink text-paper" : "border-ink/15 bg-card hover:border-ink"}`}
            >
              {it.trade}
            </button>
          ))}
        </div>
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <span className="mr-2 font-cond text-lg font-bold tabular-nums text-ink/50">
            {String(sel + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </span>
          <button type="button" onClick={() => go(sel - 1)} aria-label="Forrige eksempel" className={arrow}>
            <span aria-hidden className="text-xl">←</span>
          </button>
          <button type="button" onClick={() => go(sel + 1)} aria-label="Næste eksempel" className={arrow}>
            <span aria-hidden className="text-xl">→</span>
          </button>
        </div>
      </div>

      <div className={`grid ${side ? "mt-4 sm:mt-8 lg:mt-0" : "mt-4 sm:mt-8"}`}>
        {e.items.map((item, i) => (
          <article
            key={item.slug}
            aria-hidden={i !== sel}
            className={`grid items-center gap-5 transition-opacity sm:gap-8 duration-300 [grid-area:1/1] lg:grid-cols-12 lg:gap-14 ${i === sel ? "opacity-100" : "pointer-events-none invisible opacity-0"}`}
          >
            <div className="min-w-0 lg:col-span-7">
              {seen.includes(i) && <BrowserSite src={item.href} slug={item.slug} title={item.name} tryLabel={e.try} accent={ACCENT[item.slug]} />}
            </div>
            <div className="min-w-0 lg:col-span-5">
              <AnimatePresence mode="wait">
                {i === sel && (
                  <motion.div key={item.slug} initial={{ opacity: 0, x: dir * 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                    <p className="text-sm font-semibold text-ink/50">
                      {item.industry} · {item.place}
                    </p>
                    <h3 className="mt-1 font-cond text-3xl font-bold sm:text-5xl leading-none tracking-tight">{item.name}</h3>
                    <p className="mt-2 text-base leading-relaxed text-ink/70 sm:mt-4 sm:text-lg">{item.short}</p>
                    <ul className="mt-4 flex flex-wrap gap-1.5 sm:mt-6 sm:gap-2">
                      {item.tags.map((tag) => (
                        <li key={tag} className="rounded-full border border-ink/15 bg-card px-2.5 py-0.5 text-xs font-medium sm:px-3 sm:py-1 sm:text-sm">
                          {tag}
                        </li>
                      ))}
                    </ul>
                    <a href={item.href} target="_blank" rel="noopener" className="mt-5 inline-flex rounded-full bg-ink px-4 py-2.5 text-sm font-semibold sm:mt-7 sm:px-5 sm:py-3 sm:text-base text-paper transition hover:bg-ink/85">
                      {e.open} ↗
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </article>
        ))}
      </div>

      {/* Arrows under the example on phones, where there is no room next to the tabs. */}
      <div className="mt-4 flex items-center justify-between sm:hidden">
        <button type="button" onClick={() => go(sel - 1)} aria-label="Forrige eksempel" className={arrow}>
          <span aria-hidden className="text-xl">←</span>
        </button>
        <span className="font-cond text-lg font-bold tabular-nums text-ink/50">
          {String(sel + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </span>
        <button type="button" onClick={() => go(sel + 1)} aria-label="Næste eksempel" className={arrow}>
          <span aria-hidden className="text-xl">→</span>
        </button>
      </div>
    </div>
  );
}

/**
 * The price page's top: the same three-click card as on the front page, and beside it what happens
 * after the button.
 */
export function PriceSection() {
  const { t } = useLang();
  const c = t.calc;
  return (
    <section id="pris" className="scroll-mt-18 mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-8 sm:py-16 lg:grid-cols-12 lg:gap-12">
      <QuoteCard className="lg:col-span-7" />
      <div className="lg:col-span-5 lg:pt-2">
        <ol className="space-y-3">
          {c.how.map((s, i) => (
            <li key={s} className="grid grid-cols-[1.75rem_1fr] leading-snug text-ink/80">
              <span className="font-cond text-xl font-bold leading-none text-ink/35 tabular-nums">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm text-ink/55">{c.vat}</p>
      </div>
    </section>
  );
}

function Tick() {
  return (
    <svg viewBox="0 0 24 24" className="mt-1 size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

/** The three care plans side by side, the recommended one framed and first to catch the eye. */
export function Plans() {
  const { t, lang } = useLang();
  const c = t.calc;
  const kr = (n: number) => (lang === "da" ? `${n.toLocaleString("da-DK")} kr.` : `DKK ${n.toLocaleString("en-GB")}`);
  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-8 sm:pb-24">
      <h2 className="font-cond text-3xl font-bold tracking-tight sm:text-4xl">{c.plansTitle}</h2>
      <p className="mt-2 max-w-2xl leading-relaxed text-ink/70">{c.plansLead}</p>
      <div className="mt-6 grid gap-3 md:grid-cols-3 md:items-stretch">
        {c.care.options.map((o, i) => {
          const best = i === c.care.best;
          return (
            <div key={o.label} className={`flex flex-col rounded-2xl p-5 ${best ? "border border-ink/40 bg-card" : "border border-ink/15 bg-paper"}`}>
              <p className="flex flex-wrap items-center justify-between gap-2 font-semibold">
                {o.label}
                {best && <span className="rounded-full bg-brand px-2 py-1 text-xs font-semibold leading-none">{c.care.pick}</span>}
              </p>
              <p className="mt-2 font-cond text-4xl font-bold leading-none tabular-nums">
                {kr(o.monthly)} <span className="font-sans text-base font-normal text-ink/60">{c.monthly}</span>
              </p>
              <ul className="mt-4 space-y-1.5 border-t border-ink/15 pt-4 text-sm leading-snug text-ink/80">
                {o.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <Tick />
                    {p}
                  </li>
                ))}
                {/* What this plan leaves out, so the three can be read against each other. */}
                {o.missing.map((p) => (
                  <li key={p} className="flex gap-2 text-ink/40">
                    <span className="mt-px w-3.5 shrink-0 text-center" aria-hidden>
                      –
                    </span>
                    <span>
                      <span className="sr-only">{c.notIncluded}: </span>
                      {p}
                    </span>
                  </li>
                ))}
              </ul>
              {best && <p className="mt-auto pt-4 text-sm leading-snug text-ink/70">{c.care.upsell}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** Plain side-by-side with the two usual alternatives. */
export function Comparison() {
  const { t } = useLang();
  const tb = t.pricing.table;
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-8 sm:pb-28">
      <h2 className="font-cond text-3xl font-bold tracking-tight sm:text-4xl">{tb.title}</h2>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[32rem] border-collapse text-left text-sm sm:text-base">
          <thead>
            <tr className="border-b-2 border-ink">
              {tb.cols.map((col, i) => (
                <th key={i} scope="col" className={`py-3 font-cond text-lg font-bold ${i === 0 ? "pr-4" : "px-3"} ${i === 1 ? "bg-[#1b2c5c] text-brand" : ""}`}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tb.rows.map(([label, ...cells]) => (
              <tr key={label} className="border-b border-ink/15">
                <th scope="row" className="py-3 pr-4 font-medium text-ink/70">
                  {label}
                </th>
                {cells.map((cell, i) => (
                  <td key={i} className={`px-3 py-3 ${i === 0 ? "bg-[#1b2c5c] font-semibold" : "text-ink/75"}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// On a wide screen each step takes this share of the row and the four spread out evenly, so the
// dots sit at 0 %, about 37 %, about 63 % and 100 % of the line.
const STEP_W = 23;
const DOT_AT = [0, 1, 2, 3].map((i) => (i === 0 ? 0 : i === 3 ? 100 : STEP_W * (i + 0.5) + ((100 - 4 * STEP_W) / 3) * i));

/**
 * How it goes, as a timeline: looking at the site, the free draft, the price, the mail. The marker
 * "Du er her" moves on as the visitor uses the price card (see progress-store), and the line fills
 * up to it. Across the page on a computer, down the side on a phone.
 */
export function Process({ hideHead = false }: { hideHead?: boolean }) {
  const { t } = useLang();
  const p = t.process;
  const stage = useStage();
  const last = p.steps.length - 1;
  return (
    <section id="proces" className="border-y border-ink/15 bg-paper-2">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-24">
        {!hideHead && <SectionHead title={p.title} lead={p.lead} />}
        <div className="relative">
          {/* The line across, and how far along it the visitor is. */}
          <div aria-hidden className="absolute inset-x-0 top-[7px] hidden h-0.5 bg-ink/15 lg:block">
            <div className="h-full bg-ink transition-[width] duration-700 ease-out motion-reduce:transition-none" style={{ width: `${DOT_AT[stage]}%` }} />
          </div>
          <ol className="relative space-y-8 lg:flex lg:justify-between lg:space-y-0">
            {p.steps.map((s, i) => {
              const here = i === stage;
              const passed = i < stage;
              const align = i === 0 ? "lg:text-left" : i === last ? "lg:text-right" : "lg:text-center";
              const dotAlign = i === 0 ? "" : i === last ? "lg:ml-auto" : "lg:mx-auto";
              return (
                <li key={s.title} aria-current={here ? "step" : undefined} className={`relative pl-9 lg:w-[23%] lg:pl-0 ${align}`}>
                  {/* Down the side on a phone: the piece of line to the next step. */}
                  {i < last && (
                    <span aria-hidden className={`absolute bottom-[-2rem] left-[7px] top-4 w-0.5 lg:hidden ${passed ? "bg-ink" : "bg-ink/15"}`} />
                  )}
                  <span
                    aria-hidden
                    className={`absolute left-0 top-0 block size-4 rounded-full border-2 lg:static ${dotAlign} ${
                      here ? "border-ink bg-brand ring-4 ring-brand/40" : passed ? "border-ink bg-ink" : "border-ink/30 bg-paper-2"
                    }`}
                  />
                  <span className={`mt-0 block lg:mt-4 ${here ? "" : "lg:pt-7"}`}>
                    {here && <span className={`mb-1.5 block h-[22px] w-fit rounded-full bg-brand px-2.5 text-xs font-semibold leading-[22px] text-black ${dotAlign}`}>{p.here}</span>}
                    <span className={`block font-cond text-2xl font-bold leading-tight ${passed || here ? "" : "text-ink/45"}`}>
                      <span className="text-ink/35 tabular-nums">{i + 1}</span> {s.title}
                    </span>
                    <span className={`mt-1.5 block leading-relaxed ${passed || here ? "text-ink/75" : "text-ink/50"}`}>{s.text}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/**
 * The questions, kept small: the heading and a way to ask on the left, the answers on the right.
 * On /faq/ the heading is the page's h1 and the section clears the fixed header; on /proces/ it is an h2.
 */
export function Faq({ page = false }: { page?: boolean }) {
  const { t } = useLang();
  const f = t.faq;
  const Heading = page ? "h1" : "h2";
  return (
    <section
      id="faq"
      className={`mx-auto grid max-w-6xl gap-8 px-4 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16 ${page ? "pb-16 pt-28 sm:pt-32" : "py-10 sm:py-24"}`}
    >
      <div>
        <Heading className="font-cond text-4xl font-bold leading-none tracking-tight sm:text-5xl">{f.title}</Heading>
        <p className="mt-4 max-w-sm text-pretty leading-relaxed text-ink/70">{f.lead}</p>
        <p className="mt-3 text-sm text-ink/70">
          {f.more}{" "}
          <a href="#kontakt" className="font-semibold text-ink underline underline-offset-4 hover:text-brand">
            {f.moreLink}
          </a>
        </p>
      </div>
      <div className="border-t border-ink/20">
        {f.items.map((item) => (
          <details key={item.q} className="group border-b border-ink/20">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-4 text-base font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:text-lg [&::-webkit-details-marker]:hidden">
              <span className="text-pretty">{item.q}</span>
              <span
                className="flex h-6 w-5 shrink-0 items-center justify-center text-2xl leading-none text-ink/50 transition-transform group-open:rotate-45 motion-reduce:transition-none sm:h-7"
                aria-hidden
              >
                +
              </span>
            </summary>
            <div className="max-w-prose space-y-3 pb-5 leading-relaxed text-ink/75">
              {item.a.split("\n\n").map((para) => (
                <p key={para}>{para}</p>
              ))}
              {item.link && (
                <Link href={item.link.href} className="inline-block font-semibold text-ink underline underline-offset-4 hover:text-brand">
                  {item.link.label}
                </Link>
              )}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

/** Email is the only way in. The button opens a mail with the three things we need already listed. */
export function Contact({ people = true }: { people?: boolean }) {
  const { t } = useLang();
  const c = t.contact;
  // Which address was just copied, so only that line says "Copied".
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (mail: string) => {
    try {
      await navigator.clipboard.writeText(mail);
      setCopied(mail);
      setTimeout(() => setCopied(null), 2000);
    } catch {}
  };
  // The main address first, then Peter's underneath.
  const mails = [EMAIL, ...TEAM.map((p) => p.email).filter((m) => m !== EMAIL)];
  return (
    <section id="kontakt" className="bg-[#060912] text-ink">
      {/* The text keeps to the page's column; the photos run all the way to the right edge. */}
      <div className={`grid gap-10 px-4 py-12 sm:gap-14 sm:px-8 sm:py-28 lg:pl-[max(2rem,calc((100vw-72rem)/2+2rem))] ${people ? "lg:grid-cols-[minmax(0,28rem)_1fr]" : "lg:pr-[max(2rem,calc((100vw-72rem)/2+2rem))]"}`}>
        {/* Without the photos the band is short: heading and text on the left, the button and addresses on the right. */}
        <div className={people ? "" : "lg:grid lg:grid-flow-col lg:grid-cols-[minmax(0,32rem)_auto] lg:grid-rows-[auto_auto] lg:items-start lg:justify-items-start lg:justify-between lg:gap-x-16"}>
          <h2 className="text-balance font-cond text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl">{c.title}</h2>
          <p className="mt-5 max-w-md text-lg text-ink/70">{c.lead}</p>
          <a
            href={`mailto:${EMAIL}?subject=${encodeURIComponent(c.subject)}&body=${encodeURIComponent(c.body)}`}
            className={`mt-8 inline-flex rounded-full bg-brand px-7 py-4 font-cond text-lg font-semibold text-black transition hover:bg-brand hover:text-black-dark ${people ? "" : "lg:mt-0"}`}
          >
            {c.write}
          </a>
          {/* Each address opens the mail program; the small button beside it copies it. */}
          <ul className="mt-5 grid w-fit max-w-full grid-cols-[minmax(0,auto)_auto] items-center gap-x-1 text-ink/70">
            {mails.map((mail) => (
              <li key={mail} className="col-span-2 grid grid-cols-subgrid items-center">
                <a href={`mailto:${mail}`} className="min-w-0 break-all underline-offset-4 transition hover:text-brand hover:underline">
                  {mail}
                </a>
                <button
                  type="button"
                  onClick={() => copy(mail)}
                  aria-label={copied === mail ? c.copied : `${c.copy} ${mail}`}
                  title={copied === mail ? c.copied : c.copy}
                  className="grid size-10 shrink-0 place-items-center transition hover:text-brand"
                >
                  {copied === mail ? (
                    <svg viewBox="0 0 24 24" className="size-5 text-brand" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" aria-hidden="true">
                      <rect x="8" y="3" width="8" height="4" rx="1" />
                      <path d="M8 5H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2" />
                    </svg>
                  )}
                </button>
                <span role="status" className="sr-only col-span-2">{copied === mail ? c.copied : ""}</span>
              </li>
            ))}
          </ul>
        </div>
        {people && <div className="flex flex-col lg:border-l lg:border-ink/15 lg:pl-14">
          <p className="text-2xl font-bold">{c.who}</p>
          <div className="mt-6 grid flex-1 grid-cols-2 gap-4 sm:gap-6">
            {TEAM.map((p) => (
              <figure key={p.email} className="flex flex-col">
                <img src={p.photo} alt={p.name} loading="lazy" decoding="async" className="aspect-[4/5] w-full flex-1 rounded-2xl bg-ink/5 object-cover object-top" />
                <figcaption className="mt-3">
                  <span className="block font-cond text-xl font-semibold">{p.name}</span>
                  <a href={`mailto:${p.email}`} className="break-words text-sm text-ink/70 underline-offset-4 transition hover:text-brand hover:underline">
                    {/* On narrow phones the address breaks after the @, not mid-word. */}
                    {p.email.split("@")[0]}@<wbr />{p.email.split("@")[1]}
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>}
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-ink/10 bg-[#060912] pb-[env(safe-area-inset-bottom)] text-ink">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-10 sm:flex-row sm:items-center sm:px-8">
        <Logo />
        <nav className="flex flex-wrap gap-x-6 gap-y-2 font-medium text-ink/70">
          <Link href="/eksempelsider/" className="hover:text-brand">{t.nav.examples}</Link>
          <Link href="/proces/" className="hover:text-brand">{t.nav.process}</Link>
          <Link href="/pris/" className="hover:text-brand">{t.nav.price}</Link>
          <Link href="/faq/" className="hover:text-brand">{t.nav.faq}</Link>
          <Link href="/om-os/" className="hover:text-brand">{t.nav.about}</Link>
        </nav>
        <div className="flex flex-col gap-2 text-xs text-ink/50">
          <p>
            {t.footer} · {t.updated}
          </p>
          <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/70">
            <Link href="/vilkaar/" className="underline underline-offset-4 hover:text-brand">{t.legal.terms}</Link>
            <Link href="/privatliv/" className="underline underline-offset-4 hover:text-brand">{t.legal.privacy}</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

/** Plain band at the top of the separate menu pages. */
export function PageIntro({ title, lead }: { title: string; lead?: string }) {
  return (
    <section className="border-b border-ink/15">
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-32 sm:px-8 sm:pb-16 sm:pt-36">
        <h1 className="max-w-4xl text-balance font-cond text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl">{title}</h1>
        {lead && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/75">{lead}</p>}
      </div>
    </section>
  );
}
