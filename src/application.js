import isURL from 'validator/lib/isURL';
import { watch } from 'melanke-watchjs';
import axios from 'axios';
import _ from 'lodash';
import parseData from './parser';
import {
  veiwTranslatedInterface,
  showAlert,
  updateFormView,
  renderFeed,
  renderPosts,
  renderModalWindow,
} from './renderers';
import { i18next, initObj } from './i18/i18next';

export default () => {
  const state = {
    userLanguage: '',
    error: '',
    form: {
      status: '',
      inputValidity: '',
    },
    modalWindowContent: {},
    feeds: [],
    updates: [],
  };
  watch(state, 'form', () => updateFormView(state.form));
  watch(state, 'userLanguage', () => veiwTranslatedInterface(state.userLanguage));
  watch(state, 'error', () => showAlert(state.error));
  watch(state, 'feeds', () => renderFeed(state), 1);
  watch(state, 'updates', (prop, action, value) => {
    const { url, newPosts } = value;
    renderPosts(url, newPosts, state);
  });
  watch(state, 'modalWindowContent', () => renderModalWindow(state));

  const getParsedData = (url) => {
    const proxy = 'https://cors-anywhere.herokuapp.com';
    return axios.get(`${proxy}/${url}`).then(({ data }) => parseData(data));
  };

  const updateFeed = (url, feed) => {
    getParsedData(url)
      .then((data) => {
        const newPosts = _.differenceWith(data.posts, feed.posts, _.isEqual);
        const currentFeed = state.feeds.find((f) => f.url === url);
        if (!_.isEmpty(newPosts)) {
          state.updates = { url, newPosts };
          currentFeed.posts = [...feed.posts, ...newPosts];
        }
      })
      .catch((err) => console.log(err))
      .finally(setTimeout(() => updateFeed(url, feed), 5000));
  };

  const addFeed = (url) => {
    getParsedData(url)
      .then((data) => {
        const feed = { url, ...data };
        state.feeds = [...state.feeds, feed];
        updateFeed(url, feed);
      })
      .catch((error) => {
        const { response } = error;
        const typeOfError = response ? response.status : 'parsing error';
        state.error = `error.${typeOfError}`;
      })
      .finally(() => {
        state.form.status = 'finished';
      });
  };

  document.addEventListener('DOMContentLoaded', () => {
    i18next.init(initObj);
    const [detectedLanguage] = i18next.languages;
    state.userLanguage = detectedLanguage;
  });

  const formInput = document.getElementById('basic-url');
  formInput.addEventListener('input', ({ target }) => {
    const url = target.value;
    state.form.status = 'filling';
    state.form.inputValidity = isURL(url) ? 'valid' : 'invalid';
    state.error = '';
  });

  const form = document.querySelector('.form-group');
  form.addEventListener('submit', ({ target }) => {
    const formData = new FormData(target);
    const url = formData.get('url');
    const current = state.feeds.find((feed) => feed.url === url);

    if (!current) {
      addFeed(url);
      state.error = '';
      state.form.status = 'sending';
    } else {
      state.error = 'error.double';
    }
  });

  const closeModalButton = document.querySelector('[data-dismiss="modal"]');
  closeModalButton.addEventListener('click', () => {
    state.modalWindowContent = {};
  });
};
