import type { Metadata } from "next";
import { ExamplesPage } from "@/components/pages";

export const metadata: Metadata = {
  title: "Eksempler",
  description: "Ti eksempler på hjemmesider til håndværkere, ét til hvert fag. Vælg dit eget, og klik rundt på siden.",
};

export default function Page() {
  return <ExamplesPage />;
}
