"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LangToggle, useLang } from "./lang";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="Makkerne – forside">
      {/* Peter's mark, traced from public/brand/makkerne-logo.png: a yellow M cut by a thin diagonal line. */}
      <svg viewBox="112 112 800 800" aria-hidden className="size-10 shrink-0">
        <rect x="112" y="112" width="800" height="800" className="fill-ink" />
        <path className="fill-brand" d="M778 125 482 499 308 283v453l79-98V511l52 60 349-438zM715 282 233 882l9 8 225-282 45 53 124-152v228h79V282z" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={`font-cond text-2xl font-extrabold uppercase tracking-tight ${light ? "text-paper" : ""}`}>Makkerne</span>
        <span className={`mt-0.5 whitespace-nowrap text-[11px] ${light ? "text-paper/55" : "text-ink/55"}`}>Hjemmesider til håndværkere</span>
      </span>
    </Link>
  );
}

export function Header() {
  const { t } = useLang();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // A new page from the menu always starts at the top, unless the link points at a section.
  useEffect(() => {
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  const links = [
    { href: "/#eksempler", label: t.nav.examples },
    { href: "/pris/", label: t.nav.price },
    { href: "/proces/", label: t.nav.process },
    { href: "/faq/", label: t.nav.faq },
  ];
  // The one call to action: the price calculator, on the front page or the price page.
  const ctaHref = pathname === "/" ? "#beregner" : "/pris/#beregner";
  const here = (href: string) => pathname.replace(/\/$/, "") === href.replace(/\/$/, "");

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/15 bg-paper">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-4 sm:px-8">
        <Logo />

        {/* The full menu only where it fits on one line; below that the menu button takes over. */}
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={here(l.href) ? "page" : undefined}
              className={`whitespace-nowrap px-3 py-2 font-cond text-base font-bold uppercase tracking-wide transition ${
                here(l.href) ? "text-ink underline decoration-2 underline-offset-8" : "text-ink/65 hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <LangToggle className="hidden sm:flex" />
          <Link href={ctaHref} className="hidden whitespace-nowrap bg-ink px-4 py-2 font-cond text-base font-bold uppercase tracking-wide text-paper transition hover:bg-ink/85 sm:block">
            {t.nav.cta}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? t.nav.menuClose : t.nav.menuOpen}
            aria-expanded={open}
            className="grid size-11 place-items-center border border-ink/30 lg:hidden"
          >
            <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden>
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink/15 px-4 pb-4 sm:px-8 lg:hidden">
          <ul>
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)} className="flex h-12 items-center border-b border-ink/10 font-cond text-xl font-bold uppercase">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between sm:hidden">
            <LangToggle />
            <Link href={ctaHref} onClick={() => setOpen(false)} className="bg-ink px-5 py-2.5 font-cond text-lg font-bold uppercase text-paper">
              {t.nav.cta}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
