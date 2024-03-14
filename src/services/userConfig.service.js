const UserConfig = require('../models/userConfig.model');
const logger = require('../utils/logger');

const createUserConfig = async (userId, tokens) => {
  logger.debug('[UserConfigService] Attempting to create UserConfig record');
  try {
    let userConfig = await UserConfig.findOne({ where: { UserID: userId } });
    if (!userConfig)
      userConfig = await UserConfig.create({
        UserID: userId,
        GoogleRefreshToken: tokens.refresh_token,
        IdToken: tokens.id_token,
      });
    logger.info('[UserConfigService] Record created successfully');
    return userConfig;
  } catch (error) {
    logger.error(
      `[UserConfigService] Error creating UserConfig: ${error.message}`
    );
    throw error;
  }
};

const getUserConfig = async (userId) => {
  try {
    logger.debug(
      `[UserConfigService] Attempting to get UserConfig with ID: ${userId}`
    );
    const userConfig = await UserConfig.findOne({ where: { UserID: userId } });
    if (!userConfig) {
      logger.warn('[UserConfigService] UserConfig not found');
      return null;
    } else {
      logger.info('[UserConfigService] UserConfig retrieved successfully');
      return userConfig['dataValues'];
    }
  } catch (error) {
    logger.error(
      `[UserConfigService] Error getting UserConfig: ${error.message}`
    );
    throw error;
  }
};

const updateUserConfig = async (id, userConfigData) => {
  try {
    const [updated] = await UserConfig.update(userConfigData, {
      where: { ID: id },
    });
    if (updated) {
      logger.info('[UserConfigService] UserConfig updated successfully');
      return updated;
    } else {
      logger.warn('[UserConfigService] UserConfig not found to update');
      return null;
    }
  } catch (error) {
    logger.error(
      `[UserConfigService] Error Updating UserConfig: ${error.message}`
    );
    throw error;
  }
};

module.exports = {
  createUserConfig,
  getUserConfig,
  updateUserConfig,
};
