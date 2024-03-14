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
      res
        .status(500)
        .json({
          message: 'Failed to authenticate with Okto.tech',
          error: error.message,
        });
    }
  },
};

module.exports = oktoProxyController;
