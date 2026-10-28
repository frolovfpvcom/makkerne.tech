"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { INTRO_DONE } from "./intro";
import { forgetLang, useLang } from "./lang";

// The answer is kept in this browser for a year, so the visitor is only asked once. Keeping the answer
// is itself strictly necessary, so it needs no consent.
const CONSENT_KEY = "makkerne-cookie-svar";
const YEAR = 365 * 24 * 60 * 60 * 1000;

function savedAnswer() {
  try {
    const v = JSON.parse(localStorage.getItem(CONSENT_KEY) || "null");
    return v && Date.now() - v.at < YEAR ? v.choice : null;
  } catch {
    return null;
  }
}

function saveAnswer(choice: "alle" | "noedvendige") {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ choice, at: Date.now() }));
  } catch {}
}

/**
 * Asks about cookies the first time; after an answer it stays away for a year.
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
    if (savedAnswer()) return;
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
      className="cookie-in fixed inset-x-3 bottom-3 z-[70] overflow-hidden rounded-xl border border-ink/10 bg-card text-ink shadow-[0_18px_50px_-12px_rgb(28_27_24/0.35)] sm:inset-x-auto sm:bottom-5 sm:left-5 sm:w-[24rem]"
    >
      <style>{`.cookie-in{animation:cookie-in .25s ease-out}@keyframes cookie-in{from{transform:translateY(12px);opacity:0}}@media (prefers-reduced-motion:reduce){.cookie-in{animation:none}}`}</style>
      <div className="flex items-center justify-between gap-3 border-l-[5px] border-brand px-4 pb-1 pt-4">
        <span id="cookie-label" className="font-cond text-2xl font-extrabold uppercase tracking-wide text-ink">
          {c.label}
        </span>
        <Link href="/privatliv/#cookies" className="text-[13px] text-ink/60 underline underline-offset-4 hover:text-ink">
          {c.more}
        </Link>
      </div>
      <p id="cookie-text" className="px-4 pb-4 pt-1 text-[15px] leading-relaxed text-ink/75">
        {c.text}
      </p>
      <div className="grid grid-cols-2 gap-2 px-4 pb-4">
        <button
          type="button"
          onClick={() => {
            forgetLang();
            saveAnswer("noedvendige");
            setAnswered(true);
          }}
          className="min-h-12 whitespace-nowrap rounded-md border border-ink/20 px-2 text-[14px] font-semibold text-ink hover:bg-ink/5"
        >
          {c.decline}
        </button>
        <button type="button" onClick={() => (saveAnswer("alle"), setAnswered(true))} className="min-h-12 rounded-md bg-ink px-3 text-[15px] font-bold text-[#f7f3ea] hover:bg-black">
          {c.accept}
        </button>
      </div>
    </div>
  );
}
