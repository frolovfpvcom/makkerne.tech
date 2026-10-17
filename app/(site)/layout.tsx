import { LangProvider } from "@/components/lang";
import { Header } from "@/components/header";

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
