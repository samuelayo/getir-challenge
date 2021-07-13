
const { Router } = require('express');
const { processFetch } = require('../controllers/recordController');

const recordRouter = new Router();

recordRouter.post('/', processFetch);

module.exports = recordRouter;