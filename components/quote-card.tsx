"use client";

import { useEffect, useRef, useState } from "react";
import { EMAIL } from "@/lib/content";
import { useLang } from "./lang";
import { setTrade as showExample } from "./trade-store";
import { reachStage } from "./progress-store";

// A whole choice is one button: big to hit, and it says it is picked.
const option =
  "flex w-full min-h-14 cursor-pointer items-center gap-3 rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 text-left transition-colors hover:border-ink aria-pressed:border-ink aria-pressed:shadow-[inset_0_0_0_1px_var(--color-ink)]";

/** One list of big choices, used by every single-answer step. */
function Choices({
  items,
  value,
  price,
  onPick,
}: {
  items: readonly { label: string; note: string; price?: number }[];
  value: number | null;
  price: (n: number) => string;
  onPick: (i: number) => void;
}) {
  return (
    <div className="mt-3.5 grid gap-2">
      {items.map((o, i) => (
        <button key={o.label} type="button" aria-pressed={value === i} onClick={() => onPick(i)} className={option}>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold leading-snug">{o.label}</span>
            <span className="block text-sm leading-snug text-ink/60">{o.note}</span>
          </span>
          {o.price !== undefined && <span className="whitespace-nowrap font-cond text-xl font-semibold tabular-nums">{price(o.price)}</span>}
        </button>
      ))}
    </div>
  );
}

// The guide's steps in order. Every answer but the features moves on by itself.
const TRADE = 0, KIND = 1, TYPE = 2, SIZE = 3, DESIGN = 4, FEATURES = 5, CARE = 6, SEND = 7;

/**
 * The free-draft guide: trade, business or private, kind of site, pages, design, features and care,
 * one question at a time. The last step shows the price and a short form; sending it opens a mail
 * with every choice and the contact details written in. Picking a trade also turns the phone next
 * to it to that trade's example.
 */
export function QuoteCard({ className = "" }: { className?: string }) {
  const { t, lang } = useLang();
  const c = t.calc;
  const f = c.features;
  const [step, setStep] = useState(TRADE);
  const [trade, setTrade] = useState<number | null>(null);
  const [kind, setKind] = useState<number | null>(null);
  const [type, setType] = useState<number | null>(null);
  const [size, setSize] = useState<number | null>(null);
  const [design, setDesign] = useState<number | null>(null);
  const [calc, setCalc] = useState(0);
  const [extras, setExtras] = useState<number[]>([]);
  const [care, setCare] = useState<number | null>(null);
  // "Andet fag" is the last option; picking it opens a field to write the trade in.
  const other = c.trade.options.length - 1;
  const [otherTrade, setOtherTrade] = useState("");
  const [hint, setHint] = useState(0);
  const [contact, setContact] = useState({ name: "", email: "", phone: "", company: "", message: "" });
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
  const plus = (n: number) => (n ? `+${kr(n)}` : "");
  const picked = [...extras].sort((a, b) => a - b);
  const sitePrice =
    (size === null ? 0 : c.size.options[size].price) +
    (type === null ? 0 : c.siteType.options[type].price) +
    (design === null ? 0 : c.design.options[design].price) +
    f.calc[calc].price +
    picked.reduce((sum, i) => sum + f.extras[i].price, 0);
  const plan = care === null ? null : c.care.options[care];
  const answered = [
    trade !== null && (trade !== other || otherTrade.trim() !== ""),
    kind !== null,
    type !== null,
    size !== null,
    design !== null,
    true,
    care !== null,
  ];
  const reachable = (i: number) => answered.slice(0, i).every(Boolean);

  const mailto = () => {
    const [lTrade, lKind, lType, lSize, lDesign, lCalc, lExtras, lCare, lPrice] = c.mailLines;
    const fm = c.form;
    const body = [
      `${lTrade}: ${tradeName ?? ""}`,
      `${lKind}: ${kind === null ? "" : c.kind.options[kind].label}`,
      `${lType}: ${type === null ? "" : c.siteType.options[type].label}`,
      `${lSize}: ${size === null ? "" : c.size.options[size].label}`,
      `${lDesign}: ${design === null ? "" : c.design.options[design].label}`,
      `${lCalc}: ${f.calc[calc].label}`,
      `${lExtras}: ${picked.length ? picked.map((i) => f.extras[i].label).join(", ") : f.none}`,
      `${lCare}: ${plan?.label ?? ""}`,
      `${lPrice}: ${kr(sitePrice)}${plan ? ` + ${kr(plan.monthly)} ${c.monthly}` : ""}`,
      "",
      `${fm.name}: ${contact.name}`,
      `${fm.email}: ${contact.email}`,
      `${fm.phone}: ${contact.phone}`,
      `${fm.company}: ${contact.company}`,
      "",
      contact.message,
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
      go(KIND);
    } else {
      requestAnimationFrame(() => otherRef.current?.focus());
    }
  };

  const questions = [c.trade.q, c.kind.q, c.siteType.q, c.size.q, c.design.q, f.q, c.care.q, c.form.title];

  const field = "mt-1 h-11 w-full rounded-xl border border-ink/20 bg-paper px-3.5 placeholder:text-ink/35 focus:border-ink focus:outline-none";

  return (
    <div id="beregner" className={`scroll-mt-24 overflow-hidden rounded-3xl border border-ink/15 bg-card ${className}`}>
      {/* Where you are: one bar per step, each answered one a way back to change it. */}
      <div className="px-4 pt-4 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-ink/60 tabular-nums">
            {c.stepWord} {step + 1} {c.of} {c.steps.length}
            <span className="hidden sm:inline">
              {" "}
              · <span className="text-ink">{c.steps[step]}</span>
            </span>
          </p>
          <p className="whitespace-nowrap rounded-full bg-brand px-3 py-1.5 text-sm font-semibold leading-none text-black">{c.free}</p>
        </div>
        <ol className="mt-3 grid gap-1" style={{ gridTemplateColumns: `repeat(${c.steps.length}, minmax(0, 1fr))` }}>
          {c.steps.map((s, i) => (
            <li key={s}>
              <button
                type="button"
                disabled={!reachable(i)}
                onClick={() => go(i)}
                aria-current={step === i ? "step" : undefined}
                aria-label={`${c.stepWord} ${i + 1}: ${s}`}
                className="block w-full py-2 enabled:cursor-pointer"
              >
                <span className={`block h-1.5 rounded-full ${step === i ? "bg-ink" : i < step || (reachable(i + 1) && i < SEND) ? "bg-brand" : "bg-ink/10"}`} aria-hidden />
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="px-4 pb-5 pt-2 sm:px-5">
        <p ref={headRef} tabIndex={-1} className="font-cond text-2xl font-semibold leading-tight tracking-tight outline-none sm:text-[1.6rem]">
          {questions[step]}
        </p>

        {step === TRADE && (
          <div className="mt-3.5 flex flex-wrap gap-2">
            {c.trade.options.slice(0, other).map((o, i) => (
              <button
                key={o}
                type="button"
                aria-pressed={trade === i}
                onClick={() => pickTrade(i)}
                className="h-10 cursor-pointer rounded-full border border-ink/15 bg-paper px-4 text-[15px] font-semibold leading-none transition-colors hover:border-ink hover:bg-brand hover:text-black aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper"
              >
                {o}
              </button>
            ))}
            <button
              type="button"
              aria-pressed={trade === other}
              onClick={() => pickTrade(other)}
              className="h-10 cursor-pointer rounded-full border border-dashed border-ink/30 bg-transparent px-4 text-[15px] font-semibold leading-none transition-colors hover:border-ink hover:bg-brand hover:text-black aria-pressed:border-solid aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper"
            >
              {c.trade.options[other]}
            </button>
            {/* "Andet fag" opens a field on its own line, so it is wide enough on any phone. */}
            {trade === other && (
              <form
                className="flex basis-full gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (otherTrade.trim()) go(KIND);
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

        {step === KIND && <Choices items={c.kind.options} value={kind} price={plus} onPick={(i) => (setKind(i), go(TYPE))} />}
        {step === TYPE && <Choices items={c.siteType.options} value={type} price={plus} onPick={(i) => (setType(i), go(SIZE))} />}
        {step === SIZE && <Choices items={c.size.options} value={size} price={kr} onPick={(i) => (setSize(i), go(DESIGN))} />}
        {step === DESIGN && <Choices items={c.design.options} value={design} price={plus} onPick={(i) => (setDesign(i), go(FEATURES))} />}

        {step === FEATURES && (
          <div className="mt-3.5">
            <fieldset>
              <legend className="text-sm font-semibold">{f.calcQ}</legend>
              <div className="mt-2 grid gap-2">
                {f.calc.map((o, i) => (
                  <button key={o.label} type="button" aria-pressed={calc === i} onClick={() => setCalc(i)} className="flex w-full cursor-pointer items-baseline justify-between gap-x-3 rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 text-left transition-colors hover:border-ink aria-pressed:border-ink aria-pressed:shadow-[inset_0_0_0_1px_var(--color-ink)]">
                    <span className="min-w-0">
                      <span className="block font-semibold leading-snug">{o.label}</span>
                      <span className="block text-sm leading-snug text-ink/60">{o.note}</span>
                    </span>
                    <span className="whitespace-nowrap text-sm font-semibold tabular-nums">{plus(o.price)}</span>
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="mt-4">
              <legend className="text-sm font-semibold">{f.extrasQ}</legend>
              <div className="mt-2 grid gap-x-3 sm:grid-cols-2">
                {f.extras.map((o, i) => (
                  <label key={o.label} className="flex min-h-11 cursor-pointer items-center gap-2.5 leading-tight">
                    <input
                      type="checkbox"
                      checked={extras.includes(i)}
                      onChange={() => setExtras((x) => (x.includes(i) ? x.filter((j) => j !== i) : [...x, i]))}
                      className="size-4 shrink-0 accent-[var(--color-brand)]"
                    />
                    <span className="min-w-0">
                      {o.label}
                      {o.popular && <span className="ml-2 rounded-full bg-brand px-2 py-0.5 text-xs font-semibold text-black">{f.popular}</span>}
                      <span className="block text-sm text-ink/55 tabular-nums">{o.price ? plus(o.price) : "note" in o && o.note ? o.note : f.free}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <button type="button" onClick={() => go(CARE)} className="mt-4 h-11 cursor-pointer rounded-full bg-ink px-6 font-semibold text-paper transition hover:bg-brand hover:text-black">
              {c.next} →
            </button>
          </div>
        )}

        {step === CARE && (
          <div className="mt-3.5 grid gap-2">
            {c.care.options.map((o, i) => (
              <button
                key={o.label}
                type="button"
                aria-pressed={care === i}
                onClick={() => {
                  setCare(i);
                  go(SEND);
                  reachStage(2);
                }}
                className={`${option} ${i === c.care.best ? "border-ink/40 bg-card" : ""}`}
              >
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1 font-semibold leading-snug">
                    {o.label}
                    {i === c.care.best && <span className="rounded-full bg-brand px-2 py-1 text-xs font-semibold leading-none text-black">{c.care.pick}</span>}
                  </span>
                  <span className="block text-sm leading-snug text-ink/60">{o.short}</span>
                </span>
                <span className="text-right">
                  <span className="block whitespace-nowrap font-cond text-xl font-semibold leading-none tabular-nums">{kr(o.monthly)}</span>
                  <span className="block whitespace-nowrap text-xs text-ink/55">{c.monthly}</span>
                </span>
              </button>
            ))}
          </div>
        )}

        {step === SEND && plan && (
          <div className="mt-1">
            <p className="text-ink/70">{c.form.lead}</p>
            <div className="mt-4 rounded-2xl border border-ink/15 bg-paper px-4 py-3">
              <p className="text-sm font-semibold text-ink/60">{c.estimate}</p>
              <p className="mt-1 flex flex-wrap items-baseline gap-x-3">
                <span className="font-cond text-4xl font-bold leading-none tracking-tight tabular-nums sm:text-5xl">{kr(sitePrice)}</span>
                <span className="text-ink/70">
                  + {kr(plan.monthly)} {c.monthly}
                </span>
              </p>
              <p className="mt-1 text-sm text-ink/55">
                {c.once} · {c.vat}
              </p>
            </div>

            <form
              className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                reachStage(3);
                window.location.href = mailto();
              }}
            >
              {(
                [
                  ["name", "text", "name", true],
                  ["email", "email", "email", true],
                  ["phone", "tel", "tel", false],
                  ["company", "text", "organization", false],
                ] as const
              ).map(([key, type, auto, required]) => (
                <label key={key} className="min-w-0 text-sm font-semibold">
                  {c.form[key]}
                  {required && <span aria-hidden> *</span>}
                  <input
                    type={type}
                    required={required}
                    autoComplete={auto}
                    value={contact[key]}
                    onChange={(e) => setContact((x) => ({ ...x, [key]: e.target.value }))}
                    placeholder={c.form[`${key}Ph`]}
                    className={`${field} font-normal`}
                  />
                </label>
              ))}
              <label className="text-sm font-semibold sm:col-span-2">
                {c.form.message}
                <textarea
                  rows={3}
                  value={contact.message}
                  onChange={(e) => setContact((x) => ({ ...x, message: e.target.value }))}
                  placeholder={c.form.messagePh}
                  className={`${field} h-auto py-2.5 font-normal`}
                />
              </label>
              <button type="submit" className="flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand px-4 py-4 font-cond text-base font-semibold text-black transition hover:bg-brand min-[360px]:text-lg sm:col-span-2 sm:gap-3 sm:px-6 sm:text-xl">
                {c.cta}{" "}
                <span aria-hidden className="hidden min-[360px]:inline">
                  →
                </span>
              </button>
              <p className="text-sm leading-snug text-ink/60 sm:col-span-2">{c.sendNote}</p>
            </form>
          </div>
        )}

        {step > TRADE && (
          <p className="mt-3 flex items-center justify-between gap-3 text-sm">
            <button type="button" onClick={() => go(step - 1)} className="cursor-pointer py-1 text-ink/60 underline underline-offset-4 hover:text-ink">
              ← {c.back}
            </button>
            {step > SIZE && step < SEND && (
              <span className="text-ink/60">
                {c.soFar}: <span className="font-semibold text-ink tabular-nums">{kr(sitePrice)}</span>
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
