"use client";

import { useLang } from "./lang";
import { PhonePreview } from "./phone-preview";

function HeroCheck() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 size-5 shrink-0 text-brand-dark" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

/**
 * First view: what we make and for whom, balanced according to the golden ratio.
 * Concrete value propositions on the left balance the phone on the right, keeping
 * eye tracking natural and purposeful above the fold.
 */
export function Hero() {
  const { t } = useLang();
  const h = t.hero;

  return (
    <section className="border-b border-ink/15 pt-20 lg:flex lg:min-h-svh lg:flex-col lg:justify-center">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-10 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:py-14">
        <div className="lg:col-span-7">
          <h1 className="font-cond text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-6xl xl:text-7xl">
            <span className="block">{h.title}</span>
            <span className="mt-2 inline-block bg-brand px-3 py-1 text-ink">{h.titleHighlight}</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/80 sm:text-xl">{h.lead}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#eksempler"
              className="inline-flex items-center justify-center gap-3 bg-brand px-8 py-4 font-cond text-xl font-bold uppercase tracking-wide text-ink transition hover:bg-brand-dark sm:text-2xl"
            >
              {h.cta} <span aria-hidden>↓</span>
            </a>
            <a
              href="#beregner"
              className="inline-flex items-center justify-center border-2 border-ink bg-card px-7 py-3.5 font-cond text-xl font-bold uppercase tracking-wide text-ink transition hover:bg-paper-2 sm:text-2xl"
            >
              {h.calcCta}
            </a>
          </div>

          <ul className="mt-8 space-y-2.5 border-t border-ink/15 pt-6 text-sm text-ink/80 sm:text-base">
            {h.points?.map((p) => (
              <li key={p.bold} className="flex items-center gap-2.5">
                <HeroCheck />
                <span>
                  <strong className="font-semibold text-ink">{p.bold}</strong> – {p.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center lg:col-span-5">
          <PhonePreview items={t.examples.items} title={h.phone} badge={h.liveBadge} />
        </div>
      </div>
    </section>
  );
}
