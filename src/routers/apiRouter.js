const express = require('express');
const { serveGameDetails } = require('../handlers/serveGameDetails.js');
const { serveProfession } = require('../handlers/serveProfession.js');

const createApiRouter = () => {
  const apiRouter = express.Router();
  apiRouter.get('/game', serveGameDetails);
  apiRouter.get('/profession', serveProfession);
  return apiRouter;
};

module.exports = { createApiRouter };
