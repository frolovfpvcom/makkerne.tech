"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, animate, motion } from "framer-motion";
import { EMAIL, type Dict } from "@/lib/content";
import { ACCENT } from "@/lib/accent";
import { useLang } from "./lang";

/** Counts up to `to` when it first appears, so the price feels like a reveal. */
function CountUp({ to, format }: { to: number; format: (n: number) => string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const c = animate(0, to, { duration: 1.1, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v / 50) * 50) });
    return () => c.stop();
  }, [to]);
  return <>{format(n)}</>;
}

function Tick({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

const PAGES = [1, 4, 8];

/**
 * A rough sketch of the visitor's site that fills in as they answer: their trade's colour on top,
 * a tab per page, a strip per feature and a line for the care plan. Plain shapes, so it reads as a
 * sketch and not as a finished site.
 */
function Sketch({ c, accent, light, trade, size, chosen, care, done }: {
  c: Dict["calc"];
  accent: string;
  light: boolean;
  trade: number | null;
  size: number | null;
  chosen: number[];
  care: number | null;
  done: boolean;
}) {
  const p = c.preview;
  const grow = { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: "auto" }, exit: { opacity: 0, height: 0 }, transition: { duration: 0.22 } };
  return (
    <div>
      <p className="font-cond text-sm font-bold uppercase tracking-wide text-paper/55">{p.title}</p>
      <div className="mt-3 rounded-[26px] border-2 border-paper/25 p-2">
        <div className="min-h-[22rem] overflow-hidden rounded-[18px] bg-paper pb-5 text-ink">
          <motion.div
            animate={{ backgroundColor: trade === null ? "#ded9cd" : accent }}
            transition={{ duration: 0.3 }}
            className={`px-3.5 pb-3 pt-4 ${trade !== null && !light ? "text-paper" : "text-ink"}`}
          >
            <p className="font-cond text-lg font-extrabold uppercase leading-none">{p.firm}</p>
            <p className="mt-1 text-[11px] opacity-75">{trade === null ? "…" : c.trade.options[trade]}</p>
          </motion.div>
          <div className="flex gap-1 px-3.5 pt-2.5">
            {Array.from({ length: size === null ? 0 : PAGES[size] }, (_, i) => (
              <motion.span key={i} initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: i * 0.04 }} className="h-1.5 flex-1 origin-left bg-ink/25" />
            ))}
          </div>
          <div className="space-y-1.5 px-3.5 pt-3">
            <span className="block h-2.5 w-4/5 bg-ink/15" />
            <span className="block h-2.5 w-3/5 bg-ink/15" />
          </div>
          <div className="space-y-1.5 px-3.5 pt-4">
            <AnimatePresence initial={false}>
              {trade !== null &&
                chosen.map((i) => (
                  <motion.div key={i} {...grow} className="overflow-hidden">
                    <p className="border-l-4 bg-white px-2 py-1.5 text-[11px] font-semibold leading-tight" style={{ borderColor: trade === null ? "#ded9cd" : accent }}>
                      {c.features.options[i].short}
                    </p>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {care !== null && (
              <motion.p {...grow} className="overflow-hidden px-3.5 pt-4 font-mono text-[10px] uppercase tracking-wide text-ink/55">
                ● {p.care[care]}
              </motion.p>
            )}
          </AnimatePresence>
          {trade === null && <p className="px-3.5 pt-6 text-sm text-ink/55">{p.empty}</p>}
        </div>
      </div>
      <p className={`mt-3 flex items-center gap-2 text-sm ${done ? "font-semibold text-brand" : "text-paper/45"}`}>
        {done && <Tick />}
        {done ? p.ready : p.sketch}
      </p>
    </div>
  );
}

/**
 * The price calculator: four quick questions (trade, size, features, care plan), then the price
 * is revealed with a count-up. Each answer gets a short reply and fills in a sketch of the site. The only way on from there is a free draft by email, with every
 * answer and the price already written into the mail.
 */
export function Calculator() {
  const { t, lang } = useLang();
  const c = t.calc;
  const [step, setStep] = useState(0);
  const [trade, setTrade] = useState<number | null>(null);
  const [size, setSize] = useState<number | null>(null);
  const [extras, setExtras] = useState<number[]>([]);
  const [care, setCare] = useState<number | null>(null);

  const steps = 4;
  const kr = (n: number) => (lang === "da" ? `${n.toLocaleString("da-DK")} kr.` : `DKK ${n.toLocaleString("en-GB")}`);
  const sitePrice = (size === null ? 0 : c.size.options[size].price) + extras.reduce((sum, i) => sum + c.features.options[i].price, 0);
  const monthly = care === null ? 0 : c.care.options[care].monthly;
  const included = c.features.options.map((o, i) => (o.price === 0 ? i : -1)).filter((i) => i >= 0);
  const chosen = [...included, ...extras].sort((a, b) => a - b);

  const mailto = () => {
    const [lTrade, lSize, lFeatures, lCare, lPrice] = c.mailLines;
    const body = [
      `${lTrade}: ${trade === null ? "" : c.trade.options[trade]}`,
      `${lSize}: ${size === null ? "" : c.size.options[size].label}`,
      `${lFeatures}: ${chosen.map((i) => c.features.options[i].label).join(", ")}`,
      `${lCare}: ${care === null ? "" : c.care.options[care].label}`,
      `${lPrice}: ${kr(sitePrice)} + ${kr(monthly)} ${c.monthly}`,
      "",
      c.mailEnd,
    ].join("\n");
    return `mailto:${EMAIL}?subject=${encodeURIComponent(c.mailSubject)}&body=${encodeURIComponent(body)}`;
  };

  // Let the picked button light up for a moment before the next question slides in.
  const advance = (to: number) => setTimeout(() => setStep(to), 260);
  const slug = trade === null ? undefined : t.examples.items[trade]?.slug;
  const accent = slug ? ACCENT[slug] : "#3a3833";
  const reply = step === 1 && trade !== null ? c.trade.reactions[trade] : step === 2 && size !== null ? c.size.reactions[size] : null;
  const tally = [
    trade === null ? null : c.trade.options[trade],
    size === null ? null : c.size.options[size].label,
    step >= 3 ? `${chosen.length} ${c.preview.features}` : null,
  ].filter(Boolean);

  const restart = () => {
    setStep(0);
    setTrade(null);
    setSize(null);
    setExtras([]);
    setCare(null);
  };

  const pick = "border-2 px-4 py-3.5 text-left transition active:scale-[0.97]";
  const on = "border-brand bg-brand text-ink";
  const off = "border-paper/20 hover:border-brand";

  return (
    <MotionConfig reducedMotion="user">
      <div id="beregner" className="scroll-mt-24 border-2 border-ink bg-ink text-paper shadow-[10px_10px_0_0_var(--color-brand)]">
        <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_15rem] xl:grid-cols-[1fr_16rem]">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 bg-brand px-3 py-1 font-cond text-sm font-bold uppercase tracking-wide text-ink">
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
                <path d="M13.5 2L5 13.5h6L9.5 22 19 9.5h-6z" />
              </svg>
              {c.badge}
            </p>

            {step < steps && (
              <div className="mt-6 flex items-center gap-4">
                <div className="flex flex-1 gap-1.5">
                  {Array.from({ length: steps }, (_, i) => (
                    <span key={i} className={`h-1.5 flex-1 transition-colors ${i <= step ? "bg-brand" : "bg-paper/15"}`} />
                  ))}
                </div>
                <span className="shrink-0 font-cond text-sm font-bold uppercase tracking-wide text-paper/55">
                  {c.step} {step + 1} {c.of} {steps}
                </span>
              </div>
            )}

            {/* On smaller screens there is no room for the sketch, so the answers so far go in one line. */}
            {tally.length > 0 && step < steps && <p className="mt-3 truncate text-sm text-paper/55 lg:hidden">{tally.join(" · ")}</p>}

            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.2 }} className="mt-7">
                {reply && (
                  <p className="mb-4 flex items-start gap-2 text-base font-semibold text-brand">
                    <Tick className="mt-1 size-4 shrink-0" />
                    {reply}
                  </p>
                )}
                {step === 0 && (
                  <fieldset>
                    <legend className="font-cond text-3xl font-extrabold uppercase leading-none sm:text-4xl">{c.trade.title}</legend>
                    <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {c.trade.options.map((o, i) => (
                        <button
                          key={o}
                          type="button"
                          onClick={() => {
                            setTrade(i);
                            advance(1);
                          }}
                          aria-pressed={trade === i}
                          className={`${pick} font-cond text-lg font-bold uppercase ${trade === i ? on : off} ${i === c.trade.options.length - 1 ? "col-span-2 sm:col-span-1" : ""}`}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                )}

                {step === 1 && (
                  <fieldset>
                    <legend className="font-cond text-3xl font-extrabold uppercase leading-none sm:text-4xl">{c.size.title}</legend>
                    <div className="mt-6 grid gap-2 md:grid-cols-3">
                      {c.size.options.map((o, i) => (
                        <button
                          key={o.label}
                          type="button"
                          onClick={() => {
                            setSize(i);
                            advance(2);
                          }}
                          aria-pressed={size === i}
                          className={`${pick} ${size === i ? on : off}`}
                        >
                          <span className="block font-cond text-2xl font-bold uppercase">{o.label}</span>
                          <span className={`mt-1 block text-sm leading-snug ${size === i ? "text-ink/70" : "text-paper/60"}`}>{o.note}</span>
                        </button>
                      ))}
                    </div>
                  </fieldset>
                )}

                {step === 2 && (
                  <fieldset>
                    <legend className="font-cond text-3xl font-extrabold uppercase leading-none sm:text-4xl">{c.features.title}</legend>
                    <p className="mt-2 text-paper/60">{c.features.lead}</p>
                    <div className="mt-6 grid gap-2 sm:grid-cols-2">
                      {c.features.options.map((o, i) => {
                        const fixed = o.price === 0;
                        const active = fixed || extras.includes(i);
                        return (
                          <button
                            key={o.label}
                            type="button"
                            disabled={fixed}
                            onClick={() => setExtras((x) => (x.includes(i) ? x.filter((j) => j !== i) : [...x, i]))}
                            aria-pressed={active}
                            className={`${pick} flex items-center gap-3 ${fixed ? "cursor-default border-paper/10 bg-paper/5 text-paper/55" : active ? on : off}`}
                          >
                            <span className={`grid size-6 shrink-0 place-items-center border-2 ${active ? (fixed ? "border-paper/30" : "border-ink bg-ink text-brand") : "border-paper/30"}`}>
                              {active && <Tick />}
                            </span>
                            <span className="flex-1 font-semibold leading-snug">
                              {o.label}
                              {fixed && <span className="mt-0.5 block text-xs font-normal uppercase tracking-wide sm:hidden">{c.features.included}</span>}
                            </span>
                            {fixed && <span className="hidden shrink-0 text-xs uppercase tracking-wide sm:inline">{c.features.included}</span>}
                          </button>
                        );
                      })}
                    </div>
                    <button type="button" onClick={() => setStep(3)} className="mt-6 w-full bg-brand py-4 font-cond text-xl font-bold uppercase text-ink transition hover:bg-brand-dark sm:w-auto sm:px-10">
                      {c.next} →
                    </button>
                  </fieldset>
                )}

                {step === 3 && (
                  <fieldset>
                    <legend className="font-cond text-3xl font-extrabold uppercase leading-none sm:text-4xl">{c.care.title}</legend>
                    <div className="mt-6 grid gap-2 md:grid-cols-2">
                      {c.care.options.map((o, i) => (
                        <button
                          key={o.label}
                          type="button"
                          onClick={() => {
                            setCare(i);
                            advance(4);
                          }}
                          aria-pressed={care === i}
                          className={`${pick} ${care === i ? on : off}`}
                        >
                          <span className="block font-cond text-2xl font-bold uppercase">{o.label}</span>
                          <span className={`mt-1 block text-sm leading-snug ${care === i ? "text-ink/70" : "text-paper/60"}`}>{o.note}</span>
                        </button>
                      ))}
                    </div>
                  </fieldset>
                )}

                {step === 4 && (
                  <div>
                    <p className="font-cond text-lg font-bold uppercase tracking-wide text-brand">{c.ready}</p>
                    <div className="mt-3 grid grid-cols-1 gap-6">
                      <div>
                        <p className="text-paper/60">
                          {c.result} · {trade === null ? "" : c.trade.options[trade]} · {size === null ? "" : c.size.options[size].label}
                        </p>
                        <p className="mt-1 whitespace-nowrap font-cond text-5xl font-extrabold leading-none tabular-nums min-[360px]:text-6xl sm:text-8xl">
                          <CountUp to={sitePrice} format={kr} />
                        </p>
                        <p className="mt-2 text-lg">
                          {c.once} <span className="text-paper/45">+</span>{" "}
                          <span className="font-semibold text-brand">
                            {kr(monthly)} {c.monthly}
                          </span>
                        </p>
                      </div>
                      <a href={mailto()} className="inline-flex justify-center whitespace-nowrap bg-brand px-5 py-4 font-cond text-lg font-bold min-[360px]:px-8 min-[360px]:text-2xl uppercase text-ink transition hover:bg-brand-dark sm:justify-self-start sm:px-12">
                        {c.cta} →
                      </a>
                    </div>
                    <p className="mt-4 text-paper/70">{c.free}</p>

                    <details className="mt-6 border-t border-paper/15 pt-4 text-sm text-paper/70">
                      <summary className="cursor-pointer font-semibold text-paper">{c.breakdown}</summary>
                      <dl className="mt-3 max-w-md divide-y divide-paper/10">
                        <div className="flex justify-between gap-4 py-2">
                          <dt>
                            {c.sitePart}: {size === null ? "" : c.size.options[size].label}
                          </dt>
                          <dd className="tabular-nums">{size === null ? "" : kr(c.size.options[size].price)}</dd>
                        </div>
                        {chosen.map((i) => (
                          <div key={i} className="flex justify-between gap-4 py-2">
                            <dt>{c.features.options[i].label}</dt>
                            <dd className="tabular-nums">{c.features.options[i].price ? `+ ${kr(c.features.options[i].price)}` : c.features.included}</dd>
                          </div>
                        ))}
                        <div className="flex justify-between gap-4 py-2">
                          <dt>
                            {c.carePart}: {care === null ? "" : c.care.options[care].label}
                          </dt>
                          <dd className="tabular-nums">
                            {kr(monthly)} {c.monthly}
                          </dd>
                        </div>
                      </dl>
                    </details>
                    <p className="mt-3 text-xs text-paper/45">{c.vat}</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {step > 0 && (
              <button type="button" onClick={step === 4 ? restart : () => setStep(step - 1)} className="mt-6 text-sm text-paper/55 underline underline-offset-4 transition hover:text-paper">
                {step === 4 ? c.again : `← ${c.back}`}
              </button>
            )}
          </div>
          <div className="hidden lg:block">
            <Sketch c={c} accent={accent} light={slug === "el"} trade={trade} size={size} chosen={chosen} care={care} done={step === 4} />
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
