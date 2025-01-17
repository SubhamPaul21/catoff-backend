const { Challenge, Game, Player, User } = require('../models/index');
const { Op } = require('sequelize');
const { getGameIds, getGameType } = require('./game.service');
const { getUserIds, getUserById } = require('./user.service');
const logger = require('../utils/logger');
require('dotenv').config();
const { GameType, ParticipationTypeRev } = require('../constants/constants');

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
    let challenge = await Challenge.findByPk(id);
    challenge.dataValues.GameType = await getGameType(challenge.GameID);
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
    let searchNum = isNaN(searchTerm) ? null : parseInt(searchTerm, 10);
    let gameIDs = await getGameIds(searchTerm);
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
        order: [['StartDate', 'DESC']],
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
        order: [['StartDate', 'DESC']],
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

const checkIfChallengeAvailableForEntry = async (challengeId, userId) => {
  try {
    const challenge = await Challenge.findOne({
      where: { ChallengeID: challengeId },
    });
    const user = await getUserById(userId);
    logger.info('[ChallengeService] data retrieved successfully');
    return (
      !challenge.IsStarted &&
      challenge.IsActive &&
      user.Credits >= challenge.Wager
    );
  } catch (err) {
    logger.error(
      `[ChallengeService] Error in retrieving challenge checkIfChallengeAvailableForEntry: ${error.message}`
    );
    throw err;
  }
};

const updateIsStarted = async (challengeId, totalNum) => {
  try {
    let challenge = await Challenge.findOne({
      where: { ChallengeID: challengeId },
    });
    if (
      challenge.IsActive &&
      !challenge.IsStarted &&
      totalNum >= challenge.MaxParticipants
    ) {
      await Challenge.update(
        { IsStarted: true },
        { where: { ChallengeID: challengeId } }
      );
      logger.info('[ChallengeService] isStarted updated successfully');
      return true;
    }
  } catch (err) {
    logger.error(
      `[ChallengeService] Error in retrieving challenge updateIsStarted: ${error.message}`
    );
    throw err;
  }
};

const getAllStartedChallenges = async () => {
  try {
    let challenges = await Challenge.findAll({
      where: { IsStarted: true, IsActive: true },
    });
    logger.info('[ChallengeService] Started challenges fetched successfully');
    return challenges;
  } catch (err) {
    logger.error(
      `[ChallengeService] Error in retrieving challenge getAllStartedChallenge: ${err.message}`
    );
    throw err;
  }
};

const getChallengeDashboardById = async (challengeId) => {
  logger.debug(
    `[ChallengeService] Fetching dashboard for challenge ID: ${challengeId}`
  );
  try {
    const challenge = await Challenge.findByPk(challengeId, {
      include: [
        {
          model: Player,
          as: 'players',
          attributes: ['Value'],
        },
        {
          model: Game,
          as: 'game',
          attributes: ['GameType', 'GameName', 'ParticipationType'],
        },
      ],
    });

    if (!challenge) {
      logger.warn(
        `[ChallengeService] Challenge not found for dashboard ID: ${challengeId}`
      );
      return null;
    }

    const totalWagerStaked =
      challenge.Wager * (challenge.players ? challenge.players.length : 0);

    const dashboardData = {
      GameType: GameType[challenge.game?.GameType] || 'Unknown', // Fallback if no game data
      GameName: challenge.game?.GameName || 'Unknown',
      ParticipationType:
        ParticipationTypeRev[challenge.game?.ParticipationType] || 'Unknown',
      StartDate: challenge.StartDate,
      EndDate: challenge.EndDate,
      PlayersJoined: challenge.players.length,
      StakedWager: challenge.Wager,
      TotalWagerStaked: totalWagerStaked,
      Target: challenge.Target,
      Value: challenge.players
        ? challenge.players.reduce((acc, player) => acc + player.Value, 0)
        : 0, // Sum of all players' values
    };

    logger.info(
      `[ChallengeService] Dashboard data for challenge ID: ${challengeId} fetched successfully`
    );
    return dashboardData;
  } catch (error) {
    logger.error(
      `[ChallengeService] Error fetching challenge dashboard by ID: ${challengeId}: ${error.message}`
    );
    throw error;
  }
};

const shareChallenge = async (challengeId) => {
  try {
    const shareableLink = `${process.env.FRONTEND_ENDPOINT}/challenge/${challengeId}`;
    logger.info(
      `[ChallengeService] successfully got shaerable link for challenge with challenge id : ${challengeId} `
    );
    return shareableLink;
  } catch (e) {
    logger.error(
      `[ChallengeService] Error creating sharable link for challenge with challenge ID : ${challengeId}: ${error.stack}`
    );
    throw e;
  }
};

const getLeaderboardData = async (challengeId) => {
  try {
    const playersData = await Player.findAll({
      where: { ChallengeID: challengeId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['UserName', 'ProfilePicture'],
        },
      ],
      attributes: ['Value'],
      order: [['Value', 'DESC']],
    });

    const leaderboardData = playersData.map((player) => ({
      profilePicture: player.user.ProfilePicture,
      username: player.user.UserName,
      value: player.Value,
    }));

    return leaderboardData;
  } catch (error) {
    logger.error(
      `[ChallengeService] Error fetching leaderboard data for challenge ID: ${challengeId}: ${error.message}`
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
  checkIfChallengeAvailableForEntry,
  updateIsStarted,
  getAllStartedChallenges,
  getChallengeDashboardById,
  shareChallenge,
  getLeaderboardData,
};
