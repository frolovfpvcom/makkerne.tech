"use client";

import { useLang } from "./lang";
import { Comparison, Contact, ExamplePicker, Faq, Footer, PageIntro, PriceSection, Process } from "./sections";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>
        {children}
        <Contact />
      </main>
      <Footer />
    </>
  );
}

/** The menu's examples page: the trade tabs and the live site, as on the front page before the row. */
export function ExamplesPage() {
  return (
    <Shell>
      <ExamplePicker />
    </Shell>
  );
}

export function PricePage() {
  const { t } = useLang();
  return (
    <Shell>
      <PageIntro title={t.pricing.title} lead={t.pricing.lead} />
      <PriceSection hideHead />
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

export function FaqPage() {
  const { t } = useLang();
  return (
    <Shell>
      <PageIntro title={t.faq.title} />
      <Faq hideHead />
    </Shell>
  );
}
