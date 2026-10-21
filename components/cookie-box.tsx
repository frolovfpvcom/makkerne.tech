"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { INTRO_DONE } from "./intro";
import { forgetLang, useLang } from "./lang";

/**
 * Asks about cookies on every fresh load of the site; the answer is not kept, so the next load asks again.
 * On the front page it waits until the opening has played. INTRO_DONE can come twice on a computer (when the
 * card fills the screen, and when the phone has landed), so it waits for the last one before it comes in.
 */
export function CookieBox() {
  const { t } = useLang();
  const c = t.cookies;
  const pathname = usePathname();
  const [front] = useState(pathname === "/");
  const [shown, setShown] = useState(false);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    let id = setTimeout(() => setShown(true), front ? 6000 : 400);
    if (!front) return () => clearTimeout(id);
    // A computer with reduced motion has no opening and sends nothing.
    if (window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: reduce)").matches) {
      clearTimeout(id);
      id = setTimeout(() => setShown(true), 400);
    }
    const done = () => {
      clearTimeout(id);
      id = setTimeout(() => setShown(true), 900);
    };
    window.addEventListener(INTRO_DONE, done);
    return () => {
      clearTimeout(id);
      window.removeEventListener(INTRO_DONE, done);
    };
  }, [front]);

  if (!shown || answered) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-label"
      aria-describedby="cookie-text"
      className="cookie-in fixed inset-x-0 bottom-0 z-[70] border-t border-ink/25 bg-paper-2 font-sheet text-ink sm:inset-x-auto sm:bottom-5 sm:left-5 sm:w-[25rem] sm:border"
    >
      <style>{`.cookie-in{animation:cookie-in .25s ease-out}@keyframes cookie-in{from{transform:translateY(12px);opacity:0}}@media (prefers-reduced-motion:reduce){.cookie-in{animation:none}}`}</style>
      <div className="flex items-baseline justify-between border-b border-ink/15 px-4 py-2.5">
        <span id="cookie-label" className="font-mono text-[12px] font-medium uppercase tracking-[0.12em] text-brand">
          {c.label}
        </span>
        <Link href="/privatliv/#cookies" className="font-mono text-[12px] text-ink/70 underline underline-offset-4 hover:text-ink">
          {c.more}
        </Link>
      </div>
      <p id="cookie-text" className="px-4 py-3.5 text-[15px] leading-relaxed text-ink/85">
        {c.text}
      </p>
      <div className="grid grid-cols-2 border-t border-ink/15 pb-[env(safe-area-inset-bottom)]">
        <button
          type="button"
          onClick={() => {
            forgetLang();
            setAnswered(true);
          }}
          className="min-h-12 border-r border-ink/15 px-3 text-[15px] font-semibold text-ink hover:bg-ink/5"
        >
          {c.decline}
        </button>
        <button type="button" onClick={() => setAnswered(true)} className="min-h-12 bg-brand px-3 text-[15px] font-bold text-[#0a0f1d] hover:bg-brand-dark">
          {c.accept}
        </button>
      </div>
    </div>
  );
}
