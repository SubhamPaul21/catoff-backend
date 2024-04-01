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
    let challenge = await Challenge.findByPk(id, {
      include: [
        {
          model: Player,
          as: 'players',
          attributes: ['PlayerID'], // For counting total players
        },
        {
          model: Game,
          as: 'game',
          attributes: ['GameType', 'ParticipationType'], // For game details
        },
      ],
    });

    if (!challenge) {
      logger.warn('[ChallengeService] Challenge not found');
      return null;
    }

    // Calculate TotalWagerStaked
    const totalWagerStaked = challenge.Wager * challenge.players.length;

    // Construct the response object with only the required fields
    const challengeData = {
      ChallengeName: challenge.ChallengeName,
      ChallengeDescription: challenge.ChallengeDescription,
      ChallengeCreator: challenge.ChallengeCreator,
      StartDate: challenge.StartDate,
      EndDate: challenge.EndDate,
      GameType: GameType[challenge.game?.GameType],
      IsActive: challenge.IsActive,
      IsSettled: challenge.IsSettled,
      IsStarted: challenge.IsStarted,
      Winner: challenge.Winner || 'Winner not decided yet!',
      TotalWagerStaked: totalWagerStaked,
      Wager: challenge.Wager,
      Target: challenge.Target,
      PlayersJoined: challenge.players.length,
      ParticipationType:
        ParticipationTypeRev[challenge.game?.ParticipationType],
      ChallengeMedia: challenge.Media, // Assuming the field is named 'Media' in your Challenge model
    };

    logger.debug('[ChallengeService] Challenge retrieved successfully');
    return challengeData;
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
        include: [
          {
            model: Player,
            as: 'players',
            attributes: ['PlayerID'], // Only need the ID to count
          },
          {
            model: Game,
            as: 'game',
            attributes: ['GameType'], // Include GameType for each challenge
          },
        ],
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
        include: [
          {
            model: Player,
            as: 'players',
            attributes: ['PlayerID'], // Only need the ID to count
          },
          {
            model: Game,
            as: 'game',
            attributes: ['GameType'], // Include GameType for each challenge
          },
        ],
        offset,
        limit,
      });
    }
    logger.info('[ChallengeService] Ongoing challenges retrieved successfully');

    // Map the challenges to include the required fields
    const mappedChallenges = challenges.map((challenge) => ({
      ChallengeID: challenge.ChallengeID,
      PlayerJoined: challenge.players.length,
      GameType: GameType[challenge.game?.GameType] || 'Unknown',
      ChallengeName: challenge.ChallengeName,
      Wager: challenge.Wager,
      StartDate: challenge.StartDate,
      EndDate: challenge.EndDate,
      CurrentPool: challenge.Wager * challenge.players.length,
      Media: challenge.Media,
      IsStarted: challenge.IsStarted,
      IsActive: challenge.IsActive,
    }));

    return mappedChallenges;
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
    if (!challenge) {
      throw new Error(`Challenge with ID ${challengeId} not found.`);
    }
    const players = await Player.findAll({
      where: { ChallengeID: challengeId },
    });
    const user = await getUserById(userId);
    logger.debug('[ChallengeService] data retrieved successfully');

    if (challenge.IsStarted) {
      throw new Error(
        `Unable to join the challenge: Challenge already started!`
      );
    }
    if (players.length >= challenge.MaxParticipants) {
      throw new Error(
        `Unable to join the challenge: Challenge Pool is filled!`
      );
    }
    if (!challenge.IsActive) {
      throw new Error(`Unable to join the challenge: Challenge is not active!`);
    }
    if (user.Credits < challenge.Wager) {
      throw new Error(`Unable to join the challenge: Not enough credits!`);
    }
    return (
      !challenge.IsStarted &&
      challenge.IsActive &&
      user.Credits >= challenge.Wager
    );
  } catch (err) {
    logger.error(
      `[ChallengeService] Error in retrieving challenge checkIfChallengeAvailableForEntry: ${err.message}`
    );
    throw err;
  }
};

const updateIsStarted = async (challengeId) => {
  try {
    let challenge = await Challenge.findOne({
      where: { ChallengeID: challengeId },
    });
    if (challenge.IsActive && !challenge.IsStarted) {
      await Challenge.update(
        { IsStarted: true },
        { where: { ChallengeID: challengeId } }
      );
      logger.info('[ChallengeService] isStarted updated successfully');
      return true;
    }
  } catch (err) {
    logger.error(
      `[ChallengeService] Error in retrieving challenge updateIsStarted: ${err.message}`
    );
    throw err;
  }
};

const getAllStartedChallenges = async () => {
  try {
    let challenges = await Challenge.findAll({
      where: { IsStarted: true, IsActive: true },
    });
    logger.debug('[ChallengeService] Started challenges fetched successfully');
    return challenges;
  } catch (err) {
    logger.error(
      `[ChallengeService] Error in retrieving challenge getAllStartedChallenge: ${err.message}`
    );
    throw err;
  }
};

const checkAndUpdateIsStartedChallenge = async () => {
  try {
    const challenges = await Challenge.findAll({
      where: {
        StartDate: {
          [Op.lt]: Date.now(),
        },
        IsStarted: false,
      },
    });

    // Iterate over each challenge and update its IsStarted status
    for (const challenge of challenges) {
      // Assuming updateIsStarted function accepts challengeId as its parameter
      await updateIsStarted(challenge.ChallengeID);
      logger.info(
        `[ChallengeService] Challenge with ID ${challenge.ChallengeID} has been started.`
      );
    }

    if (challenges.length > 0) {
      logger.debug(
        '[ChallengeService] All applicable challenges have been updated to started.'
      );
    } else {
      logger.debug(
        '[ChallengeService] No challenges needed to be started at this time.'
      );
    }
  } catch (err) {
    logger.error(`[playerService]  checkAndUpdateIsStartedChallenge error`);
    throw err;
  }
};

const getChallengeDashboardById = async (challengeId, userId) => {
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
        {
          model: User,
          as: 'creator',
          attributes: ['UserName'],
        },
        {
          model: Player,
          as: 'winner',
          attributes: ['UserID', 'PlayerID'],
        },
      ],
    });

    if (!challenge) {
      logger.warn(
        `[ChallengeService] Challenge not found for dashboard ID: ${challengeId}`
      );
      return null;
    }

    // Additional logic to fetch winner's username if not included in the original query
    let winnerUsername = 'Winner not decided yet!';
    if (challenge.winner) {
      const winnerUser = await User.findByPk(challenge.winner.UserID);
      winnerUsername = winnerUser
        ? winnerUser.UserName
        : 'Winner not decided yet!';
    }

    const totalWagerStaked =
      challenge.Wager * (challenge.players ? challenge.players.length : 0);
    // Find the player's value for the current user
    const userPlayer = challenge.players.find(
      (player) => player.UserID === userId
    );
    const userValue = userPlayer ? userPlayer.Value : 0;

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
      ChallengeName: challenge.ChallengeName,
      ChallengeDescription: challenge.ChallengeDescription,
      ChallengeWinner: winnerUsername,
      ChallengeCreatorUsername: challenge.creator?.UserName || 'Unknown',
      ChallengeMedia: challenge.Media,
      Target: challenge.Target,
      Value: userValue,
      IsStarted: challenge.IsStarted,
      IsActive: challenge.IsActive,
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
  checkAndUpdateIsStartedChallenge,
};
