import { Hero } from "@/components/hero";
import { Contact, Examples, Footer, PriceSection } from "@/components/sections";

/** Short on purpose: who we are, what it looks like, what it costs, and the two of us. */
export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Examples />
        <PriceSection />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
