import { LangProvider } from "@/components/lang";
import { Header } from "@/components/header";
import { CookieBox } from "@/components/cookie-box";
import type { Viewport } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";

// Only the draft guide uses these two; they are loaded for the site pages, not the examples.
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], weight: ["500", "600", "700"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400", "500", "700"] });

// On Android phones the page reaches under the gesture bar instead of leaving a dark strip below it.
export const viewport: Viewport = {
  themeColor: "#0a0f1d",
  viewportFit: "cover",
};

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className={`contents ${jakarta.variable} ${jetbrains.variable}`}>
      <LangProvider>
        <Header />
        {children}
        <CookieBox />
      </LangProvider>
    </div>
  );
}
