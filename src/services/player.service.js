const Players = require('../models/player.model');
const logger = require('../utils/logger');
const {
  checkIfChallengeAvailableForEntry,
  updateIsStarted,
  addPlayersToChallenge,
} = require('./challenge.service');

const createPlayer = async (playerData) => {
  logger.debug('[PlayerService] Creating player');
  try {
    const isPlayerExist = await Players.findOne({
      where: { UserID: playerData.UserID, ChallengeID: playerData.ChallengeID },
    });
    console.log(1);
    if (!isPlayerExist) {
      console.log(2);
      if (await checkIfChallengeAvailableForEntry(playerData.ChallengeID)) {
        const player = await Players.create(playerData);

        await addPlayersToChallenge(playerData.ChallengeID, player.PlayerID);
        await checkAndUpdateIsStartedChallenge(playerData.ChallengeID);
        logger.info('[PlayerService] Player created successfully');
        return player;
      }
    } else {
      throw new Error('User already joined the challenge');
    }
  } catch (error) {
    logger.error(`[PlayerService] Error creating player: ${error.message}`);
    throw error;
  }
};

const getPlayer = async (id) => {
  logger.debug(`[PlayerService] Fetching player with ID: ${id}`);
  try {
    const player = await Players.findByPk(id);
    if (!player) {
      logger.info(`[PlayerService] Player with ID: ${id} not found`);
      return null;
    }
    logger.info('[PlayerService] Player fetched successfully');
    return player;
  } catch (error) {
    logger.error(`[PlayerService] Error fetching player: ${error.message}`);
    throw error;
  }
};

const updatePlayer = async (id, playerData) => {
  logger.debug(`[PlayerService] Updating player with ID: ${id}`);
  try {
    const [updated] = await Players.update(playerData, {
      where: { PlayerID: id },
    });
    if (updated) {
      logger.info('[PlayerService] Player updated successfully');
      return updated;
    } else {
      logger.info('[PlayerService] Player not found for update');
      return null;
    }
  } catch (error) {
    logger.error(`[PlayerService] Error updating player: ${error.message}`);
    throw error;
  }
};

const deletePlayer = async (id) => {
  logger.debug(`[PlayerService] Deleting player with ID: ${id}`);
  try {
    const deleted = await Players.destroy({ where: { PlayerID: id } });
    if (deleted) {
      logger.info('[PlayerService] Player deleted successfully');
      return deleted;
    } else {
      logger.info('[PlayerService] Player not found for deletion');
      return null;
    }
  } catch (error) {
    logger.error(`[PlayerService] Error deleting player: ${error.message}`);
    throw error;
  }
};

const getAllPlayersOfChallenge = async (challengeId) => {
  logger.debug(
    `[PlayerService] Fetching all players for challenge ID: ${challengeId}`
  );
  try {
    const players = await Players.findAll({
      where: { ChallengeID: challengeId },
    });
    logger.info('[PlayerService] Players for challenge fetched successfully');
    return players;
  } catch (e) {
    logger.error(
      `[PlayerService] Error fetching players for challenge: ${e.message}`
    );
    throw e;
  }
};

const checkAndUpdateIsStartedChallenge = async (challengeId) => {
  try {
    await updateIsStarted(challengeId);
    logger.info('[PlayerService] Players for challenge fetched successfully');
  } catch (err) {
    logger.error(`[playerService]  checkAndUpdateIsStartedChallenge error`);
    throw err;
  }
};

module.exports = {
  createPlayer,
  getPlayer,
  updatePlayer,
  deletePlayer,
  getAllPlayersOfChallenge,
};
