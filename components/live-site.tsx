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

/** How long an example has to stay on screen before its live site starts loading behind the picture. */
const LIVE_DELAY = 700;

/**
 * An example as a screenshot first, which shows at once, with the real site loaded behind it a moment
 * later and faded in over it when it has finished loading. Flipping quickly through the examples
 * only ever loads the pictures; the live site waits until the visitor stays on one, and until the
 * page around it has loaded. `shot` must show the site at the same size as the frame.
 */
export function ShotThenLive({
  src,
  shot,
  title,
  width,
  height,
  scale,
  priority = false,
  onLive,
  interactive = false,
}: {
  src: string;
  shot: string;
  title: string;
  width: number;
  height: number;
  scale: number;
  priority?: boolean;
  onLive?: (win: Window | null) => void;
  /** On a phone the visitor scrolls inside the example with a finger. */
  interactive?: boolean;
}) {
  const [mount, setMount] = useState(false);
  const [live, setLive] = useState(false);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const start = () => (timer = setTimeout(() => setMount(true), LIVE_DELAY));
    if (document.readyState === "complete") start();
    else addEventListener("load", start, { once: true });
    return () => {
      removeEventListener("load", start);
      clearTimeout(timer);
    };
  }, []);
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- a screenshot made to the frame's exact size */}
      <img
        data-shot
        src={shot}
        alt=""
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className="absolute inset-0 size-full object-cover object-top"
      />
      {mount && (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          tabIndex={interactive ? 0 : -1}
          aria-hidden={interactive ? undefined : true}
          onLoad={(e) => {
            hideScrollbar(e);
            setLive(true);
            onLive?.(e.currentTarget.contentWindow);
          }}
          className={`${interactive ? "" : "pointer-events-none "}absolute left-0 top-0 origin-top-left border-0 bg-paper transition-opacity duration-300 ${live ? "opacity-100" : "opacity-0"}`}
          style={{ width, height, transform: `scale(${scale})` }}
        />
      )}
    </>
  );
}

/**
 * Fetches the pictures of the examples either side of the current one, so the arrows show them at
 * once: from the folder `wide`, or `narrow` on a phone.
 */
export function usePreloadShots(slugs: string[], wide: string, narrow = wide) {
  const key = slugs.join(" ");
  useEffect(() => {
    const dir = window.innerWidth < 640 ? narrow : wide;
    const load = () => key.split(" ").forEach((slug) => (new Image().src = `/examples/shots/${dir}/${slug}.webp`));
    if (document.readyState === "complete") load();
    else addEventListener("load", load, { once: true });
    return () => removeEventListener("load", load);
  }, [key, wide, narrow]);
}

export const DESKTOP_WIDTH = 1280;

/** A small chip on a phone preview: a finger moving up and down, so it is clear the page inside scrolls. */
export function ScrollHint({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute bottom-20 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink/85 px-3.5 py-2 text-[13px] font-semibold text-[#f7f3ea] shadow-lg [animation:hint-out_.6s_ease_5s_forwards]">
      <style>{`@keyframes hint-move{0%,100%{transform:translateY(5px)}50%{transform:translateY(-5px)}}@keyframes hint-out{to{opacity:0;visibility:hidden}}@media (prefers-reduced-motion:reduce){.hint-f{animation:none!important}}`}</style>
      <svg viewBox="0 0 24 24" className="hint-f size-5 [animation:hint-move_1.2s_ease-in-out_infinite]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 3v6M9 6l3-3 3 3M9 18l3 3 3-3M12 15v6" />
      </svg>
      {label}
    </span>
  );
}

export function useScaledFrame() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: DESKTOP_WIDTH, h: 800, scale: 0.5, ready: false });
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const measure = () => {
      if (!box.clientWidth) return;
      // A wide box shows the site as on a computer, a tall one (on phones) as on a phone.
      if (box.clientWidth > box.clientHeight) {
        const scale = box.clientWidth / DESKTOP_WIDTH;
        setSize({ w: DESKTOP_WIDTH, h: Math.ceil(box.clientHeight / scale), scale, ready: true });
      } else {
        // A phone: the example is shown at the box's own width, unscaled, so it fills the box exactly.
        setSize({ w: box.clientWidth, h: box.clientHeight, scale: 1, ready: true });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);
  return { boxRef, size };
}

/**
 * An example site in a soft, rounded browser window with the usual browser buttons and a strip in
 * the example's own colour along the bottom. The preview never takes clicks or scroll; clicking it
 * opens the real site in a new tab.
 */
export function BrowserSite({ src, slug, title, tryLabel, accent }: { src: string; slug: string; title: string; tryLabel: string; accent: string }) {
  const { boxRef, size } = useScaledFrame();
  const path = src.replace(/^\//, "makkerne.tech/").replace(/\/$/, "");

  return (
    <div className="group overflow-hidden rounded-xl border sm:rounded-2xl border-black/5 bg-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-2.5 px-3 py-2 sm:gap-4 sm:px-5 sm:py-3">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-black/15 sm:size-3" />
          <span className="size-2.5 rounded-full bg-black/15 sm:size-3" />
          <span className="size-2.5 rounded-full bg-black/15 sm:size-3" />
        </span>
        <a href={src} target="_blank" rel="noopener" className="min-w-0 flex-1 truncate rounded-full bg-[#f3f2ef] px-3 py-1 text-center text-xs text-black/55 sm:px-4 sm:py-1.5 sm:text-sm transition hover:text-black">
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
      <div ref={boxRef} className="relative aspect-[9/16] max-h-[78svh] overflow-hidden bg-paper sm:aspect-[16/10] sm:max-h-none">
        {size.ready && (
          <ShotThenLive
            key={size.w}
            src={src}
            shot={`/examples/shots/${size.w === DESKTOP_WIDTH ? "desktop" : "mobile"}/${slug}.webp`}
            title={title}
            width={size.w}
            height={size.h}
            scale={size.scale}
            priority
            interactive={size.w !== DESKTOP_WIDTH}
          />
        )}
        {size.ready && size.w !== DESKTOP_WIDTH && <ScrollHint label="Stryg for at scrolle i siden" />}
        {/* Clicking anywhere on the picture opens the real site, just like the address bar. */}
        <a href={src} target="_blank" rel="noopener" className="absolute inset-0 hidden items-end justify-center pb-6 sm:flex">
          {/* On a phone the label would cover the example's own call bar; the address bar and the button below say it instead. */}
          <span className="hidden rounded-xl bg-black/45 px-6 py-3 text-base font-semibold text-white/85 opacity-0 backdrop-blur-sm transition group-hover:opacity-100 sm:inline">
            {tryLabel} ↗
          </span>
        </a>
      </div>
      {/* On a phone the frame is for scrolling, so opening the real site has its own button. */}
      <a href={src} target="_blank" rel="noopener" className="flex items-center justify-center gap-2 py-3 text-[15px] font-semibold text-white sm:hidden" style={{ background: accent }}>
        {tryLabel} ↗
      </a>
      <div className="hidden h-1.5 sm:block" style={{ background: accent }} aria-hidden />
    </div>
  );
}
