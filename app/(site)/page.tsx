import { Hero } from "@/components/hero";
import { Comparison, Contact, ExamplePicker, Examples, Footer, Plans } from "@/components/sections";

/** What we make and the price at once, what it looks like for your trade, what it costs to keep, and the two of us. */
export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Examples />
        <ExamplePicker front />
        <Plans />
        <Comparison />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
