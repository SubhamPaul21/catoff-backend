const Challenge = require('../models/challenge.model');
const { Op } = require('sequelize');
const { getGameIds } = require('./game.service');
const { getUserIds } = require('./user.service');
const logger = require('../utils/logger');

const createChallenge = async (challengeData) => {
  logger.debug('[ChallengeService] Attempting to create challenge');
  try {
    const challenge = await Challenge.create(challengeData);
    logger.info('[ChallengeService] Challenge created successfully');
    return challenge;
  } catch (error) {
    logger.error(
      `[ChallengeService] Error creating challenge: ${error.message}`
    );
    throw error;
  }
};

const getChallenge = async (id) => {
  logger.debug(`[ChallengeService] Attempting to get challenge with ID: ${id}`);
  try {
    const challenge = await Challenge.findByPk(id);
    if (challenge) {
      logger.info('[ChallengeService] Challenge retrieved successfully');
      return challenge;
    } else {
      logger.warn('[ChallengeService] Challenge not found');
      return null;
    }
  } catch (error) {
    logger.error(
      `[ChallengeService] Error getting challenge: ${error.message}`
    );
    throw error;
  }
};

const updateChallenge = async (id, challengeData) => {
  logger.debug(
    `[ChallengeService] Attempting to update challenge with ID: ${id}`
  );
  try {
    const [updated] = await Challenge.update(challengeData, {
      where: { ChallengeID: id },
    });
    if (updated) {
      logger.info('[ChallengeService] Challenge updated successfully');
      return updated;
    } else {
      logger.warn('[ChallengeService] Challenge not found for update');
      return null;
    }
  } catch (error) {
    logger.error(
      `[ChallengeService] Error updating challenge: ${error.message}`
    );
    throw error;
  }
};

const deleteChallenge = async (id) => {
  logger.debug(
    `[ChallengeService] Attempting to delete challenge with ID: ${id}`
  );
  try {
    const deleted = await Challenge.destroy({ where: { ChallengeID: id } });
    if (deleted) {
      logger.info('[ChallengeService] Challenge deleted successfully');
      return deleted;
    } else {
      logger.warn('[ChallengeService] Challenge not found for deletion');
      return null;
    }
  } catch (error) {
    logger.error(
      `[ChallengeService] Error deleting challenge: ${error.message}`
    );
    throw error;
  }
};

const searchChallenge = async (searchTerm, limit, page) => {
  logger.debug(
    `[ChallengeService] Searching challenges with term: ${searchTerm}`
  );
  const offset = (page - 1) * limit;
  try {
    let userIds = await getUserIds(searchTerm);
    let gameIDs = await getGameIds(searchTerm);
    let searchNum = isNaN(searchTerm) ? null : parseInt(searchTerm, 10);
    const challenges = await Challenge.findAll({
      where: {
        [Op.or]: [
          { ChallengeID: searchNum },
          { ChallengeName: { [Op.iLike]: `%${searchTerm}%` } },
          { ChallengeCreator: { [Op.in]: userIds } },
          { GameID: { [Op.in]: gameIDs } },
        ],
      },
      offset,
      limit,
    });
    logger.info('[ChallengeService] Challenges search completed');
    return challenges;
  } catch (error) {
    logger.error(
      `[ChallengeService] Error searching challenges: ${error.message}`
    );
    throw error;
  }
};

const getOngoingChallenges = async (type, page, limit) => {
  logger.debug(
    `[ChallengeService] Getting ongoing challenges of type: ${type}, page: ${page}`
  );
  try {
    const offset = (page - 1) * limit;
    let challenges;
    if (type === 'all') {
      challenges = await Challenge.findAll({
        where: { IsActive: true },
        order: [['createdAt', 'DESC']],
        offset,
        limit,
      });
    } else {
      let gameIDs = await getGameIds(type);
      challenges = await Challenge.findAll({
        where: {
          IsActive: true,
          GameID: { [Op.in]: gameIDs },
        },
        order: [['createdAt', 'DESC']],
        offset,
        limit,
      });
    }
    logger.info('[ChallengeService] Ongoing challenges retrieved successfully');
    return challenges;
  } catch (error) {
    logger.error(
      `[ChallengeService] Error getting ongoing challenges: ${error.message}`
    );
    throw error;
  }
};

const checkIfChallengeAvailableForEntry = async(challengeId)=>{
  try{
    const challenge = await Challenge.findOne({where: {ChallengeID: challengeId}});
    logger.info('[ChallengeService] data retrieved successfully');
    return !challenge.IsStarted && challenge.IsActive;
  }catch(err){
    logger.error(
      `[ChallengeService] Error in retrieving challenge checkIfChallengeAvailableForEntry: ${error.message}`
    )
    throw err
  }
}

const addPlayersToChallenge = async(challengeId,playerId)=>{
  try{
    const challenge = await Challenge.findByPk(challengeId);
    await challenge.update({
      Players: [...challenge.Players, playerId],
    });
    logger.info('[ChallengeService] players updated successfully')

  }catch(e){
    logger.error(
      `[ChallengeService] Error in updating players in challenge: ${error.message}`
    )
    throw e
  }
}

const updateIsStarted = async(challengeId)=>{
  try{
    let challenge = await Challenge.findOne({where: {ChallengeID: challengeId}});
    if(challenge.IsActive && !challenge.IsStarted && (challenge.Players.length>=challenge.MaxParticipants)){
      await Challenge.update({IsStarted: true},{where:{ChallengeID: challengeId}})
      logger.info('[ChallengeService] isStarted updated successfully')
      return true;
    }
  }catch(err){
    logger.error(
      `[ChallengeService] Error in retrieving challenge updateIsStarted: ${error.message}`
    )
    throw err;
  }
}

const getAllStartedChallenges = async()=>{
  try{
    let challenges = await Challenge.findAll({where:{IsStarted: true}});
    logger.info('[ChallengeService] Started challenges fetched successfully');
    return challenges;
  }
  catch(err){
    logger.error(
      `[ChallengeService] Error in retrieving challenge getAllStartedChallenge: ${err.message}`
    )
    throw err
  }
}

module.exports = {
  createChallenge,
  getChallenge,
  updateChallenge,
  deleteChallenge,
  searchChallenge,
  getOngoingChallenges,
  checkIfChallengeAvailableForEntry,
  updateIsStarted,
  addPlayersToChallenge,
  getAllStartedChallenges,
};
