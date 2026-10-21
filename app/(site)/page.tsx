import { CinematicHero } from "@/components/cinematic-hero";
import { AboutSection } from "@/components/pages";
import { Contact, Examples, Footer } from "@/components/sections";
import { DraftSection } from "@/components/draft-sheet";

/** The name, then one of our sites on a blue card, the draft guide, the ten examples, and the two of us. */
export default function Home() {
  return (
    <>
      <main>
        <CinematicHero />
        <DraftSection />
        <Examples />
        <AboutSection withTitle />
        <Contact people={false} />
      </main>
      <Footer />
    </>
  );
}
