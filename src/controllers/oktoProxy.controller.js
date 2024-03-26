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

  createWalletForUser: async (req, res) => {
    const userId = req.UserID;

    logger.debug(
      '[OktoProxyController] Attempting to Create New Wallet for Okto user'
    );
    try {
      const result = await oktoProxyService.createWalletForUser(userId);
      logger.debug(
        '[OktoProxyController] Successfully Created New Wallet for Okto user'
      );
      res.json(result);
    } catch (error) {
      logger.error(
        `[OktoProxyController] Error creating wallet for user: `,
        error
      );
      res.status(500).json({
        message: 'Failed to create wallet',
        error: error.message,
      });
    }
  },

  refreshTokenForUser: async (req, res) => {
    const userId = req.UserID;
    logger.debug(
      '[OktoProxyController] Attempting to Create Refresh Token for Okto user'
    );
    try {
      const result = await oktoProxyService.refreshTokenForUser(userId);
      logger.debug(
        '[OktoProxyController] Successfully Created New Refresh Token for Okto user'
      );
      res.json(result);
    } catch (error) {
      logger.error(
        `[OktoProxyController] Error refreshing tokens for user: `,
        error
      );
      res.status(500).json({
        message: 'Failed to refresh tokens',
        error: error.message,
      });
    }
  },

  getUserFromToken: async (req, res) => {
    const userId = req.UserID;
    logger.debug(
      '[OktoProxyController] Attempting to Get User Details of Okto user',
      userId
    );

    try {
      const result = await oktoProxyService.getUserFromToken(userId);
      logger.debug(
        '[OktoProxyController] Successfully Fetched User Details of Okto user'
      );
      res.json(result);
    } catch (error) {
      logger.error(
        `[OktoProxyController] Error retrieving user information: `,
        error
      );
      res.status(500).json({
        message: 'Failed to retrieve user information',
        error: error.message,
      });
    }
  },

  fetchAllWalletsForUser: async (req, res) => {
    const userId = req.UserID;
    logger.debug(
      '[OktoProxyController] Attempting to fetch all wallets for the user'
    );
    try {
      const result = await oktoProxyService.fetchAllWallets(userId);
      logger.debug(
        '[OktoProxyController] Successfully fetched all wallets for the user'
      );
      res.json(result);
    } catch (error) {
      logger.error(
        `[OktoProxyController] Error fetching all wallets for the user: ${error.message}`,
        error
      );
      res.status(500).json({
        message: 'Failed to fetch all wallets for the user',
        error: error.message,
      });
    }
  },

};

module.exports = oktoProxyController;
