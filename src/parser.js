export default (data) => {
  const parser = new DOMParser();
  const html = parser.parseFromString(data, 'application/xml');

  const information = {
    title: html.querySelector('title').textContent,
    description: html.querySelector('description').textContent,
    link: html.querySelector('link').textContent,
  };

  const list = [...html.querySelectorAll('item')].map((item) => ({
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    link: item.querySelector('link').textContent,
  }));

  return { information, list };
};
