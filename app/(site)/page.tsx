import { CinematicHero } from "@/components/cinematic-hero";
import { AboutSection } from "@/components/pages";
import { Contact, Examples, Footer } from "@/components/sections";

/** The name, then one of our sites and the price on a blue card, the ten examples, and the two of us. */
export default function Home() {
  return (
    <>
      <main>
        <CinematicHero />
        <Examples />
        <AboutSection withTitle />
        <Contact people={false} />
      </main>
      <Footer />
    </>
  );
}
