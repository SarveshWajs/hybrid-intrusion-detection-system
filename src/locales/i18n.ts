import { createI18n } from "vue-i18n";

interface LocaleMessages {
  [key: string]: Record<string, string>;
}

// 导入所有语言包
function loadLocaleMessages(): LocaleMessages {
  const locales: LocaleMessages = {};
  const files = import.meta.glob("./*.json", { eager: true });

  for (const path in files) {
    const matched = path.match(/\/([a-zA-Z]{2}(?:-[a-zA-Z]{2})?)\.json$/);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      locales[locale] = files[path] as Record<string, string>;
    }
  }

  return locales;
}

// Load all JSON messages
const localization = loadLocaleMessages();

const localLocale = JSON.parse(localStorage.getItem("localeStore") || "{}");

const i18n = createI18n({
  legacy: false,
  locale: localLocale.locale || "en", // default locale
  fallbackLocale: "en",
  messages: localization,
});

export default i18n;
