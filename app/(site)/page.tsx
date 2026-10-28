import { CalcStage, CraftHero } from "@/components/craft-hero";
import { DeliveryNote, OldVsNew, TapeMeasure, TradeBand } from "@/components/home-craft";
import { AboutSection } from "@/components/pages";
import { Contact, Examples, Footer, Process } from "@/components/sections";

/** The name, then one of our sites on a blue card beside the draft guide, the ten examples, and the two of us. */
export default function Home() {
  return (
    <>
      <main>
        <CraftHero />
        <TradeBand />
        <OldVsNew />
        <TapeMeasure />
        <CalcStage />
        <Examples />
        <DeliveryNote />
        <Process />
        <AboutSection withTitle />
        <Contact people={false} />
      </main>
      <Footer />
    </>
  );
}
