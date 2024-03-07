const { Op } = require('sequelize');
const Player = require('../models/player.model');
const Challenge = require('../models/challenge.model');
const logger = require('../utils/logger');

exports.getOngoingChallengesByUserId = async (userId) => {
  logger.debug(
    `[OngoingChallengeService] Fetching ongoing challenges for user ID: ${userId}`
  );
  try {
    const ongoingChallenges = await Player.findAll({
      where: { UserID: userId },
      include: [
        {
          model: Challenge,
          where: {
            IsActive: true,
            StartDate: { [Op.lte]: new Date() },
            EndDate: { [Op.gte]: new Date() },
          },
          required: true,
        },
      ],
    });
    const challenges = ongoingChallenges.map((player) => player.Challenge);
    logger.info(
      `[OngoingChallengeService] Successfully fetched ongoing challenges for user ID: ${userId}`
    );
    return challenges;
  } catch (error) {
    logger.error(
      `[OngoingChallengeService] Error fetching ongoing challenges for user ID: ${userId}: ${error.message}`
    );
    throw error;
  }
};
