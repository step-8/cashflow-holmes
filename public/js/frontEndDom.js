const setAttribute = (tagEle, attributes) => {
  Object.entries(attributes).forEach(([key, value]) => {
    if (!value) {
      tagEle[key] = key;
      return;
    }
    tagEle[key] = value;
  });
};

const html = ([tag, attributes, ...content]) => {
  const tagEle = document.createElement(tag);

  setAttribute(tagEle, attributes);

  const newEle = content.map(ele => Array.isArray(ele) ? html(ele) : ele);
  newEle.forEach(ele => tagEle.append(ele));

  return tagEle;
};
