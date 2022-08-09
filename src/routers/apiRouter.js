const express = require('express');
const { serveGameDetails } = require('../handlers/serveGameDetails.js');

const createApiRouter = () => {
  const apiRouter = express.Router();
  apiRouter.get('/game', serveGameDetails);
  return apiRouter;
};

module.exports = { createApiRouter };
