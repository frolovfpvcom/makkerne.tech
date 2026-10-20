import { CinematicHero } from "@/components/cinematic-hero";
import { AboutSection } from "@/components/pages";
import { Comparison, Contact, ExamplePicker, Examples, Footer, Plans } from "@/components/sections";

/** The name, then one of our sites and the price on a blue card, the ten examples, your trade, what it costs to keep, and the two of us. */
export default function Home() {
  return (
    <>
      <main>
        <CinematicHero />
        <Examples />
        <ExamplePicker front />
        <Plans />
        <Comparison />
        <AboutSection withTitle />
        <Contact people={false} />
      </main>
      <Footer />
    </>
  );
}
