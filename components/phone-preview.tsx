"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Example } from "@/lib/content";
import CHIN from "@/lib/chin.json";
import { setTrade, useTrade } from "./trade-store";
import { ShotThenLive, usePreloadShots } from "./live-site";

const PHONE_WIDTH = 390;

/**
 * The colour at the very bottom of the site, so the strip under it (where a real iPhone keeps the
 * home indicator) continues the site's own call bar instead of cutting it off at the round corner.
 */
function bottomColour(win: Window | null | undefined) {
  try {
    if (!win) return null;
    let el = win.document.elementFromPoint(2, win.innerHeight - 2);
    while (el) {
      const bg = win.getComputedStyle(el).backgroundColor;
      if (bg && bg !== "transparent" && !/rgba\(.*,\s*0\)$/.test(bg)) return bg;
      el = el.parentElement;
    }
  } catch {}
  return null;
}

/** Whether a computed rgb() colour is dark, so the home indicator can be drawn light on it. */
function isDark(rgb: string) {
  const [r, g, b] = (rgb.match(/\d+(\.\d+)?/g) ?? []).map(Number);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 128;
}

/**
 * An iPhone: thin titanium edge, black bezel, big rounded corners, the Dynamic Island in a white
 * status bar, and the side buttons. The screen shows one of the example sites at real phone width
 * below the status bar, so the island never covers any of the site; it never takes clicks itself.
 */
export function IPhone({ src, slug, title, width = 300, height = 600 }: { src: string; slug: string; title: string; width?: number; height?: number }) {
  const bezel = Math.max(7, Math.round(width * 0.034));
  const radius = Math.round(width * 0.17);
  const screenW = width - bezel * 2;
  const screenH = height - bezel * 2;
  const statusBar = Math.round(width * 0.115);
  // The bottom of a real iPhone screen is kept free for the home indicator; sites pad their call
  // bars into it with env(safe-area-inset-bottom), which is 0 in this frame, so the mockup keeps
  // the strip itself. Tall enough that the round corners never reach the buttons above it.
  const homeBar = Math.round(height * 0.04);
  // Taken from the screenshot until the live site has loaded and can be asked itself.
  const [live, setLive] = useState<{ src: string; chin: string } | null>(null);
  const chin = live?.src === src ? live.chin : ((CHIN as Record<string, string>)[slug] ?? "#ffffff");
  const scale = screenW / PHONE_WIDTH;
  // Side buttons, as a share of the phone's height: action, volume up, volume down (left) and power (right).
  const button = "absolute w-[3px] rounded-sm bg-gradient-to-b from-[#3a3a3c] via-[#1c1c1e] to-[#3a3a3c]";
  return (
    <div className="relative" style={{ width, height }}>
      <span aria-hidden className={`${button} -left-[2px] top-[17%] h-[4.5%]`} />
      <span aria-hidden className={`${button} -left-[2px] top-[26%] h-[8%]`} />
      <span aria-hidden className={`${button} -left-[2px] top-[36%] h-[8%]`} />
      <span aria-hidden className={`${button} -right-[2px] top-[29%] h-[12%]`} />
      <div
        className="absolute inset-0 bg-[#0b0b0c] shadow-[0_34px_60px_-28px_rgba(22,21,19,0.55),inset_0_0_0_1.5px_#4a4a4d,inset_0_0_0_3px_#1c1c1e]"
        style={{ padding: bezel, borderRadius: radius }}
      >
        <div className="relative size-full overflow-hidden bg-white" style={{ borderRadius: radius - bezel }}>
          {/* Status bar: time on the left, the Dynamic Island in the middle, signal, wifi and battery on the right. */}
          <div aria-hidden className="relative flex items-center justify-between bg-white px-[9%] text-black" style={{ height: statusBar, fontSize: Math.round(width * 0.043) }}>
            <span className="font-semibold tabular-nums tracking-tight">9:41</span>
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black" style={{ width: width * 0.3, height: width * 0.088 }} />
            <span className="flex items-center gap-[3px]">
              <svg viewBox="0 0 18 12" className="h-[0.62em]" fill="currentColor">
                <rect x="0" y="8" width="3" height="4" rx="0.8" />
                <rect x="5" y="5.5" width="3" height="6.5" rx="0.8" />
                <rect x="10" y="3" width="3" height="9" rx="0.8" />
                <rect x="15" y="0" width="3" height="12" rx="0.8" />
              </svg>
              <svg viewBox="0 0 16 12" className="h-[0.62em]" fill="currentColor">
                <path d="M8 2.2c2.4 0 4.6.9 6.2 2.5l1.3-1.3A10.6 10.6 0 0 0 8 .3 10.6 10.6 0 0 0 .5 3.4l1.3 1.3A8.7 8.7 0 0 1 8 2.2Zm0 3.7c1.4 0 2.7.5 3.6 1.4l1.3-1.3A7 7 0 0 0 8 4a7 7 0 0 0-4.9 2l1.3 1.3c.9-.9 2.2-1.4 3.6-1.4Zm0 3.7c-.5 0-1 .2-1.3.6L8 11.5l1.3-1.3c-.3-.4-.8-.6-1.3-.6Z" />
              </svg>
              <svg viewBox="0 0 27 12" className="h-[0.62em]" fill="none">
                <rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="currentColor" opacity="0.4" />
                <rect x="2" y="2" width="19" height="8" rx="1.8" fill="currentColor" />
                <path d="M24.5 4v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" opacity="0.4" />
              </svg>
            </span>
          </div>
          <div className="relative overflow-hidden bg-paper" style={{ height: screenH - statusBar - homeBar }}>
            <ShotThenLive
              key={src}
              src={src}
              shot={`/examples/shots/phone/${slug}.webp`}
              title={title}
              width={PHONE_WIDTH}
              height={(screenH - statusBar - homeBar) / scale}
              scale={scale}
              priority
              onLive={(win) => setLive({ src, chin: bottomColour(win) ?? "#ffffff" })}
            />
          </div>
          {/* Home indicator, on the same colour as the bottom of the site above it. */}
          <div aria-hidden className="relative grid place-items-center" style={{ height: homeBar, background: chin }}>
            <span className={`h-[4px] w-[36%] rounded-full ${isDark(chin) ? "bg-white/85" : "bg-black/85"}`} style={{ marginTop: -homeBar * 0.15 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function onResize(cb: () => void) {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
}

/**
 * A smaller phone on small screens, and on a low laptop screen one that fits under the header
 * with the view switch above it and its arrows below it.
 * Read straight from the window, so the hero has its final height on the first render after a
 * menu click and a jump to #eksempler lands in the right place.
 */
function phoneHeight() {
  if (window.innerWidth < 640) return 460;
  if (window.innerWidth >= 1024) return Math.max(380, Math.min(560, window.innerHeight - 340));
  return 540;
}

const DESKTOP_WIDTH = 1280;
const DESKTOP_HEIGHT = 800;

/**
 * A laptop: black bezel with a camera dot, the example site at 1280 px wide on its 16:10 screen,
 * and a thin aluminium base with the opening notch. Like the phone, it never takes clicks itself.
 */
function Laptop({ src, slug, title, width }: { src: string; slug: string; title: string; width: number }) {
  const screenW = Math.round(width * 0.86);
  const bezel = Math.max(6, Math.round(screenW * 0.022));
  const innerW = screenW - bezel * 2;
  const innerH = Math.round((innerW * DESKTOP_HEIGHT) / DESKTOP_WIDTH);
  const base = Math.max(8, Math.round(width * 0.022));
  return (
    <div className="flex flex-col items-center" style={{ width }}>
      <div
        className="relative bg-[#0b0b0c] shadow-[inset_0_0_0_1.5px_#4a4a4d,inset_0_0_0_3px_#1c1c1e]"
        style={{ width: screenW, padding: bezel, paddingTop: bezel * 1.5, borderRadius: `${bezel * 1.8}px ${bezel * 1.8}px 0 0` }}
      >
        <span aria-hidden className="absolute left-1/2 size-[4px] -translate-x-1/2 rounded-full bg-[#2c2c2e]" style={{ top: bezel * 0.55 }} />
        <div className="relative overflow-hidden bg-paper" style={{ width: innerW, height: innerH }}>
          <ShotThenLive
            key={src}
            src={src}
            shot={`/examples/shots/desktop/${slug}.webp`}
            title={title}
            width={DESKTOP_WIDTH}
            height={DESKTOP_HEIGHT}
            scale={innerW / DESKTOP_WIDTH}
            priority
          />
        </div>
      </div>
      <div aria-hidden className="relative w-full rounded-b-[10px] border-b-2 border-[#9a9a9e] bg-[#cfcfd2] shadow-[0_30px_50px_-26px_rgba(22,21,19,0.55)]" style={{ height: base }}>
        <span className="absolute left-1/2 top-0 h-[38%] w-[14%] -translate-x-1/2 rounded-b-md bg-[#b4b4b8]" />
      </div>
    </div>
  );
}

type View = "phone" | "desktop";

/**
 * Front page: one of the example sites on a phone, Holm VVS first, or on a laptop. The switch above
 * picks the device and the counter and arrows under it step through all ten, the same controls as on
 * the examples page. Both sit snugly above and below whichever device is shown. On a laptop screen the
 * laptop grows a little past its column on both sides, and the switch and the arrows centre on it.
 */
export function PhonePreview({
  items,
  title,
  desktopTitle,
  labels,
  cta,
}: {
  items: Example[];
  title: string;
  desktopTitle: string;
  labels: { view: string; phone: string; desktop: string };
  cta?: string;
}) {
  const sel = useTrade();
  const n = items.length;
  const item = items[sel] ?? items[0];
  const height = useSyncExternalStore(onResize, phoneHeight, () => 560);
  const [view, setView] = useState<View>("phone");
  const boxRef = useRef<HTMLDivElement>(null);
  // The box's width, and on a laptop screen how much room there is to its right before the window edge.
  const [box, setBox] = useState({ w: 0, right: 0, wide: false });
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const measure = () => setBox({ w: el.clientWidth, right: window.innerWidth - el.getBoundingClientRect().right, wide: window.innerWidth >= 1024 });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  // Into the gap beside the heading, and on the right only as far as the base sticks out past the
  // screen, so the screen itself still ends on the same line as the header.
  const SPILL_LEFT = 32;
  const laptopW = box.wide ? Math.round(box.w + SPILL_LEFT + Math.min(48, Math.max(0, box.right - 16))) : Math.min(box.w, 560);
  const grow = view === "desktop" && box.wide;
  const go = (i: number) => setTrade(((i % n) + n) % n);
  usePreloadShots([sel - 1, sel + 1].map((i) => items[((i % n) + n) % n].slug), view);
  const arrow = "grid size-12 place-items-center border-2 border-ink bg-card transition hover:bg-brand";
  const tab = "flex h-11 items-center gap-2 px-4 font-cond text-lg font-bold uppercase tracking-wide transition";
  return (
    <div ref={boxRef} className="w-full">
      <div className="flex flex-col items-center" style={grow ? { width: laptopW, marginLeft: -SPILL_LEFT } : undefined}>
        <div role="group" aria-label={labels.view} className="mb-6 flex border-2 border-ink bg-card">
          {(["phone", "desktop"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={`${tab} ${view === v ? "bg-ink text-paper" : "text-ink hover:bg-brand"}`}
            >
              {v === "phone" ? (
                <svg aria-hidden viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                  <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
                  <path d="M10.5 18h3" strokeLinecap="round" />
                </svg>
              ) : (
                <svg aria-hidden viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                  <rect x="4" y="4.5" width="16" height="11" rx="1.5" />
                  <path d="M2 19.5h20" strokeLinecap="round" />
                </svg>
              )}
              {v === "phone" ? labels.phone : labels.desktop}
            </button>
          ))}
        </div>
        <div className="flex w-full items-center justify-center" style={view === "phone" ? { height } : undefined}>
          {view === "phone" ? (
            <IPhone src={item.href} slug={item.slug} title={`${title}: ${item.name}`} width={height / 2} height={height} />
          ) : (
            box.w > 0 && <Laptop src={item.href} slug={item.slug} title={`${desktopTitle}: ${item.name}`} width={laptopW} />
          )}
        </div>
        <div className="mt-6 flex items-center gap-2">
          <span aria-live="polite" className="mr-2 font-cond text-lg font-bold tabular-nums text-ink/50">
            <span className="sr-only">{item.name}, </span>
            {String(sel + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </span>
          <button type="button" onClick={() => go(sel - 1)} aria-label="Forrige eksempel" className={arrow}>
            <span aria-hidden className="text-xl">←</span>
          </button>
          <button type="button" onClick={() => go(sel + 1)} aria-label="Næste eksempel" className={arrow}>
            <span aria-hidden className="text-xl">→</span>
          </button>
        </div>
        {cta && (
          <a href={item.href} target="_blank" rel="noopener" className="mt-5 text-sm font-medium text-ink/70 underline underline-offset-4 transition hover:text-ink">
            {item.name} · {cta} ↗
          </a>
        )}
      </div>
    </div>
  );
}
