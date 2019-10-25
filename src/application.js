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


export default () => {
  const state = {
    input: {
      validity: true,
      isEmpty: true,
    },
    submitButton: {
      disabled: true,
    },
    alertWindow: {
      message: null,
    },
    modalWindowContent: {},
    feeds: [],
    updates: [],
  };

  watch(state, ['input', 'submitButton', 'alertWindow'], (change, action, value) => renderElements(change, value));
  watch(state, 'feeds', () => renderFeed(state), 1);
  watch(state, 'updates', (prop, action, value) => {
    const { url, newPosts } = value;
    renderPosts(url, newPosts, state);
  });
  watch(state, 'modalWindowContent', () => renderModalWindow(state));

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
        state.alertWindow.message = error.message;
      });
  };

  const input = document.getElementById('basic-url');
  input.addEventListener('input', ({ target }) => {
    state.input.isEmpty = false;
    state.input.validity = isURL(target.value);
    state.submitButton.disabled = !isURL(target.value);
    state.alertWindow.message = null;
  });

  const button = document.querySelector('button.btn-primary');
  button.addEventListener('click', () => {
    const url = input.value;
    const current = state.feeds.find((feed) => feed.url === url);

    if (!current) {
      state.alertWindow.message = null;
      state.input.isEmpty = true;
      state.submitButton.disabled = true;
      addFeed(url);
    } else {
      state.alertWindow.message = 'Ups! this feed is allready added!';
    }
  });

  const closeModalButton = document.querySelector('[data-dismiss="modal"]');
  closeModalButton.addEventListener('click', () => {
    state.modalWindowContent = {};
  });
};
