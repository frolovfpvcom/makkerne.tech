"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { EMAIL } from "@/lib/content";
import { INTRO_DONE } from "./intro";
import { useLang } from "./lang";
import { PhonePreview } from "./phone-preview";
import { DraftSheet } from "./draft-sheet";

/*
 * Front page opening. A short film of real trade work (Pexels) runs behind the name. First a yellow line
 * is drawn across, like a chalk line snapped on a board, then the heading comes up line by line, slowly
 * enough to read. Under it, on the light page, one of our sites on a phone beside the price card. Nothing
 * is pinned: the page scrolls normally on every screen.
 */
const STYLES = `
.ch-line{transform-origin:left;transform:scaleX(0);animation:ch-draw 1.1s cubic-bezier(.65,0,.35,1) .25s forwards}
.ch-up{opacity:0;transform:translateY(28px);animation:ch-up .9s cubic-bezier(.22,1,.36,1) forwards}
.ch-d1{animation-delay:1.05s}.ch-d2{animation-delay:1.35s}.ch-d3{animation-delay:1.75s}.ch-d4{animation-delay:2s}
@keyframes ch-draw{to{transform:scaleX(1)}}
@keyframes ch-up{to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.ch-line{transform:none;animation:none}.ch-up{opacity:1;transform:none;animation:none}}
`;

export function CraftHero() {
  const { t, lang } = useLang();
  const h = t.hero;
  const da = lang === "da";

  // The menu and the cookie note come in once the heading is up.
  useEffect(() => {
    const id = setTimeout(() => window.dispatchEvent(new Event(INTRO_DONE)), 1800);
    return () => clearTimeout(id);
  }, []);

  return (
    <>
      <style>{STYLES}</style>
      <section className="relative isolate flex min-h-[86svh] items-end overflow-hidden bg-navy text-[#f7f3ea] sm:min-h-[92svh]">
        <video
          className="absolute inset-0 -z-20 size-full object-cover"
          src="/video/haandvaerk.mp4"
          poster="/video/haandvaerk-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(28_27_24/0.25)_0%,rgb(28_27_24/0.55)_45%,rgb(28_27_24/0.92)_100%)]" aria-hidden />

        <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-28 sm:px-8 sm:pb-16">
          <p className="ch-up ch-d1 font-cond text-base font-semibold uppercase tracking-[0.18em] text-brand sm:text-lg">
            {da ? "Hjemmesider til håndværkere" : "Websites for tradespeople"}
          </p>
          <span className="ch-line mt-3 block h-[5px] w-28 bg-brand sm:w-40" aria-hidden />
          <h1 className="mt-5 font-cond font-extrabold uppercase leading-[0.92] tracking-tight">
            <span className="ch-up ch-d2 block text-[3.1rem] sm:text-7xl lg:text-[6.5rem]">{da ? "Du bygger huse." : "You build houses."}</span>
            <span className="ch-up ch-d3 block text-[2.15rem] text-[#f7f3ea]/85 sm:text-5xl lg:text-[4.2rem]">
              {da ? "Vi bygger siden, der skaffer kunderne." : "We build the site that brings in customers."}
            </span>
          </h1>
          <div className="ch-up ch-d4 mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/eksempelsider/" className="inline-flex h-13 items-center justify-center rounded-md bg-brand px-6 font-cond text-xl font-bold uppercase tracking-wide text-ink transition hover:bg-white">
              {da ? "Se eksempler" : "See examples"}
            </Link>
            <a href="#beregner" className="inline-flex h-13 items-center justify-center rounded-md border-2 border-[#f7f3ea]/80 px-6 font-cond text-xl font-bold uppercase tracking-wide transition hover:bg-[#f7f3ea] hover:text-ink">
              {da ? "Beregn din pris" : "Work out your price"}
            </a>
          </div>
          <p className="ch-up ch-d4 mt-6 max-w-xl text-[15px] leading-relaxed text-[#f7f3ea]/75 sm:text-base">
            {da
              ? "Du ser et gratis udkast af din side, før du betaler noget. Skriv til os på "
              : "You see a free draft of your site before you pay anything. Write to us at "}
            <a href={`mailto:${EMAIL}`} className="font-semibold text-[#f7f3ea] underline underline-offset-4">{EMAIL}</a>
          </p>
        </div>
      </section>

    </>
  );
}

/** One of our sites on a phone beside the price card, on the light page. */
export function CalcStage() {
  const { t } = useLang();
  const h = t.hero;
  const phone = useRef<HTMLDivElement>(null);

  // On a computer the phone leans a little towards the mouse. It never holds the page still.
  useEffect(() => {
    if (!window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)").matches) return;
    let frame = 0;
    const move = (e: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = phone.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / 600));
        const y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / 600));
        el.style.transform = `perspective(1200px) rotateY(${x * 7}deg) rotateX(${-y * 5}deg)`;
      });
    };
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Plain scrolling, no pinned stage.
  return (
      <section id="beregner" className="scroll-mt-20 bg-paper py-12 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-14">
          <div className="lg:col-span-2">
            <h2 className="font-cond text-4xl font-extrabold uppercase tracking-tight sm:text-6xl">{h.cardTitle}</h2>
            <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-ink/70">{h.cardLead}</p>
          </div>
          <div className="order-last mx-auto lg:order-none">
            <div ref={phone} className="transition-transform duration-300 ease-out will-change-transform">
              <PhonePreview items={t.examples.items} title={h.phone} desktopTitle={h.desktop} labels={{ view: h.view, phone: h.viewPhone, desktop: h.viewDesktop }} quiet phoneOnly />
            </div>
          </div>
          <div className="min-w-0">
            <DraftSheet tight />
          </div>
        </div>
      </section>
  );
}
