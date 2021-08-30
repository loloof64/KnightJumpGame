import en from "./en";
import es from "./es";
import fr from "./fr";

const locale = (navigator.language || navigator.languages[0]).substring(0, 2);

const messages = {
  en,
  es,
  fr,
};

export default {
  legacy: false,
  locale: locale,
  fallbackLocale: "en",
  messages,
};
