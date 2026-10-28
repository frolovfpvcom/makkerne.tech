import { LangProvider } from "@/components/lang";
import { Header } from "@/components/header";
import { CookieBox } from "@/components/cookie-box";
import type { Viewport } from "next";
import Script from "next/script";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";

// Only the draft guide uses these two; they are loaded for the site pages, not the examples.
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], weight: ["500", "600", "700"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400", "500", "700"] });

// On Android phones the page reaches under the gesture bar instead of leaving a dark strip below it.
export const viewport: Viewport = {
  themeColor: "#f4f0e8",
  viewportFit: "cover",
};

const COOKIEBOT = process.env.NEXT_PUBLIC_COOKIEBOT_ID;

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className={`contents ${jakarta.variable} ${jetbrains.variable}`}>
      <LangProvider>
        <Header />
        {children}
        {/* With a Cookiebot account (NEXT_PUBLIC_COOKIEBOT_ID) its official banner takes over; until then our own. */}
        {COOKIEBOT ? <Script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid={COOKIEBOT} data-blockingmode="auto" strategy="afterInteractive" /> : <CookieBox />}
      </LangProvider>
    </div>
  );
}
