import { Hero } from "@/components/hero";
import { Contact, Examples, Footer } from "@/components/sections";

/** Short on purpose: what we make and the price at once, what it looks like, and the two of us. */
export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Examples />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
