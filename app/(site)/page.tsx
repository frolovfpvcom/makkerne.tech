import { CraftHero } from "@/components/craft-hero";
import { AboutSection } from "@/components/pages";
import { Contact, Examples, Footer } from "@/components/sections";

/** The name, then one of our sites on a blue card beside the draft guide, the ten examples, and the two of us. */
export default function Home() {
  return (
    <>
      <main>
        <CraftHero />
        <Examples />
        <AboutSection withTitle />
        <Contact people={false} />
      </main>
      <Footer />
    </>
  );
}
