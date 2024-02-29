const Game = require('../models/game.model');

const createGame = async (gameData) => {
  try {
    return await Game.create(gameData);
  } catch (error) {
    throw error;
  }
};

const getGame = async (id) => {
  try {
    return await Game.findByPk(id);
  } catch (error) {
    throw error;
  }
};

const updateGame = async (id, gameData) => {
  try {
    return await Game.update(gameData, { where: { GameID: id } });
  } catch (error) {
    throw error;
  }
};

const deleteGame = async (id) => {
  try {
    return await Game.destroy({ where: { GameID: id } });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createGame,
  getGame,
  updateGame,
  deleteGame,
};
