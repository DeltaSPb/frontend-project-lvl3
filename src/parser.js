export default (data) => {
  const parser = new DOMParser();
  const html = parser.parseFromString(data, 'application/xml');

  const title = html.querySelector('title').textContent;
  const description = html.querySelector('description').textContent;
  const posts = [...html.querySelectorAll('item')].map((item) => ({
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    link: item.querySelector('link').textContent,
  }));
  return { title, description, posts };
};
