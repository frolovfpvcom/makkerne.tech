import type { Metadata } from "next";
import { AboutPage } from "@/components/pages";

export const metadata: Metadata = {
  title: "Hvem er vi?",
  description: "Makkerne er Peter Frolov og Nikolaj Blond. Vi laver hjemmesider til håndværkere: gratis udkast før du betaler, vi skriver teksterne, og du taler med os.",
};

export default function Page() {
  return <AboutPage />;
}
