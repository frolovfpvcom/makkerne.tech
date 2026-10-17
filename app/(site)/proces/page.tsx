import type { Metadata } from "next";
import { ProcessPage } from "@/components/pages";

export const metadata: Metadata = {
  title: "Sådan foregår det",
  description: "Fra første mail til færdig side: tre enkle trin uden lange møder eller tunge briefs.",
};

export default function Page() {
  return <ProcessPage />;
}
