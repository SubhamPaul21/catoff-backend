const UserConfig = require('../models/userConfig');
const logger = require('../utils/logger');

const createUSerConfig = async (UserConfigData) => {
    logger.debug('[UserConfigService] Attempting to create UserConfig record');
    try {
      const userConfig = await UserConfig.create(UserConfigData);
      logger.info('[UserConfigService] Record created successfully');
      return userConfig;
    } catch (error) {
      logger.error(
        `[UserConfigService] Error creating UserConfig: ${error.message}`
      );
      throw error;
    }
};

const getUserConfig = async (id)=>{
    try{
        logger.debug(`[UserConfigService] Attempting to get UserConfig with ID: ${id}`);
        const userConfig = await UserConfig.findByPk(id);
        if (!userConfig) {
            logger.warn('[UserConfigService] UserConfig not found');
            return null;
        }
        else{
            logger.info('[UserConfigService] UserConfig retrieved successfully');
            return 
        }
    }catch(error){
        logger.error(
            `[UserConfigService] Error getting UserConfig: ${error.message}`
          );
        throw error;
    }
}

const updateUserConfig = async(id, userConfigData)=>{
    try{
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
    }catch(error){
        logger.error(
            `[UserConfigService] Error Updating UserConfig: ${error.message}`
          );
        throw error;
    }
}

module.exports = {
    createUSerConfig,
    getUserConfig,
    updateUserConfig
  };