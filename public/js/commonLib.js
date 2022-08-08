const identity = (ele) => ele;

const xhrRequest = (req, onStatus, handler, altHandler = identity, body = '') => {
  const xhr = new XMLHttpRequest();

  xhr.onload = () => {
    if (xhr.status === onStatus) {
      return handler(xhr);
    }
    altHandler(xhr);
  };

  const contentType = req['content-type'] || 'application/x-www-form-urlencoded';
  xhr.open(req.method, req.url);
  xhr.setRequestHeader('content-type', contentType);
  xhr.send(body);
};

const resetForm = (selector) => {
  const form = document.querySelector(selector);
  form.reset();
};

const readFormData = (selector) => {
  const form = document.querySelector(selector);
  const formData = new FormData(form);
  const body = new URLSearchParams(formData);
  return body;
};

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
