// src/services/player.service.js
const Players = require('../models/player.model');

const createPlayer = async (playerData) => {
  try {
    return await Players.create(playerData);
  } catch (error) {
    throw error;
  }
};

const getPlayer = async (id) => {
  try {
    return await Players.findByPk(id);
  } catch (error) {
    throw error;
  }
};

const updatePlayer = async (id, playerData) => {
  try {
    return await Players.update(playerData, { where: { PlayerID: id } });
  } catch (error) {
    throw error;
  }
};

const deletePlayer = async (id) => {
  try {
    return await Players.destroy({ where: { PlayerID: id } });
  } catch (error) {
    throw error;
  }
};

const getAllPlayersOfChallenge = async (challengeId) => {
  try {
    return await Players.findAll({ where: { ChallengeID: challengeId } });
  } catch (e) {
    return e;
  }
};

module.exports = {
  createPlayer,
  getPlayer,
  updatePlayer,
  deletePlayer,
  getAllPlayersOfChallenge,
};
