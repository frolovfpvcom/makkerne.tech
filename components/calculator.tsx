"use client";

import { useEffect, useId, useRef, useState } from "react";
import { EMAIL } from "@/lib/content";
import { useLang } from "./lang";

/** One line of the form: its name on the left on wider screens, the choices on the right. */
function Row({ title, children }: { title: string; children: React.ReactNode }) {
  const id = useId();
  return (
    <div role="group" aria-labelledby={id} className="grid gap-x-8 gap-y-3 border-b border-ink/15 py-6 last:border-b-0 sm:grid-cols-[9rem_minmax(0,1fr)] lg:last:border-b">
      <p id={id} className="font-cond text-xl font-bold uppercase leading-tight sm:pt-2.5">
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
    <label className="group grid cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-3 py-2.5">
      <input type={type} name={name} checked={checked} onChange={onChange} className="mt-1 size-4 accent-ink" />
      <span>
        <span className="block font-semibold leading-snug underline-offset-4 group-hover:underline">{label}</span>
        {note && <span className="mt-0.5 block text-sm leading-snug text-ink/60">{note}</span>}
      </span>
      <span className="whitespace-nowrap pt-0.5 text-sm tabular-nums text-ink/70">{price}</span>
    </label>
  );
}

/**
 * The draft request: trade, size, extras and care plan on one plain form, with the price beside it
 * as it adds up. The only way on is a mail asking for a free draft, with every choice written in.
 */
export function Calculator() {
  const { t, lang } = useLang();
  const c = t.calc;
  const [trade, setTrade] = useState<number | null>(null);
  const [size, setSize] = useState(0);
  const [extras, setExtras] = useState<number[]>([]);
  const [care, setCare] = useState(0);
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
  const sitePrice = c.size.options[size].price + extras.reduce((sum, i) => sum + c.features.options[i].price, 0);
  const monthly = c.care.options[care].monthly;

  const mailto = () => {
    const [lTrade, lSize, lExtras, lCare, lPrice] = c.mailLines;
    const body = [
      `${lTrade}: ${tradeName ?? ""}`,
      `${lSize}: ${c.size.options[size].label}`,
      `${lExtras}: ${extras.length ? [...extras].sort((a, b) => a - b).map((i) => c.features.options[i].label).join(", ") : c.none}`,
      `${lCare}: ${c.care.options[care].label}`,
      `${lPrice}: ${kr(sitePrice)} + ${kr(monthly)} ${c.monthly}`,
      "",
      c.mailEnd,
    ].join("\n");
    return `mailto:${EMAIL}?subject=${encodeURIComponent(c.mailSubject)}&body=${encodeURIComponent(body)}`;
  };

  const tradeChip = (o: string, i: number) => (
    <label
      key={o}
      className="flex h-9 cursor-pointer items-center border border-ink/25 bg-card px-3.5 font-cond text-lg font-bold uppercase leading-none transition-colors hover:border-ink has-checked:border-ink has-checked:bg-ink has-checked:text-paper has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand"
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

  return (
    <div id="beregner" className="grid scroll-mt-24 gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_19rem]">
      <form onSubmit={(e) => e.preventDefault()} className="min-w-0 border-t-2 border-ink">
        <Row title={c.trade.title}>
          <div className="flex flex-wrap items-start gap-2">
            {c.trade.options.slice(0, other).map((o, i) => tradeChip(o, i))}
            {/* "Andet fag" and its field wrap together, so the field always sits right next to it. */}
            <span className="flex gap-2">
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
                  className="h-9 w-44 min-w-0 border border-ink bg-card px-3.5 font-cond text-lg font-bold uppercase placeholder:text-ink/40 focus:shadow-[inset_0_0_0_1px_var(--color-ink)]"
                />
              )}
            </span>
          </div>
        </Row>
        <Row title={c.size.title}>
          {c.size.options.map((o, i) => (
            <Choice key={o.label} type="radio" name="stoerrelse" checked={size === i} onChange={() => setSize(i)} label={o.label} note={o.note} price={kr(o.price)} />
          ))}
        </Row>
        <Row title={c.features.title}>
          <p className="pb-2 pt-2.5 text-sm leading-snug text-ink/60">{c.features.included}</p>
          {c.features.options.map((o, i) => (
            <Choice
              key={o.label}
              type="checkbox"
              name="tilvalg"
              checked={extras.includes(i)}
              onChange={() => setExtras((x) => (x.includes(i) ? x.filter((j) => j !== i) : [...x, i]))}
              label={o.label}
              price={`+ ${kr(o.price)}`}
            />
          ))}
        </Row>
        <Row title={c.care.title}>
          {c.care.options.map((o, i) => (
            <Choice key={o.label} type="radio" name="drift" checked={care === i} onChange={() => setCare(i)} label={o.label} note={o.note} price={`${kr(o.monthly)} ${c.monthly}`} />
          ))}
        </Row>
      </form>

      {/* The price and the one button stay in view beside the form on a computer. */}
      <aside className="self-start border-t-2 border-ink pt-5 lg:sticky lg:top-24" aria-live="polite">
        <p className="font-cond text-xl font-bold uppercase">{c.estimate}</p>
        <p className="mt-1 text-sm text-ink/60">
          {tradeName ?? c.pickTrade} · {c.size.options[size].label}
        </p>
        <p className="mt-4 font-cond text-6xl font-extrabold leading-none tabular-nums">{kr(sitePrice)}</p>
        <p className="mt-2">
          {c.once} + {kr(monthly)} {c.monthly}
        </p>
        <p className="mt-1 text-sm text-ink/55">{c.vat}</p>
        <a href={mailto()} className="mt-6 flex w-full items-center justify-center bg-brand px-6 py-4 font-cond text-xl font-bold uppercase text-ink transition hover:bg-brand-dark">
          {c.cta}
        </a>
        <p className="mt-3 text-sm leading-snug text-ink/65">{c.free}</p>
      </aside>
    </div>
  );
}
