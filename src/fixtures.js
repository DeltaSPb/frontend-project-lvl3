const getTitle = (doc) => doc.querySelector('title').textContent;
const getDescription = (doc) => doc.querySelector('description').textContent;
const getLink = (doc) => doc.querySelector('link').textContent;

export const getInformation = (doc) => ({
  title: getTitle(doc),
  description: getDescription(doc),
  link: getLink(doc),
});

export const getList = (doc) => [...doc.querySelectorAll('item')].map((item) => getInformation(item));
