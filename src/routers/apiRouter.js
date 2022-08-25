const express = require('express');
const { serveGameDetails, saveGameDetails, loadGameDetails } = require('../handlers/serveGameDetails.js');
const { serveProfession } = require('../handlers/serveProfession.js');
const { playerInfo } = require('../handlers/apiHandlers.js');


const createApiRouter = (config) => {
  const apiRouter = express.Router();
  apiRouter.get('/save/:gameID/:name', saveGameDetails(config.GAMES));
  apiRouter.get('/load/:gameID/:name', loadGameDetails(config.GAMES));
  apiRouter.get('/game', serveGameDetails);
  apiRouter.get('/profession', serveProfession);
  apiRouter.get('/player-info', playerInfo);
  return apiRouter;
};

module.exports = { createApiRouter };
