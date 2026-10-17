"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EMAIL, TEAM, type Example } from "@/lib/content";
import { useLang } from "./lang";
import { BrowserSite, WorkshopScreen } from "./live-site";
import { IPhone } from "./phone-preview";
import { Logo } from "./header";
import { Calculator } from "./calculator";
import { setTrade, useTrade } from "./trade-store";

function SectionHead({ title, lead, light = false }: { title: string; lead?: string; light?: boolean }) {
  return (
    <div className="mb-10 max-w-2xl">
      <h2 className="text-balance font-cond text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-6xl">{title}</h2>
      {lead && <p className={`mt-4 text-pretty text-lg leading-relaxed ${light ? "text-paper/70" : "text-ink/70"}`}>{lead}</p>}
    </div>
  );
}

function Check({ light = false }: { light?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`mt-0.5 size-5 shrink-0 ${light ? "text-brand" : "text-ink"}`} fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

/** Landing page: the examples as a carousel, one at a time, so the page stays short. */
export function Examples() {
  const { t } = useLang();
  const e = t.examples;
  return (
    <section id="eksempler" className="scroll-mt-18 bg-[#f3f2ef]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24">
        <SectionHead title={e.title} lead={e.lead} />
        <ExampleCarousel />
        <p className="mt-10 text-sm text-ink/55">{e.disclaimer}</p>
      </div>
    </section>
  );
}

/**
 * The examples page: pick your trade, and see that site on a computer and on a phone side by
 * side, with what it can do next to it. Rawer than the landing page on purpose.
 */
export function ExamplesByIndustry() {
  const { t } = useLang();
  const e = t.examples;
  const [sel, setSel] = useState(0);
  const item = e.items[sel];

  // Responsive phone and laptop size so the mockups stay fully visible on laptops and desktop screens.
  const [phoneSize, setPhoneSize] = useState({ width: 200, height: 410 });

  useEffect(() => {
    const update = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      if (vw < 768) {
        setPhoneSize({ width: 200, height: 410 });
      } else if (vh < 680) {
        setPhoneSize({ width: 175, height: 355 });
      } else if (vh < 800) {
        setPhoneSize({ width: 195, height: 395 });
      } else {
        setPhoneSize({ width: 215, height: 435 });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const laptopMaxWidth = Math.round((phoneSize.height - 33) * 1.6);

  return (
    <section className="border-b border-ink/15 pt-24 pb-12 sm:pt-28 sm:pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="max-w-4xl">
          <h1 className="text-balance font-cond text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
            {e.pageTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink/75 sm:text-lg">
            {e.pageLead}
          </p>
        </div>

        <div className="mt-6 sm:mt-8">
          <p className="font-cond text-base font-bold uppercase tracking-wide text-ink/55 sm:text-lg">{e.pick}</p>
          <div role="tablist" aria-label={e.pick} className="-mx-4 mt-2.5 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            {e.items.map((it, i) => (
              <button
                key={it.slug}
                type="button"
                role="tab"
                aria-selected={i === sel}
                aria-controls="eksempel-panel"
                onClick={() => setSel(i)}
                className={`flex shrink-0 items-baseline gap-2 border-2 border-ink px-3.5 py-2 font-cond text-lg font-bold uppercase transition sm:px-4 sm:py-2.5 sm:text-xl ${
                  i === sel ? "bg-brand" : "bg-card hover:bg-paper-2"
                }`}
              >
                <span className="text-xs text-ink/45 sm:text-sm">{String(i + 1).padStart(2, "0")}</span>
                {it.trade}
              </button>
            ))}
          </div>
        </div>

        <div id="eksempel-panel" role="tabpanel" className="mt-8 sm:mt-10">
          {/* Computer and phone next to each other, never on top of each other. */}
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-end md:justify-center md:gap-8 lg:gap-10">
            <div className="w-full min-w-0 md:flex-1" style={{ maxWidth: laptopMaxWidth }}>
              <WorkshopScreen src={item.href} title={item.name} tryLabel={e.try} />
            </div>
            <div className="shrink-0">
              <IPhone src={item.href} title={`${item.name} på telefonen`} width={phoneSize.width} height={phoneSize.height} />
            </div>
          </div>

          <div className="mt-12 grid gap-10 border-t-2 border-ink pt-8 sm:mt-14 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="text-sm text-ink/60">
                {item.industry} · {item.place}
              </p>
              <h2 className="mt-1 font-cond text-4xl font-extrabold uppercase leading-none sm:text-5xl">{item.name}</h2>
              <p className="mt-4 max-w-lg leading-relaxed text-ink/75">{item.long}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={item.href} target="_blank" rel="noopener" className="bg-ink px-5 py-3 font-cond text-lg font-bold uppercase text-paper transition hover:bg-ink/85">
                  {e.open} ↗
                </a>
                <a href="#kontakt" className="border-2 border-ink px-5 py-3 font-cond text-lg font-bold uppercase transition hover:bg-brand">
                  {e.want}
                </a>
              </div>
            </div>
            <ul className="space-y-3 lg:col-span-6 lg:pt-6">
              {item.features.map((f) => (
                <li key={f} className="flex gap-2.5 text-lg">
                  <Check />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-12 text-sm text-ink/55 sm:mt-14">{e.disclaimer}</p>
      </div>
    </section>
  );
}

/** Each example's own main colour, used for the strip under its browser window. */
const ACCENT: Record<Example["slug"], string> = { vvs: "#0f2742", tomrer: "#2e4a3b", maler: "#6f7a57", tag: "#2c3e48", el: "#f5c400", murer: "#9e3b26", gulv: "#3e2c1e", fuger: "#2f6eba", anlaeg: "#2f4a2b", smed: "#b0381c" };

/**
 * One example at a time: the live site in a browser window with its text beside it. Trade tabs and
 * arrows move between them, and the hero's trade buttons pick one too. A site is only loaded the
 * first time it is shown, then stays mounted (stacked on top of the others), so switching back is
 * instant and the box never jumps in height.
 */
function ExampleCarousel() {
  const { t } = useLang();
  const e = t.examples;
  const n = e.items.length;
  const sel = useTrade();
  const [dir, setDir] = useState(1);
  const [seen, setSeen] = useState<number[]>([0]);
  if (!seen.includes(sel)) setSeen([...seen, sel]);
  const go = (i: number) => {
    setDir(i > sel ? 1 : -1);
    setTrade(((i % n) + n) % n);
  };
  const arrow = "grid size-12 place-items-center border-2 border-ink bg-card transition hover:bg-brand";
  return (
    <div>
      <div className="flex items-center gap-3">
        <div role="tablist" aria-label={e.pick} className="-mx-4 flex flex-1 gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          {e.items.map((it, i) => (
            <button
              key={it.slug}
              type="button"
              role="tab"
              aria-selected={i === sel}
              onClick={() => go(i)}
              className={`shrink-0 border-2 border-ink px-4 py-2 font-cond text-lg font-bold uppercase transition ${i === sel ? "bg-ink text-paper" : "bg-card hover:bg-brand"}`}
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

      <div className="mt-8 grid">
        {e.items.map((item, i) => (
          <article
            key={item.slug}
            aria-hidden={i !== sel}
            className={`grid items-center gap-8 transition-opacity duration-300 [grid-area:1/1] lg:grid-cols-12 lg:gap-14 ${i === sel ? "opacity-100" : "pointer-events-none invisible opacity-0"}`}
          >
            <div className="min-w-0 lg:col-span-7">
              {seen.includes(i) && <BrowserSite src={item.href} title={item.name} tryLabel={e.try} accent={ACCENT[item.slug]} />}
            </div>
            <div className="min-w-0 lg:col-span-5">
              <AnimatePresence mode="wait">
                {i === sel && (
                  <motion.div key={item.slug} initial={{ opacity: 0, x: dir * 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                    <p className="font-cond text-lg font-bold uppercase tracking-wide text-ink/50">
                      {item.industry} · {item.place}
                    </p>
                    <h3 className="mt-1 font-cond text-5xl font-extrabold uppercase leading-none">{item.name}</h3>
                    <p className="mt-4 text-lg leading-relaxed text-ink/70">{item.short}</p>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <li key={tag} className="border border-ink/20 bg-card px-3 py-1 text-sm font-medium">
                          {tag}
                        </li>
                      ))}
                    </ul>
                    <a href={item.href} target="_blank" rel="noopener" className="mt-7 inline-block border-b-2 border-ink pb-0.5 font-cond text-xl font-bold uppercase transition hover:border-brand">
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
      <div className="mt-6 flex items-center justify-between sm:hidden">
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

/** The price calculator under a short heading. */
export function PriceSection({ hideHead = false }: { hideHead?: boolean }) {
  const { t } = useLang();
  return (
    <section id="pris" className="scroll-mt-18 mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
      {!hideHead && <SectionHead title={t.pricing.title} lead={t.pricing.lead} />}
      <Calculator />
    </section>
  );
}

/** Plain side-by-side with the two usual alternatives. */
export function Comparison() {
  const { t } = useLang();
  const tb = t.pricing.table;
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-8 sm:pb-28">
      <h2 className="font-cond text-3xl font-extrabold uppercase sm:text-4xl">{tb.title}</h2>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[32rem] border-collapse text-left text-sm sm:text-base">
          <thead>
            <tr className="border-b-2 border-ink">
              {tb.cols.map((col, i) => (
                <th key={i} scope="col" className={`py-3 font-cond text-lg font-bold uppercase ${i === 0 ? "pr-4" : "px-3"} ${i === 1 ? "bg-brand/40" : ""}`}>
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
                  <td key={i} className={`px-3 py-3 ${i === 0 ? "bg-brand/40 font-semibold" : "text-ink/75"}`}>
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

export function Process({ hideHead = false }: { hideHead?: boolean }) {
  const { t } = useLang();
  const p = t.process;
  return (
    <section id="proces" className="border-y border-ink/15 bg-paper-2">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-8 sm:py-28">
        {!hideHead && <SectionHead title={p.title} lead={p.lead} />}
        <ol className="max-w-3xl border-t border-ink/20">
          {p.steps.map((s) => (
            <li key={s.n} className="grid grid-cols-[3rem_1fr] gap-x-5 border-b border-ink/20 py-7 sm:grid-cols-[4rem_1fr]">
              <p className="font-cond text-5xl font-extrabold leading-none text-ink/30 sm:text-6xl">{s.n}</p>
              <div>
                <h3 className="font-cond text-2xl font-bold uppercase sm:text-3xl">{s.title}</h3>
                <p className="mt-2 max-w-xl leading-relaxed text-ink/70">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Faq({ hideHead = false }: { hideHead?: boolean }) {
  const { t } = useLang();
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-8 sm:py-28">
      {!hideHead && <SectionHead title={t.faq.title} />}
      <div className="border-t border-ink/20">
        {t.faq.items.map((item) => (
          <details key={item.q} className="group border-b border-ink/20 py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold [&::-webkit-details-marker]:hidden">
              {item.q}
              <span className="text-2xl leading-none text-ink/50 transition group-open:rotate-45" aria-hidden>
                +
              </span>
            </summary>
            <p className="mt-3 max-w-2xl leading-relaxed text-ink/75">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/** Email is the only way in. The button opens a mail with the three things we need already listed. */
export function Contact() {
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
    <section id="kontakt" className="bg-ink text-paper">
      {/* The text keeps to the page's column; the photos run all the way to the right edge. */}
      <div className="grid gap-14 px-4 py-20 sm:px-8 sm:py-28 lg:grid-cols-[minmax(0,28rem)_1fr] lg:pl-[max(2rem,calc((100vw-72rem)/2+2rem))]">
        <div>
          <h2 className="text-balance font-cond text-5xl font-extrabold uppercase leading-[0.95] sm:text-6xl">{c.title}</h2>
          <p className="mt-5 max-w-md text-lg text-paper/70">{c.lead}</p>
          <a
            href={`mailto:${EMAIL}?subject=${encodeURIComponent(c.subject)}&body=${encodeURIComponent(c.body)}`}
            className="mt-8 inline-flex bg-brand px-7 py-4 font-cond text-xl font-bold uppercase text-ink transition hover:bg-brand-dark"
          >
            {c.write}
          </a>
          {/* Two columns, so the "Copy" links line up under each other. */}
          <div className="mt-5 grid w-fit grid-cols-[auto_auto] items-center gap-x-4 gap-y-2 text-paper/70">
            {mails.map((mail) => (
              <Fragment key={mail}>
                <span className="break-all">{mail}</span>
                <button type="button" onClick={() => copy(mail)} className="justify-self-start text-sm underline underline-offset-4 transition hover:text-paper">
                  {copied === mail ? `${c.copied} ✓` : c.copy}
                </button>
              </Fragment>
            ))}
          </div>
        </div>
        <div className="flex flex-col lg:border-l lg:border-paper/15 lg:pl-14">
          <p className="text-2xl font-bold">{c.who}</p>
          <div className="mt-6 grid flex-1 grid-cols-2 gap-4 sm:gap-6">
            {TEAM.map((p) => (
              <figure key={p.email} className="flex flex-col">
                <img src={p.photo} alt={p.name} loading="lazy" decoding="async" className="aspect-[4/5] w-full flex-1 border-2 border-paper/15 object-cover object-top" />
                <figcaption className="mt-3">
                  <span className="block font-cond text-xl font-bold uppercase">{p.name}</span>
                  <a href={`mailto:${p.email}`} className="break-all text-sm text-paper/70 underline-offset-4 transition hover:text-brand hover:underline">
                    {p.email}
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-paper/10 bg-ink text-paper">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-10 sm:flex-row sm:items-center sm:px-8">
        <Logo light />
        <nav className="flex flex-wrap gap-x-6 gap-y-2 font-cond text-lg font-bold uppercase text-paper/70">
          <Link href="/eksempler/" className="hover:text-brand">{t.nav.examples}</Link>
          <Link href="/pris/" className="hover:text-brand">{t.nav.price}</Link>
          <Link href="/proces/" className="hover:text-brand">{t.nav.process}</Link>
          <Link href="/faq/" className="hover:text-brand">{t.nav.faq}</Link>
        </nav>
        <p className="text-xs text-paper/50">
          {t.footer} · {t.updated}
        </p>
      </div>
    </footer>
  );
}

/** Plain band at the top of the separate menu pages. */
export function PageIntro({ title, lead }: { title: string; lead?: string }) {
  return (
    <section className="border-b border-ink/15">
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-32 sm:px-8 sm:pb-16 sm:pt-36">
        <h1 className="max-w-4xl text-balance font-cond text-5xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-7xl">{title}</h1>
        {lead && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/75">{lead}</p>}
      </div>
    </section>
  );
}
