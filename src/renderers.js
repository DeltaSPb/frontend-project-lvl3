/* eslint-disable no-param-reassign */
import last from 'lodash/last';
import i18 from './i18next';

const rerenderInputValidity = (value) => {
  const input = document.getElementById('basic-url');
  const toggle = {
    valid: () => input.classList.remove('is-invalid'),
    invalid: () => input.classList.add('is-invalid'),
  };
  return toggle[value]();
};

const inputCleaning = () => {
  const input = document.getElementById('basic-url');
  input.value = '';
};

const submitButtonAvailaility = (value) => {
  const button = document.querySelector('button.btn-primary');
  const toggle = {
    disabled: () => button.setAttribute('disabled', 'true'),
    enabled: () => button.removeAttribute('disabled'),
  };
  return toggle[value]();
};

const showAlert = (message) => {
  const alert = document.querySelector('.alert-danger');
  alert.textContent = message;
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
  i18('descriptionButton').then((translation) => {
    button.textContent = translation;
  });
  button.addEventListener('click', ({ target }) => {
    const title = target.parentNode.querySelector('.list-group-item-link').textContent;
    const description = target.parentNode.querySelector('.list-group-item-text').textContent;
    state.modalWindowContent = { title, description };
  });
  return button;
};

export const renderPosts = (url, elements, state) => {
  const posts = elements.map((element) => {
    const { title, description, link } = element;

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
  ul.prepend(...posts);
};

export const renderFeed = (state) => {
  const current = last(state.feeds);
  const { url, information, list } = current;
  const { description, title } = information;

  const div = document.createElement('div');
  div.classList.add('feed');
  div.innerHTML = `
    <h2>${title}</h2>
    <p>${description}</p>
    <ul class="list-group" id="${url}"></ul>`;

  const jumbotron = document.querySelector('.jumbotron');
  jumbotron.after(div);

  renderPosts(url, list, state);
};

const render = {
  inputValidity: (value) => rerenderInputValidity(value),
  inputValue: (value) => (value === 'empty' ? inputCleaning() : null),
  submitButton: (value) => submitButtonAvailaility(value),
  alertWindowMessage: (value) => showAlert(value),
};

export const renderElements = (change, value) => render[change](value);
