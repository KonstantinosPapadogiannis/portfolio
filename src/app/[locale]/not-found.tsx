import { useLocale, useTranslations } from "next-intl";
import { getPathname } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const locale = useLocale();
  const t = useTranslations("notFound");

  return (
    <Container as="section" aria-labelledby="not-found-heading" className="py-16 md:py-24">
      <h1
        id="not-found-heading"
        className="text-[40px] font-bold leading-[1.06] tracking-[-0.02em] text-ink md:text-[64px]"
      >
        {t("title")}
      </h1>
      <p className="mt-4 max-w-[60ch] text-[17px] leading-[1.6] text-muted">{t("body")}</p>
      <div className="mt-8">
        <Button variant="primary" href={getPathname({ href: "/", locale })}>
          {t("home")}
        </Button>
      </div>
    </Container>
  );
}
