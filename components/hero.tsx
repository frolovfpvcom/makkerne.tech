"use client";

import Link from "next/link";
import { TEAM } from "@/lib/content";
import { useLang } from "./lang";
import { PhonePreview } from "./phone-preview";
import { QuoteCard } from "./quote-card";

/**
 * First view: who is behind it, what we make and for whom, and the price in three clicks right
 * under it. A small real example site on a phone sits beside it and turns to the trade the visitor
 * picks. On a phone the text and the price come first.
 */
export function Hero() {
  const { t } = useLang();
  const h = t.hero;

  return (
    <section className="pt-18">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-10 sm:px-8 lg:grid-cols-12 lg:items-start lg:gap-14 lg:py-16">
        <div className="lg:col-span-8">
          {/* The two of us, before anything else: a real person is the first thing a craftsman checks. */}
          <p className="flex items-center gap-3 text-sm font-medium text-ink/70">
            <span className="flex -space-x-2">
              {TEAM.map((p) => (
                <img key={p.name} src={p.photo} alt="" width={36} height={36} loading="eager" className="size-9 rounded-full border-2 border-paper bg-paper-2 object-cover object-top" />
              ))}
            </span>
            {h.by}
          </p>

          <h1 className="mt-6 text-balance font-cond text-[2.6rem] font-bold leading-[1.02] tracking-tight sm:text-6xl xl:text-[4.25rem]">
            {h.title}{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span className="relative z-10">{h.titleHighlight}</span>
              {/* A stroke of the logo's yellow under the word, like a marker on a drawing. */}
              <svg aria-hidden viewBox="0 0 300 20" preserveAspectRatio="none" className="absolute inset-x-0 -bottom-[0.1em] h-[0.24em] w-full text-brand">
                <path d="M3 12c60-7 140-10 294-5" fill="none" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/70 lg:text-xl">{h.lead}</p>

          <QuoteCard big className="mt-8 max-w-xl sm:max-w-none lg:mt-10" />

          <Link href="/eksempelsider/" className="group mt-6 inline-flex items-center gap-2 py-1 font-cond text-lg font-semibold">
            <span className="underline decoration-ink/30 decoration-2 underline-offset-[6px] transition group-hover:decoration-brand">{h.cta}</span>
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="flex justify-center lg:order-first lg:col-span-4 lg:pt-14">
          <PhonePreview items={t.examples.items} title={h.phone} desktopTitle={h.desktop} labels={{ view: h.view, phone: h.viewPhone, desktop: h.viewDesktop }} quiet />
        </div>
      </div>
    </section>
  );
}
