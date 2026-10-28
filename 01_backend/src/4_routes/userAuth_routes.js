const express = require('express');
const { register, login, logout, adminRegister, deleteProfile } = require('../5_request_handlers/user_handlers');
const userMiddleware = require('../7_middleware/userMiddleware'); //during logout, it checks whether current token is valid or not
const adminMiddleware = require('../7_middleware/adminMiddleware');

const authRouter = express.Router();

authRouter.post("/register", register)
authRouter.post("/login", login);
authRouter.post("/logout", userMiddleware, logout);
authRouter.post("/admin/register", adminMiddleware, adminRegister);
authRouter.delete("/delete", userMiddleware, deleteProfile)
//instead of creating new middleware to check admin, we can use userMiddleware in above api end point and then inside adminRegister, just check whether req.result.role is admin or not

// authRouter.get("/info", info);
module.exports = authRouter;