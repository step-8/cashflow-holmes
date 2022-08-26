const express = require('express');
const { serveGameDetails, saveGameDetails, loadGameDetails } = require('../handlers/serveGameDetails.js');
const { serveProfession } = require('../handlers/serveProfession.js');
const { playerInfo } = require('../handlers/apiHandlers.js');


const createApiRouter = (DB) => {
  const apiRouter = express.Router();
  apiRouter.get('/save/:name', saveGameDetails(DB));
  apiRouter.get('/load/:gameID/:name', loadGameDetails(DB));
  apiRouter.get('/game', serveGameDetails);
  apiRouter.get('/profession', serveProfession);
  apiRouter.get('/player-info', playerInfo);
  return apiRouter;
};

module.exports = { createApiRouter };
