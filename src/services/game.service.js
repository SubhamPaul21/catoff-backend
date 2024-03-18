const Game = require('../models/game.model');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

const createGame = async (gameData) => {
  logger.debug('[GameService] Attempting to create a game');
  try {
    const game = await Game.create(gameData);
    logger.info('[GameService] Game created successfully');
    return game;
  } catch (error) {
    logger.error(`[GameService] Error creating game: ${error.message}`);
    throw error;
  }
};

const getGame = async (id) => {
  logger.debug(`[GameService] Attempting to retrieve game with ID: ${id}`);
  try {
    const game = await Game.findByPk(id);
    if (game) {
      logger.info('[GameService] Game retrieved successfully');
      return game;
    } else {
      logger.warn('[GameService] Game not found');
      return null;
    }
  } catch (error) {
    logger.error(`[GameService] Error retrieving game: ${error.message}`);
    throw error;
  }
};

const updateGame = async (id, gameData) => {
  logger.debug(`[GameService] Attempting to update game with ID: ${id}`);
  try {
    const [updated] = await Game.update(gameData, { where: { GameID: id } });
    if (updated) {
      logger.info('[GameService] Game updated successfully');
      return updated;
    } else {
      logger.warn('[GameService] Game not found for update');
      return null;
    }
  } catch (error) {
    logger.error(`[GameService] Error updating game: ${error.message}`);
    throw error;
  }
};

const deleteGame = async (id) => {
  logger.debug(`[GameService] Attempting to delete game with ID: ${id}`);
  try {
    const deleted = await Game.destroy({ where: { GameID: id } });
    if (deleted) {
      logger.info('[GameService] Game deleted successfully');
      return deleted;
    } else {
      logger.warn('[GameService] Game not found for deletion');
      return null;
    }
  } catch (error) {
    logger.error(`[GameService] Error deleting game: ${error.message}`);
    throw error;
  }
};

const getGameIds = async (searchTerm) => {
  logger.debug(
    `[GameService] Retrieving game IDs for searchTerm: ${searchTerm}`
  );
  try {
    const games = await Game.findAll({
      attributes: ['GameID'],
      where: { GameName: { [Op.iLike]: `%${searchTerm}%` } },
    });
    const gameIDs = games.map((game) => game.GameID);
    logger.info('[GameService] Game IDs retrieved successfully');
    return gameIDs;
  } catch (error) {
    logger.error(`[GameService] Error retrieving game IDs: ${error.message}`);
    throw error;
  }
};

module.exports = {
  createGame,
  getGame,
  updateGame,
  deleteGame,
  getGameIds,
};
