"use client";

import { createContext, useContext, useEffect, useId, useState } from "react";
import { dict, type Dict, type Lang } from "@/lib/content";

const STORAGE_KEY = "makkerne-lang";

const LangContext = createContext<{ lang: Lang; t: Dict; setLang: (l: Lang) => void }>({
  lang: "da",
  t: dict.da,
  setLang: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("da");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- read the saved choice once after hydration
      if (saved === "en") setLangState("en");
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  };

  return <LangContext.Provider value={{ lang, t: dict[lang], setLang }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

/** The two flags, drawn as SVG so they look the same on every system (flag emoji do not show on Windows). */
function Flag({ lang }: { lang: Lang }) {
  const clip = useId();
  const size = "h-[14px] w-[21px] shrink-0";
  if (lang === "da")
    return (
      <svg aria-hidden viewBox="0 0 37 28" className={size} preserveAspectRatio="none">
        <rect width="37" height="28" fill="#C8102E" />
        <path d="M12 0h4v28h-4zM0 12h37v4H0z" fill="#fff" />
      </svg>
    );
  return (
    <svg aria-hidden viewBox="0 0 60 30" className={size} preserveAspectRatio="none">
      <clipPath id={clip}>
        <path d="M30 15h30v15zv15H0zH0V0zV0h30z" />
      </clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
      <path d="M0 0l60 30m0-30L0 30" stroke="#C8102E" strokeWidth="4" clipPath={`url(#${clip})`} />
      <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
      <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {(["da", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          aria-label={l === "da" ? "Dansk" : "English"}
          lang={l}
          className={`grid h-9 w-11 place-items-center transition ${lang === l ? "" : "opacity-40 hover:opacity-100"}`}
        >
          <Flag lang={l} />
        </button>
      ))}
    </div>
  );
}
