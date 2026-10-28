"use client";

import { useRef, useState } from "react";
import { EMAIL } from "@/lib/content";
import { useLang } from "./lang";
import { setTrade as showExample } from "./trade-store";
import { reachStage } from "./progress-store";
import { setDraft, useDraft } from "./draft-store";

/*
 * The price card: four short rows, already set to what most pick, so the price is there from the
 * first second. Change a row and the total follows. Prices sit in the total, not on every button.
 * The contact fields only fold out when the visitor asks for the draft.
 */

const rule = "border-ink/[0.09]";
const on = "bg-ink text-[#f7f3ea]";
const off = "text-ink/75 hover:bg-ink/[0.05] hover:text-ink";

function useKr() {
  const { lang } = useLang();
  const num = (n: number) => n.toLocaleString(lang === "da" ? "da-DK" : "en-GB");
  return (n: number) => (lang === "da" ? `${num(n)} kr.` : `DKK ${num(n)}`);
}

/** One question: its name on the left, the answer beside it. */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={`grid grid-cols-[4.75rem_minmax(0,1fr)] items-center gap-3 border-t ${rule} py-3 sm:grid-cols-[6rem_minmax(0,1fr)]`}>
      <p className="text-[13px] font-semibold text-ink/55">{label}</p>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/** One answer out of a few, as a single bar split into parts. */
function Segments({ items, value, onPick }: { items: string[]; value: number; onPick: (i: number) => void }) {
  return (
    <div className="flex overflow-hidden rounded-[5px] border border-ink/20 bg-white">
      {items.map((label, i) => (
        <button
          key={label}
          type="button"
          aria-pressed={value === i}
          onClick={() => onPick(i)}
          className={`min-w-0 flex-1 cursor-pointer px-1.5 py-2 text-[13px] font-semibold leading-tight transition-colors sm:text-sm ${i ? "border-l border-ink/20" : ""} ${value === i ? on : off}`}
        >
          {label}
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
    <section id="beregner" className="scroll-mt-18 bg-paper text-ink">
      <div className="mx-auto max-w-[640px] px-4 py-10 sm:px-8 sm:py-20 lg:px-0">
        {head && (
          <div className="mb-8">
            <h2 className="font-cond text-3xl font-bold tracking-tight sm:text-5xl">{c.head}</h2>
            <p className="mt-3 leading-relaxed text-ink/65 sm:text-lg">{c.lead}</p>
          </div>
        )}
        <DraftSheet />
      </div>
    </section>
  );
}

/** `tight` is the front-page version beside the phone; the card is the same, only the hero sizes it. */
export function DraftSheet({ tight = false }: { tight?: boolean }) {
  const { t } = useLang();
  const c = t.calc;
  const q = c.quick;
  const kr = useKr();
  const { trade } = useDraft();
  const other = c.trade.options.length - 1;

  // The extras in one list: the two price options first (only one of them at a time), then the rest.
  const extraPrices = [c.prices.options[1].price, c.prices.options[2].price, ...c.extras.options.map((o) => o.price)];
  const extraNames = [c.prices.options[1].label, c.prices.options[2].label, ...c.extras.options.map((o) => o.label)];

  // Set to what most people pick, so the total is real from the start.
  const [otherTrade, setOtherTrade] = useState("");
  const [size, setSize] = useState(1);
  const [extras, setExtras] = useState<number[]>([]);
  const [more, setMore] = useState(false);
  const [care, setCare] = useState(0);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", contact: "" });
  const nameRef = useRef<HTMLInputElement>(null);

  const touched = () => reachStage(1);
  const picked = [...extras].sort((a, b) => a - b);
  const total = c.size.options[size].price + picked.reduce((s, i) => s + extraPrices[i], 0);
  const plan = c.care.options[care];
  const tradeName = trade === null ? "" : trade === other ? otherTrade.trim() : c.trade.options[trade];

  const pickTrade = (i: number) => {
    touched();
    setDraft({ trade: i });
    if (i < other) showExample(i);
  };

  const toggleExtra = (i: number) => {
    touched();
    setExtras((x) => {
      if (x.includes(i)) return x.filter((j) => j !== i);
      // A price list and a price calculator do the same job, so picking one drops the other.
      const rest = i < 2 ? x.filter((j) => j > 1) : x;
      return [...rest, i];
    });
  };

  const mailto = () => {
    const lines = [
      `${q.rows.trade}: ${tradeName || "-"}`,
      `${q.rows.size}: ${c.size.options[size].label} (${kr(c.size.options[size].price)})`,
      `${q.rows.extras}: ${picked.length ? picked.map((i) => `${extraNames[i]} (+${kr(extraPrices[i])})`).join(", ") : c.extras.none}`,
      `${q.rows.texts}: ${c.texts.options[0].label}`,
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
    "mt-1 w-full rounded-[5px] border border-ink/20 bg-white px-3 py-2.5 text-[15px] text-ink focus:border-ink focus:outline-none";
  const visible = more ? extraNames.length : 4;

  return (
    <div className={`overflow-hidden rounded-lg border border-ink/12 bg-card text-ink shadow-[0_1px_0_rgb(28_27_24/0.06),0_12px_30px_-12px_rgb(28_27_24/0.18)] ${tight ? "lg:max-w-[560px]" : ""}`}>
      <div className="px-4 pb-1 pt-4 sm:px-6 sm:pt-5">
        <p className="mb-3 font-cond text-xl font-bold tracking-tight sm:text-2xl">{q.title}</p>

        <Row label={q.rows.trade}>
          <div className="flex flex-wrap gap-2">
            <span className="relative min-w-0 flex-1 basis-40">
              <select
                value={trade ?? ""}
                onChange={(e) => pickTrade(Number(e.target.value))}
                aria-label={q.rows.trade}
                className={`w-full cursor-pointer appearance-none rounded-[5px] border border-ink/20 bg-white py-2 pl-3 pr-9 text-sm font-semibold focus:border-ink focus:outline-none ${trade === null ? "text-ink/55" : "text-ink"}`}
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
              <svg aria-hidden viewBox="0 0 12 8" className="pointer-events-none absolute right-3 top-1/2 h-2 w-3 -translate-y-1/2 fill-none stroke-ink/60" strokeWidth="1.6">
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
                className="min-w-0 flex-1 basis-32 rounded-[5px] border border-ink/20 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/40 focus:border-ink focus:outline-none"
              />
            )}
          </div>
        </Row>

        <Row label={q.rows.size}>
          <Segments items={c.size.options.map((o) => o.label.replace(/ sider?$| pages?$/i, "").replace(/^(Én|One)$/i, "1"))} value={size} onPick={(i) => (touched(), setSize(i))} />
        </Row>

        <Row label={q.rows.extras}>
          <div className="flex flex-wrap gap-1.5">
            {q.extrasShort.slice(0, visible).map((label, i) => {
              const sel = extras.includes(i);
              return (
                <button
                  key={label}
                  type="button"
                  aria-pressed={sel}
                  onClick={() => toggleExtra(i)}
                  title={`${extraNames[i]} · +${kr(extraPrices[i])}`}
                  className={`cursor-pointer rounded-[5px] border px-2.5 py-1.5 text-[13px] font-semibold transition-colors ${sel ? `border-ink ${on}` : `border-ink/20 bg-white ${off}`}`}
                >
                  {label}
                </button>
              );
            })}
            {!more && (
              <button type="button" onClick={() => setMore(true)} className="cursor-pointer px-1.5 py-1.5 text-[13px] font-semibold text-ink/55 underline-offset-4 hover:text-ink hover:underline">
                + {q.more}
              </button>
            )}
          </div>
        </Row>

        <Row label={q.rows.care}>
          <Segments items={q.careShort} value={care} onPick={(i) => (touched(), setCare(i))} />
        </Row>
      </div>

      {/* The total, and the way to the draft. */}
      <div className="mt-2 border-t-[3px] border-brand bg-paper px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
          <p aria-live="polite" className="leading-none">
            <span className="font-cond text-[2.6rem] font-extrabold tracking-tight tabular-nums sm:text-5xl">{kr(total)}</span>
            <span className="mt-2 block text-sm text-ink/60">
              + <span className="tabular-nums text-ink">{kr(plan.monthly)}</span> {c.perMonth}
            </span>
          </p>
          {!open && (
            <button
              type="button"
              onClick={() => {
                setOpen(true);
                reachStage(2);
                requestAnimationFrame(() => nameRef.current?.focus());
              }}
              className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full bg-[#FACC15] px-6 font-cond text-lg font-semibold text-black transition hover:bg-ink hover:text-[#f7f3ea]"
            >
              {q.cta} <span aria-hidden>→</span>
            </button>
          )}
        </div>

        {open && (
          <form
            className="mt-4 grid gap-3 sm:grid-cols-3"
            onSubmit={(e) => {
              e.preventDefault();
              reachStage(3);
              window.location.href = mailto();
            }}
          >
            {(
              [
                ["name", "name", true],
                ["company", "organization", false],
                ["contact", "email", true],
              ] as const
            ).map(([key, auto, required]) => (
              <label key={key} className="min-w-0">
                <span className="text-xs text-ink/55">
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
            <button
              type="submit"
              className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#FACC15] px-6 font-cond text-lg font-semibold text-black transition hover:bg-ink hover:text-[#f7f3ea] sm:col-span-3 sm:justify-self-start"
            >
              {q.send} <span aria-hidden>→</span>
            </button>
          </form>
        )}

        <p className="mt-3 text-xs text-ink/50">{q.fine}</p>
      </div>
    </div>
  );
}
