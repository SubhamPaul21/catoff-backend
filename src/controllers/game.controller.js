const {
  createGame,
  getGame,
  updateGame,
  deleteGame,
} = require('../services/game.service');
const logger = require('../utils/logger');

const createGameHandler = async (req, res) => {
  logger.debug('[GameController] Attempting to create a new game');
  try {
    const game = await createGame(req.body);
    logger.info('[GameController] Game created successfully');
    res.status(201).json(game);
  } catch (error) {
    logger.error(`[GameController] Error creating game: ${error.message}`);
    res
      .status(500)
      .json({ message: 'Error creating game', error: error.message });
  }
};

const getGameHandler = async (req, res) => {
  const gameId = req.params.ID;
  logger.debug(
    `[GameController] Attempting to retrieve game with ID: ${gameId}`
  );
  try {
    const game = await getGame(gameId);
    if (!game) {
      logger.info(`[GameController] Game not found with ID: ${gameId}`);
      return res.status(404).json({ message: 'Game not found' });
    }
    logger.info(
      `[GameController] Game retrieved successfully with ID: ${gameId}`
    );
    res.json(game);
  } catch (error) {
    logger.error(
      `[GameController] Error retrieving game with ID: ${gameId}, Error: ${error.message}`
    );
    res
      .status(500)
      .json({ message: 'Error retrieving game', error: error.message });
  }
};

const updateGameHandler = async (req, res) => {
  const gameId = req.params.ID;
  logger.debug(`[GameController] Attempting to update game with ID: ${gameId}`);
  try {
    const updated = await updateGame(gameId, req.body);
    if (!updated) {
      logger.info(
        `[GameController] Game not found for update with ID: ${gameId}`
      );
      return res.status(404).json({ message: 'Game not found' });
    }
    logger.info(
      `[GameController] Game updated successfully with ID: ${gameId}`
    );
    res.json({ message: 'Game updated successfully' });
  } catch (error) {
    logger.error(
      `[GameController] Error updating game with ID: ${gameId}, Error: ${error.message}`
    );
    res
      .status(500)
      .json({ message: 'Error updating game', error: error.message });
  }
};

const deleteGameHandler = async (req, res) => {
  const gameId = req.params.ID;
  logger.debug(`[GameController] Attempting to delete game with ID: ${gameId}`);
  try {
    const deleted = await deleteGame(gameId);
    if (!deleted) {
      logger.info(
        `[GameController] Game not found for deletion with ID: ${gameId}`
      );
      return res.status(404).json({ message: 'Game not found' });
    }
    logger.info(
      `[GameController] Game deleted successfully with ID: ${gameId}`
    );
    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    logger.error(
      `[GameController] Error deleting game with ID: ${gameId}, Error: ${error.message}`
    );
    res
      .status(500)
      .json({ message: 'Error deleting game', error: error.message });
  }
};

module.exports = {
  createGameHandler,
  getGameHandler,
  updateGameHandler,
  deleteGameHandler,
};
