"use client";

import Link from "next/link";
import { useLang } from "./lang";
import { PhonePreview } from "./phone-preview";
import { QuoteCard } from "./quote-card";

/**
 * First view: a small real example site on a phone on the left, which turns to the trade the
 * visitor picks, and on the right what we make and for whom, with the price in three clicks under
 * it, drawn large and in yellow so it is what the eye lands on first. On a phone the text and the
 * price come first. It stops short of the screen's bottom, so the examples below peek in.
 */
export function Hero() {
  const { t } = useLang();
  const h = t.hero;

  return (
    <section className="border-b border-ink/15 pt-20">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-8 sm:px-8 lg:grid-cols-12 lg:items-start lg:gap-14 lg:py-10">
        <div className="lg:col-span-8">
          <h1 className="font-cond text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-6xl xl:text-7xl">
            <span className="block">{h.title}</span>
            <span className="mt-2 inline-block bg-brand px-3 py-1 text-ink">{h.titleHighlight}</span>
          </h1>

          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/80 lg:text-xl">{h.lead}</p>

          <QuoteCard big className="mt-7 max-w-xl sm:max-w-none lg:mt-9" />

          <Link href="/eksempelsider/" className="mt-6 inline-flex items-center gap-2 py-1 font-cond text-lg font-bold uppercase tracking-wide underline decoration-2 underline-offset-4 hover:decoration-brand">
            {h.cta} <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="flex justify-center lg:order-first lg:col-span-4">
          <PhonePreview items={t.examples.items} title={h.phone} desktopTitle={h.desktop} labels={{ view: h.view, phone: h.viewPhone, desktop: h.viewDesktop }} quiet />
        </div>
      </div>
    </section>
  );
}
