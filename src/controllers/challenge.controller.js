const {
  createChallenge,
  getChallenge,
  updateChallenge,
  deleteChallenge,
  searchChallenge,
  getOngoingChallenges,
  getChallengeDashboardById,
  getLeaderboardData,
} = require('../services/challenge.service');
const { makeResponse } = require('../utils/responseMaker');
const logger = require('../utils/logger');

const createChallengeHandler = async (req, res) => {
  logger.debug('[ChallengeController] Attempting to create a challenge');
  try {
    req.body.ChallengeCreator = req.UserID;
    const challenge = await createChallenge(req.body);
    logger.debug('[ChallengeController] Challenge created successfully');
    makeResponse(res, 201, true, 'created challenge', challenge);
  } catch (error) {
    logger.error(
      `[ChallengeController] Error creating challenge: ${error.message}`
    );
    return makeResponse(res, 500, false, 'error creating challenge', null);
  }
};

const getChallengeHandler = async (req, res) => {
  const challengeId = req.params.ID;
  logger.debug(
    `[ChallengeController] Attempting to retrieve challenge with ID: ${challengeId}`
  );
  try {
    const challenge = await getChallenge(challengeId);
    if (!challenge) {
      logger.debug(
        `[ChallengeController] Challenge not found with ID: ${challengeId}`
      );
      return makeResponse(res, 404, false, 'challenge not found ', null);
    }
    logger.debug(
      `[ChallengeController] Challenge retrieved successfully with ID: ${challengeId}`
    );
    makeResponse(res, 200, true, 'successful query', challenge);
  } catch (error) {
    logger.error(
      `[ChallengeController] Error retrieving challenge with ID: ${challengeId}, Error: ${error.message}`
    );
    return makeResponse(res, 500, false, 'error retrieving challenge', null);
  }
};

const updateChallengeHandler = async (req, res) => {
  const challengeId = req.params.ID;
  logger.debug(
    `[ChallengeController] Attempting to update challenge with ID: ${challengeId}`
  );
  try {
    const [updated] = await updateChallenge(challengeId, req.body);
    if (!updated) {
      logger.debug(
        `[ChallengeController] Challenge not found for update with ID: ${challengeId}`
      );
      return makeResponse(res, 404, false, 'challenge not found', null);
    }
    logger.debug(
      `[ChallengeController] Challenge updated successfully with ID: ${challengeId}`
    );
    return makeResponse(res, 200, true, 'updated successfully', updated);
  } catch (error) {
    logger.error(
      `[ChallengeController] Error updating challenge with ID: ${challengeId}, Error: ${error.message}`
    );
    return makeResponse(res, 500, false, 'error retrieving challenge', null);
  }
};

const deleteChallengeHandler = async (req, res) => {
  const challengeId = req.params.ID;
  logger.debug(
    `[ChallengeController] Attempting to delete challenge with ID: ${challengeId}`
  );
  try {
    const deleted = await deleteChallenge(challengeId);
    if (!deleted) {
      logger.debug(
        `[ChallengeController] Challenge not found for deletion with ID: ${challengeId}`
      );
      return makeResponse(res, 404, false, 'challenge not found', null);
    }
    logger.debug(
      `[ChallengeController] Challenge deleted successfully with ID: ${challengeId}`
    );
    return makeResponse(res, 200, true, 'deleted successfully', deleted);
  } catch (error) {
    logger.error(
      `[ChallengeController] Error deleting challenge with ID: ${challengeId}, Error: ${error.message}`
    );
    return makeResponse(res, 500, false, 'error retrieving challenge', null);
  }
};

const searchChallengeHandler = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const searchTerm = req.params.searchTerm;
  logger.debug(
    `[ChallengeController] Searching for challenges with term: ${searchTerm}`
  );
  try {
    const challenges = await searchChallenge(searchTerm, limit, page);
    logger.debug('[ChallengeController] Search successful');
    makeResponse(res, 200, true, 'Search successful', challenges);
  } catch (error) {
    logger.error(
      `[ChallengeController] Search failed, Error: ${error.message}`
    );
    makeResponse(res, error.status || 500, false, 'Search failed', null);
  }
};

const getOnGoingChallengesHandler = async (req, res) => {
  const type = req.params.type;
  const page = req.query.page || 1; // Default to page 1 if not specified
  const limit = req.query.limit || 10;
  logger.debug(
    `[ChallengeController] Getting ongoing challenges of type: ${type}, page: ${page}`
  );
  try {
    const challenges = await getOngoingChallenges(type, page, limit);
    logger.debug('[ChallengeController] Ongoing challenges query successful');
    makeResponse(res, 200, true, 'Query successful', challenges);
  } catch (error) {
    logger.error(
      `[ChallengeController] Unable to retrieve ongoing challenges, Error: ${error.message}`
    );
    makeResponse(res, 500, false, 'Unable to retrieve', null);
  }
};

const getChallengeDashboardByIdHandler = async (req, res) => {
  const challengeId = req.params.ID;
  logger.debug(
    `[ChallengeController] Attempting to retrieve dashboard for challenge with ID: ${challengeId}`
  );
  try {
    const dashboardData = await getChallengeDashboardById(challengeId);
    if (!dashboardData) {
      logger.debug(
        `[ChallengeController] Challenge dashboard not found for ID: ${challengeId}`
      );
      return makeResponse(
        res,
        404,
        false,
        'Challenge dashboard data not found',
        null
      );
    }
    logger.debug(
      `[ChallengeController] Challenge dashboard data retrieved successfully for ID: ${challengeId}`
    );
    makeResponse(
      res,
      200,
      true,
      'Challenge dashboard data fetched successfully',
      dashboardData
    );
  } catch (error) {
    logger.error(
      `[ChallengeController] Error fetching challenge dashboard data for ID: ${challengeId}: ${error.message}`
    );
    return makeResponse(
      res,
      500,
      false,
      'Error fetching challenge dashboard data',
      null
    );
  }
};

const getLeaderboardDataHandler = async (req, res) => {
  const challengeId = req.params.ID;
  logger.debug(`[ChallengeController] Fetching leaderboard data for challenge with ID: ${challengeId}`);
  try {
    const leaderboardData = await getLeaderboardData(challengeId);
    if (!leaderboardData) {
      logger.debug(`[ChallengeController] No leaderboard data found for challenge ID: ${challengeId}`);
      return makeResponse(res, 404, false, 'Leaderboard data not found', null);
    }
    logger.debug(`[ChallengeController] Leaderboard data retrieved successfully for challenge ID: ${challengeId}`);
    makeResponse(res, 200, true, 'Leaderboard data fetched successfully', leaderboardData);
  } catch (error) {
    logger.error(`[ChallengeController] Error fetching leaderboard data for challenge ID: ${challengeId}: ${error.message}`);
    return makeResponse(res, 500, false, 'Error fetching leaderboard data', null);
  }
};

module.exports = {
  createChallengeHandler,
  getChallengeHandler,
  updateChallengeHandler,
  deleteChallengeHandler,
  searchChallengeHandler,
  getOnGoingChallengesHandler,
  getChallengeDashboardByIdHandler,
  getLeaderboardDataHandler,
};
