import { useTranslation } from "react-i18next";

const useAboutData = () => {
  const { t } = useTranslation();

  const introData = {
    title: (
      <span>
        {t("A")} <span className="text-brand">{t("Trusted Marketplace")}</span>{" "}
        {t("for Buying & Selling Businesses")}
      </span>
    ),
    subtitle: t("About Jusoor"),
    desc: t(
      "Jusoor is a Saudi-born platform built to make buying and selling businesses easier, safer, and more transparent. We connect serious buyers with verified sellers while handling all the sensitive steps in between."
    ),
    list: [
      t("Verified listings backed by commercial and financial documents"),
      t("Secure, step-by-step deal flow including E-NDA and payment verification"),
      t("End-to-end support across all major Saudi regions"),
    ],
  };

  const missionData = {
    title: (
      <span>
        {t("Our Mission is to Make Buying & Selling Businesses")}{" "}
        <span className="text-brand">{t("Trusted, and Fast")}</span>
      </span>
    ),
    subtitle: t("Our Mission"),
    desc: t(
      "We’re on a mission to empower individuals in Saudi Arabia to confidently buy and sell businesses through verified listings, secure payments, and step-by-step support — all in one platform."
    ),
    list: [
      {
        title: t("Transparency First"),
        desc: t("Verified data, real documents no hidden surprises."),
      },
      {
        title: t("Seamless Experience"),
        desc: t("Simple tools, clear steps smooth business transfers."),
      },
      {
        title: t("Built on Trust"),
        desc: t("Secure payments and admin support every step of the way."),
      },
    ],
  };

  const countData = [
    {
      title: t("Identity & CR Verification"),
      count: 100,
      sign: "%",
    },
    {
      title: t("Regions Covered Across KSA"),
      count: 10,
      sign: "+",
    },
    {
      title: t("Major Business Categories"),
      count: 8,
      sign: "+",
    },
  ];

  const whatweData = [
    {
      id: 1,
      icon: "/assets/icons/c-1.png",
      title: t("Verified Listings"),
      description: t(
        "Every business goes through document verification including CR and more ensuring legitimacy."
      ),
    },
    {
      id: 2,
      icon: "/assets/icons/c-2.png",
      title: t("Secure Deal Process"),
      description: t(
        "From submitting offers to finalizing deals, our step-by-step system protects both buyers and sellers."
      ),
    },
    {
      id: 3,
      icon: "/assets/icons/c-3.png",
      title: t("Built for Saudi Market"),
      description: t(
        "Tailored specifically for Saudi entrepreneurs with region-specific filters, documentation, and support."
      ),
    },
  ];

  return { introData, missionData, countData, whatweData };
};

export { useAboutData };
