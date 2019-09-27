import { getDescription, getTitle, getLink } from './fixtures';

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

const addFeed = (html) => {
  const { feedTitle = getTitle(html), feedDescription = getDescription(html) } = html;
  const div = document.createElement('div');
  div.setAttribute('class', 'feed');

  const h2 = document.createElement('h2');
  h2.textContent = feedTitle;
  const p = document.createElement('p');
  p.textContent = feedDescription;
  const hr = document.createElement('hr');
  const ul = document.createElement('ul');
  ul.setAttribute('class', 'link-group');

  const items = html.querySelectorAll('item');
  items.forEach((el) => {
    const { title = getTitle(el), link = getLink(el) } = el;
    const aEl = document.createElement('a');
    aEl.href = link;
    aEl.setAttribute('class', 'link');
    aEl.textContent = title;
    const liEl = document.createElement('li');
    liEl.setAttribute('class', 'link-item');
    liEl.append(aEl);
    ul.append(liEl);
  });

  [h2, p, hr, ul].forEach((e) => div.append(e));
  const jumbotron = document.querySelector('.jumbotron');
  jumbotron.after(div);
};

const render = {
  validity: inputValidation,
  isEmpty: (value) => (value === true ? inputCleaning() : null),
  message: (value) => showAlert(value),
  currentFeed: (html) => addFeed(html),
};

export default ({ change, value }) => render[change](value);
