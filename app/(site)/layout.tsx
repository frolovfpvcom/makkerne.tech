import { LangProvider } from "@/components/lang";
import { Header } from "@/components/header";
import type { Viewport } from "next";

// On Android phones the page reaches under the gesture bar instead of leaving a dark strip below it.
export const viewport: Viewport = {
  themeColor: "#0a0f1d",
  viewportFit: "cover",
};

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <LangProvider>
        <Header />
        {children}
      </LangProvider>
    </>
  );
}
