// challengeService.js
const  Challenge = require('../models/challenge.model');

const createChallenge = async (challengeData) => {
  try {
    return await Challenge.create(challengeData);
  } catch (error) {
    throw error;
  }
};

const getChallenge = async (id) => {
  try {
    return await Challenge.findByPk(id);
  } catch (error) {
    throw error;
  }
};

const updateChallenge = async (id, challengeData) => {
  try {
    return await Challenge.update(challengeData, { where: { ChallengeId: id } });
  } catch (error) {
    throw error;
  }
};

const deleteChallenge = async (id) => {
  try {
    return await Challenge.destroy({ where: { ChallengeId: id } });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createChallenge,
  getChallenge,
  updateChallenge,
  deleteChallenge,
};
