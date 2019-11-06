import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import getErrorMessageEng from './errors/EngErrorMessages';
import getErrorMessageRu from './errors/RuErrorMessages';


const toRussian = () => {
  document.querySelector('h1.form-title').textContent = 'RSS агрегатор';
  document.querySelector('button.btn-primary').textContent = 'Подписаться';
  document.getElementById('basic-url').placeholder = 'Введите адрес новостного источника';
};

const toEnglish = () => {
  document.querySelector('h1.form-title').textContent = 'RSS reader';
  document.querySelector('button.btn-primary').textContent = 'Subscribe';
  document.getElementById('basic-url').placeholder = 'Enter the feed URL';
};


export default (key, error) => i18next
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    debug: false,
    resources: {
      'en-EN': {
        translation: {
          interfece: toEnglish(),
          descriptionButton: 'Show description',
          error: getErrorMessageEng(error),
        },
      },
      'ru-RU': {
        translation: {
          interfece: toRussian(),
          descriptionButton: 'Читать',
          error: getErrorMessageRu(error),
        },
      },
    },
  }).then((translation) => translation(key));
