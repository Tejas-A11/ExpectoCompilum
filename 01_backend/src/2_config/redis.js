const {createClient} = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'cats-teeth-example-11822.db.redis.io',
        port: 19921
    }
});

module.exports = redisClient;