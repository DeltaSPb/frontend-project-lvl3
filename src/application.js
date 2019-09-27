import isURL from 'validator/lib/isURL';
import { watch } from 'melanke-watchjs';
import axios from 'axios';
import render from './renderers';

export default () => {
  const state = {
    input: {
      validity: true,
      isEmpty: true,
    },
    alert: {
      message: '',
    },
    feed: {
      currentFeed: null,
    },
  };

  watch(state, (change, action, value) => render({ change, value }), 1, true);

  const activeFeeds = new Set();

  const getFeed = (url) => {
    const newLink = `https://cors-anywhere.herokuapp.com/${url}`;
    axios.get(newLink)
      .then((response) => {
        const parser = new DOMParser();
        const html = parser.parseFromString(response.data, 'application/xml');
        state.feed.currentFeed = html;
      })
      .catch((error) => console.log(error));
  };

  const input = document.getElementById('basic-url');
  input.addEventListener('input', ({ target }) => {
    state.input.isEmpty = false;
    state.input.validity = isURL(target.value);
  });

  const button = document.querySelector('button.btn-primary');
  button.addEventListener('click', () => {
    const url = input.value;

    if (activeFeeds.has(url)) {
      state.alert.message = 'Ups! this feed is allready added!';
    }
    if (state.input.validity === true && !activeFeeds.has(url)) {
      state.alert.message = '';
      state.input.isEmpty = true;
      activeFeeds.add(url);
      getFeed(url);
    }
  });
};
