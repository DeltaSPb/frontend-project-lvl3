import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import errorMessages from './errorMessages';

const initObj = {
  fallbackLng: 'en',
  load: 'languageOnly',
  whitelist: ['en', 'ru'],
  debug: false,
  resources: {
    ru: {
      translation: {
        descriptionButton: 'Читать',
        error: errorMessages.ru,
      },
    },
    en: {
      translation: {
        descriptionButton: 'Show description',
        error: errorMessages.en,
      },
    },
  },
};


i18next.use(LanguageDetector);

export { i18next, initObj };
