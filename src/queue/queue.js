const Queue = require('bull');

const queue = new Queue('user-updates', {
  redis: {
    port: process.env.REDIS_PORT, //6379,
    host: process.env.REDIS_HOST //'localhost',
  },
});

async function addJobGoogleInit(userId) {
  await queue.add('google-init', { userId });
  console.log(`Job for userId ${userId} added to the queue`);
}

module.exports = { addJobGoogleInit };
