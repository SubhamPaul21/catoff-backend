const oktoProxyService = require('../services/oktoProxy.service');
const logger = require('../utils/logger');

const oktoProxyController = {
  authenticateOktoUser: async (req, res) => {
    const userId = req.UserID;
    try {
      logger.debug(
        '[OktoProxyController] Forwarding authentication request to Okto.tech'
      );
      const response = await oktoProxyService.authenticateUserWithOkto(userId);
      res.json(response);
    } catch (error) {
      logger.error(
        '[OktoProxyController] Error forwarding authentication request to Okto.tech',
        error
      );
      res.status(500).json({
        message: 'Failed to authenticate with Okto.tech',
        error: error.message,
      });
    }
  },

  setNewPinOktoUser: async (req, res) => {
    const userId = req.UserID;
    logger.debug(
      '[OktoProxyController] Attempting to set new PIN for Okto user'
    );

    try {
      // Call the service function to set the new PIN
      const response = await oktoProxyService.setPinForOktoUser(userId);
      logger.debug(
        '[OktoProxyController] Successfully set new PIN for Okto user'
      );
      res.json(response);
    } catch (error) {
      logger.error(
        '[OktoProxyController] Failed to set new PIN for Okto user',
        {
          error: error.message,
        }
      );
      res.status(500).json({
        message: 'Failed to set new PIN for Okto user',
        error: error.message,
      });
    }
  },
};

module.exports = oktoProxyController;
