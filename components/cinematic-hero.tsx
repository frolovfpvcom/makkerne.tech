"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { INTRO_DONE } from "./intro";
import { useLang } from "./lang";
import { PhonePreview } from "./phone-preview";
import { QuoteCard } from "./quote-card";


// Film grain, the faint grid behind the title, and the deep blue card. On a computer the card and its
// contents start hidden, so nothing flashes before the scroll timeline takes over.
const STYLES = `
.cine-grain{position:absolute;inset:0;pointer-events:none;z-index:50;opacity:.05;mix-blend-mode:overlay;
  background:url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)"/></svg>')}
.cine-grid{background-size:60px 60px;
  background-image:linear-gradient(to right,rgb(255 255 255/.05) 1px,transparent 1px),linear-gradient(to bottom,rgb(255 255 255/.05) 1px,transparent 1px);
  mask-image:radial-gradient(ellipse at center,#000 0%,transparent 70%);-webkit-mask-image:radial-gradient(ellipse at center,#000 0%,transparent 70%)}
.cine-title{color:#fff;text-shadow:0 10px 30px rgb(255 255 255/.18),0 2px 4px rgb(255 255 255/.1)}
.cine-silver{background:linear-gradient(180deg,#fff 0%,rgb(255 255 255/.45) 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;transform:translateZ(0)}
.cine-card{background:linear-gradient(145deg,#162c6d 0%,#0a101d 100%)}
.cine-sheen{position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(800px circle at var(--mx,50%) var(--my,50%),rgb(255 255 255/.06) 0%,transparent 40%)}
.cine-badge{background:linear-gradient(135deg,rgb(255 255 255/.1) 0%,rgb(255 255 255/.02) 100%);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  box-shadow:0 0 0 1px rgb(255 255 255/.1),0 25px 50px -12px rgb(0 0 0/.8)}
@media (min-width:1024px) and (prefers-reduced-motion:no-preference){
  .cine-card,.cine-in{visibility:hidden}
}
`;

/**
 * Front page opening. A dark screen with the name and what we do; then, by itself, a deep blue card
 * rises over it and grows to fill the screen, and in it are one of our sites on a phone, the price in
 * three clicks, and the way to the examples. On a computer it plays as the page opens; on a phone, or
 * with reduced motion, the two simply follow each other.
 */
export function CinematicHero() {
  const { t, lang } = useLang();
  const h = t.hero;
  const c = t.calc;
  const kr = (n: number) => (lang === "da" ? `${n.toLocaleString("da-DK")} kr.` : `DKK ${n.toLocaleString("en-GB")}`);
  const root = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const phone = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      // The light on the card follows the mouse, and the phone tilts a little towards it.
      let frame = 0;
      const move = (e: MouseEvent) => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          if (!card.current || !phone.current) return;
          const r = card.current.getBoundingClientRect();
          card.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
          card.current.style.setProperty("--my", `${e.clientY - r.top}px`);
          const x = (e.clientX / window.innerWidth - 0.5) * 2;
          const y = (e.clientY / window.innerHeight - 0.5) * 2;
          gsap.to(phone.current, { rotationY: x * 8, rotationX: -y * 8, ease: "power3.out", duration: 1.2 });
        });
      };
      window.addEventListener("mousemove", move);

      gsap.set(".cine-line1", { autoAlpha: 0, y: 60, scale: 0.85, filter: "blur(20px)" });
      gsap.set(".cine-line2", { clipPath: "inset(0 100% 0 0)" });
      gsap.set(".cine-card", { y: window.innerHeight + 200, autoAlpha: 1 });
      gsap.set(".cine-in", { autoAlpha: 0 });

      // Plays by itself as the page opens: the name, a short pause, then the blue card rises, fills the
      // screen and its contents come in. Scrolling, a click or a key skips straight to the end.
      const intro = gsap
        .timeline({ delay: 0.2, onComplete: done })
        .to(".cine-line1", { duration: 0.9, autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", ease: "expo.out" })
        .to(".cine-line2", { duration: 0.6, clipPath: "inset(0 0% 0 0)", ease: "power3.out" }, "-=0.6")
        .to({}, { duration: 0.2 })
        .addLabel("card")
        .to([".cine-text", ".cine-grid"], { scale: 1.15, filter: "blur(20px)", opacity: 0.2, ease: "power2.inOut", duration: 0.6 }, "card")
        .to(".cine-card", { y: 0, ease: "power3.inOut", duration: 0.6 }, "card")
        .to(".cine-card", { width: "100vw", height: "100vh", borderRadius: 0, ease: "power3.inOut", duration: 0.4 }, "-=0.2")
        // The menu comes in as soon as the card fills the screen, not after the phone and price card have landed.
        .call(() => window.dispatchEvent(new Event(INTRO_DONE)))
        .fromTo(".cine-phone", { y: 300, z: -500, rotationX: 50, rotationY: -30, autoAlpha: 0, scale: 0.6 }, { y: 0, z: 0, rotationX: 0, rotationY: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 0.7 }, "-=0.3")
        .fromTo(".cine-badge", { y: 60, autoAlpha: 0, scale: 0.85 }, { y: 0, autoAlpha: 1, scale: 1, ease: "back.out(1.5)", duration: 0.5, stagger: 0.08 }, "-=0.5")
        .fromTo(".cine-left", { x: -40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power4.out", duration: 0.5 }, "-=0.5")
        .fromTo(".cine-right", { x: 40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "expo.out", duration: 0.5 }, "<");
      const skip = () => intro.progress(1);
      const skipEvents = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
      skipEvents.forEach((ev) => window.addEventListener(ev, skip, { once: true, passive: true }));
      function done() {
        skipEvents.forEach((ev) => window.removeEventListener(ev, skip));
        window.dispatchEvent(new Event(INTRO_DONE));
      }

      return () => {
        skipEvents.forEach((ev) => window.removeEventListener(ev, skip));
        window.removeEventListener("mousemove", move);
        cancelAnimationFrame(frame);
      };
    }, root);
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden bg-[#0a0a0b] text-white lg:h-dvh" style={{ perspective: "1500px" }}>
      <style>{STYLES}</style>
      <div className="cine-grain" aria-hidden />
      <div className="cine-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden />

      {/* The name and what we do, alone on the dark screen. */}
      <div className="cine-text relative z-10 flex min-h-[70svh] flex-col items-center justify-center px-4 text-center lg:absolute lg:inset-0 lg:min-h-0">
        <h1 className="font-cond font-bold tracking-tight">
          <span className="cine-line1 cine-title block text-6xl sm:text-7xl lg:text-[7rem]">{h.tagline1}</span>
          <span className="cine-line2 cine-silver mt-3 block text-balance text-3xl leading-tight sm:text-5xl lg:text-[3.5rem]">{h.tagline2}</span>
        </h1>
      </div>

      {/* The blue card: phone, text and the price card. */}
      <div className="relative z-20 lg:pointer-events-none lg:absolute lg:inset-0 lg:flex lg:items-center lg:justify-center" style={{ perspective: "1500px" }}>
        <div ref={card} className="cine-card relative w-full overflow-hidden lg:pointer-events-auto lg:h-[85vh] lg:w-[85vw] lg:rounded-[40px]">
          <div className="cine-sheen" aria-hidden />
          <div className="relative mx-auto grid h-full max-w-7xl items-center gap-12 px-4 pb-16 pt-20 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_auto_minmax(0,1.15fr)] lg:gap-10 lg:px-12 lg:pb-8 lg:pt-24">
            <div className="cine-left cine-in">
              <h2 className="font-cond text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">{h.cardTitle}</h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-blue-100/70">{h.cardLead}</p>
              <Link href="/eksempelsider/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-cond text-lg font-semibold text-black transition hover:bg-brand hover:text-black">
                {h.seeExamples} <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="cine-phone cine-in relative order-last mx-auto lg:order-none" style={{ perspective: "1000px" }}>
              <div ref={phone} style={{ transformStyle: "preserve-3d" }}>
                <PhonePreview items={t.examples.items} title={h.phone} desktopTitle={h.desktop} labels={{ view: h.view, phone: h.viewPhone, desktop: h.viewDesktop }} quiet onDark phoneOnly />
              </div>
              <div className="cine-badge cine-in absolute -left-28 top-12 hidden whitespace-nowrap rounded-2xl px-4 py-3 xl:block lg:-left-44">
                <p className="text-sm font-semibold">{h.badgeFree}</p>
                <p className="text-xs text-blue-100/60">{h.badgeFreeNote}</p>
              </div>
              <div className="cine-badge cine-in absolute -left-28 bottom-28 hidden whitespace-nowrap rounded-2xl px-4 py-3 xl:block lg:-left-52">
                <p className="text-sm font-semibold tabular-nums">
                  {h.badgePrice} {kr(c.size.options[0].price)}
                </p>
                <p className="text-xs tabular-nums text-blue-100/60">
                  {h.badgePriceNote} {kr(c.care.options[0].monthly)} {c.monthly}
                </p>
              </div>
            </div>

            <div className="cine-right cine-in text-ink">
              <QuoteCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
