"use client";

import { useEffect, useRef, useState } from "react";
import { EMAIL } from "@/lib/content";
import { useLang } from "./lang";
import { setTrade as showExample } from "./trade-store";
import { reachStage } from "./progress-store";
import { setDraft, useDraft } from "./draft-store";

/*
 * The draft guide as a spec sheet: one wide frame, the questions on the left and on the right a quote
 * that fills in line by line as you pick. Square corners and hairlines throughout, figures in mono.
 */

const TRADE = 0, SIZE = 1, PRICES = 2, EXTRAS = 3, TEXTS = 4, CARE = 5, SEND = 6;

const line = "border-[#262626]";
const mono = "font-mono uppercase tracking-[0.04em]";
// The hairline grid: the 1px gap shows the grid's own background as knife-sharp lines between cells.
const hairGrid = "grid gap-px border border-[#262626] bg-[#262626]";
const cellBase =
  "flex w-full cursor-pointer items-start gap-3 bg-[#0B0D12] text-left transition-colors hover:bg-[#141720] aria-pressed:bg-[#161922] aria-pressed:shadow-[inset_3px_0_0_#FACC15]";
const cell = `${cellBase} px-5 py-[18px]`;
// In the front-page hero the sheet sits beside the phone, so its answers are a little tighter.
const cellTight = `${cellBase} px-5 py-[18px] lg:px-4 lg:py-3`;

// The trades sit two by two. On a narrow phone the mark goes above the name, so long names like
// "Anlægsgartner" keep to their cell; below 360 px they go one to a row. "Andet fag" takes the
// whole last row, so no empty cell is left over.
const tradeGrid = `grid-cols-1 min-[360px]:grid-cols-2 ${hairGrid}`;
const tradeCell =
  "items-center !px-3.5 !py-3 text-sm max-[399px]:flex-col max-[399px]:items-start max-[399px]:!gap-1 sm:!px-4 sm:text-[15px] last:min-[360px]:col-span-2";

function useKr() {
  const { lang } = useLang();
  const num = (n: number) => n.toLocaleString(lang === "da" ? "da-DK" : "en-GB");
  return (n: number) => (lang === "da" ? `${num(n)} kr.` : `DKK ${num(n)}`);
}

/** "[×]" when picked, "[ ]" when not: a square mark in mono, never a round tick. */
function Mark({ on }: { on: boolean }) {
  return (
    <span aria-hidden className={`mt-0.5 shrink-0 font-mono text-sm ${on ? "text-[#FACC15]" : "text-white/30"}`}>
      {on ? "[×]" : "[ ]"}
    </span>
  );
}

/** The bar over the questions: which step, and that the draft is free. */
function TopBar({ step }: { step: number }) {
  const { t } = useLang();
  const c = t.calc;
  return (
    <div className={`flex items-center justify-between gap-3 border-b ${line} px-4 py-3 sm:px-5`}>
      <p className={`${mono} text-[11px] text-white/70 sm:text-xs`}>
        {c.stepWord} {String(step + 1).padStart(2, "0")} / {String(c.steps.length).padStart(2, "0")} — {c.steps[step]}
      </p>
      <p className={`${mono} flex items-center gap-2 whitespace-nowrap text-[11px] text-white sm:text-xs`}>
        <span aria-hidden className="size-1.5 bg-[#FACC15]" />
        <span>[ {c.free} ]</span>
      </p>
    </div>
  );
}

/** Seven sharp segments from edge to edge: done in yellow, this one white, the rest dark. */
function Progress({ step, reachable, onGo }: { step: number; reachable: (i: number) => boolean; onGo?: (i: number) => void }) {
  const { t } = useLang();
  const c = t.calc;
  return (
    <ol className="flex gap-[2px]">
      {c.steps.map((s, i) => (
        <li key={s} className="flex-1">
          <button
            type="button"
            disabled={!onGo || !reachable(i)}
            onClick={() => onGo?.(i)}
            aria-current={step === i ? "step" : undefined}
            aria-label={`${c.stepWord} ${i + 1}: ${s}`}
            className="block h-[3px] w-full enabled:cursor-pointer"
          >
            <span className={`block h-full ${i < step ? "bg-[#FACC15]" : i === step ? "bg-white" : "bg-[#262626]"}`} aria-hidden />
          </button>
        </li>
      ))}
    </ol>
  );
}

/** One list of single answers in the hairline grid, each with its price in mono. */
function Options({
  items,
  value,
  onPick,
  price,
  cls = cell,
  top = "mt-5",
}: {
  items: readonly { label: string; note: string; price: number; tag?: string }[];
  value: number | null;
  onPick: (i: number) => void;
  price: (n: number) => string;
  cls?: string;
  top?: string;
}) {
  return (
    <div className={`${top} ${hairGrid}`}>
      {items.map((o, i) => (
        <button key={o.label} type="button" aria-pressed={value === i} onClick={() => onPick(i)} className={cls}>
          <Mark on={value === i} />
          <span className="min-w-0 flex-1">
            <span className="block font-semibold leading-snug">
              {o.label}
              {o.tag && <span className={`${mono} ml-2 whitespace-nowrap text-[10px] text-[#FACC15]`}>[ {o.tag} ]</span>}
            </span>
            <span className="mt-0.5 block text-sm leading-snug text-white/55">{o.note}</span>
          </span>
          <span className="shrink-0 font-mono text-sm tabular-nums text-white/85">{price(o.price)}</span>
        </button>
      ))}
    </div>
  );
}

/** The full guide with the live quote beside it, as its own section. */
export function DraftSection({ head = true }: { head?: boolean }) {
  const { t } = useLang();
  const c = t.calc;
  return (
    <section id="beregner" className="scroll-mt-18 bg-[#07090E] text-white">
      <div className="mx-auto max-w-[1120px] px-4 py-10 sm:px-8 sm:py-20 lg:px-0">
        {head && (
          <div className="mb-8 max-w-2xl">
            <h2 className="font-sheet text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">{c.head}</h2>
            <p className="mt-3 leading-relaxed text-white/65 sm:text-lg">{c.lead}</p>
          </div>
        )}
        <DraftSheet />
      </div>
    </section>
  );
}

/**
 * The questions on the left and the quote that fills in on the right, in one frame. `tight` is the
 * front-page hero's version: the same sheet, a little smaller, so it fits beside the phone.
 */
export function DraftSheet({ tight = false }: { tight?: boolean }) {
  const { t } = useLang();
  const c = t.calc;
  const kr = useKr();
  const plus = (n: number) => (n ? `+${kr(n)}` : kr(0));
  const { step, trade } = useDraft();
  const other = c.trade.options.length - 1;
  const [otherTrade, setOtherTrade] = useState("");
  const [hint, setHint] = useState(0);
  const [size, setSize] = useState<number | null>(null);
  const [prices, setPrices] = useState<number | null>(null);
  const [extras, setExtras] = useState<number[]>([]);
  const [extrasDone, setExtrasDone] = useState(false);
  const [texts, setTexts] = useState<number | null>(null);
  const [care, setCare] = useState<number | null>(null);
  const [form, setForm] = useState({ first: "", last: "", company: "", contact: "", comment: "" });
  const headRef = useRef<HTMLParagraphElement>(null);
  const otherRef = useRef<HTMLInputElement>(null);
  const moved = useRef(false);

  const tradeName = trade === null ? null : trade === other ? otherTrade.trim() || null : c.trade.options[trade];

  // While the field is empty, its placeholder runs through a few trades that are not on the list.
  useEffect(() => {
    if (trade !== other || otherTrade) return;
    const id = setInterval(() => setHint((h) => (h + 1) % c.trade.hints.length), 1800);
    return () => clearInterval(id);
  }, [trade, other, otherTrade, c.trade.hints.length]);

  // After a step changes, the new question gets focus, so keyboard and screen reader users follow along.
  useEffect(() => {
    if (moved.current) headRef.current?.focus({ preventScroll: true });
    moved.current = true;
  }, [step]);

  const go = (s: number) => setDraft({ step: s });
  const answered = [tradeName !== null, size !== null, prices !== null, extrasDone, texts !== null, care !== null];
  const reachable = (i: number) => answered.slice(0, i).every(Boolean);

  const picked = [...extras].sort((a, b) => a - b);
  const total =
    (size === null ? 0 : c.size.options[size].price) +
    (prices === null ? 0 : c.prices.options[prices].price) +
    picked.reduce((sum, i) => sum + c.extras.options[i].price, 0);
  const plan = c.care.options[care ?? 0];

  const pickTrade = (i: number) => {
    setDraft({ trade: i });
    reachStage(1);
    if (i < other) {
      showExample(i);
      go(SIZE);
    } else {
      requestAnimationFrame(() => otherRef.current?.focus());
    }
  };

  const rows: { label: string; value: string | null; lines?: [string, string][] }[] = [
    { label: c.sheet.rows[0], value: tradeName },
    { label: c.sheet.rows[1], value: size === null ? null : `${c.size.options[size].label} · ${kr(c.size.options[size].price)}` },
    { label: c.sheet.rows[2], value: prices === null ? null : `${c.prices.options[prices].label} · ${plus(c.prices.options[prices].price)}` },
    {
      label: c.sheet.rows[3],
      value: !extrasDone && !picked.length ? null : picked.length ? "" : c.extras.none,
      lines: picked.map((i) => [c.extras.options[i].label, plus(c.extras.options[i].price)]),
    },
    { label: c.sheet.rows[4], value: texts === null ? null : `${c.texts.options[texts].label} · ${c.texts.included}` },
    { label: c.sheet.rows[5], value: care === null ? null : `${plan.label} · ${kr(plan.monthly)} ${c.perMonth}` },
  ];

  const mailto = () => {
    const f = c.form;
    const body = [
      ...rows.map((r) => `${r.label}: ${r.value ?? ""}${r.lines?.length ? r.lines.map(([l, p]) => `${l} (${p})`).join(", ") : ""}`),
      `${c.sheet.total}: ${kr(total)}`,
      `${c.sheet.care}: ${kr(plan.monthly)} ${c.perMonth}`,
      "",
      `${f.first}: ${form.first}`,
      `${f.last}: ${form.last}`,
      `${f.company}: ${form.company}`,
      `${f.contact}: ${form.contact}`,
      "",
      form.comment,
      "",
      c.mailEnd,
    ].join("\n");
    return `mailto:${EMAIL}?subject=${encodeURIComponent(c.mailSubject)}&body=${encodeURIComponent(body)}`;
  };

  const questions = [c.trade.q, c.size.q, c.prices.q, c.extras.q, c.texts.q, c.care.q, c.form.q];
  const input =
    "mt-1 w-full rounded-none border-0 border-b border-[#333] bg-transparent px-0 py-3 text-white placeholder:text-white/30 focus:border-[#FACC15] focus:outline-none";
  const label = `${mono} block text-[11px] text-[#888]`;
  const next = `${mono} mt-5 inline-flex h-12 cursor-pointer items-center gap-2 border border-white/80 px-5 text-sm text-white transition hover:border-[#FACC15] hover:text-[#FACC15]`;

  const opt = tight ? cellTight : cell;
  // Tight: smaller padding and type on a computer; on a phone it is the same as the full sheet.
  const pad = tight ? "p-4 sm:p-8 lg:p-5" : "p-4 sm:p-8";
  const gap = tight ? "mt-5 lg:mt-3.5" : "mt-5";
  // On a low laptop screen the hero has no height to spare, so the step's note and the line at the
  // bottom step aside there.
  const low = tight ? "[@media(min-width:1024px)_and_(max-height:820px)]:hidden" : "";

  return (
        <div className={`grid border ${line} bg-[#07090E] text-white ${tight ? "lg:grid-cols-[60fr_40fr] xl:grid-cols-[57fr_43fr]" : "lg:grid-cols-[58fr_42fr]"}`}>
          {/* The questions. */}
          <div className="min-w-0">
            <TopBar step={step} />
            <Progress step={step} reachable={reachable} onGo={go} />
            <p className={`border-b ${line} border-l-[3px] border-l-[#FACC15] bg-[#111318] px-4 py-3 text-sm leading-snug text-white/75 sm:px-5 ${tight ? "lg:py-2.5 lg:text-[13px]" : ""} ${low}`}>{c.notes[step]}</p>

            <div className={pad}>
              <p ref={headRef} tabIndex={-1} className={`font-sheet text-2xl font-semibold leading-tight tracking-[-0.03em] outline-none sm:text-[1.75rem] ${tight ? "lg:text-[1.375rem]" : ""}`}>
                {questions[step]}
              </p>

              {step === TRADE && (
                <>
                  <div className={`${gap} ${tradeGrid}`}>
                    {c.trade.options.map((o, i) => (
                      <button key={o} type="button" aria-pressed={trade === i} onClick={() => pickTrade(i)} className={`${cell} ${tradeCell} ${tight ? "lg:max-xl:!gap-2 lg:max-xl:!px-3 lg:max-xl:text-sm" : ""}`}>
                        <Mark on={trade === i} />
                        <span className="min-w-0 font-semibold leading-tight">{o}</span>
                      </button>
                    ))}
                  </div>
                  {trade === other && (
                    <form
                      className="mt-5 flex flex-wrap items-end gap-x-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (otherTrade.trim()) go(SIZE);
                      }}
                    >
                      <label className="min-w-0 flex-1 basis-56">
                        <span className={label}>{c.trade.write}</span>
                        <input
                          ref={otherRef}
                          type="text"
                          value={otherTrade}
                          onChange={(e) => setOtherTrade(e.target.value)}
                          maxLength={40}
                          placeholder={c.trade.hints[hint]}
                          autoComplete="off"
                          enterKeyHint="next"
                          className={input}
                        />
                      </label>
                      <button type="submit" disabled={!otherTrade.trim()} className={`${next} disabled:cursor-default disabled:opacity-40`}>
                        {c.next} →
                      </button>
                    </form>
                  )}
                </>
              )}

              {step === SIZE && <Options cls={opt} top={gap} items={c.size.options} value={size} price={kr} onPick={(i) => (setSize(i), go(PRICES))} />}
              {step === PRICES && <Options cls={opt} top={gap} items={c.prices.options} value={prices} price={plus} onPick={(i) => (setPrices(i), go(EXTRAS))} />}

              {step === EXTRAS && (
                <>
                  <div className={`${gap} ${hairGrid}`}>
                    {c.extras.options.map((o, i) => {
                      const on = extras.includes(i);
                      return (
                        <button
                          key={o.label}
                          type="button"
                          aria-pressed={on}
                          onClick={() => setExtras((x) => (on ? x.filter((j) => j !== i) : [...x, i]))}
                          className={opt}
                        >
                          <Mark on={on} />
                          <span className="min-w-0 flex-1">
                            <span className="block font-semibold leading-snug">
                              {o.label}
                              {o.tag && <span className={`${mono} ml-2 whitespace-nowrap text-[10px] text-[#FACC15]`}>[ {o.tag} ]</span>}
                            </span>
                            <span className="mt-0.5 block text-sm leading-snug text-white/55">{o.note}</span>
                          </span>
                          <span className="shrink-0 font-mono text-sm tabular-nums text-white/85">{plus(o.price)}</span>
                        </button>
                      );
                    })}
                  </div>
                  <button type="button" onClick={() => (setExtrasDone(true), go(TEXTS))} className={next}>
                    {extras.length ? c.next : c.skip} →
                  </button>
                </>
              )}

              {step === TEXTS && <Options cls={opt} top={gap} items={c.texts.options} value={texts} price={() => c.texts.included} onPick={(i) => (setTexts(i), go(CARE))} />}

              {step === CARE && (
                <div className={`${gap} ${hairGrid}`}>
                  {c.care.options.map((o, i) => (
                    <button
                      key={o.label}
                      type="button"
                      aria-pressed={care === i}
                      onClick={() => {
                        setCare(i);
                        reachStage(2);
                        go(SEND);
                      }}
                      className={opt}
                    >
                      <Mark on={care === i} />
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold leading-snug">
                          {o.label}
                          {i === c.care.best && <span className={`${mono} ml-2 whitespace-nowrap text-[10px] text-[#FACC15]`}>[ {c.care.pick} ]</span>}
                        </span>
                        <span className="mt-0.5 block text-sm leading-snug text-white/55">{o.short}</span>
                      </span>
                      <span className="shrink-0 text-right font-mono text-sm tabular-nums text-white/85">
                        {kr(o.monthly)}
                        <span className="block text-[11px] text-white/45">{c.perMonth}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {step === SEND && (
                <form
                  className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    reachStage(3);
                    window.location.href = mailto();
                  }}
                >
                  {(
                    [
                      ["first", "given-name", true, false],
                      ["last", "family-name", false, false],
                      ["company", "organization", false, true],
                      ["contact", "email", true, true],
                    ] as const
                  ).map(([key, auto, required, wide]) => (
                    <label key={key} className={`min-w-0 ${wide ? "sm:col-span-2" : ""}`}>
                      <span className={label}>
                        {c.form[key]}
                        {required && <span aria-hidden> *</span>}
                      </span>
                      <input
                        type="text"
                        required={required}
                        autoComplete={auto}
                        value={form[key]}
                        onChange={(e) => setForm((x) => ({ ...x, [key]: e.target.value }))}
                        placeholder={key === "company" ? c.form.companyPh : key === "contact" ? c.form.contactPh : undefined}
                        className={input}
                      />
                    </label>
                  ))}
                  <label className="min-w-0 sm:col-span-2">
                    <span className={label}>{c.form.comment}</span>
                    <textarea rows={2} value={form.comment} onChange={(e) => setForm((x) => ({ ...x, comment: e.target.value }))} placeholder={c.form.commentPh} className={`${input} resize-y`} />
                  </label>
                  <button
                    type="submit"
                    className={`${mono} flex h-14 w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap bg-[#FACC15] px-4 text-[15px] font-bold text-black transition hover:bg-white sm:col-span-2 sm:text-base`}
                  >
                    {c.form.cta} <span aria-hidden>→</span>
                  </button>
                  <p className="text-sm leading-snug text-white/55 sm:col-span-2">{c.form.sendNote}</p>
                </form>
              )}

              {step > TRADE && (
                <button type="button" onClick={() => go(step - 1)} className={`${mono} mt-6 block cursor-pointer py-1 text-xs text-white/55 hover:text-white`}>
                  ← {c.back}
                </button>
              )}
            </div>
          </div>

          {/* The quote that fills in as you go. */}
          <aside aria-live="polite" className={`flex min-w-0 flex-col border-t ${line} lg:border-l lg:border-t-0`}>
            <p className={`${mono} border-b ${line} px-4 py-3 text-[11px] text-white sm:px-5 sm:text-xs`}>{c.sheet.title}</p>
            <ol className="flex-1">
              {rows.map((r, i) => (
                <li key={r.label} className={`grid grid-cols-[2rem_1fr] border-b ${line} px-4 py-3.5 sm:px-5 ${tight ? "lg:py-2 [@media(min-width:1024px)_and_(max-height:820px)]:py-1.5" : ""}`}>
                  <span className="font-mono text-xs text-white/35 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0">
                    <span className={`${mono} block text-[11px] text-[#888]`}>{r.label}</span>
                    {r.value === null ? (
                      <span className="mt-0.5 block text-sm text-white/30">{c.sheet.empty}</span>
                    ) : (
                      r.value && <span className="mt-0.5 block text-sm font-medium leading-snug text-white">{r.value}</span>
                    )}
                    {r.lines?.map(([l, p]) => (
                      <span key={l} className="mt-1 flex justify-between gap-3 text-sm leading-snug text-white">
                        <span className="min-w-0">{l}</span>
                        <span className="shrink-0 font-mono tabular-nums text-white/85">{p}</span>
                      </span>
                    ))}
                  </span>
                </li>
              ))}
            </ol>
            <div className={`border-t ${line} px-4 py-5 sm:px-5 ${tight ? "lg:py-3.5 [@media(min-width:1024px)_and_(max-height:820px)]:py-2.5" : ""}`}>
              <p className={`${mono} text-[11px] text-[#888]`}>{c.sheet.total}</p>
              <p className={`mt-1 font-mono text-4xl font-bold leading-none tracking-tight tabular-nums sm:text-[2.75rem] ${tight ? "lg:text-[2rem]" : ""}`}>{kr(total)}</p>
              <p className={`mt-4 flex flex-wrap items-baseline justify-between gap-x-3 border-t ${line} pt-3`}>
                <span className={`${mono} text-[11px] text-[#888]`}>{c.sheet.care}</span>
                <span className="font-mono text-lg tabular-nums">
                  {kr(plan.monthly)} {c.perMonth}
                </span>
              </p>
              <p className="mt-1 text-xs text-white/45">{c.sheet.careNote}</p>
              <p className="mt-3 text-xs leading-snug text-white/55">{c.sheet.note}</p>
            </div>
          </aside>

          <p className={`border-t ${line} px-4 py-3 font-mono text-xs leading-relaxed text-white/60 sm:px-5 lg:col-span-2 ${tight ? "lg:py-2.5 lg:text-[11px]" : ""} ${low}`}>{c.status}</p>
        </div>
  );
}
