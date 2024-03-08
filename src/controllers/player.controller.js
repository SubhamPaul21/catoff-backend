const {
  createPlayer,
  getPlayer,
  updatePlayer,
  deletePlayer,
  getAllPlayersOfChallenge,
} = require('../services/player.service');
const { makeResponse } = require('../utils/responseMaker');
const logger = require('../utils/logger');

const createPlayerHandler = async (req, res) => {
  logger.debug('[PlayerController] Attempting to create a player');
  try {
    const player = await createPlayer(req.body);
    logger.debug('[PlayerController] Player created successfully');
    makeResponse(res, 201, true, 'Player created successfully', player);
  } catch (error) {
    logger.error(`[PlayerController] Error creating player: ${error.message}`);
    makeResponse(res, 500, false, 'Error creating player', error.message);
  }
};

const getPlayerHandler = async (req, res) => {
  const playerId = req.params.ID;
  logger.debug(
    `[PlayerController] Attempting to retrieve player with ID: ${playerId}`
  );
  try {
    const player = await getPlayer(playerId);
    if (!player) {
      logger.debug(`[PlayerController] Player not found with ID: ${playerId}`);
      return makeResponse(res, 404, false, 'Player not found');
    }
    logger.debug(
      `[PlayerController] Player retrieved successfully with ID: ${playerId}`
    );
    makeResponse(res, 200, true, 'Player retrieved successfully', player);
  } catch (error) {
    logger.error(
      `[PlayerController] Error retrieving player with ID: ${playerId}, Error: ${error.message}`
    );
    makeResponse(res, 500, false, 'Error retrieving player', error.message);
  }
};

const updatePlayerHandler = async (req, res) => {
  const playerId = req.params.ID;
  logger.debug(
    `[PlayerController] Attempting to update player with ID: ${playerId}`
  );
  try {
    const updated = await updatePlayer(playerId, req.body);
    if (!updated) {
      logger.debug(
        `[PlayerController] Player not found for update with ID: ${playerId}`
      );
      return makeResponse(res, 404, false, 'Player not found');
    }
    logger.debug(
      `[PlayerController] Player updated successfully with ID: ${playerId}`
    );
    makeResponse(res, 200, true, 'Player updated successfully');
  } catch (error) {
    logger.error(
      `[PlayerController] Error updating player with ID: ${playerId}, Error: ${error.message}`
    );
    makeResponse(res, 500, false, 'Error updating player', error.message);
  }
};

const deletePlayerHandler = async (req, res) => {
  const playerId = req.params.ID;
  logger.debug(
    `[PlayerController] Attempting to delete player with ID: ${playerId}`
  );
  try {
    const deleted = await deletePlayer(playerId);
    if (!deleted) {
      logger.debug(
        `[PlayerController] Player not found for deletion with ID: ${playerId}`
      );
      return makeResponse(res, 404, false, 'Player not found');
    }
    logger.debug(
      `[PlayerController] Player deleted successfully with ID: ${playerId}`
    );
    makeResponse(res, 200, true, 'Player deleted successfully');
  } catch (error) {
    logger.error(
      `[PlayerController] Error deleting player with ID: ${playerId}, Error: ${error.message}`
    );
    makeResponse(res, 500, false, 'Error deleting player', error.message);
  }
};

const getAllPlayersOfChallengeHandler = async (req, res) => {
  const challengeId = req.params.ID;
  logger.debug(
    `[PlayerController] Attempting to retrieve all players for challenge with ID: ${challengeId}`
  );
  try {
    const players = await getAllPlayersOfChallenge(challengeId);
    logger.debug(
      `[PlayerController] Successfully retrieved all players for challenge with ID: ${challengeId}`
    );
    makeResponse(res, 200, true, 'Players fetched successfully', players);
  } catch (error) {
    logger.error(
      `[PlayerController] Error retrieving players for challenge with ID: ${challengeId}, Error: ${error.message}`
    );
    makeResponse(res, 500, false, 'Unable to retrieve players', error.message);
  }
};

module.exports = {
  createPlayerHandler,
  getPlayerHandler,
  updatePlayerHandler,
  deletePlayerHandler,
  getAllPlayersOfChallengeHandler,
};
