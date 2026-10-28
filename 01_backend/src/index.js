require('dotenv').config(); //always on top because if something above this needs to access .env inside it then it cannot access as this will be below that 
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const main = require('./2_config/db');
const authRouter = require('./4_routes/userAuth_routes');
const problemRouter = require('./4_routes/problem_routes');
const redisClient = require('./2_config/redis');
const submitRouter = require('./4_routes/submit_routes');
app.use(express.json());
app.use(cookieParser());

app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);

const initialize = async()=>{
    try {
        await Promise.all([main(), redisClient.connect()]);
        console.log("both db connected");
        app.listen(process.env.PORT, ()=>{
            console.log("server is listening at port number " + process.env.PORT);
        })
    } catch (error) {
        console.log("error in index.js " + error.message);
    }
}

initialize();

// main()
// .then(()=>{
//     console.log("db connected");
//     app.listen(process.env.PORT, ()=>{
//     console.log("server is listening at port number " + process.env.PORT);
// })
// })
// .catch((err)=>console.log(err.message));