import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const formTitle = document.querySelector('h1.form-title');
const formSubmitButton = document.querySelector('button.btn-primary');
const formInput = document.getElementById('basic-url');

const interfaceLanguageSwitcher = {
  ru: () => {
    formTitle.textContent = 'RSS агрегатор';
    formSubmitButton.textContent = 'Подписаться';
    formInput.placeholder = 'Введите адрес новостного источника';
  },
  en: () => {
    formTitle.textContent = 'RSS reader';
    formSubmitButton.textContent = 'Subscribe';
    formInput.placeholder = 'Enter the feed URL';
  },
};

const errorMessages = {
  english: {
    'parsing error': 'Parsing error',
    double: 'This feed is allready added',
    400: 'Bad request',
    403: 'Access to the resource is denied',
    404: 'Page not found',
    408: 'Server request timeout',
    500: 'Internal Server Error',
    502: 'Received an incorrect response from the upstream server',
  },
  russian: {
    'parsing error': 'Ошибка при обработке данных',
    double: 'Вы уже подписаны на данный ресурс',
    400: 'Неверный запрос',
    403: 'Доступ к ресурсу отклонен',
    404: 'Страница не найдена',
    408: 'Время ожидания ответа от сервера истекло',
    500: 'Внутренняя ошибка сервера',
    502: 'Некорректный ответ сервера',
  },
};


i18next
  .on('languageChanged', (lng) => {
    interfaceLanguageSwitcher[lng]();
  })
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    debug: true,
    resources: {
      ru: {
        translation: {
          descriptionButton: 'Читать',
          error: errorMessages.russian,
        },
      },
      en: {
        translation: {
          descriptionButton: 'Show description',
          error: errorMessages.english,
        },
      },
    },
  });

export default i18next;
