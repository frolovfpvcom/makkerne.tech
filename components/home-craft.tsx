"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLang } from "./lang";
import { DESKTOP_WIDTH, ScrollHint, ShotThenLive, useScaledFrame } from "./live-site";

/*
 * The middle of the front page, built from things a tradesperson knows: a strip of warning tape with the
 * trades on it, an old site you can drag away to show ours, a tape measure with the few numbers that
 * matter, and a delivery note of what is in the box. Every number here is from our own price list.
 */

const STYLES = `
.tape{background:repeating-linear-gradient(-45deg,#f5c518 0 22px,#1c1b18 22px 44px)}
.tape-run{animation:tape-run 48s linear infinite}
.tape-run:hover{animation-play-state:paused}
@keyframes tape-run{to{transform:translateX(-50%)}}
.ruler{background-color:#f5c518;background-image:
 repeating-linear-gradient(90deg,#1c1b18 0 2px,transparent 2px 100%),
 repeating-linear-gradient(90deg,#1c1b18 0 1px,transparent 1px 100%);
 background-size:80px 30px,16px 14px;background-repeat:repeat-x;background-position:0 0,0 0}
@media (prefers-reduced-motion:reduce){.tape-run{animation:none}}
`;

/** Warning-tape band with every trade on it. Each card opens that example. */
export function TradeBand() {
  const { t } = useLang();
  const items = t.examples.items;
  const row = [...items, ...items];
  return (
    <section aria-label={t.examples.all} className="relative overflow-hidden bg-ink py-5 sm:py-7">
      <style>{STYLES}</style>
      <div className="tape absolute inset-x-0 top-0 h-2.5" aria-hidden />
      <div className="tape absolute inset-x-0 bottom-0 h-2.5" aria-hidden />
      <div className="tape-run flex w-max gap-3 py-3 sm:gap-4">
        {row.map((it, i) => (
          <Link
            key={i}
            href={it.href}
            tabIndex={i >= items.length ? -1 : undefined}
            aria-hidden={i >= items.length || undefined}
            className="group flex w-[230px] shrink-0 items-center gap-3 rounded-lg bg-[#2a2823] p-2 pr-4 text-[#f7f3ea] transition hover:bg-[#35322b] sm:w-[260px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- small static screenshot */}
            <img src={`/examples/shots/phone/${it.slug}.webp`} alt="" width={78} height={145} loading="lazy" className="h-[72px] w-[39px] shrink-0 rounded-[6px] object-cover object-top ring-1 ring-white/10" />
            <span className="min-w-0">
              <span className="block font-cond text-2xl font-extrabold uppercase leading-none tracking-wide text-brand">{it.trade}</span>
              <span className="mt-1 block truncate text-sm text-[#f7f3ea]/70">{it.name}, {it.place}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/** A tired old trade site; drag the handle and ours is underneath. */
export function OldVsNew() {
  const { lang } = useLang();
  const da = lang === "da";
  const [pos, setPos] = useState(55);
  const { boxRef, size } = useScaledFrame();
  const phone = size.ready && size.w !== DESKTOP_WIDTH;
  // Dragging the handle moves the split. Only the handle takes the finger, so the rest of the frame scrolls.
  const drag = (e: React.PointerEvent<HTMLButtonElement>) => {
    const box = boxRef.current;
    if (!box) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const move = (x: number) => {
      const r = box.getBoundingClientRect();
      setPos(Math.max(4, Math.min(96, ((x - r.left) / r.width) * 100)));
    };
    move(e.clientX);
    const el = e.currentTarget;
    const onMove = (ev: PointerEvent) => move(ev.clientX);
    const stop = () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", stop);
      el.removeEventListener("pointercancel", stop);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", stop);
    el.addEventListener("pointercancel", stop);
  };
  return (
    <section className="bg-paper py-14 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="max-w-2xl">
          <p className="font-cond text-lg font-bold uppercase tracking-[0.16em] text-ink/55">{da ? "Før og efter" : "Before and after"}</p>
          <h2 className="mt-2 font-cond text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-6xl">
            {da ? "Træk i håndtaget. Se forskellen." : "Drag the handle. See the difference."}
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-ink/70">
            {da
              ? "Til venstre en typisk håndværkerside, som mange stadig har. Til højre en af vores. Kunden beslutter sig på et par sekunder, ofte på telefonen ude i indkørslen."
              : "On the left, a typical trade site many still have. On the right, one of ours. Customers decide in a few seconds, often on their phone in the driveway."}
          </p>
        </div>

        <div ref={boxRef} className="relative mx-auto mt-8 aspect-[9/16] max-h-[80svh] w-full max-w-[440px] select-none overflow-hidden rounded-[28px] border-[6px] border-ink bg-white shadow-[0_24px_60px_-24px_rgb(28_27_24/0.45)] sm:aspect-[16/10] sm:max-h-none sm:max-w-none sm:rounded-xl sm:border sm:border-ink/15">
          {/* Ours: the carpenter example itself, live and sharp, at phone or computer width. */}
          {size.ready && (
            <ShotThenLive
              key={size.w}
              src="/examples/tomrer/"
              shot={`/examples/shots/${size.w === DESKTOP_WIDTH ? "desktop" : "mobile"}/tomrer.webp`}
              title={da ? "Vores tømrerside" : "Our carpenter site"}
              width={size.w}
              height={size.h}
              scale={size.scale}
              interactive={phone}
            />
          )}
          {phone && <ScrollHint label={da ? "Stryg for at scrolle i vores side" : "Swipe to scroll our site"} />}
          <span className="absolute right-3 top-3 rounded bg-brand px-2.5 py-1 font-cond text-base font-bold uppercase text-ink">{da ? "Vores" : "Ours"}</span>

          {/* The old one, drawn in plain HTML so it looks exactly as tired as they do. */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#e9e9e9] font-serif text-[#222]" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} aria-hidden>
            {/* On a phone the old site is shown the way old sites look there: a computer page shrunk to fit. */}
            <div
              className="origin-top-left"
              style={phone ? { width: 640, transform: `scale(${size.w / 640})` } : undefined}
            >
            <div className="bg-[linear-gradient(#3a6ea5,#204a7a)] px-4 py-3 text-center text-white">
              <p className="text-2xl font-bold italic sm:text-4xl" style={{ fontFamily: "Times New Roman, serif", textShadow: "2px 2px 0 #000" }}>Hansen &amp; Søn Byg</p>
              <p className="text-xs sm:text-sm">Tømrer · Snedker · Alt i byggeri</p>
            </div>
            <div className="flex flex-wrap gap-1 bg-[#c0c0c0] px-2 py-1 text-[11px] sm:text-sm">
              {["Forside", "Om os", "Ydelser", "Billeder", "Kontakt", "Gæstebog"].map((m) => (
                <span key={m} className="border border-[#808080] bg-[#d4d0c8] px-2 text-[#00c] underline">{m}</span>
              ))}
            </div>
            <div className="grid gap-3 p-3 text-[12px] leading-snug sm:grid-cols-[1fr_200px] sm:p-5 sm:text-[14px]">
              <div>
                <p className="text-lg font-bold text-[#800000] sm:text-2xl" style={{ fontFamily: "Comic Sans MS, cursive" }}>Velkommen til vores hjemmeside!!</p>
                <p className="mt-2">Vi er et firma der laver alt indenfor tømrerarbejde. Vi har mange års erfaring og leverer altid kvalitet til konkurrencedygtige priser. Kontakt os endelig for et uforpligtende tilbud. Siden er under opbygning.</p>
                <div className="mt-3 grid h-24 place-items-center border-2 border-dashed border-[#999] bg-[#f4f4f4] text-[#999] sm:h-40">[ billede mangler ]</div>
                <p className="mt-3 text-[#00c] underline">Klik her for at se vores priser (PDF)</p>
                <p className="mt-4 text-base font-bold underline">Vores ydelser:</p>
                <ul className="mt-1 list-disc pl-5">
                  {["Tagarbejde", "Vinduer og døre", "Tilbygninger", "Gulve", "Køkkener", "Div. reparationer", "Forsikringsskader"].map((y) => (
                    <li key={y}>{y}</li>
                  ))}
                </ul>
                <table className="mt-4 w-full border-collapse border border-[#999] text-[11px]">
                  <tbody>
                    {[["Timepris", "Ring for pris"], ["Kørsel", "Efter aftale"], ["Tilbud", "Ring venligst"]].map(([k, v]) => (
                      <tr key={k}><td className="border border-[#999] bg-[#ddd] px-2 py-1">{k}</td><td className="border border-[#999] px-2 py-1">{v}</td></tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-5 border-t border-[#999] pt-2 text-center text-[10px] text-[#666]">© 2011 Hansen &amp; Søn Byg · Bedst set i Internet Explorer 800x600</p>
              </div>
              <div className="hidden border border-[#999] bg-white p-2 text-center sm:block">
                <p className="font-bold">Besøgende:</p>
                <p className="mt-1 inline-block bg-black px-2 font-mono text-[#0f0]">0 0 4 7 1 2</p>
                <p className="mt-3 text-[11px]">Opdateret: 14-03-2011</p>
                <p className="mt-3 text-[11px]">Tlf: 12 34 56 78 (kun hverdage 8-15)</p>
              </div>
            </div>
            </div>
          </div>
          <span className="absolute left-3 top-3 rounded bg-ink/80 px-2.5 py-1 font-cond text-base font-bold uppercase text-white" style={{ opacity: pos > 18 ? 1 : 0 }}>{da ? "Typisk i dag" : "Typical today"}</span>

          {/* The split line, and a handle that is the only part that takes the finger. Arrow keys work through the range input. */}
          <div className="pointer-events-none absolute inset-y-0 w-1 -translate-x-1/2 bg-brand" style={{ left: `${pos}%` }} aria-hidden />
          <button
            type="button"
            onPointerDown={drag}
            tabIndex={-1}
            aria-hidden
            className="absolute top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize touch-none place-items-center rounded-full bg-brand text-ink shadow-[0_6px_20px_rgb(0_0_0/0.35)] ring-4 ring-white/70"
            style={{ left: `${pos}%` }}
          >
            <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 6l-6 6 6 6M15 6l6 6-6 6" /></svg>
          </button>
          <input
            type="range"
            min={4}
            max={96}
            value={pos}
            onChange={(e) => setPos(Number(e.target.value))}
            aria-label={da ? "Flyt skillelinjen mellem den gamle side og vores" : "Move the line between the old site and ours"}
            className="sr-only"
          />
        </div>
        <p className="mt-3 text-sm text-ink/55">{da ? "Den gamle side er lavet til lejligheden og findes ikke. Vores er tømrereksemplet." : "The old site is made up for this. Ours is the carpenter example."}</p>
      </div>
    </section>
  );
}

/** A tape measure with the four numbers that matter. They count up once, when the tape comes into view. */
export function TapeMeasure() {
  const { lang } = useLang();
  const da = lang === "da";
  const ref = useRef<HTMLDivElement>(null);
  const [go, setGo] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setGo(true), io.disconnect()), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const facts = [
    { n: 0, unit: "kr.", label: da ? "før du har sagt ja til udkastet" : "before you say yes to the draft" },
    { n: 3, unit: da ? "hverdage" : "working days", label: da ? "så har du dit udkast" : "and you have your draft" },
    { n: 2000, unit: "kr.", label: da ? "fra, for selve siden, ekskl. moms" : "from, for the site itself, excl. VAT" },
    { n: 10, unit: da ? "fag" : "trades", label: da ? "har allerede et eksempel, du kan prøve" : "already have an example to try" },
  ];
  return (
    <section ref={ref} className="bg-paper-2 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="ruler h-[30px] rounded-t-md border-x-2 border-t-2 border-ink" aria-hidden />
        <div className="grid grid-cols-2 border-2 border-t-0 border-ink bg-card lg:grid-cols-4">
          {facts.map((f, i) => (
            <div key={i} className={`p-4 sm:p-6 ${i % 2 ? "border-l-2 border-ink" : ""} ${i > 1 ? "border-t-2 border-ink lg:border-t-0" : ""} ${i === 2 ? "lg:border-l-2" : ""}`}>
              <p className="font-cond text-5xl font-extrabold leading-none tabular-nums sm:text-6xl">
                <Count to={f.n} go={go} />
                <span className="ml-1.5 text-2xl sm:text-3xl">{f.unit}</span>
              </p>
              <p className="mt-2 text-[15px] leading-snug text-ink/70">{f.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Count({ to, go }: { to: number; go: boolean }) {
  const [v, setV] = useState(to);
  useEffect(() => {
    if (!go || to === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1100);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    setV(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [go, to]);
  return <>{v.toLocaleString("da-DK")}</>;
}

/** What comes in the box, written out like a delivery note from the timber yard. */
export function DeliveryNote() {
  const { lang } = useLang();
  const da = lang === "da";
  const lines = da
    ? [
        ["Hjemmeside bygget til dit fag", "Ikke en skabelon. Fra 1 til 20 sider."],
        ["Telefonnummeret i top", "Kunden ringer med ét tryk fra mobilen."],
        ["Vi skriver teksterne", "Du fortæller, vi skriver. Det koster ikke ekstra."],
        ["Klar til Google", "Titler, beskrivelser og din by på de rigtige steder."],
        ["Domæne og opsætning", "Vi sætter det hele op. Du ejer selv dit domæne."],
        ["Drift og rettelser", "Fra 249 kr. om måneden. Ingen binding."],
      ]
    : [
        ["A site built for your trade", "Not a template. From 1 to 20 pages."],
        ["Phone number at the top", "Customers call with one tap on their phone."],
        ["We write the text", "You tell us, we write it. No extra cost."],
        ["Ready for Google", "Titles, descriptions and your town in the right places."],
        ["Domain and setup", "We set it all up. You own your domain."],
        ["Care and changes", "From 249 kr. a month. No lock-in."],
      ];
  return (
    <section className="bg-paper py-14 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-28">
          <p className="font-cond text-lg font-bold uppercase tracking-[0.16em] text-ink/55">{da ? "Det får du" : "What you get"}</p>
          <h2 className="mt-2 font-cond text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-6xl">
            {da ? "Alt er med. Du skal bare godkende." : "Everything is included. You just approve it."}
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-ink/70">
            {da ? "Du passer dine opgaver. Vi klarer siden fra første mail, til den er oppe at køre." : "You get on with your jobs. We handle the site from the first email until it is live."}
          </p>
          <Link href="/pris/#beregner" className="mt-6 inline-flex h-13 items-center rounded-md bg-ink px-6 font-cond text-xl font-bold uppercase tracking-wide text-[#f7f3ea] transition hover:bg-black">
            {da ? "Se din pris" : "See your price"}
          </Link>
        </div>
        {/* The note: ruled lines, a tick for each line, and a stamp. */}
        <div className="relative rotate-[0.6deg] rounded-sm border border-ink/15 bg-[#fffdf7] p-5 shadow-[0_20px_50px_-20px_rgb(28_27_24/0.35)] sm:p-8">
          <div className="flex items-baseline justify-between border-b-2 border-ink pb-3">
            <p className="font-cond text-2xl font-extrabold uppercase tracking-wide">{da ? "Følgeseddel" : "Delivery note"}</p>
            <p className="text-sm text-ink/55">Makkerne</p>
          </div>
          <ol className="divide-y divide-dashed divide-ink/25">
            {lines.map(([a, b], i) => (
              <li key={a} className="grid grid-cols-[2rem_1fr_auto] items-start gap-3 py-4">
                <span className="font-cond text-xl font-bold text-ink/40 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block font-semibold">{a}</span>
                  <span className="block text-[15px] leading-snug text-ink/65">{b}</span>
                </span>
                <svg viewBox="0 0 24 24" className="mt-0.5 size-6 text-[#2f7d32]" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden><path d="M4 12.5l5 5L20 6.5" /></svg>
              </li>
            ))}
          </ol>
          <div className="pointer-events-none absolute -bottom-4 right-6 rotate-[-10deg] rounded border-[3px] border-[#b3261e] px-3 py-1 font-cond text-xl font-extrabold uppercase tracking-wider text-[#b3261e]/85 sm:right-10">
            {da ? "Udkast gratis" : "Draft free"}
          </div>
        </div>
      </div>
    </section>
  );
}
