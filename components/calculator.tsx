"use client";

import { useEffect, useId, useRef, useState } from "react";
import { EMAIL } from "@/lib/content";
import { useLang } from "./lang";

/** One numbered line of the form: its name on the left on wider screens, the choices on the right. */
function Row({ n, title, wide = false, children }: { n: number; title: string; wide?: boolean; children: React.ReactNode }) {
  const id = useId();
  return (
    <div role="group" aria-labelledby={id} className={`grid gap-x-8 gap-y-4 border-b border-ink/15 py-7 last:border-b-0 ${wide ? "" : "sm:grid-cols-[10rem_minmax(0,1fr)]"}`}>
      <p id={id} className={`font-cond text-xl font-bold uppercase leading-tight ${wide ? "" : "sm:pt-2"}`}>
        <span className="mr-2 text-ink/35 tabular-nums">{n}</span>
        {title}
      </p>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/** A radio or checkbox as a full-width line, with the price at the end. */
function Choice({ type, name, checked, onChange, label, note, price }: {
  type: "radio" | "checkbox";
  name: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  note?: string;
  price: string;
}) {
  return (
    <label className="grid cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-3 py-2.5">
      <input type={type} name={name} checked={checked} onChange={onChange} className="mt-1 size-4 accent-ink" />
      <span>
        <span className="block font-semibold leading-snug">{label}</span>
        {note && <span className="mt-0.5 block text-sm leading-snug text-ink/60">{note}</span>}
      </span>
      <span className="whitespace-nowrap pt-0.5 text-sm tabular-nums text-ink/70">{price}</span>
    </label>
  );
}

function Tick() {
  return (
    <svg viewBox="0 0 24 24" className="mt-1 size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

/**
 * The draft request, framed as one order slip: trade, size, extras and care plan on the left, and
 * on the right what has been picked, the total and the one button. The button opens a mail asking
 * for a free draft, with every choice written in.
 */
export function Calculator({ head = true }: { head?: boolean }) {
  const { t, lang } = useLang();
  const c = t.calc;
  const [trade, setTrade] = useState<number | null>(null);
  const [size, setSize] = useState(0);
  const [extras, setExtras] = useState<number[]>([]);
  // The care plan with admin is the one we recommend, so it starts picked.
  const [care, setCare] = useState(1);
  // "Andet fag" is the last option; picking it opens a field to write the trade in.
  const other = c.trade.options.length - 1;
  const [otherTrade, setOtherTrade] = useState("");
  const [hint, setHint] = useState(0);
  const otherRef = useRef<HTMLInputElement>(null);
  const tradeName = trade === null ? null : trade === other && otherTrade.trim() ? otherTrade.trim() : c.trade.options[trade];

  // While the field is empty, its placeholder runs through a few trades that are not on the list.
  useEffect(() => {
    if (trade !== other || otherTrade) return;
    const id = setInterval(() => setHint((h) => (h + 1) % c.trade.hints.length), 1800);
    return () => clearInterval(id);
  }, [trade, other, otherTrade, c.trade.hints.length]);

  const num = (n: number) => n.toLocaleString(lang === "da" ? "da-DK" : "en-GB");
  const kr = (n: number) => (lang === "da" ? `${num(n)} kr.` : `DKK ${num(n)}`);
  const picked = [...extras].sort((a, b) => a - b);
  const sitePrice = c.size.options[size].price + extras.reduce((sum, i) => sum + c.features.options[i].price, 0);
  const plan = c.care.options[care];

  const mailto = () => {
    const [lTrade, lSize, lExtras, lCare, lPrice] = c.mailLines;
    const body = [
      `${lTrade}: ${tradeName ?? ""}`,
      `${lSize}: ${c.size.options[size].label}`,
      `${lExtras}: ${picked.length ? picked.map((i) => c.features.options[i].label).join(", ") : c.none}`,
      `${lCare}: ${plan.label}`,
      `${lPrice}: ${kr(sitePrice)} + ${kr(plan.monthly)} ${c.monthly}`,
      "",
      c.mailEnd,
    ].join("\n");
    return `mailto:${EMAIL}?subject=${encodeURIComponent(c.mailSubject)}&body=${encodeURIComponent(body)}`;
  };

  const tradeChip = (o: string, i: number) => (
    <label
      key={o}
      className="flex h-9 shrink-0 cursor-pointer items-center border border-ink/25 bg-paper px-3.5 font-cond text-lg font-bold uppercase leading-none transition-colors hover:border-ink has-checked:border-ink has-checked:bg-ink has-checked:text-paper has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand"
    >
      <input
        type="radio"
        name="fag"
        checked={trade === i}
        onChange={() => {
          setTrade(i);
          if (i === other) requestAnimationFrame(() => otherRef.current?.focus());
        }}
        className="sr-only"
      />
      {o}
    </label>
  );

  const line = "flex justify-between gap-4 py-1.5";

  return (
    <div id="beregner" className="scroll-mt-24 border-2 border-ink bg-card">
      {head && (
        <div className="border-b-2 border-ink px-4 py-8 sm:px-10 sm:py-10">
          <h2 className="text-balance font-cond text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-6xl">{c.title}</h2>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-ink/70">{c.lead}</p>
        </div>
      )}
      <div className="grid lg:grid-cols-[minmax(0,1fr)_20rem]">
        <form onSubmit={(e) => e.preventDefault()} className="min-w-0 px-4 py-2 sm:px-10">
          <Row n={1} title={c.trade.title}>
            <div className="flex flex-wrap items-start gap-2">
              {c.trade.options.slice(0, other).map((o, i) => tradeChip(o, i))}
              {/* "Andet fag" and its field wrap together, so the field always sits right next to it. */}
              <span className="flex max-w-full gap-2">
                {tradeChip(c.trade.options[other], other)}
                {trade === other && (
                  <input
                    ref={otherRef}
                    type="text"
                    value={otherTrade}
                    onChange={(e) => setOtherTrade(e.target.value)}
                    maxLength={40}
                    aria-label={c.trade.write}
                    placeholder={c.trade.hints[hint]}
                    autoComplete="off"
                    enterKeyHint="done"
                    data-field
                    className="h-9 w-44 min-w-0 border border-ink bg-paper px-3.5 font-cond text-lg font-bold uppercase placeholder:text-ink/40 focus:shadow-[inset_0_0_0_1px_var(--color-ink)]"
                  />
                )}
              </span>
            </div>
          </Row>
          <Row n={2} title={c.size.title}>
            {c.size.options.map((o, i) => (
              <Choice key={o.label} type="radio" name="stoerrelse" checked={size === i} onChange={() => setSize(i)} label={o.label} note={o.note} price={kr(o.price)} />
            ))}
          </Row>
          <Row n={3} title={c.features.title}>
            <p className="pb-2 pt-2 text-sm leading-snug text-ink/60">{c.features.included}</p>
            {c.features.options.map((o, i) => (
              <Choice
                key={o.label}
                type="checkbox"
                name="tilvalg"
                checked={extras.includes(i)}
                onChange={() => setExtras((x) => (x.includes(i) ? x.filter((j) => j !== i) : [...x, i]))}
                label={o.label}
                note={o.note}
                price={`+ ${kr(o.price)}`}
              />
            ))}
          </Row>
          <Row n={4} title={c.care.title} wide>
            {/* Side by side when there is room, so the two plans can be read against each other. */}
            <div className="@container">
              <div className="grid gap-3 @md:grid-cols-2">
                {c.care.options.map((o, i) => (
                  <label
                    key={o.label}
                    className="flex cursor-pointer flex-col border border-ink/25 bg-paper p-4 transition-colors hover:border-ink has-checked:border-ink has-checked:shadow-[inset_0_0_0_1px_var(--color-ink)] has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand"
                  >
                    <span className="flex items-start gap-3">
                      <input type="radio" name="drift" checked={care === i} onChange={() => setCare(i)} className="mt-1 size-4 shrink-0 accent-ink" />
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold leading-snug">{o.label}</span>
                        <span className="mt-0.5 block text-sm tabular-nums text-ink/70">
                          {kr(o.monthly)} {c.monthly}
                        </span>
                      </span>
                      {i === 1 && <span className="shrink-0 bg-brand px-1.5 py-0.5 font-cond text-sm font-bold uppercase leading-none">{c.care.pick}</span>}
                    </span>
                    <ul className="mt-3 space-y-1.5 border-t border-ink/15 pt-3 text-sm leading-snug text-ink/75">
                      {o.points.map((p) => (
                        <li key={p} className="flex gap-2">
                          <Tick />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </label>
                ))}
              </div>
            </div>
          </Row>
        </form>

        <aside className="border-t-2 border-ink bg-paper px-4 py-8 sm:px-10 lg:border-l-2 lg:border-t-0 lg:px-8" aria-live="polite">
          {/* The order and the one button stay in view beside the form on a computer. */}
          <div className="lg:sticky lg:top-24">
            <p className="font-cond text-xl font-bold uppercase">{c.estimate}</p>
            <dl className="mt-3 border-b border-ink/15 pb-2 text-sm">
              <div className={line}>
                <dt className="text-ink/60">{c.trade.title}</dt>
                <dd className={`min-w-0 truncate text-right ${tradeName ? "font-semibold" : "text-ink/50"}`}>{tradeName ?? c.pickTrade}</dd>
              </div>
              <div className={line}>
                <dt>{c.size.options[size].label}</dt>
                <dd className="whitespace-nowrap tabular-nums">{kr(c.size.options[size].price)}</dd>
              </div>
              {picked.map((i) => (
                <div key={i} className={line}>
                  <dt>{c.features.options[i].label}</dt>
                  <dd className="whitespace-nowrap tabular-nums">+ {kr(c.features.options[i].price)}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 flex items-baseline justify-between gap-3">
              <span className="font-cond text-lg font-bold uppercase">{c.total}</span>
              <span className="text-sm text-ink/60">{c.once}</span>
            </p>
            <p className="font-cond text-6xl font-extrabold leading-none tabular-nums">{kr(sitePrice)}</p>
            <p className="mt-3 flex justify-between gap-4 border-t border-ink/15 pt-3 text-sm">
              <span>{plan.label}</span>
              <span className="whitespace-nowrap tabular-nums">
                {kr(plan.monthly)} {c.monthly}
              </span>
            </p>
            <p className="mt-3 text-sm text-ink/55">{c.vat}</p>
            <a href={mailto()} className="mt-6 flex w-full items-center justify-center bg-brand px-6 py-4 font-cond text-xl font-bold uppercase text-ink transition hover:bg-brand-dark">
              {c.cta}
            </a>
            <ol className="mt-5 space-y-1.5 text-sm leading-snug text-ink/70">
              {c.how.map((s, i) => (
                <li key={s} className="flex gap-2.5">
                  <span className="font-cond font-bold text-ink/40 tabular-nums">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
