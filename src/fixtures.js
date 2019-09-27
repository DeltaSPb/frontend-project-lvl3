const getTitle = (doc) => doc.querySelector('title').textContent;
const getDescription = (doc) => doc.querySelector('description').textContent;
const getLink = (doc) => doc.querySelector('link').textContent;

export {
  getTitle,
  getDescription,
  getLink,
};
