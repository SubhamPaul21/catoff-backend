const Queue  = require('bull')

const queue = new Queue('user-updates', {
    redis: {
      port: 6379,
      host: 'localhost',
    },
  });


async function addJobGoogleInit(userId) {
    await queue.add('google-init', { userId });
    console.log(`Job for userId ${userId} added to the queue`);
  }

module.exports = {addJobGoogleInit}