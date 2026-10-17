"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Example } from "@/lib/content";
import { useTrade } from "./trade-store";

const PHONE_WIDTH = 390;

function hideScrollbar(e: React.SyntheticEvent<HTMLIFrameElement>) {
  try {
    const doc = e.currentTarget.contentDocument;
    if (!doc) return;
    const style = doc.createElement("style");
    style.textContent = "html{scrollbar-width:none}html::-webkit-scrollbar{display:none}";
    doc.head.appendChild(style);
  } catch {}
}

/**
 * An iPhone: thin titanium edge, black bezel, big rounded corners, the Dynamic Island in a white
 * status bar, and the side buttons. The screen shows one of the example sites at real phone width
 * below the status bar, so the island never covers any of the site; it never takes clicks itself.
 */
export function IPhone({ src, title, width = 300, height = 600 }: { src: string; title: string; width?: number; height?: number }) {
  const bezel = Math.max(7, Math.round(width * 0.034));
  const radius = Math.round(width * 0.17);
  const screenW = width - bezel * 2;
  const screenH = height - bezel * 2;
  const statusBar = Math.round(width * 0.115);
  const scale = screenW / PHONE_WIDTH;
  // Which site has finished loading, so a newly picked trade never shows a blank screen.
  const [loaded, setLoaded] = useState<string | null>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  // The first site can finish loading before React is ready to hear about it; catch that case.
  useEffect(() => {
    const check = () => {
      try {
        const doc = frameRef.current?.contentDocument;
        if (doc?.readyState === "complete" && doc.location.href !== "about:blank") setLoaded(src);
      } catch {}
    };
    const id = setTimeout(check, 0);
    return () => clearTimeout(id);
  }, [src]);
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
          <div className="relative overflow-hidden bg-paper" style={{ height: screenH - statusBar }}>
            <iframe
              key={src}
              ref={frameRef}
              src={src}
              title={title}
              loading="lazy"
              tabIndex={-1}
              aria-hidden
              onLoad={(e) => {
                hideScrollbar(e);
                setLoaded(src);
              }}
              className="pointer-events-none absolute left-0 top-0 origin-top-left border-0 bg-paper"
              style={{ width: PHONE_WIDTH, height: (screenH - statusBar) / scale, transform: `scale(${scale})` }}
            />
            <div aria-hidden className={`absolute inset-0 grid place-items-center bg-paper transition-opacity duration-300 ${loaded === src ? "pointer-events-none opacity-0" : "opacity-100"}`}>
              <span className="h-1.5 w-16 animate-pulse bg-brand" />
            </div>
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
 * A smaller phone on small screens, and on a low laptop screen one that fits under the header.
 * Read straight from the window, so the hero has its final height on the first render after a
 * menu click and a jump to #eksempler lands in the right place.
 */
function phoneHeight() {
  if (window.innerWidth < 640) return 460;
  if (window.innerWidth >= 1024) return Math.max(460, Math.min(560, window.innerHeight - 200));
  return 540;
}

/**
 * Front page: the phone with one of the example sites on screen, Holm VVS until a trade is
 * picked in the examples below.
 */
export function PhonePreview({ items, title, cta }: { items: Example[]; title: string; cta?: string }) {
  const item = items[useTrade()] ?? items[0];
  const height = useSyncExternalStore(onResize, phoneHeight, () => 560);
  return (
    <div className="flex flex-col items-center">
      <IPhone src={item.href} title={`${title}: ${item.name}`} width={height / 2} height={height} />
      {cta && (
        <a href={item.href} target="_blank" rel="noopener" className="mt-5 text-sm font-medium text-ink/70 underline underline-offset-4 transition hover:text-ink">
          {item.name} · {cta} ↗
        </a>
      )}
    </div>
  );
}
