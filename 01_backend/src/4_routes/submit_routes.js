const express = require('express');
const userMiddleware = require('../7_middleware/userMiddleware');
const {submitCode, runCode} = require('../5_request_handlers/submit_handlers');
const submitRouter = express.Router();

submitRouter.post("/submit/:id", userMiddleware, submitCode);
submitRouter.post("/run/:id", userMiddleware, runCode);

module.exports = submitRouter;