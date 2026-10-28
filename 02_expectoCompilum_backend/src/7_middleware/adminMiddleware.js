//to check whether current user is admin or not, this is a middleware for admin/register api endpoint
const jwt = require('jsonwebtoken');
const User = require('../3_models/users');
const redisClient = require('../2_config/redis');
async function adminMiddleware(req, res, next){
    try {
        const token = req.cookies.token;
        if(!token) throw new Error("token is not present");
        const payload = jwt.verify(token, process.env.JWT_KEY);
        const {_id, role} = payload;
        if(!_id) throw new Error("invalid token")
        if(role !== 'admin') throw new Error("please login as admin first to perform this task")
        const result = await User.findById(_id);
        if(!result) throw new Error("this admin does not exists");
        const isBlocked = await redisClient.exists(`token:${token}`);
        if(isBlocked) throw new Error("this token is blocked");
        req.result = result; //this is used to extract id of admin who created problem in createProblem end point
        next();
    } catch (error) {
        res.status(401).send("error during adminMiddleware: " + error.message)
    }
}
module.exports = adminMiddleware;