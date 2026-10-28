const mongoose = require('mongoose')
const {Schema} = mongoose;

const problemSchema = new Schema({
    title : {
        type : String, 
        required : true
    },
    description : {
        type : String,
        required : true
    },
    difficulty : {
        type : String,
        required : true,
        enum : ['easy', 'medium', 'hard']
    },
    tags : {
        type : String,
        required : true,
        enum : ['array', 'linkedlist', 'graph', 'tree', 'dp']
    },
    testCases : [
        {
            input : {
                type : String,
                required : true
            },
            output : {
                type : String,
                required : true
            },
            explanation : {
                type : String,
                required : true
            }
        }
    ],
    hiddenTestCases : [
         {
            input : {
                type : String,
                required : true
            },
            output : {
                type : String,
                required : true
            }
         }
    ],
    boilerPlate : [
        {
            language : {
                type : String,
                required : true
            },
            code : {
                type : String,
                required : true
            }
        }
    ],
    referenceSolution : [
        {
            language : {
                type : String,
                required : true
            },
            code : {
                type : String,
                required : true
            }
        }
    ],
    problemCreator : {
        type : Schema.Types.ObjectId, //objectId of 'user' collection as refered from below
        ref : 'user',  //this user refers to collection 'user' and is used when we use .populate("problemCreator") to get all information about problemCreator with above object id from the userSchema => see example 
        // const problem = await Problem.findById(id); => returns problemCreator as objectId only
        // {
        //     title: "Add Two Numbers",
        //     problemCreator: ObjectId("abc")
        // }
        // but , const problem = await Problem.findById(id).populate("problemCreator"); => returns problemCreator as object with information of that objectId from uses schema
        //     {
        //         title: "Add Two Numbers",
        //         problemCreator: {
        //             _id: "abc",
        //             name: "Tejas",
        //             email: "tejas@gmail.com"
        //         }
        //     }
        
        required : true
    }
}, {
    timestamps : true
})

const Problem = mongoose.model("problem", problemSchema); //model name is problem and it creates collection named problems automatically
// if model name were mongoose.model("Problem"), it would create collection named problems automatically, lowercase + pluralized form
module.exports = Problem;