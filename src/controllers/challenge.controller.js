const {
  createChallenge,
  getChallenge,
  updateChallenge,
  deleteChallenge,
  searchChallenge,
  getOngoingChallenges,
} = require('../services/challenge.service');
const { makeResponse } = require('../utils/responseMaker');
const logger = require('../utils/logger'); // Ensure this path is correct

const createChallengeHandler = async (req, res) => {
  logger.debug('[ChallengeController] Attempting to create a challenge');
  try {
    const challenge = await createChallenge(req.body);
    logger.info('[ChallengeController] Challenge created successfully');
    res.status(201).json(challenge);
  } catch (error) {
    logger.error(
      `[ChallengeController] Error creating challenge: ${error.message}`
    );
    res
      .status(500)
      .json({ message: 'Error creating challenge', error: error.message });
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
      logger.info(
        `[ChallengeController] Challenge not found with ID: ${challengeId}`
      );
      return res.status(404).json({ message: 'Challenge not found' });
    }
    logger.info(
      `[ChallengeController] Challenge retrieved successfully with ID: ${challengeId}`
    );
    res.json(challenge);
  } catch (error) {
    logger.error(
      `[ChallengeController] Error retrieving challenge with ID: ${challengeId}, Error: ${error.message}`
    );
    res
      .status(500)
      .json({ message: 'Error retrieving challenge', error: error.message });
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
      logger.info(
        `[ChallengeController] Challenge not found for update with ID: ${challengeId}`
      );
      return res.status(404).json({ message: 'Challenge not found' });
    }
    logger.info(
      `[ChallengeController] Challenge updated successfully with ID: ${challengeId}`
    );
    res.json({ message: 'Challenge updated successfully' });
  } catch (error) {
    logger.error(
      `[ChallengeController] Error updating challenge with ID: ${challengeId}, Error: ${error.message}`
    );
    res
      .status(500)
      .json({ message: 'Error updating challenge', error: error.message });
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
      logger.info(
        `[ChallengeController] Challenge not found for deletion with ID: ${challengeId}`
      );
      return res.status(404).json({ message: 'Challenge not found' });
    }
    logger.info(
      `[ChallengeController] Challenge deleted successfully with ID: ${challengeId}`
    );
    res.json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    logger.error(
      `[ChallengeController] Error deleting challenge with ID: ${challengeId}, Error: ${error.message}`
    );
    res
      .status(500)
      .json({ message: 'Error deleting challenge', error: error.message });
  }
};

const searchChallengeHandler = async (req, res) => {
  const searchTerm = req.params.searchTerm;
  logger.debug(
    `[ChallengeController] Searching for challenges with term: ${searchTerm}`
  );
  try {
    const challenges = await searchChallenge(searchTerm);
    logger.info('[ChallengeController] Search successful');
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
  logger.debug(
    `[ChallengeController] Getting ongoing challenges of type: ${type}, page: ${page}`
  );
  try {
    const challenges = await getOngoingChallenges(type, page);
    logger.info('[ChallengeController] Ongoing challenges query successful');
    makeResponse(res, 200, true, 'Query successful', challenges);
  } catch (error) {
    logger.error(
      `[ChallengeController] Unable to retrieve ongoing challenges, Error: ${error.message}`
    );
    makeResponse(res, 500, false, 'Unable to retrieve', null);
  }
};

module.exports = {
  createChallengeHandler,
  getChallengeHandler,
  updateChallengeHandler,
  deleteChallengeHandler,
  searchChallengeHandler,
  getOnGoingChallengesHandler,
};
