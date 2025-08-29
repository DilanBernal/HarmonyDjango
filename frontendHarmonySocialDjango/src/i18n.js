import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation';
import esDefault, { extra as esExtra } from './locales/es/translation';
import frDefault, { extra as frExtra } from './locales/fr/translation';

const es = { ...esDefault, ...(esExtra || {}) };
const fr = { ...frDefault, ...(frExtra || {}) };

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
