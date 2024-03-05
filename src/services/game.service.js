const Game = require('../models/game.model');
const { Op } = require('sequelize');

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

const getGameIds = async (searchTerm) => {
  try {
    const gameIDs = await Game.findAll({
      attributes: ['GameID'],
      where: {
        GameName: { [Op.like]: `%${searchTerm}%` },
      },
    });
    let arr = gameIDs.map((ele) => ele['GameID']);
    return arr;
  } catch (e) {
    throw e;
  }
};


module.exports = {
  createGame,
  getGame,
  updateGame,
  deleteGame,
  getGameIds,
};
