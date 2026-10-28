const express = require('express');
const adminMiddleware = require('../7_middleware/adminMiddleware');
const {createProblem, updateProblem, deleteProblem, getProblemById, getAllProblems, solvedProblems, submittedProblems} = require('../5_request_handlers/problem_handlers');
const userMiddleware = require('../7_middleware/userMiddleware');
const problemRouter = express.Router();

problemRouter.post("/create", adminMiddleware, createProblem);
problemRouter.put("/update/:id", adminMiddleware, updateProblem);
problemRouter.delete("/delete/:id", adminMiddleware, deleteProblem);

problemRouter.get("/getById/:id", userMiddleware, getProblemById);
problemRouter.get("/getAll", userMiddleware, getAllProblems);
problemRouter.get("/solvedByUser", userMiddleware, solvedProblems); //first we need to create a codesubmission schema inorder to use this endpoint
problemRouter.get("/submitted/:pid", userMiddleware, submittedProblems);

module.exports = problemRouter