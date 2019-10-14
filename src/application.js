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
      active: false,
      message: '',
    },
    modalWindow: {
      title: '',
      description: '',
    },
    feeds: [],
    updates: [],
  };

  watch(state, ['input', 'submitButton', 'alertWindow'], (change, action, value) => renderElements(change, value));
  watch(state, 'feeds', () => renderFeed(state), 1);
  watch(state, 'updates', (prop, action, value) => {
    const { url, newPosts } = value;
    renderPosts(url, newPosts);
  });

  watch(state, 'modalWindow', () => renderModalWindow(state));


  const activeFeeds = new Set();

  const getData = (url) => {
    const proxy = 'https://cors-anywhere.herokuapp.com';
    return axios.get(`${proxy}/${url}`).then((response) => response.data);
  };

  const parseData = (data) => {
    const parser = new DOMParser();
    return parser.parseFromString(data, 'application/xml');
  };

  const updateFeeds = (feeds) => {
    feeds.forEach((feed) => {
      const { url, list } = feed;
      getData(url)
        .then((data) => {
          const html = parseData(data);
          const updatedList = getList(html);
          const newPosts = _.differenceWith(updatedList, list, _.isEqual);
          const currentFeed = state.feeds.find((f) => f.url === url);
          if (!_.isEmpty(newPosts)) {
            state.updates.unshift({ url, newPosts });
            currentFeed.list = [...list, ...newPosts];
          }
        });
    });
  };

  const addFeed = (url) => {
    getData(url)
      .then((data) => {
        const html = parseData(data);
        const information = getInformation(html);
        const list = getList(html).reverse();
        state.feeds.push({ url, information, list });
      })
      .catch((error) => {
        state.alertWindow.message = error.message;
      });

    setInterval(updateFeeds, 5000, state.feeds);
  };

  const input = document.getElementById('basic-url');
  input.addEventListener('input', ({ target }) => {
    state.input.isEmpty = false;
    state.input.validity = isURL(target.value);
    state.submitButton.disabled = !isURL(target.value);
  });

  const button = document.querySelector('button.btn-primary');
  button.addEventListener('click', () => {
    const url = input.value;

    if (activeFeeds.has(url)) {
      state.alertWindow.message = 'Ups! this feed is allready added!';
    }
    if (state.input.validity === true && !activeFeeds.has(url)) {
      state.alertWindow.message = '';
      state.input.isEmpty = true;
      activeFeeds.add(url);
      addFeed(url);
    }
  });


  const closeModalButton = document.querySelector('[data-dismiss="modal"]');
  closeModalButton.addEventListener('click', () => {
    state.modalWindow = {};
  });
};
