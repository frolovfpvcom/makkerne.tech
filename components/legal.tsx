"use client";

import { useLang } from "./lang";
import { Footer, PageIntro } from "./sections";

/**
 * Shell for the terms and privacy pages: plain reading column, a short "in brief" box on top,
 * and the sections listed on the left on wide screens so they are easy to jump between.
 */
export function LegalPage({
  title,
  lead,
  updated,
  brief,
  sections,
  children,
}: {
  title: string;
  lead: string;
  updated: string;
  brief: string[];
  sections: { id: string; title: string }[];
  children: React.ReactNode;
}) {
  const { t } = useLang();
  return (
    <>
      <main>
        <PageIntro title={title} lead={lead} />
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-8 sm:py-16 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="Indhold" className="hidden lg:block">
            <ol className="sticky top-28 space-y-2 border-l-2 border-ink/15 pl-4 text-sm text-ink/70">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="hover:text-ink hover:underline">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <article className="min-w-0 max-w-[68ch] text-[17px] leading-relaxed">
            {t.legal.danishOnly && <p className="mb-8 border-l-4 border-ink/30 pl-4 text-ink/75">{t.legal.danishOnly}</p>}
            <div className="border-2 border-ink bg-card p-5 sm:p-7">
              <h2 className="font-cond text-2xl font-extrabold uppercase">Kort fortalt</h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-5">
                {brief.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
            {children}
            <p className="mt-14 border-t border-ink/15 pt-5 text-sm text-ink/60">Senest opdateret {updated}.</p>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}

export function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-12 scroll-mt-28">
      <h2 className="text-balance font-cond text-3xl font-extrabold uppercase leading-none sm:text-4xl">{title}</h2>
      <div className="mt-4 space-y-4 [&_a]:underline [&_a]:underline-offset-4 [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">{children}</div>
    </section>
  );
}

/** Something only Peter and Nikolaj can fill in. Marked so it is easy to spot on the page and to find in the code. */
export function Udfyld({ children }: { children: React.ReactNode }) {
  return <mark className="bg-brand/50 px-0.5 text-ink">[{children}]</mark>;
}
