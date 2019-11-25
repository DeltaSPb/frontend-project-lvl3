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
        title: 'RSS агрегатор',
        submitButton: 'Подписаться',
        inputPlaceholder: 'Введите адрес новостного источника',
        descriptionButton: 'Читать',
        error: errorMessages.ru,
      },
    },
    en: {
      translation: {
        title: 'RSS reader',
        submitButton: 'Subscribe',
        inputPlaceholder: 'Enter the feed URL',
        descriptionButton: 'Show description',
        error: errorMessages.en,
      },
    },
  },
};


i18next.use(LanguageDetector);

export { i18next, initObj };
