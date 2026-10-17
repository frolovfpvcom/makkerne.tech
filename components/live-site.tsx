"use client";

import { useEffect, useRef, useState } from "react";

function hideScrollbar(e: React.SyntheticEvent<HTMLIFrameElement>) {
  try {
    const doc = e.currentTarget.contentDocument;
    if (!doc) return;
    const style = doc.createElement("style");
    style.textContent = "html{scrollbar-width:none}html::-webkit-scrollbar{display:none}";
    doc.head.appendChild(style);
  } catch {}
}

const DESKTOP_WIDTH = 1280;
const PHONE_WIDTH = 390;

/**
 * Renders a page at desktop (or phone) width and scales it down to fit its box.
 * With `alwaysDesktop` it keeps the desktop layout however narrow the box gets.
 */
function useScaledFrame(alwaysDesktop = false) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: DESKTOP_WIDTH, h: 800, scale: 0.5 });
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const measure = () => {
      if (!box.clientWidth) return;
      const w = alwaysDesktop || box.clientWidth >= 500 ? DESKTOP_WIDTH : PHONE_WIDTH;
      const scale = box.clientWidth / w;
      setSize({ w, h: Math.ceil(box.clientHeight / scale), scale });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    return () => ro.disconnect();
  }, [alwaysDesktop]);
  return { boxRef, size };
}

/**
 * A real, running example site in a soft, rounded browser window with the usual browser buttons and a strip in
 * the example's own colour along the bottom. The preview never takes clicks or scroll; clicking it
 * opens the real site in a new tab.
 */
export function BrowserSite({ src, title, tryLabel, accent }: { src: string; title: string; tryLabel: string; accent: string }) {
  const { boxRef, size } = useScaledFrame();
  const path = src.replace(/^\//, "makkerne.tech/").replace(/\/$/, "");

  return (
    <div className="group overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-3 rounded-full bg-black/15" />
          <span className="size-3 rounded-full bg-black/15" />
          <span className="size-3 rounded-full bg-black/15" />
        </span>
        <a href={src} target="_blank" rel="noopener" className="min-w-0 flex-1 truncate rounded-full bg-[#f3f2ef] px-4 py-1.5 text-center text-sm text-black/55 transition hover:text-black">
          {path} ↗
        </a>
        {/* The usual browser buttons on the right: share, new tab, tabs. Just for looks. */}
        <span className="hidden items-center gap-4 text-black/45 sm:flex" aria-hidden>
          <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.5 9H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1.5" />
            <path d="M12 3v11M8.5 6.5 12 3l3.5 3.5" />
          </svg>
          <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
            <rect x="8" y="3.5" width="12.5" height="12.5" rx="2.5" />
            <path d="M16 19.5a1.5 1.5 0 0 1-1.5 1.5H6a2.5 2.5 0 0 1-2.5-2.5V10A1.5 1.5 0 0 1 5 8.5" />
          </svg>
        </span>
      </div>
      <div ref={boxRef} className="relative aspect-[9/14] overflow-hidden bg-paper sm:aspect-[16/10]">
        <iframe
          src={src}
          title={title}
          loading="lazy"
          tabIndex={-1}
          aria-hidden
          onLoad={hideScrollbar}
          className="pointer-events-none absolute left-0 top-0 origin-top-left border-0 bg-paper"
          style={{ width: size.w, height: size.h, transform: `scale(${size.scale})` }}
        />
        {/* Clicking anywhere on the picture opens the real site, just like the address bar. */}
        <a href={src} target="_blank" rel="noopener" className="absolute inset-0 flex items-end justify-center pb-6">
          <span className="rounded-xl bg-black/45 px-6 py-3 text-base font-semibold text-white/85 opacity-100 backdrop-blur-sm transition sm:opacity-0 sm:group-hover:opacity-100">
            {tryLabel} ↗
          </span>
        </a>
      </div>
      <div className="h-1.5" style={{ background: accent }} aria-hidden />
    </div>
  );
}

/**
 * The examples page's version: a raw, square screen with a thick black frame and a hard
 * offset shadow, like a sign on the workshop wall. Clicking it opens the real site.
 */
export function WorkshopScreen({ src, title, tryLabel }: { src: string; title: string; tryLabel: string }) {
  const { boxRef, size } = useScaledFrame(true);
  const path = src.replace(/^\//, "makkerne.tech/").replace(/\/$/, "");

  return (
    <div className="group border-[3px] border-ink bg-ink shadow-[10px_10px_0_0_var(--color-brand)]">
      <div className="flex items-center gap-3 px-3 py-2">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 bg-paper/25" />
          <span className="size-2.5 bg-paper/25" />
          <span className="size-2.5 bg-paper/25" />
        </span>
        <a href={src} target="_blank" rel="noopener" className="min-w-0 flex-1 truncate text-center font-mono text-xs text-paper/60 transition hover:text-paper">
          {path} ↗
        </a>
      </div>
      <div ref={boxRef} className="relative aspect-[16/10] overflow-hidden bg-paper">
        <iframe
          key={src}
          src={src}
          title={title}
          loading="lazy"
          tabIndex={-1}
          aria-hidden
          onLoad={hideScrollbar}
          className="pointer-events-none absolute left-0 top-0 origin-top-left border-0 bg-paper"
          style={{ width: size.w, height: size.h, transform: `scale(${size.scale})` }}
        />
        <a href={src} target="_blank" rel="noopener" className="absolute inset-0 flex items-end justify-center pb-6">
          <span className="bg-ink px-5 py-2.5 font-cond text-lg font-bold uppercase text-paper opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
            {tryLabel} ↗
          </span>
        </a>
      </div>
    </div>
  );
}
