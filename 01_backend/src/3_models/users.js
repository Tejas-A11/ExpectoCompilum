const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    firstName : {
        type : String,
        required : true,
        minLength : 2,
        maxLength : 20
    },
    lastName : {
        type : String,
        minLength : 2,
        maxLength : 20
    },
    emailId : {
        type : String,
        required : true,
        trim : true,
        immutable : true,
        unique : true,
        lowercase : true
    },
    password : {
        type : String,
        required : true
    },
    age : {
        type : Number,
        min : 6,
        max : 80
    },
    role : {
        type : String,
        enum : ['user', 'admin'],
        default : 'user'
    },
    problemSolved : { //important format to populate the inner ids
        type : [
            {
                type : Schema.Types.ObjectId,
                ref : 'problem' 
            }
        ]
    }
}, {
    timestamps : true
})

userSchema.post("findOneAndDelete", async function(userInfo){ //post mean first above schema executes or updates and then this executes if we call User.findByIdAndDelete, which is mongoose format but internally it uses the monogoDB format of findOneAndDelete
    if(userInfo){
        await mongoose.model('submissions').deleteMany({userId : userInfo._id});
        //userId is a field in submission schema and userInfo is current user's info 
    }
})

const User = mongoose.model("user", userSchema);
module.exports = User;