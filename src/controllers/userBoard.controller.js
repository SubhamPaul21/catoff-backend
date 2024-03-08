const {
  getUserCurrentStandings,
  getUserProgressData,
  getUserDetailsData,
} = require('../services/userBoard.service');
const logger = require('../utils/logger');

exports.getUserCurrentTable = async (req, res) => {
  const userID = req.UserID;
  logger.debug(
    `[UserBoardController] Fetching current standings for user ID: ${userID}`
  );
  try {
    const standings = await getUserCurrentStandings(userID);
    logger.debug(
      `[UserBoardController] Successfully fetched current standings for user ID: ${userID}, Result count: ${standings.length}`
    );
    res.json(standings);
  } catch (error) {
    logger.error(
      `[UserBoardController] Error fetching user standings for user ID: ${userID}, Error: ${error.message}`
    );
    res
      .status(500)
      .json({ message: 'Error fetching user standings', error: error.message });
  }
};

exports.getUserProgressGraph = async (req, res) => {
  const userID = req.UserID;
  const { period } = req.params;
  logger.debug(
    `[UserBoardController] Fetching user progress for user ID: ${userID}, period: ${period}`
  );
  try {
    const progressData = await getUserProgressData(userID, period);
    logger.debug(
      `[UserBoardController] Successfully fetched user progress for user ID: ${userID}, period: ${period}, Data points: ${progressData.length}`
    );
    res.json(progressData);
  } catch (error) {
    logger.error(
      `[UserBoardController] Error fetching user progress for user ID: ${userID}, period: ${period}, Error: ${error.message}`
    );
    res
      .status(500)
      .json({ message: 'Error fetching user progress', error: error.message });
  }
};

exports.getUserDetails = async (req, res) => {
  const userId = req.UserID;
  logger.debug(`[UserBoardController] Fetching details for user ID: ${userId}`);
  try {
    const userDetails = await getUserDetailsData(userId);
    logger.debug(
      `[UserBoardController] Successfully fetched details for user ID: ${userId}`
    );
    res.json(userDetails);
  } catch (error) {
    logger.error(
      `[UserBoardController] Error fetching details for user ID: ${userId}, Error: ${error.message}`
    );
    res
      .status(500)
      .json({ message: 'Error fetching user details', error: error.message });
  }
};
