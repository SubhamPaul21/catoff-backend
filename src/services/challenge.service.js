const Challenge = require('../models/challenge.model');
const { Op } = require('sequelize');
const { getGameIds } = require('./game.service');
const { getUserIds } = require('./user.service');
const logger = require('../utils/logger');

const createChallenge = async (challengeData) => {
  logger.debug('[ChallengeService] Attempting to create challenge');
  try {
    const challenge = await Challenge.create(challengeData);
    logger.info('[ChallengeService] Challenge created successfully');
    return challenge;
  } catch (error) {
    logger.error(
      `[ChallengeService] Error creating challenge: ${error.message}`
    );
    throw error;
  }
};

const getChallenge = async (id) => {
  logger.debug(`[ChallengeService] Attempting to get challenge with ID: ${id}`);
  try {
    const challenge = await Challenge.findByPk(id);
    if (challenge) {
      logger.info('[ChallengeService] Challenge retrieved successfully');
      return challenge;
    } else {
      logger.warn('[ChallengeService] Challenge not found');
      return null;
    }
  } catch (error) {
    logger.error(
      `[ChallengeService] Error getting challenge: ${error.message}`
    );
    throw error;
  }
};

const updateChallenge = async (id, challengeData) => {
  logger.debug(
    `[ChallengeService] Attempting to update challenge with ID: ${id}`
  );
  try {
    const [updated] = await Challenge.update(challengeData, {
      where: { ChallengeID: id },
    });
    if (updated) {
      logger.info('[ChallengeService] Challenge updated successfully');
      return updated;
    } else {
      logger.warn('[ChallengeService] Challenge not found for update');
      return null;
    }
  } catch (error) {
    logger.error(
      `[ChallengeService] Error updating challenge: ${error.message}`
    );
    throw error;
  }
};

const deleteChallenge = async (id) => {
  logger.debug(
    `[ChallengeService] Attempting to delete challenge with ID: ${id}`
  );
  try {
    const deleted = await Challenge.destroy({ where: { ChallengeID: id } });
    if (deleted) {
      logger.info('[ChallengeService] Challenge deleted successfully');
      return deleted;
    } else {
      logger.warn('[ChallengeService] Challenge not found for deletion');
      return null;
    }
  } catch (error) {
    logger.error(
      `[ChallengeService] Error deleting challenge: ${error.message}`
    );
    throw error;
  }
};

const searchChallenge = async (searchTerm, limit, page) => {
  logger.debug(
    `[ChallengeService] Searching challenges with term: ${searchTerm}`
  );
  const offset = (page - 1) * limit;
  try {
    let userIds = await getUserIds(searchTerm);
    let gameIDs = await getGameIds(searchTerm);
    let searchNum = isNaN(searchTerm) ? null : parseInt(searchTerm, 10);
    const challenges = await Challenge.findAll({
      where: {
        [Op.or]: [
          { ChallengeID: searchNum },
          { ChallengeName: { [Op.iLike]: `%${searchTerm}%` } },
          { ChallengeCreator: { [Op.in]: userIds } },
          { GameID: { [Op.in]: gameIDs } },
        ],
      },
      offset,
      limit,
    });
    logger.info('[ChallengeService] Challenges search completed');
    return challenges;
  } catch (error) {
    logger.error(
      `[ChallengeService] Error searching challenges: ${error.message}`
    );
    throw error;
  }
};

const getOngoingChallenges = async (type, page, limit) => {
  logger.debug(
    `[ChallengeService] Getting ongoing challenges of type: ${type}, page: ${page}`
  );
  try {
    const offset = (page - 1) * limit;
    let challenges;
    if (type === 'all') {
      challenges = await Challenge.findAll({
        where: { IsActive: true },
        order: [['createdAt', 'DESC']],
        offset,
        limit,
      });
    } else {
      let gameIDs = await getGameIds(type);
      challenges = await Challenge.findAll({
        where: {
          IsActive: true,
          GameID: { [Op.in]: gameIDs },
        },
        order: [['createdAt', 'DESC']],
        offset,
        limit,
      });
    }
    logger.info('[ChallengeService] Ongoing challenges retrieved successfully');
    return challenges;
  } catch (error) {
    logger.error(
      `[ChallengeService] Error getting ongoing challenges: ${error.message}`
    );
    throw error;
  }
};

const incrementChallengeParticipant = async (id) => {
  try {
    const challenge = await Challenge.findByPk(id);
    if (!challenge) {
      throw new Error('Challenge not found');
    }
    await challenge.increment('CurrentParticipants');
    logger.info(
      '[ChallengeService] current participant incremented succesfully'
    );
    return true;
  } catch (error) {
    logger.error(
      `[ChallengeService] Error updating the challenge: ${error.message}`
    );
    throw error;
  }
};

module.exports = {
  createChallenge,
  getChallenge,
  updateChallenge,
  deleteChallenge,
  searchChallenge,
  getOngoingChallenges,
  incrementChallengeParticipant,
};
