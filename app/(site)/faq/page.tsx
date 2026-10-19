import type { Metadata } from "next";
import { FaqPage } from "@/components/pages";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Korte svar om pris, månedlig drift, tekster, domæne, hvem du taler med, og hvordan du stopper igen.",
};

export default function Page() {
  return <FaqPage />;
}
