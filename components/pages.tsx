"use client";

import Image from "next/image";
import { TEAM } from "@/lib/content";
import { useLang } from "./lang";
import { Comparison, Contact, ExamplePicker, Faq, Footer, PageIntro, Plans, PriceSection, Process } from "./sections";

function Shell({ children, people = true }: { children: React.ReactNode; people?: boolean }) {
  return (
    <>
      <main>
        {children}
        <Contact people={people} />
      </main>
      <Footer />
    </>
  );
}

/** The menu's examples page: the trades down the left edge and the live site beside them. */
export function ExamplesPage() {
  return (
    <Shell>
      <ExamplePicker side />
    </Shell>
  );
}

export function PricePage() {
  const { t } = useLang();
  return (
    <Shell>
      <PageIntro title={t.pricing.title} lead={t.pricing.lead} />
      <PriceSection />
      <Plans />
      <Comparison />
      <Process />
    </Shell>
  );
}

export function ProcessPage() {
  const { t } = useLang();
  return (
    <Shell>
      <PageIntro title={t.process.title} lead={t.process.lead} />
      <Process hideHead />
      <Faq />
    </Shell>
  );
}

/** No big intro band here: the questions start right under the header, with the page's heading beside them. */
export function FaqPage() {
  return (
    <Shell>
      <Faq page />
    </Shell>
  );
}

/** Who we are: the two of us, how we work, and plainly that we are new. The photos sit here, so the contact band below skips them. */
export function AboutPage() {
  const { t } = useLang();
  const a = t.about;
  return (
    <Shell people={false}>
      <PageIntro title={a.title} lead={a.lead} />
      <AboutSection />
    </Shell>
  );
}

/** The two of us and how we work; on the about page under its intro, and at the bottom of the front page. */
export function AboutSection({ withTitle = false }: { withTitle?: boolean }) {
  const { t } = useLang();
  const a = t.about;
  return (
    <>
      {withTitle && (
        <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-8 sm:pt-24">
          <h2 className="text-balance font-cond text-4xl font-bold leading-[1.02] tracking-tight sm:text-[3.25rem]">{a.title}</h2>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-ink/70">{a.lead}</p>
        </div>
      )}
      <section id="om-os" className="scroll-mt-18 mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:gap-14 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-20">
        <div className="grid grid-cols-2 content-start gap-4 sm:gap-6">
          {TEAM.map((p) => (
            <figure key={p.email} className="min-w-0">
              <Image
                src={p.photo}
                alt={p.fullName}
                width={1342}
                height={2000}
                sizes="(min-width: 1024px) 200px, 45vw"
                preload
                className="aspect-[4/5] w-full rounded-2xl object-cover object-top"
              />
              <figcaption className="mt-3">
                <span className="block font-cond text-xl font-bold leading-tight">{p.fullName}</span>
                <a href={`mailto:${p.email}`} className="break-words text-sm text-ink/70 underline-offset-4 transition hover:text-ink hover:underline">
                  {/* On narrow phones the address breaks after the @, not mid-word. */}
                  {p.email.split("@")[0]}@<wbr />{p.email.split("@")[1]}
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
        <div>
          <h2 className="font-cond text-3xl font-bold tracking-tight leading-none sm:text-4xl">{a.howTitle}</h2>
          <ol className="mt-6 border-b border-ink/15">
            {a.how.map((h, i) => (
              <li key={h.t} className="grid grid-cols-[2.5rem_1fr] gap-x-3 border-t border-ink/15 py-5">
                <span className="font-cond text-xl font-bold tabular-nums text-ink/45" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-lg font-semibold">{h.t}</p>
                  <p className="mt-1 leading-relaxed text-ink/75">{h.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-xl border-l-4 border-brand pl-4 leading-relaxed text-ink/80">{a.honest}</p>
        </div>
      </section>
    </>
  );
}
