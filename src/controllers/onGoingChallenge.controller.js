const playerService = require('../services/onGoingChallenge.service');
const logger = require('../utils/logger');

exports.getOngoingChallengesByUser = async (req, res) => {
  const { userId } = req.params;
  logger.debug(
    `[onGoingChallengeController] Fetching ongoing challenges for user ID: ${userId}`
  );
  try {
    const ongoingChallenges =
      await playerService.getOngoingChallengesByUserId(userId);
    logger.debug(
      `[onGoingChallengeController] Successfully fetched ongoing challenges for user ID: ${userId}`
    );
    res.status(200).json(ongoingChallenges);
  } catch (error) {
    logger.error(
      `[onGoingChallengeController] Error fetching ongoing challenges for user ID: ${userId}, Error: ${error.message}`
    );
    res.status(500).json({ message: error.message });
  }
};
