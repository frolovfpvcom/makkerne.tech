"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/** Unsplash photo by id, cropped to the requested width. */
export function photo(id: string, w = 1600) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;
}

/** A stock photo. `priority` is for the hero: load it straight away instead of lazily (it is the LCP image). */
export function Img({ id, w, alt, className, priority = false }: { id: string; w?: number; alt: string; className?: string; priority?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- remote stock photos, sized via the URL
    <img src={photo(id, w)} alt={alt} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" className={className} />
  );
}

/** Index that advances on its own, pauses while hovered, and can be set by hand. */
export function useSlider(count: number, ms = 5000) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || count < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), ms);
    return () => clearInterval(id);
  }, [paused, count, ms, index]);
  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);
  return {
    index,
    go,
    next: () => go(index + 1),
    prev: () => go(index - 1),
    hover: { onMouseEnter: () => setPaused(true), onMouseLeave: () => setPaused(false) },
  };
}

/** Scrolls a horizontal scroll-snap track by most of its width. */
export function scrollTrack(track: React.RefObject<HTMLDivElement | null>, dir: 1 | -1) {
  const el = track.current;
  if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
}

export type Hours = { day: string; open: string; close: string }[];

/** Open/closed right now, from a Monday-first list of opening hours. */
export function useOpenNow(hours: Hours) {
  const [state, setState] = useState<{ open: boolean; today: number } | null>(null);
  useEffect(() => {
    const check = () => {
      const now = new Date();
      const today = (now.getDay() + 6) % 7;
      const h = hours[today];
      const mins = now.getHours() * 60 + now.getMinutes();
      const toMin = (t: string) => {
        const [hh, mm] = t.split(":").map(Number);
        return hh * 60 + mm;
      };
      const open = !!h && h.open !== "" && mins >= toMin(h.open) && mins < toMin(h.close);
      setState({ open, today });
    };
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, [hours]);
  return state;
}

export function Arrow({ dir, onClick, className = "" }: { dir: "left" | "right"; onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "left" ? "Forrige" : "Næste"}
      className={`grid size-11 place-items-center rounded-full border transition ${className}`}
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        {dir === "left" ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}
      </svg>
    </button>
  );
}

/** One review's stars. The label always matches what is drawn. */
export function Stars({ n = 5, className = "" }: { n?: number; className?: string }) {
  return (
    <span className={`tracking-[0.15em] ${className}`} role="img" aria-label={`${n} ud af 5 stjerner`}>
      {"★".repeat(n)}
      <span className="opacity-30">{"★".repeat(5 - n)}</span>
    </span>
  );
}

/**
 * Small, honest label for the reviews section: the firm is made up, so the reviews are sample text.
 * On a real customer's site this is where their own reviews from Google or Anmeld Håndværker go.
 */
export function SampleReviewsNote({ className = "" }: { className?: string }) {
  return <p className={`text-sm ${className}`}>Eksempeltekster. På din side vises dine egne anmeldelser fra Google eller Anmeld Håndværker.</p>;
}

/** Small banner so nobody mistakes the example for a real business. */
export function DemoNote({ className = "" }: { className?: string }) {
  return (
    <p className={`px-4 py-2 text-center text-[13px] ${className}`}>
      Eksempel lavet af{" "}
      <Link href="/" target="_top" className="font-semibold underline underline-offset-2">
        Makkerne
      </Link>{" "}
      · Firmaet er opdigtet, og intet bliver sendt
    </p>
  );
}

/*
 * Pieces shared by the craftsman examples. They read the site's colours from CSS variables
 * set on the page root: --ex-ink (text), --ex-paper (cards), --ex-accent and --ex-on-accent.
 */

type IconName = "phone" | "check" | "clock" | "shield" | "pin" | "camera" | "arrow";

const ICONS: Record<IconName, React.ReactNode> = {
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z" />
      <path d="M8.5 12l2.5 2.5 4.5-4.5" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
};

export function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {ICONS[name]}
    </svg>
  );
}

/** Two photos on top of each other, with a handle you drag to wipe between them. */
export function BeforeAfter({
  before,
  after,
  alt,
  className = "",
}: {
  before: string;
  after: string;
  alt: string;
  className?: string;
}) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const moveTo = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (r) setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <div
      ref={box}
      className={`relative cursor-ew-resize touch-pan-y select-none overflow-hidden ${className}`}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        moveTo(e.clientX);
      }}
      onPointerMove={(e) => e.buttons && moveTo(e.clientX)}
    >
      <Img id={after} w={1400} alt={`${alt}, efter`} className="pointer-events-none absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Img id={before} w={1400} alt={`${alt}, før`} className="pointer-events-none size-full object-cover grayscale-[35%]" />
      </div>
      <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">Før</span>
      <span className="absolute right-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-black">Efter</span>
      <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_12px_rgba(0,0,0,0.4)]" style={{ left: `${pos}%` }}>
        <span className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-black shadow-xl">
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />
          </svg>
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(pos)}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`Træk for at se før og efter: ${alt}`}
        className="absolute inset-x-0 bottom-0 h-1 w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}

/** Postcode check: is the visitor inside the area the business drives to? */
export function AreaCheck({ areas, base }: { areas: Record<string, string>; base: string }) {
  const [zip, setZip] = useState("");
  const town = areas[zip];
  const valid = /^\d{4}$/.test(zip) && Number(zip) >= 1000;
  return (
    <div>
      <label className="block text-sm font-semibold" htmlFor="area-zip">
        Kommer I ud til mig?
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="area-zip"
          inputMode="numeric"
          maxLength={4}
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
          placeholder="Dit postnummer"
          className="min-w-0 flex-1 rounded-xl border border-current/20 bg-transparent px-4 py-3 text-lg tabular-nums outline-none focus:border-(--ex-accent)"
        />
      </div>
      <div className="mt-3 min-h-14" aria-live="polite">
        <AnimatePresence mode="wait">
          {valid && (
            <motion.p
              key={zip}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${town ? "bg-emerald-600/12 text-emerald-800" : "bg-current/5"}`}
            >
              <Icon name={town ? "check" : "pin"} className="mt-0.5 size-4 shrink-0" />
              {town
                ? `Ja! Vi kører fast til ${town} (${zip}) – uden kørselstillæg.`
                : `${zip} ligger uden for vores faste område omkring ${base}. Ring alligevel, vi siger sjældent nej.`}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {Object.entries(areas).map(([z, t]) => (
          <li key={z}>
            <button type="button" onClick={() => setZip(z)} className="rounded-full border border-current/15 px-3 py-1 text-xs transition hover:border-(--ex-accent)">
              {t}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const WHEN = ["Hurtigst muligt", "Inden for en måned", "Jeg er fleksibel"];

/** Three short steps from "what needs doing" to a sent request, then a thank-you. */
export function QuoteWizard({
  services,
  preset,
  reply,
  submitLabel = "Send forespørgsel",
}: {
  services: string[];
  preset?: { service?: string; note?: string };
  reply: string;
  submitLabel?: string;
}) {
  const [step, setStep] = useState(preset?.service ? 1 : 0);
  const [service, setService] = useState(preset?.service ?? "");
  const [note, setNote] = useState(preset?.note ?? "");
  const [when, setWhen] = useState(WHEN[0]);
  const [files, setFiles] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const steps = ["Opgaven", "Detaljer", "Kontakt"];
  const field = "w-full rounded-xl border border-current/15 bg-(--ex-paper) px-4 py-3 text-sm outline-none transition focus:border-(--ex-accent)";

  return (
    <div className="@container rounded-lg bg-(--ex-paper) p-6 shadow-sm sm:p-8">
      {step < 3 && (
        <div className="grid grid-cols-3 gap-2">
          {steps.map((s, i) => (
            <div key={s}>
              <div className="h-1 overflow-hidden rounded-full bg-current/10">
                <motion.div className="h-full bg-(--ex-accent)" animate={{ width: i <= step ? "100%" : "0%" }} />
              </div>
              <p className={`mt-1.5 text-xs ${i === step ? "font-semibold" : "opacity-50"}`}>
                {i + 1}. {s}
              </p>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }} className="mt-6">
          {step === 0 && (
            <div>
              <p className="text-lg font-semibold">Hvad skal laves?</p>
              <div className="mt-4 grid gap-2 @md:grid-cols-2">
                {services.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setService(s);
                      setStep(1);
                    }}
                    className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition hover:border-(--ex-accent) ${
                      service === s ? "border-(--ex-accent) bg-(--ex-accent)/8" : "border-current/12"
                    }`}
                  >
                    {s}
                    <Icon name="arrow" className="size-4 shrink-0 opacity-40" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <p className="text-sm">
                <span className="opacity-60">Opgave:</span> <span className="font-semibold">{service}</span>
              </p>
              <label className="block">
                <span className="text-sm font-semibold">Fortæl kort om opgaven</span>
                <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Fx størrelse, hvad der er galt, og hvad du gerne vil have" className={`mt-2 resize-none ${field}`} />
              </label>
              <div>
                <p className="text-sm font-semibold">Hvornår?</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {WHEN.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setWhen(w)}
                      className={`rounded-full px-4 py-2 text-sm transition ${when === w ? "bg-(--ex-accent) text-(--ex-on-accent)" : "bg-current/6 hover:bg-current/10"}`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-current/25 px-4 py-3.5 text-sm transition hover:border-(--ex-accent)">
                <Icon name="camera" className="size-5 shrink-0 opacity-60" />
                <span className="min-w-0 flex-1 truncate">{files.length ? files.join(", ") : "Vedhæft billeder (valgfrit)"}</span>
                <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((f) => f.name))} />
              </label>
              <button type="button" onClick={() => setStep(2)} className="w-full rounded-full bg-(--ex-accent) py-3.5 text-sm font-semibold text-(--ex-on-accent) transition hover:brightness-110">
                Videre
              </button>
            </div>
          )}

          {step === 2 && (
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                setStep(3);
              }}
            >
              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Navn" autoComplete="name" className={field} />
              <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Telefon" type="tel" autoComplete="tel" pattern="[\d\s+]{8,}" className={field} />
              <input required value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))} placeholder="Postnummer" inputMode="numeric" maxLength={4} pattern="\d{4}" className={field} />
              <button type="submit" className="w-full rounded-full bg-(--ex-accent) py-3.5 text-sm font-semibold text-(--ex-on-accent) transition hover:brightness-110">
                {submitLabel}
              </button>
              <p className="text-center text-xs opacity-50">Uforpligtende. Vi deler aldrig dine oplysninger.</p>
            </form>
          )}

          {step === 3 && (
            <div className="py-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 15 }}
                className="mx-auto grid size-16 place-items-center rounded-full bg-(--ex-accent) text-(--ex-on-accent)"
              >
                <Icon name="check" className="size-8" />
              </motion.div>
              <p className="mt-5 font-display text-3xl font-bold">Tak, {name.split(" ")[0]}!</p>
              <p className="mx-auto mt-2 max-w-xs opacity-65">{reply}</p>
              <p className="mx-auto mt-3 max-w-xs text-xs opacity-55">Dette er et eksempel, så der er ikke sendt noget.</p>
              <dl className="mx-auto mt-6 max-w-xs divide-y divide-current/10 rounded-md bg-current/5 px-4 text-left text-sm">
                {[
                  ["Opgave", service],
                  ["Hvornår", when],
                  ["Telefon", phone],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 py-2.5">
                    <dt className="opacity-55">{k}</dt>
                    <dd className="text-right font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              <button
                type="button"
                onClick={() => {
                  setStep(0);
                  setService("");
                  setNote("");
                  setFiles([]);
                }}
                className="mt-6 text-sm underline underline-offset-4 opacity-60"
              >
                Send en ny forespørgsel
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {step > 0 && step < 3 && (
        <button type="button" onClick={() => setStep(step - 1)} className="mt-5 text-sm underline underline-offset-4 opacity-55">
          ← Tilbage
        </button>
      )}
    </div>
  );
}
