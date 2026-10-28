//all api endpoints related to submission or running a code are handled here

const Problem = require("../3_models/problems");
const Submission = require("../3_models/submissions");
const getLanguageId = require("../6_utils/getLangId");
const submitBatch = require("../6_utils/submitBatch");
const submitToken = require("../6_utils/submitToken");

const submitCode = async(req, res) => {
    try {
        const userId = req.result._id;
        const problemId = req.params.id;
        const {code, language} = req.body;
        if(!userId || !problemId || !code || !language) return res.status(400).send("few fields missing")

        //fetch the problem from database
        const problem = await Problem.findById(problemId);
        if(!problem) return res.status(400).send("problem not found")
            
        //first store this user input in db in pending state until it gets submitted or WA on judge0, because sometimes judge0 may crash and may not return anything, so userinput is gone, hence first store userinput so that we can process it whenever we want
        const submittedResult = await Submission.create({
            userId,
            problemId,
            code,
            language,
            totalTestCases : problem.hiddenTestCases.length
            // status : 'pending' status is by default pending so no need
        })
        //now submit it to judge0
        const languageId = getLanguageId(language);
        const submissions = problem.hiddenTestCases.map(({input, output})=>{
            return{
                source_code : code,
                language_id : languageId,
                stdin : input,
                expected_output : output
            }
        })

        const submitResult = await submitBatch(submissions);
        const resultTokens = submitResult.map((value)=>value.token);
        const testResults = await submitToken(resultTokens);

        //now update the submittedResult with testcasespassed and other fields
        let runtime = 0;
        let testCasesPassed = 0;
        let memory = 0;
        let errorMessage = null;
        let status = 'accepted'  //which is to be updated in submittedResult
        for(const test of testResults){
            if(test.status_id == 3){
                runtime += parseFloat(test.time);
                testCasesPassed++;
                memory = Math.max(memory, test.memory);
            }
            else{
                if(test.status_id == 4){
                    status = 'error';
                    errorMessage = test.stderr;
                }
                else{
                    status = 'wrong'
                    errorMessage = test.stderr;
                }
            }
        }

        submittedResult.runtime = runtime;
        submittedResult.testCasesPassed = testCasesPassed;
        submittedResult.memory = memory;
        submittedResult.errorMessage = errorMessage;
        submittedResult.status = status;

        // await Submission.findByIdAndUpdate(submittedResult._id, {...submittedResult}) or
        await submittedResult.save();

        //now check if problemId is present in user.problemsSolved, push if not present
        // here req.result means current user which is been saved to req.result in the userMiddleware
        if(!req.result.problemSolved.includes(problemId)){
            req.result.problemSolved.push(problemId);
            await req.result.save();
        }
        res.status(201).send(submittedResult);

    } catch (error) {
        res.status(500).send("error while submitting code => " + error.message);
    }
}

const runCode = async(req, res) => {
    //similar to submitCode 
    try {
        const userId = req.result._id;
        const problemId = req.params.id;
        const {code, language} = req.body;
        if(!userId || !problemId || !code || !language) return res.status(400).send("few fields missing")

        const problem = await Problem.findById(problemId);
        if(!problem) return res.status(400).send("problem not found")

        const languageId = getLanguageId(language);
        const submissions = problem.testCases.map(({input, output})=>{
            return{
                source_code : code,
                language_id : languageId,
                stdin : input,
                expected_output : output
            }
        })

        const submitResult = await submitBatch(submissions);
        const resultTokens = submitResult.map((value)=>value.token);
        const testResults = await submitToken(resultTokens);

        res.status(201).send(testResults);

    } catch (error) {
        res.status(500).send("error while submitting code => " + error.message);
    }
}

module.exports = {submitCode, runCode};