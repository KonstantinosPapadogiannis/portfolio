import { useLocale, useTranslations } from "next-intl";
import { TextLink } from "@/components/ui/text-link";
import { lead, prose } from "@/components/thesis/case-section";
import { OpenstackSection } from "@/components/openstack/case-section";
import { NetworkFigure } from "@/components/openstack/network-figure";
import { sectionIds } from "@/config/navigation";
import { getPathname } from "@/i18n/navigation";
import { code } from "@/lib/rich-text";

// The six sections of the OpenStack case study. The page is short on
// purpose: each paragraph explains the setup, the problem, a decision, the
// debugging or the result (docs/CONTENT_AND_VOICE.md).

// A term and its description, one per row: the label in a column from 768px,
// above the text below that.
const row =
  "grid gap-y-1 border-b border-border py-4 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-x-10";
const rowLabel = "text-[15px] leading-6 font-medium text-ink md:text-[16px] md:leading-[25px]";
const rowBody =
  "max-w-[620px] text-[15px] leading-6 text-pretty text-ink/80 md:text-[16px] md:leading-[25px]";

export function Environment() {
  const t = useTranslations("openstackPage.environment");

  return (
    <OpenstackSection id="environment">
      <p className={lead}>{t("p1")}</p>
      <p className={`${prose} mt-5`}>{t("p2")}</p>
    </OpenstackSection>
  );
}

const services = ["keystone", "glance", "nova", "neutron"] as const;
const serviceNames = { keystone: "Keystone", glance: "Glance", nova: "Nova", neutron: "Neutron" };

export function OpenstackLayer() {
  const t = useTranslations("openstackPage.openstack");

  return (
    <OpenstackSection id="openstack">
      <p className={lead}>{t("lead")}</p>
      {/* Service names are proper names, the same in both languages. */}
      <dl className="mt-6 max-w-[880px] border-t border-border md:mt-8">
        {services.map((key) => (
          <div key={key} className={row}>
            <dt lang="en" className={rowLabel}>
              {serviceNames[key]}
            </dt>
            <dd className={rowBody}>{t(`services.${key}`)}</dd>
          </div>
        ))}
      </dl>
      <p className={`${prose} mt-8 md:mt-10`}>{t("scope")}</p>
    </OpenstackSection>
  );
}

export function Network() {
  const t = useTranslations("openstackPage.network");

  return (
    <OpenstackSection id="network">
      <p className={lead}>{t.rich("p1", { code })}</p>
      <div className={`${prose} mt-5 space-y-5`}>
        <p>{t("p2")}</p>
        <p>{t.rich("p3", { code })}</p>
      </div>
      <NetworkFigure />
    </OpenstackSection>
  );
}

const steps = ["symptom", "trace", "cause", "fix"] as const;

export function Debugging() {
  const t = useTranslations("openstackPage.debugging");

  return (
    <OpenstackSection id="debugging">
      {/* One problem in the order it was worked through. */}
      <dl className="max-w-[880px] border-t border-border">
        {steps.map((key) => (
          <div key={key} className={row}>
            <dt className={rowLabel}>{t(`rows.${key}.label`)}</dt>
            <dd className={rowBody}>{t.rich(`rows.${key}.body`, { code })}</dd>
          </div>
        ))}
      </dl>
      <p className={`${prose} mt-8 md:mt-10`}>{t.rich("persistence", { code })}</p>
      <p className={`${lead} mt-8 md:mt-10`}>{t("lesson")}</p>
    </OpenstackSection>
  );
}

export function Application() {
  const t = useTranslations("openstackPage.application");

  return (
    <OpenstackSection id="application">
      <p className={lead}>{t("p1")}</p>
      <p className={`${prose} mt-5`}>{t.rich("p2", { code })}</p>
    </OpenstackSection>
  );
}

export function Reflection() {
  const t = useTranslations("openstackPage.reflection");
  const locale = useLocale();

  return (
    <OpenstackSection id="reflection">
      <p className={prose}>{t.rich("body", { code })}</p>
      <TextLink
        href={`${getPathname({ href: "/", locale })}#${sectionIds.moreWork}`}
        internal
        arrow="left"
        className="mt-12 text-[15px] text-ink hover:text-steel md:mt-14"
      >
        {t("back")}
      </TextLink>
    </OpenstackSection>
  );
}
