"use client";

import Link from "next/link";
import { useLang } from "./lang";
import { PhonePreview } from "./phone-preview";
import { QuoteCard } from "./quote-card";

/**
 * First view: what we make and for whom, and right under the headline, where the eye goes next, the
 * price in three clicks. Next to it a real example site on a phone, which turns to the trade the
 * visitor picks. It stops short of the screen's bottom, so the examples below peek in.
 */
export function Hero() {
  const { t } = useLang();
  const h = t.hero;

  return (
    <section className="border-b border-ink/15 pt-20">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:items-start px-4 py-8 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:py-10">
        <div className="lg:col-span-7">
          <h1 className="font-cond text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-6xl xl:text-[4rem]">
            <span className="block">{h.title}</span>
            <span className="mt-2 inline-block bg-brand px-3 py-1 text-ink">{h.titleHighlight}</span>
          </h1>

          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/80">{h.lead}</p>

          <QuoteCard className="mt-6 max-w-xl" />

          <Link href="/eksempelsider/" className="mt-4 inline-flex items-center gap-2 py-1 font-cond text-lg font-bold uppercase tracking-wide underline decoration-2 underline-offset-4 hover:decoration-brand">
            {h.cta} <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="flex justify-center lg:col-span-5">
          <PhonePreview items={t.examples.items} title={h.phone} desktopTitle={h.desktop} labels={{ view: h.view, phone: h.viewPhone, desktop: h.viewDesktop }} />
        </div>
      </div>
    </section>
  );
}
