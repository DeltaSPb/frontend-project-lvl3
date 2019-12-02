/* eslint-disable no-param-reassign */
import last from 'lodash/last';
import { i18next } from './i18/i18next';


export const veiwTranslatedInterface = () => {
  const formTitle = document.querySelector('h1.form-title');
  const formSubmitButton = document.querySelector('button.btn-primary');
  const formInput = document.getElementById('basic-url');

  formTitle.textContent = i18next.t('title');
  formSubmitButton.textContent = i18next.t('submitButton');
  formInput.placeholder = i18next.t('inputPlaceholder');
};

const viewInputValidity = (value) => {
  const formInput = document.getElementById('basic-url');
  const toggle = {
    valid: () => formInput.classList.remove('is-invalid'),
    invalid: () => formInput.classList.add('is-invalid'),
  };
  return toggle[value]();
};

const disableInput = () => {
  const formInput = document.getElementById('basic-url');
  formInput.setAttribute('disabled', 'true');
};
const enableInput = () => {
  const formInput = document.getElementById('basic-url');
  formInput.removeAttribute('disabled');
};

const cleanInput = () => {
  const formInput = document.getElementById('basic-url');
  formInput.value = '';
};

const disableSubmitButton = () => {
  const formSubmitButton = document.querySelector('button.btn-primary');
  formSubmitButton.setAttribute('disabled', 'true');
};

const enableSummitButton = () => {
  const formSubmitButton = document.querySelector('button.btn-primary');
  formSubmitButton.removeAttribute('disabled');
};

const showSpinner = () => {
  const formSubmitButton = document.querySelector('button.btn-primary');
  const spinner = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
  formSubmitButton.innerHTML = `${spinner} ${formSubmitButton.textContent}`;
};

const removeSpinner = () => {
  const formSubmitButton = document.querySelector('button.btn-primary');
  formSubmitButton.innerHTML = `${formSubmitButton.textContent}`;
};

export const showAlert = (errorCode) => {
  const alert = document.querySelector('.alert-danger');
  const errorMessages = i18next.t(errorCode);
  alert.textContent = errorMessages;
  alert.classList.toggle('d-none');
};

export const renderModalWindow = (state) => {
  const modalWindow = document.getElementById('modalCenter');

  const modatWindowTitle = modalWindow.querySelector('.title');
  modatWindowTitle.textContent = state.modalWindowContent.title || '';

  const modalWindowDescriprion = modalWindow.querySelector('.description');
  modalWindowDescriprion.textContent = state.modalWindowContent.description || '';
};

const renderDescriptionButton = (state) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.classList.add('btn', 'btn-info', 'col-2');
  button.setAttribute('data-toggle', 'modal');
  button.setAttribute('data-target', '#modalCenter');
  button.textContent = i18next.t('descriptionButton');
  button.addEventListener('click', ({ target }) => {
    const title = target.parentNode.querySelector('.list-group-item-link').textContent;
    const description = target.parentNode.querySelector('.list-group-item-text').textContent;
    state.modalWindowContent = { title, description };
  });
  return button;
};

export const renderPosts = (url, posts, state) => {
  const list = posts.map((post) => {
    const { title, description, link } = post;

    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.innerHTML = `<div class=row>
      <a href=${link} class="list-group-item-link col-10">${title}</a>
      <p class="list-group-item-text" hidden>${description}</p>
    </div>`;

    const button = renderDescriptionButton(state);
    li.lastChild.append(button);
    return li;
  });
  const ul = document.getElementById(url);
  ul.prepend(...list);
};

export const renderFeed = (state) => {
  const currentFeed = last(state.feeds);
  const {
    url,
    description,
    title,
    posts,
  } = currentFeed;

  const div = document.createElement('div');
  div.classList.add('feed');
  div.innerHTML = `
    <h2>${title}</h2>
    <p>${description}</p>
    <ul class="list-group" id="${url}"></ul>`;

  const jumbotron = document.querySelector('.jumbotron');
  jumbotron.after(div);

  renderPosts(url, posts, state);
};

export const updateFormView = (formState) => {
  const { status, inputValidity } = formState;

  const statusTypes = {
    filling: (validity) => {
      enableInput();
      viewInputValidity(validity);
      return validity === 'valid' ? enableSummitButton() : disableSubmitButton();
    },
    sending: () => {
      disableInput();
      showSpinner();
      disableSubmitButton();
    },
    finished: () => {
      removeSpinner();
      cleanInput();
      enableInput();
    },
  };
  return statusTypes[status](inputValidity);
};
