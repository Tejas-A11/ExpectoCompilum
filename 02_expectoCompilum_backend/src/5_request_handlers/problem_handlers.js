//all api endPoints related to problem are handled here

const Problem = require("../3_models/problems");
const Submission = require("../3_models/submissions");
const User = require("../3_models/users");
const getLanguageId = require("../6_utils/getLangId");
const submitBatch = require("../6_utils/submitBatch");
const submitToken = require("../6_utils/submitToken");

const createProblem = async(req, res) => {
    // console.log(req.body);
    const {title, description, difficulty, tags, testCases, hiddenTestCases, boilerPlate, referenceSolution, problemCreator} = req.body;
    //before creating problem and sending details to backend, we first need to make sure that whether ref solution is correct for atleast visible test cases of not for each language given by admin
    try{
        for(const {language, code} of referenceSolution){
            const languageId = getLanguageId(language); 
            //sending batch submission for current language and code for all test cases at once
            const submissions = testCases.map(({input, output})=>({ //first we need to destructure input and output from the element of testCases where each element is an object there
                source_code : code,
                language_id : languageId,
                stdin : input,
                expected_output : output
            }));
            const submitResult = await submitBatch(submissions);  //this returns tokens array for the submission batch which needs to be sent again to judge0 api for status_id
            const resultTokens = submitResult.map((value) => value.token);
            const testResult = await submitToken(resultTokens); // this returns array of objects with token, language_id, status_id etc for each given input testCase

            for(const test of testResult){
                if(test.status_id !=3) return res.status(400).send("error occured while creating the problem")
            }  
        }
        //at this step, we can store the problem in db finally 
        const newProblem = await Problem.create({
            ...req.body, 
            problemCreator : req.result._id //? where is req.result present?? => from adminMiddleware
        });
        res.status(201).send("Problem created and saved successfully")
    }catch(error){
        res.status(400).send(error.message)
    }
}

const updateProblem = async(req, res) => {
    //same as crateProblem code because we need to see whether updated ref code is correct or not
    const {id} = req.params; //this is problemId
    const {title, description, difficulty, tags, testCases, hiddenTestCases, boilerPlate, referenceSolution, problemCreator} = req.body;

    try {
        if(!id) return res.status(400).send("missing problem_id");
        const dsaProblem = await Problem.findById(id);
        if(!dsaProblem) return res.status(400).send("this problem does not exists in the db");

        for(const {language, code} of referenceSolution){
            const languageId = getLanguageId(language);
            const submissions = testCases.map(({input, output})=>{
                return{
                    language_id : languageId,
                    source_code : code,
                    stdin : input,
                    expected_output : output
                }
            });

            const submitResult = await submitBatch(submissions);
            const resultTokens = submitResult.map((value)=>value.token);
            const testResult = await submitToken(resultTokens);
            
            for(const test of testResult){
                if(test.status_id!=3) return res.status(400).send("error occured while updating the problem")
            }
        }
        const updatedProblem = await Problem.findByIdAndUpdate(id, {...req.body}, {runValidators : true, new : true}); //new true means updatedProblem will be containing new updated problem instead of prev non updated problem
        res.status(200).send("problem updated successfully");

    } catch (error) {
        res.status(404).send("error in updateProblem request_handler", + error.message);
    }
}

const deleteProblem = async(req, res) => {
    const {id} = req.params;
    try {
        if(!id) return res.status(400).send("missing problem_id");
        const deletedProblem = await Problem.findByIdAndDelete(id);
        if(!deletedProblem) return res.status(400).send("problem is missing")
        res.status(200).send("problem deleted successfully");
    } catch (error) {
        res.status(500).send("error while deleting this problem");
    }
}

const getProblemById = async(req, res) => {
    const {id} = req.params;
    try {
        if(!id) return res.status(400).send("enter a valid problem id");
        const problem = await Problem.findById(id).select('_id title description difficulty tags testCases boilerPlate'); //sends only those fields inside select('')
        if(!problem) return res.status(404).send("problem not found");
        res.status(200).send(problem);
    } catch (error) {
        res.status(404).send("error in getting the problem => " + error.message)
    }
}

const getAllProblems = async(req, res) => {
    //dont directly fetch all of the problems in one fetch from db, we use pagination instead
    //we can also use filteration method 
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        // const allProblems = await Problem.find({}); //will return array of all problems
        // const allProblems = await Problem.find().skip((page-1)*limit).limit(limit).select('-hiddenTestCases -referenceSolution -problemCreator -__v -createdAt -updatedAt -description'); //returns all fields except those inside select('')  due to - sign before those fields
        const allProblems = await Problem.find({}).skip((page-1)*limit).limit(limit).select('_id title difficulty ') //both works, find() and find({})
        if(allProblems.length===0) return res.status(404).send("problems not found");
        res.status(200).send(allProblems);
    }catch(error){
        res.status(404).send(error.message);
    }
}

const solvedProblems = async(req, res) => {
    try {
        const user = await User.findById(req.result._id).populate({
            path : "problemSolved",
            select : "_id title difficulty tags"
        });
        res.status(201).send(user.problemSolved);
    } catch (error) {
        res.status(400).send("error fetching problems solved by this user => " + error.message);
    }
}

const submittedProblems = async(req, res) => {
    try {
        const userId = req.result._id; //this is user id
        const problemId = req.params.pid; //this is problem id whose submissions we need to return
        const problems = await Submission.find({userId, problemId}); //same key and value names so written once
        // i.e submissionSchema has userId and problemId as field
        if(problems.length == 0) return res.status(200).send("no submissions yet")
        res.status(200).send(problems);

    } catch (error) {
        res.status(500).send("internal server error => " + error.message);
    }
}

module.exports = {createProblem, updateProblem, deleteProblem, getProblemById, getAllProblems, solvedProblems, submittedProblems};