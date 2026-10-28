//to validate incoming tokens during logout specially

const jwt = require('jsonwebtoken');
const User = require('../3_models/users');
const redisClient = require('../2_config/redis');
const userMiddleware = async(req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) throw new Error("token is not present")

        //1//check validity of token by using jwt
        const payload = jwt.verify(token, process.env.JWT_KEY) ;
        const {_id} = payload;

        //2//what if someone deleted user with this _id?
        if(!_id) throw new Error("invalid token"); 
        const result = await User.findById(_id);
        if(!result) throw new Error("user does not exists");

        //3//now check whether this user with token is present in blocklist of redis or not
        const isBlocked = await redisClient.exists(`token:${token}`);
        if(isBlocked) throw new Error("this token is blocked");
        req.result = result; //why is it used?? => to send information of valid user for GET requests from the middleware to final request handler
        next();
    } catch (error) {
        res.status(401).send("error during  userMiddleware : " + error.message);
    }
}
module.exports = userMiddleware;