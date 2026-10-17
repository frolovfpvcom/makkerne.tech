import type { Metadata } from "next";
import { FaqPage } from "@/components/pages";

export const metadata: Metadata = {
  title: "Spørgsmål",
  description: "Svar på det, vi tit bliver spurgt om: prisen, tekst og billeder, domæne og hosting, og ændringer bagefter.",
};

export default function Page() {
  return <FaqPage />;
}
