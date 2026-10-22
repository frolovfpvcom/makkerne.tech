"use client";

import { useRef, useState } from "react";
import { EMAIL } from "@/lib/content";
import { useLang } from "./lang";
import { setTrade as showExample } from "./trade-store";
import { reachStage } from "./progress-store";
import { setDraft, useDraft } from "./draft-store";

/*
 * The price card: every choice on one screen, already set to what most pick, so the price is there
 * from the first second. Change a row and the total follows. The contact fields only fold out when
 * the visitor asks for the draft. Plain tiles, solid lines, no wizard.
 */

const rule = "border-white/[0.09]";
const tileBase =
  "min-w-0 cursor-pointer rounded-[5px] border text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FACC15]";
const tileOff = "border-white/15 text-white/85 hover:border-white/45 hover:text-white";
const tileOn = "border-white bg-white text-black";

function useKr() {
  const { lang } = useLang();
  const num = (n: number) => n.toLocaleString(lang === "da" ? "da-DK" : "en-GB");
  return (n: number) => (lang === "da" ? `${num(n)} kr.` : `DKK ${num(n)}`);
}

/** One question: its name on the left (above it on a phone), the answers beside it. */
function Row({ label, tight, children }: { label: string; tight: boolean; children: React.ReactNode }) {
  return (
    <div className={`grid gap-2 border-t ${rule} py-3.5 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:items-start sm:gap-4 ${tight ? "lg:py-2.5" : ""}`}>
      <p className={`pt-1.5 text-[13px] font-semibold text-white/60 ${tight ? "lg:text-xs" : ""}`}>{label}</p>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/** Answers where one is picked, as a row of tiles with the price under each name. */
function Pick({
  items,
  value,
  onPick,
  cols,
  tight,
}: {
  items: { label: string; price: string }[];
  value: number;
  onPick: (i: number) => void;
  cols: string;
  tight: boolean;
}) {
  return (
    <div className={`grid gap-1.5 ${cols}`}>
      {items.map((o, i) => (
        <button
          key={o.label}
          type="button"
          aria-pressed={value === i}
          onClick={() => onPick(i)}
          className={`${tileBase} ${value === i ? tileOn : tileOff} px-3 py-2 ${tight ? "lg:px-2.5 lg:py-1.5" : ""}`}
        >
          <span className={`block text-sm font-semibold leading-tight ${tight ? "lg:text-[13px]" : ""}`}>{o.label}</span>
          <span className={`mt-0.5 block text-xs tabular-nums ${value === i ? "text-black/70" : "text-white/45"}`}>{o.price}</span>
        </button>
      ))}
    </div>
  );
}

/** The card on its own, with a heading over it. Used on the "Udkast" page. */
export function DraftSection({ head = true }: { head?: boolean }) {
  const { t } = useLang();
  const c = t.calc;
  return (
    <section id="beregner" className="scroll-mt-18 bg-[#07090E] text-white">
      <div className="mx-auto max-w-[880px] px-4 py-10 sm:px-8 sm:py-20 lg:px-0">
        {head && (
          <div className="mb-8 max-w-2xl">
            <h2 className="font-cond text-3xl font-bold tracking-tight sm:text-5xl">{c.head}</h2>
            <p className="mt-3 leading-relaxed text-white/65 sm:text-lg">{c.lead}</p>
          </div>
        )}
        <DraftSheet />
      </div>
    </section>
  );
}

/** `tight` is the front-page version that sits beside the phone, a little smaller on a computer. */
export function DraftSheet({ tight = false }: { tight?: boolean }) {
  const { t } = useLang();
  const c = t.calc;
  const q = c.quick;
  const kr = useKr();
  const plus = (n: number) => (n ? `+${kr(n)}` : kr(0));
  const { trade } = useDraft();
  const other = c.trade.options.length - 1;

  // Set to what most people pick, so the total is real from the start.
  const [otherTrade, setOtherTrade] = useState("");
  const [size, setSize] = useState(1);
  const [prices, setPrices] = useState(0);
  const [extras, setExtras] = useState<number[]>([]);
  const [texts, setTexts] = useState(0);
  const [care, setCare] = useState(0);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", contact: "" });
  const nameRef = useRef<HTMLInputElement>(null);

  const touched = () => reachStage(1);
  const picked = [...extras].sort((a, b) => a - b);
  const total = c.size.options[size].price + c.prices.options[prices].price + picked.reduce((s, i) => s + c.extras.options[i].price, 0);
  const plan = c.care.options[care];
  const tradeName = trade === null ? "" : trade === other ? otherTrade.trim() : c.trade.options[trade];

  const pickTrade = (i: number) => {
    touched();
    setDraft({ trade: i });
    if (i < other) showExample(i);
  };

  const mailto = () => {
    const lines = [
      `${q.rows.trade}: ${tradeName || "-"}`,
      `${q.rows.size}: ${c.size.options[size].label} (${kr(c.size.options[size].price)})`,
      `${q.rows.prices}: ${c.prices.options[prices].label} (${plus(c.prices.options[prices].price)})`,
      `${q.rows.extras}: ${picked.length ? picked.map((i) => `${c.extras.options[i].label} (${plus(c.extras.options[i].price)})`).join(", ") : c.extras.none}`,
      `${q.rows.texts}: ${c.texts.options[texts].label}`,
      `${q.rows.care}: ${plan.label} (${kr(plan.monthly)} ${c.perMonth})`,
      "",
      `${q.oneTime}: ${kr(total)}`,
      "",
      `${q.name}: ${form.name}`,
      `${q.company}: ${form.company}`,
      `${q.contact}: ${form.contact}`,
      "",
      c.mailEnd,
    ];
    return `mailto:${EMAIL}?subject=${encodeURIComponent(c.mailSubject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  };

  const field =
    "mt-1 w-full rounded-[5px] border border-white/15 bg-transparent px-3 py-2.5 text-[15px] text-white placeholder:text-white/30 focus:border-[#FACC15] focus:outline-none";
  const pad = tight ? "px-4 sm:px-6 lg:px-5" : "px-4 sm:px-6";

  return (
    <div className="overflow-hidden rounded-lg border border-white/12 bg-[#0B0D12] text-white">
      <div className={`${pad} pb-1 pt-4 ${tight ? "lg:pt-3.5" : "sm:pt-5"}`}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className={`font-cond text-xl font-bold tracking-tight sm:text-2xl ${tight ? "lg:text-xl" : ""}`}>{q.title}</p>
          <p className="text-[13px] text-white/50">{q.sub}</p>
        </div>

        <div className="mt-3">
          <Row label={q.rows.trade} tight={tight}>
            <div className="flex flex-wrap gap-2">
              <span className="relative min-w-0 flex-1 basis-44">
                <select
                  value={trade ?? ""}
                  onChange={(e) => pickTrade(Number(e.target.value))}
                  className={`w-full cursor-pointer appearance-none rounded-[5px] border bg-[#0B0D12] py-2 pl-3 pr-9 text-sm font-semibold focus:border-[#FACC15] focus:outline-none ${trade === null ? "border-white/15 text-white/55" : "border-white/45 text-white"}`}
                >
                  <option value="" disabled>
                    {q.tradePick}
                  </option>
                  {c.trade.options.map((o, i) => (
                    <option key={o} value={i}>
                      {o}
                    </option>
                  ))}
                </select>
                <svg aria-hidden viewBox="0 0 12 8" className="pointer-events-none absolute right-3 top-1/2 h-2 w-3 -translate-y-1/2 fill-none stroke-white/60" strokeWidth="1.6">
                  <path d="M1 1.5l5 5 5-5" />
                </svg>
              </span>
              {trade === other && (
                <input
                  type="text"
                  value={otherTrade}
                  onChange={(e) => setOtherTrade(e.target.value)}
                  maxLength={40}
                  placeholder={c.trade.write}
                  aria-label={c.trade.write}
                  autoFocus
                  className="min-w-0 flex-1 basis-40 rounded-[5px] border border-white/15 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-[#FACC15] focus:outline-none"
                />
              )}
            </div>
          </Row>

          <Row label={q.rows.size} tight={tight}>
            <Pick
              tight={tight}
              cols="grid-cols-2 sm:grid-cols-4"
              value={size}
              onPick={(i) => (touched(), setSize(i))}
              items={c.size.options.map((o) => ({ label: o.label, price: kr(o.price) }))}
            />
          </Row>

          <Row label={q.rows.prices} tight={tight}>
            <Pick
              tight={tight}
              cols="grid-cols-1 min-[420px]:grid-cols-3"
              value={prices}
              onPick={(i) => (touched(), setPrices(i))}
              items={c.prices.options.map((o) => ({ label: o.label, price: plus(o.price) }))}
            />
          </Row>

          <Row label={q.rows.extras} tight={tight}>
            <div className="flex flex-wrap gap-1.5">
              {c.extras.options.map((o, i) => {
                const on = extras.includes(i);
                return (
                  <button
                    key={o.label}
                    type="button"
                    aria-pressed={on}
                    onClick={() => (touched(), setExtras((x) => (on ? x.filter((j) => j !== i) : [...x, i])))}
                    title={o.note}
                    className={`${tileBase} ${on ? tileOn : tileOff} inline-flex items-baseline gap-2 px-3 py-1.5 text-sm font-semibold ${tight ? "lg:text-[13px]" : ""}`}
                  >
                    {o.label}
                    <span className={`text-xs font-normal tabular-nums ${on ? "text-black/70" : "text-white/45"}`}>{plus(o.price)}</span>
                  </button>
                );
              })}
            </div>
          </Row>

          <Row label={q.rows.texts} tight={tight}>
            <Pick
              tight={tight}
              cols="grid-cols-2"
              value={texts}
              onPick={(i) => (touched(), setTexts(i))}
              items={q.textsShort.map((l) => ({ label: l, price: c.texts.included }))}
            />
          </Row>

          <Row label={q.rows.care} tight={tight}>
            <Pick
              tight={tight}
              cols="grid-cols-1 min-[420px]:grid-cols-3"
              value={care}
              onPick={(i) => (touched(), setCare(i))}
              items={c.care.options.map((o, i) => ({ label: q.careShort[i], price: `${kr(o.monthly)} ${c.perMonth}` }))}
            />
            <p className="mt-1.5 text-xs text-white/45">{q.careHint}</p>
          </Row>
        </div>
      </div>

      {/* The total, and the way to the draft. */}
      <div className={`border-t-2 border-[#FACC15] bg-[#11141B] ${pad} py-4 ${tight ? "lg:py-3.5" : "sm:py-5"}`}>
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <div aria-live="polite">
            <p className="text-[13px] font-semibold text-white/60">{q.oneTime}</p>
            <p className={`font-cond text-[2.6rem] font-extrabold leading-none tracking-tight tabular-nums sm:text-5xl ${tight ? "lg:text-[2.6rem]" : ""}`}>{kr(total)}</p>
            <p className="mt-1.5 text-sm text-white/65">
              {q.then} <span className="font-semibold tabular-nums text-white">{kr(plan.monthly)}</span> {c.perMonth}
            </p>
          </div>
          {!open && (
            <button
              type="button"
              onClick={() => {
                setOpen(true);
                reachStage(2);
                requestAnimationFrame(() => nameRef.current?.focus());
              }}
              className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full bg-[#FACC15] px-6 font-cond text-lg font-semibold text-black transition hover:bg-white"
            >
              {q.cta} <span aria-hidden>→</span>
            </button>
          )}
        </div>

        {open && (
          <form
            className="mt-4 border-t border-white/10 pt-4"
            onSubmit={(e) => {
              e.preventDefault();
              reachStage(3);
              window.location.href = mailto();
            }}
          >
            <p className="text-sm font-semibold">{q.who}</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-3">
              {(
                [
                  ["name", "name", true],
                  ["company", "organization", false],
                  ["contact", "email", true],
                ] as const
              ).map(([key, auto, required]) => (
                <label key={key} className="min-w-0">
                  <span className="text-xs text-white/55">
                    {q[key]}
                    {required && " *"}
                  </span>
                  <input
                    ref={key === "name" ? nameRef : undefined}
                    type="text"
                    required={required}
                    autoComplete={auto}
                    value={form[key]}
                    onChange={(e) => setForm((x) => ({ ...x, [key]: e.target.value }))}
                    className={field}
                  />
                </label>
              ))}
            </div>
            <button
              type="submit"
              className="mt-4 inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#FACC15] px-6 font-cond text-lg font-semibold text-black transition hover:bg-white sm:w-auto"
            >
              {q.send} <span aria-hidden>→</span>
            </button>
          </form>
        )}

        <p className="mt-3 text-xs leading-snug text-white/45">{q.fine}</p>
      </div>
    </div>
  );
}
