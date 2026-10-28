const mongoose = require('mongoose')
const {Schema} = mongoose;

const submissionSchema = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'user',  //ref must match the model name which is first string after mongoose.model(<this one>), exact same 
        required : true
    },
    problemId : {
        type : Schema.Types.ObjectId,
        ref : 'problem',
        required : true
    },
    code : {
        type : String,
        required : true
    },
    language : {
        type : String,
        required : true,
        enum : ['c++', 'python', 'java', 'javascript']
    },
    status : {
        type : String,
        enum : ['pending', 'accepted', 'wrong', 'error'],
        default : 'pending'
    },
    runtime : {
        type : Number, //in milliseconds
        default : 0
    },
    memory : {
        type : Number, //in KB
        default : 0
    },
    errorMessage : {
        type : String,
        default : ''
    },
    testCasesPassed : {
        type : Number,
        default : 0
    },
    totalTestCases : {
        type : Number,
        default : 0
    }
}, {
    timestamps : true
})

submissionSchema.index({userId : 1, problemId : 1}); //1 means arrange in asceinding order and -1 means in descending order


const Submission = mongoose.model("submissions", submissionSchema);
module.exports = Submission;