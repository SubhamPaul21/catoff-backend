// challengeService.js
const Challenge = require('../models/challenge.model');
const { Op } = require('sequelize');
const { getGameIds } = require('./game.service');
const { getUserIds } = require('./user.service');

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
    return await Challenge.update(challengeData, {
      where: { ChallengeID: id },
    });
  } catch (error) {
    throw error;
  }
};

const deleteChallenge = async (id) => {
  try {
    return await Challenge.destroy({ where: { ChallengeID: id } });
  } catch (error) {
    throw error;
  }
};

const searchChallenge = async (searchTerm) => {
  try {
    let userIds = await getUserIds(searchTerm);
    let gameIDs = await getGameIds(searchTerm);
    let searchNum;
    isNaN(searchTerm) ? (searchNum = null) : (searchNum = searchTerm);
    const challenges = await Challenge.findAll({
      where: {
        [Op.or]: [
          { ChallengeID: searchNum },
          { ChallengeName: { [Op.like]: `%${searchTerm}%` } },
          { ChallengeCreator: { [Op.in]: userIds } },
          { ChallengeType: { [Op.in]: gameIDs } },
        ],
      },
    });
    return challenges;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const getOngoingChallenges = async(type, page)=>{
  try{
    const limit = 10;
    const offset = (page - 1) * 10;
    let challenges;
    if(type == 'all'){
      challenges = await Challenge.findAll({
        where: { IsActive: true }, // Add a where clause to check for IsActive true
        order: [['CreationDate', 'DESC']], // Assuming CreationDate determines the "hotness"
        offset,
        limit,
      });
    } else{
      let gameIDs = await getGameIds(type);
      challenges = await Challenge.findAll({
        where: { IsActive: true, ChallengeType: {
          [Op.in]: [gameIDs],
        },}, // Add a where clause to check for IsActive true and category ID
        order: [['CreationDate', 'DESC']], // Assuming CreationDate determines the "hotness"
        offset,
        limit,
      });
      
    }
    return challenges;
  }catch(e){
    throw e
  }
}

module.exports = {
  createChallenge,
  getChallenge,
  updateChallenge,
  deleteChallenge,
  searchChallenge,
  getOngoingChallenges,
};
