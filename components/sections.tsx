"use client";

import Link from "next/link";
import { Fragment, useEffect, useMemo, useState } from "react";
import { EMAIL, TEAM } from "@/lib/content";
import { useLang } from "./lang";
import { CurvedRow } from "./curved-row";
import { Logo } from "./header";
import { Calculator } from "./calculator";

function SectionHead({ title, lead, light = false }: { title: string; lead?: string; light?: boolean }) {
  return (
    <div className="mb-10 max-w-2xl">
      <h2 className="text-balance font-cond text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-6xl">{title}</h2>
      {lead && <p className={`mt-4 text-pretty text-lg leading-relaxed ${light ? "text-paper/70" : "text-ink/70"}`}>{lead}</p>}
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
  const tiles = useMemo(() => e.items.map((it) => ({ src: `/examples/shots/${it.slug}.jpg`, href: it.href })), [e.items]);
  const on = hover === null ? null : e.items[hover];
  // Coming straight to /#eksempler, the browser jumps before the hero has its final height on a
  // phone; jump again once it has, so the heading is not left under the header.
  useEffect(() => {
    if (window.location.hash !== "#eksempler") return;
    const id = requestAnimationFrame(() => document.getElementById("eksempler")?.scrollIntoView({ behavior: "instant" }));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <section id="eksempler" className="overflow-hidden bg-[#f3f2ef] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <SectionHead title={e.title} lead={e.lead} />
      </div>
      <CurvedRow items={tiles} onHover={setHover} className="h-[180px] sm:h-[280px] lg:h-[380px] 2xl:h-[460px]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <p aria-hidden className="mt-4 hidden min-h-7 text-center [@media(hover:hover)]:block font-cond text-xl font-bold uppercase tracking-wide">
          {on && (
            <>
              {on.name} <span className="text-ink/50">· {on.industry} · {on.place}</span>
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
        <p className="mt-8 text-sm text-ink/55">{e.disclaimer}</p>
      </div>
    </section>
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
          <Link href="/#eksempler" className="hover:text-brand">{t.nav.examples}</Link>
          <Link href="/pris/" className="hover:text-brand">{t.nav.price}</Link>
          <Link href="/proces/" className="hover:text-brand">{t.nav.process}</Link>
          <Link href="/faq/" className="hover:text-brand">{t.nav.faq}</Link>
        </nav>
        <div className="flex flex-col gap-2 text-xs text-paper/50">
          <p>
            {t.footer} · {t.updated}
          </p>
          <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-paper/70">
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
        <h1 className="max-w-4xl text-balance font-cond text-5xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-7xl">{title}</h1>
        {lead && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/75">{lead}</p>}
      </div>
    </section>
  );
}
