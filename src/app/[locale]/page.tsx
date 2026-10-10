import { setRequestLocale } from "next-intl/server";
import { Rule } from "@/components/ui/rule";
import { Hero } from "@/components/home/hero";
import { SelectedWork } from "@/components/home/selected-work";
import { About } from "@/components/home/about";
import { Story } from "@/components/home/story";
import { AcademicHighlights } from "@/components/home/academic-highlights";
import { Interests } from "@/components/home/interests";
import { MoreWork, Technologies } from "@/components/home/more-work";

export const instant = false;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Rule />
      <SelectedWork />
      <Rule />
      <About />
      <Rule />
      <Story />
      <Rule />
      <AcademicHighlights />
      <Rule />
      <Interests />
      <Rule />
      <MoreWork />
      <Rule />
      <Technologies />
    </>
  );
}
