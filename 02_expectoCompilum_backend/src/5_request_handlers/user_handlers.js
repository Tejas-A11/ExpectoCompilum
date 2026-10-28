//register, login, logout, info => these are request handlers , i.e middleware that handles the request

const valid = require("../6_utils/valid");
const bcrypt = require('bcrypt');
const User = require('../3_models/users');
const jwt = require('jsonwebtoken');
const redisClient = require("../2_config/redis");
const Submission = require("../3_models/submissions");
const register = async(req, res) => {
    try {
        valid(req.body); //any 'throw new Error 'inside this function will be caught by following catch block
        const {firstName, emailId, password} = req.body;

        //once input fields get validated, we need to store passwords in hash format in db
        const hashedPass = await bcrypt.hash(password, 10);
        req.body.password = hashedPass;

        //to prevent user from designating himself as admin even if he sent role : admin in body of post request
        req.body.role = "user";  //creates a new key 'role' if it is not present in schema and mutates the 'role' key with new value if it is present in userSchema

        const user = await User.create(req.body);
        const reply = {
            firstName : user.firstName,
            emailId : user.emailId,
            _id : user._id
        }
        //send token immediatly once user is registered
        const token = jwt.sign({_id : user._id, emailId : user.emailId, role : "user"}, process.env.JWT_KEY, {expiresIn : 60*60});
        res.cookie('token', token, {maxAge : 60*60*1000}); //maxAge is in milliseconds
        res.status(201).json({
            user : reply,
            message : "user created successfully"
        });
    } catch (error) {
        res.status(400).send("error in register middleware, " + error.message)
    }
}

const login = async(req, res) => {
    try {
        const {emailId, password} = req.body;
        if(!emailId) throw new Error("please enter email Id");
        if(!password) throw new Error("please enter password")

        const user = await User.findOne({emailId : emailId});
        const pass = await bcrypt.compare(password, user.password); 
        if(!pass) throw new Error("invalid credentials");
        const token = jwt.sign({_id : user._id,emailId : user.emailId, role : user.role}, process.env.JWT_KEY, {expiresIn : 60*60});
        res.cookie('token', token, {maxAge : 60*60*1000});
        const role = user.role;
        const reply = {
            firstName : user.firstName,
            emailId : user.emailId,
            _id : user._id,
            role //
        }
        if(role === 'user') res.status(201).json({user : reply, message : "USER logged in successfully"});
        if(role === 'admin') res.status(201).json({user : reply, message : "ADMIN logged in successfully"});
        
    } catch (error) {
        res.status(401).send("error in login middleware : unauthorized user, " + error.message);
    }
}

const logout = async(req, res) => {
    try {
        // valid token ? add it to redis,send null cookie and log user out : throw new Error
        const {token} = req.cookies;
        const payload = jwt.decode(token);

        //add to redis and set its expiry date as payloads expiry date
        await redisClient.set(`token:${token}`, "blocked");
        await redisClient.expireAt(`token:${token}`, payload.exp);

        //send null cookie
        res.cookie("token", null, {expires : new Date(Date.now())});
        if(req.result.role === 'user') res.send("user logged out successfully")
        if(req.result.role === 'admin') res.send("admin logged out successfully")
        
    } catch (error) {
        res.status(503).send("invalid token during logout" + error.message)
    }
}

const adminRegister = async(req, res)=>{
    try {
        valid(req.body);
        const {firstName, emailId, password} = req.body;
        
        const hashedPass = await bcrypt.hash(password, 10);
        req.body.password = hashedPass;

        // req.body.role = "admin"; dont hardcode it because orginal admin can register other person as admin as well as user also 

        const user = await User.create(req.body);

        // const token = jwt.sign({_id : user._id, emailId : user.emailId, role : "admin"}, process.env.JWT_KEY, {expiresIn : 60*60});
        // res.cookie('token', token, {maxAge : 60*60*1000}); 
        //we dont want newly created admin to take over the current admin's session, hence no cookies sent of new admin
        if(user.role === 'admin') res.status(201).send("admin created successfully");
        else res.status(201).send("user created successfully");
        
    } catch (error) {
        res.status(400).send("error in admin process, " + error.message)
    }
}

const deleteProfile = async(req, res) => {
    try {
        await User.findByIdAndDelete(req.result._id); //this executes the post function in userSchema
        // await Submission.deleteMany({userId : req.result._id}); //deletes all submissions with this userid
        //'userId' is a field in submissionSchema
        res.status(200).send("user deleted successfully");
    } catch (error) {
        res.status(500).send("internal server error => " + error.message)
    }
}

module.exports = {register, login, logout, adminRegister, deleteProfile};