const express = require('express');

const createApp = (config) => {
  const app = express();
  return app;
};


module.exports = { createApp };
