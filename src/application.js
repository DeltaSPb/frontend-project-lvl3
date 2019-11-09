import isURL from 'validator/lib/isURL';
import { watch } from 'melanke-watchjs';
import axios from 'axios';
import _ from 'lodash';
import { getInformation, getList } from './fixtures';
import {
  renderElements,
  renderFeed,
  renderPosts,
  renderModalWindow,
} from './renderers';
import i18 from './i18next';

export default () => {
  const state = {
    inputValidity: '',
    inputValue: '',
    submitButton: '',
    alertWindowMessage: '',
    modalWindowContent: {},
    feeds: [],
    updates: [],
  };

  watch(state, ['inputValidity', 'inputValue', 'submitButton', 'alertWindowMessage'], (change, action, value) => renderElements(change, value));
  watch(state, 'feeds', () => renderFeed(state), 1);
  watch(state, 'updates', (prop, action, value) => {
    const { url, newPosts } = value;
    renderPosts(url, newPosts, state);
  });
  watch(state, 'modalWindowContent', () => renderModalWindow(state));

  const urlValidity = (url) => (isURL(url) ? 'valid' : 'invalid');

  const getData = (url) => {
    const proxy = 'https://cors-anywhere.herokuapp.com';
    return axios.get(`${proxy}/${url}`).then((response) => response.data);
  };

  const parseData = (data) => {
    const parser = new DOMParser();
    const parsedData = parser.parseFromString(data, 'application/xml');
    return { information: getInformation(parsedData), list: getList(parsedData) };
  };

  const updateFeed = (feed) => {
    const { url, list } = feed;
    getData(url)
      .then((data) => {
        const updatedList = parseData(data).list;
        const newPosts = _.differenceWith(updatedList, list, _.isEqual);
        const currentFeed = state.feeds.find((f) => f.url === url);
        if (!_.isEmpty(newPosts)) {
          state.updates = { url, newPosts };
          currentFeed.list = [...list, ...newPosts];
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setTimeout(() => updateFeed(feed), 5000));
  };

  const addFeed = (url) => {
    getData(url)
      .then((data) => {
        const feed = { url, ...parseData(data) };
        state.feeds = [...state.feeds, feed];
        updateFeed(feed);
      })
      .catch((error) => {
        const { response } = error;
        const typeOfError = response ? response.status : 'parsing error';
        state.alertWindowMessage = i18.t(`error.${typeOfError}`);
      });
  };

  const input = document.getElementById('basic-url');
  input.addEventListener('input', ({ target }) => {
    state.alertWindowMessage = '';
    state.inputValue = 'not empty';
    state.inputValidity = urlValidity(target.value);
    state.submitButton = state.inputValidity === 'valid' ? 'enabled' : 'disabled';
  });

  const form = document.querySelector('.form-group');
  form.addEventListener('submit', () => {
    const url = input.value;
    const current = state.feeds.find((feed) => feed.url === url);

    if (!current) {
      state.alertWindowMessage = '';
      state.inputValue = 'empty';
      state.submitButton = 'disabled';
      addFeed(url);
    } else {
      state.alertWindowMessage = i18.t('error.double');
    }
  });

  const closeModalButton = document.querySelector('[data-dismiss="modal"]');
  closeModalButton.addEventListener('click', () => {
    state.modalWindowContent = {};
  });
};
