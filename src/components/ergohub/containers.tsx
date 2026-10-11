import { useTranslations } from "next-intl";
import { itemBody, lead, prose, subhead } from "@/components/thesis/case-section";
import { ErgoSection } from "@/components/ergohub/case-section";
import { code } from "@/lib/rich-text";

const images = ["api", "frontend"] as const;

export function Containers() {
  const t = useTranslations("ergohubPage.containers");

  return (
    <ErgoSection id="containers">
      <p className={lead}>{t("lead")}</p>

      <ul className="mt-10 border-t border-border md:mt-12">
        {images.map((key) => (
          <li
            key={key}
            className="grid gap-y-1.5 border-b border-border py-5 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] md:gap-x-10"
          >
            <h3 className={subhead}>{t(`items.${key}.title`)}</h3>
            <p className={`${itemBody} max-w-[620px]`}>{t(`items.${key}.body`)}</p>
          </li>
        ))}
      </ul>

      <div className={`${prose} mt-10 space-y-5 md:mt-12`}>
        <p>{t("compose")}</p>
        <p>{t.rich("tags", { code })}</p>
      </div>
    </ErgoSection>
  );
}
