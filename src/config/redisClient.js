// redisClient.js
import { createClient } from 'redis';

const redisClient = createClient({
  url: 'redis://localhost:6379' // hoặc đổi nếu dùng Docker/WSL port khác
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

await redisClient.connect(); // nếu dùng ES module
// hoặc redisClient.connect().then(() => console.log('Redis connected')); nếu dùng CommonJS

export default redisClient;
