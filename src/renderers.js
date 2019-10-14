import _ from 'lodash';

const inputValidation = () => {
  const input = document.getElementById('basic-url');
  input.classList.toggle('is-invalid');
};

const inputCleaning = () => {
  const input = document.getElementById('basic-url');
  input.value = '';
};

const showAlert = (message) => {
  const alert = document.querySelector('.alert-danger');
  alert.textContent = message;
  alert.classList.toggle('d-none');
};

const disableButton = (value) => {
  const button = document.querySelector('button.btn-primary');
  button.disabled = value;
};

export const renderModalWindow = (state) => {
  const modalWindow = document.getElementById('modalCenter');
  modalWindow.querySelector('.modal-title').textContent = state.modalWindow.title || '';
  modalWindow.querySelector('.modal-text').textContent = state.modalWindow.text || '';
};

const renderModalButton = (state) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.classList.add('btn', 'btn-info', 'col-2');
  button.setAttribute('data-toggle', 'modal');
  button.setAttribute('data-target', '#modalCenter');
  button.textContent = 'Show description';
  button.addEventListener('click', ({ target }) => {
    const text = target.parentNode.querySelector('.list-group-item-text').textContent;
    const title = target.parentNode.querySelector('.list-group-item-link').textContent;
    state.modalWindow = { title, text };
  });
  return button;
};

export const renderPosts = (url, elements, state) => {
  const ul = document.getElementById(url);
  elements.forEach((element) => {
    const { title, description, link } = element;

    const a = document.createElement('a');
    a.href = link;
    a.classList.add('list-group-item-link', 'col-10');
    a.textContent = title;

    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.append(a);

    const btn = renderModalButton(state);

    const p = document.createElement('p');
    p.classList.add('list-group-item-text');
    p.textContent = description;
    p.hidden = true;

    const div = document.createElement('div');
    div.classList.add('row');
    [a, p, btn].forEach((e) => div.append(e));

    li.append(div);

    ul.prepend(li);
  });
};

export const renderFeed = (state) => {
  const current = _.last(state.feeds);
  const { url, information, list } = current;
  const { description, title } = information;

  const div = document.createElement('div');
  div.setAttribute('class', 'feed');

  const h2 = document.createElement('h2');
  h2.textContent = title;

  const p = document.createElement('p');
  p.textContent = description;

  const ul = document.createElement('ul');
  ul.setAttribute('class', 'list-group');
  ul.id = url;

  [h2, p, ul].forEach((e) => div.append(e));
  const jumbotron = document.querySelector('.jumbotron');
  jumbotron.after(div);
  renderPosts(url, list, state);
};

const render = {
  validity: inputValidation,
  isEmpty: (value) => (value === true ? inputCleaning() : null),
  disabled: (value) => disableButton(value),
  message: (value) => showAlert(value),
};

export const renderElements = (change, value) => render[change](value);
