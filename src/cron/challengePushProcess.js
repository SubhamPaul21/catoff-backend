const cron = require('node-cron');
const Queue = require('bull');
const {
  getAllStartedChallenges,
  checkAndUpdateIsStartedChallenge,
} = require('../services/challenge.service');
const logger = require('../utils/logger');

const queue = new Queue('challenge-updates', {
  redis: {
    port: 6379,
    host: 'localhost',
  },
});

async function addJobGoogleFit(challengeId) {
  await queue.add('google-fit', { challengeId });
  console.log(`Job for userId ${challengeId} added to the queue`);
}

async function pushToChallengeQueue() {
  cron.schedule('*/10 * * * * *', async () => {
    console.log('Running cron job...');
    let challenges = await getAllStartedChallenges();

    challenges.forEach(async (challenge) => {
      await addJobGoogleFit(challenge.ChallengeID);
    });
  });
}

async function updateIsStartedIfStartDateReached() {
  logger.info('Starting Cron Job to update IsStarted If StartDate Reached');
  cron.schedule('*/10 * * * * *', async () => {
    await checkAndUpdateIsStartedChallenge();
  });
}

module.exports = { pushToChallengeQueue, updateIsStartedIfStartDateReached };
