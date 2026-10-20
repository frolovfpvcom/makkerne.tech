"use client";

import { useEffect, useRef, useState } from "react";
import { EMAIL } from "@/lib/content";
import { useLang } from "./lang";
import { setTrade as showExample } from "./trade-store";
import { reachStage } from "./progress-store";

/**
 * The price in three clicks: trade, size, care plan, one question at a time. Each answer moves on by
 * itself, and the last step shows the price, a few optional extras and the one button, which opens a
 * mail asking for a free draft with every choice written in. Picking a trade also turns the phone
 * next to it to that trade's example.
 */
export function QuoteCard({ className = "", big = false }: { className?: string; big?: boolean }) {
  // In the hero on a computer everything is drawn a size up, so the card stands level with the phone.
  const L = (cls: string) => (big ? ` ${cls}` : "");
  const { t, lang } = useLang();
  const c = t.calc;
  const [step, setStep] = useState(0);
  const [trade, setTrade] = useState<number | null>(null);
  const [size, setSize] = useState<number | null>(null);
  const [care, setCare] = useState<number | null>(null);
  const [extras, setExtras] = useState<number[]>([]);
  // "Andet fag" is the last option; picking it opens a field to write the trade in.
  const other = c.trade.options.length - 1;
  const [otherTrade, setOtherTrade] = useState("");
  const [hint, setHint] = useState(0);
  const otherRef = useRef<HTMLInputElement>(null);
  const headRef = useRef<HTMLParagraphElement>(null);
  const moved = useRef(false);

  const tradeName = trade === null ? null : trade === other ? otherTrade.trim() || c.trade.options[other] : c.trade.options[trade];

  // While the field is empty, its placeholder runs through a few trades that are not on the list.
  useEffect(() => {
    if (trade !== other || otherTrade) return;
    const id = setInterval(() => setHint((h) => (h + 1) % c.trade.hints.length), 1800);
    return () => clearInterval(id);
  }, [trade, other, otherTrade, c.trade.hints.length]);

  // After a step changes, the new question gets focus, so keyboard and screen reader users follow along.
  useEffect(() => {
    if (moved.current) headRef.current?.focus({ preventScroll: true });
  }, [step]);

  const go = (s: number) => {
    moved.current = true;
    setStep(s);
  };

  const num = (n: number) => n.toLocaleString(lang === "da" ? "da-DK" : "en-GB");
  const kr = (n: number) => (lang === "da" ? `${num(n)} kr.` : `DKK ${num(n)}`);
  const picked = [...extras].sort((a, b) => a - b);
  const sitePrice = (size === null ? 0 : c.size.options[size].price) + picked.reduce((sum, i) => sum + c.features.options[i].price, 0);
  const plan = care === null ? null : c.care.options[care];
  const done = [trade !== null && (trade !== other || otherTrade.trim() !== ""), size !== null, care !== null];

  const mailto = () => {
    const [lTrade, lSize, lExtras, lCare, lPrice] = c.mailLines;
    const body = [
      `${lTrade}: ${tradeName ?? ""}`,
      `${lSize}: ${size === null ? "" : c.size.options[size].label}`,
      `${lExtras}: ${picked.length ? picked.map((i) => c.features.options[i].label).join(", ") : c.none}`,
      `${lCare}: ${plan?.label ?? ""}`,
      `${lPrice}: ${kr(sitePrice)}${plan ? ` + ${kr(plan.monthly)} ${c.monthly}` : ""}`,
      "",
      c.mailEnd,
    ].join("\n");
    return `mailto:${EMAIL}?subject=${encodeURIComponent(c.mailSubject)}&body=${encodeURIComponent(body)}`;
  };

  const pickTrade = (i: number) => {
    setTrade(i);
    reachStage(1);
    if (i < other) {
      showExample(i);
      go(1);
    } else {
      requestAnimationFrame(() => otherRef.current?.focus());
    }
  };

  // A whole choice is one button: big to hit, and it says it is picked.
  const option = "flex w-full cursor-pointer items-center gap-3 rounded-xl border border-ink/15 bg-paper px-3.5 text-left transition-colors hover:border-ink aria-pressed:border-ink aria-pressed:shadow-[inset_0_0_0_1px_var(--color-ink)]";
  const questions = [c.trade.q, c.size.q, c.care.q, c.estimate];

  return (
    <div
      id="beregner"
      className={`scroll-mt-24 overflow-hidden rounded-3xl border bg-card ${big ? "border-ink/10 shadow-[0_24px_60px_-32px_rgba(29,28,25,0.35)]" : "border-ink/15"} ${className}`}
    >
      {/* The card's name, and the yellow tag saying the draft costs nothing. */}
      <div className={`flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 sm:px-5 ${big ? "pb-3 pt-5 lg:px-7 lg:pt-6" : "pb-2 pt-4"}`}>
        <p className={`font-cond font-bold leading-none tracking-tight ${big ? "text-[1.6rem] sm:text-[1.75rem] lg:text-[2rem]" : "text-xl"}`}>{c.head}</p>
        <p className="whitespace-nowrap rounded-full bg-brand px-3 py-1.5 text-sm font-semibold leading-none text-black">{c.free}</p>
      </div>

      {/* Where you are: the three answers so far, each a way back to change it. */}
      <ol className="grid grid-cols-3 gap-2 px-2 text-left sm:px-3">
        {c.steps.map((s, i) => {
          const value = i === 0 ? tradeName : i === 1 ? (size === null ? null : c.size.options[size].label) : plan?.label;
          const reachable = i === 0 || done.slice(0, i).every(Boolean);
          return (
            <li key={s} className="min-w-0">
              <button
                type="button"
                disabled={!reachable}
                onClick={() => go(i)}
                aria-current={step === i ? "step" : undefined}
                className={`block w-full min-w-0 rounded-xl px-2 py-2 text-left enabled:cursor-pointer enabled:hover:bg-paper sm:px-2${L("lg:px-4 lg:py-2.5")}`}
              >
                <span className={`block h-1 rounded-full ${step === i ? "bg-ink" : done[i] ? "bg-brand" : "bg-ink/10"}`} aria-hidden />
                <span className="mt-2 block text-xs font-semibold leading-tight text-ink/50">
                  {i + 1} {s}
                </span>
                <span className="block truncate text-sm font-semibold leading-tight">{value ?? "\u00a0"}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className={`px-4 pb-5 pt-4 sm:px-5${L("lg:px-7 lg:pb-7 lg:pt-6")}`}>
        <p ref={headRef} tabIndex={-1} className={`font-cond text-2xl font-semibold leading-tight tracking-tight outline-none sm:text-[1.6rem]${L("lg:text-3xl")}`}>
          {questions[step]}
        </p>

        {step === 0 && (
          <div className={`mt-3.5 flex flex-wrap gap-2${L("lg:mt-5 lg:gap-2.5")}`}>
            {c.trade.options.slice(0, other).map((o, i) => (
              <button
                key={o}
                type="button"
                aria-pressed={trade === i}
                onClick={() => pickTrade(i)}
                className={`h-10 cursor-pointer rounded-full border px-4 text-[15px] ${big ? "border-ink/15 bg-paper hover:bg-brand hover:text-black lg:h-11 lg:px-5 lg:text-base" : "border-ink/15 bg-paper"} font-semibold leading-none transition-colors hover:border-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper`}
              >
                {o}
              </button>
            ))}
            <button
              type="button"
              aria-pressed={trade === other}
              onClick={() => pickTrade(other)}
              className={`h-10 cursor-pointer rounded-full border border-dashed border-ink/30 px-4 text-[15px] ${big ? "bg-transparent hover:bg-brand hover:text-black lg:h-11 lg:px-5 lg:text-base" : "bg-transparent"} font-semibold leading-none transition-colors hover:border-ink aria-pressed:border-solid aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper`}
            >
              {c.trade.options[other]}
            </button>
            {/* "Andet fag" opens a field on its own line, so it is wide enough on any phone. */}
            {trade === other && (
              <form
                className="flex basis-full gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (otherTrade.trim()) go(1);
                }}
              >
                <input
                  ref={otherRef}
                  type="text"
                  value={otherTrade}
                  onChange={(e) => setOtherTrade(e.target.value)}
                  maxLength={40}
                  aria-label={c.trade.write}
                  placeholder={c.trade.hints[hint]}
                  autoComplete="off"
                  enterKeyHint="next"
                  data-field
                  className="h-10 min-w-0 flex-1 rounded-full border border-ink bg-paper px-4 font-semibold placeholder:font-normal placeholder:text-ink/40 focus:shadow-[inset_0_0_0_1px_var(--color-ink)] sm:max-w-64"
                />
                <button type="submit" disabled={!otherTrade.trim()} className="h-10 shrink-0 rounded-full bg-ink px-4 font-semibold leading-none text-paper enabled:cursor-pointer disabled:opacity-40">
                  {c.next} →
                </button>
              </form>
            )}
          </div>
        )}

        {step === 1 && (
          <div className={`mt-3.5 grid gap-2${L("lg:mt-5 lg:gap-2.5")}`}>
            {c.size.options.map((o, i) => (
              <button
                key={o.label}
                type="button"
                aria-pressed={size === i}
                onClick={() => {
                  setSize(i);
                  go(2);
                }}
                className={`${option} min-h-14 py-2.5${L("lg:min-h-[4.5rem] lg:px-5 lg:text-lg")}`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold leading-snug">{o.label}</span>
                  <span className="block text-sm leading-snug text-ink/60">{o.note}</span>
                </span>
                <span className={`whitespace-nowrap font-cond text-xl font-semibold tabular-nums${L("lg:text-2xl")}`}>{kr(o.price)}</span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className={`mt-3.5 grid gap-2${L("lg:mt-5 lg:gap-2.5")}`}>
            {c.care.options.map((o, i) => (
              <button
                key={o.label}
                type="button"
                aria-pressed={care === i}
                onClick={() => {
                  setCare(i);
                  go(3);
                  reachStage(2);
                }}
                className={`${option} min-h-14 py-2.5${L("lg:min-h-[4.5rem] lg:px-5 lg:text-lg")} ${i === c.care.best ? "border-ink/40 bg-card" : ""}`}
              >
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1 font-semibold leading-snug">
                    {o.label}
                    {i === c.care.best && <span className="rounded-full bg-brand px-2 py-1 text-xs font-semibold leading-none">{c.care.pick}</span>}
                  </span>
                  <span className="block text-sm leading-snug text-ink/60">{o.short}</span>
                </span>
                <span className="text-right">
                  <span className={`block whitespace-nowrap font-cond text-xl font-semibold leading-none tabular-nums${L("lg:text-2xl")}`}>{kr(o.monthly)}</span>
                  <span className="block whitespace-nowrap text-xs text-ink/55">{c.monthly}</span>
                </span>
              </button>
            ))}
          </div>
        )}

        {step === 3 && plan && size !== null && (
          <div className="mt-2">
            <p className="flex flex-wrap items-baseline gap-x-3">
              <span className="font-cond text-5xl font-bold leading-none tracking-tight tabular-nums sm:text-6xl">{kr(sitePrice)}</span>
              <span className="text-ink/70">
                + {kr(plan.monthly)} {c.monthly}
              </span>
            </p>
            <p className="mt-1 text-sm text-ink/55">
              {c.once} · {c.vat}
            </p>

            <fieldset className="mt-4 border-t border-ink/15 pt-3">
              <legend className="sr-only">{c.features.q}</legend>
              <p aria-hidden className="text-sm font-semibold">{c.features.q}</p>
              <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
                {c.features.options.map((o, i) => (
                  <label key={o.label} title={o.note} className="flex min-h-9 cursor-pointer items-center gap-2 text-sm leading-tight">
                    <input
                      type="checkbox"
                      checked={extras.includes(i)}
                      onChange={() => setExtras((x) => (x.includes(i) ? x.filter((j) => j !== i) : [...x, i]))}
                      className="size-4 shrink-0 accent-ink"
                    />
                    <span className="min-w-0">
                      {o.short}{" "}
                      <span className="whitespace-nowrap text-ink/55 tabular-nums">{o.price ? `+${kr(o.price)}` : c.features.freeLabel}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <a href={mailto()} onClick={() => reachStage(3)} className="mt-4 flex w-full items-center justify-center gap-3 rounded-full bg-brand px-6 py-4 font-cond text-xl font-semibold text-black transition hover:bg-brand hover:text-black-dark">
              {c.cta} <span aria-hidden>→</span>
            </a>
            <p className="mt-2.5 text-sm leading-snug text-ink/60">{c.sendNote}</p>
          </div>
        )}

        {step > 0 && step < 3 && (
          <p className="mt-3 flex items-center justify-between gap-3 text-sm">
            <button type="button" onClick={() => go(step - 1)} className="cursor-pointer py-1 text-ink/60 underline underline-offset-4 hover:text-ink">
              ← {c.back}
            </button>
            {step === 2 && size !== null && (
              <span className="text-ink/60">
                {c.size.options[size].label}: <span className="font-semibold text-ink tabular-nums">{kr(c.size.options[size].price)}</span>
              </span>
            )}
          </p>
        )}
        {step === 0 && (
          <p className={`mt-3.5 text-sm text-ink/60${L("lg:mt-5 lg:text-base")}`}>
            {c.fromSite} <span className="font-semibold text-ink tabular-nums">{kr(c.size.options[0].price)}</span> · {c.fromCare}{" "}
            <span className="font-semibold text-ink tabular-nums">
              {kr(c.care.options[0].monthly)} {c.monthly}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
