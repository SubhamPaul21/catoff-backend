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

  getPortfolioDataForUser: async (req, res) => {
    const userId = req.UserID;
    logger.debug(
      '[OktoProxyController] Attempting to fetch portfolio data for the user'
    );
    try {
      const result = await oktoProxyService.fetchPortfolioData(userId);
      logger.debug(
        '[OktoProxyController] Successfully fetched portfolio data for the user'
      );
      res.json(result);
    } catch (error) {
      logger.error(
        `[OktoProxyController] Error fetching portfolio data for the user: ${error.message}`,
        error
      );
      res.status(500).json({
        message: 'Failed to fetch portfolio data for the user',
        error: error.message,
      });
    }
  },

  executeRawTransaction: async (req, res) => {
    const userId = req.UserID;
    const { network_name, transaction } = req.body;
    logger.debug(
      '[OktoProxyController] Attempting to execute raw transaction for the user'
    );
    try {
      const result = await oktoProxyService.executeRawTransaction(
        userId,
        network_name,
        transaction
      );
      logger.debug(
        '[OktoProxyController] Successfully executed raw transaction for the user'
      );
      res.json(result);
    } catch (error) {
      logger.error(
        `[OktoProxyController] Error executing raw transaction for the user: ${error.message}`,
        error
      );
      res.status(500).json({
        message: 'Failed to execute raw transaction for the user',
        error: error.message,
      });
    }
  },

  getRawTransactionStatus: async (req, res) => {
    const userId = req.UserID;
    const { order_id } = req.query;
    logger.debug(
      '[OktoProxyController] Attempting to fetch raw transaction status for order_id:',
      order_id
    );
    try {
      const result = await oktoProxyService.fetchRawTransactionStatus(
        userId,
        order_id
      );
      logger.debug(
        '[OktoProxyController] Successfully fetched raw transaction status for order_id:',
        order_id
      );
      res.json(result);
    } catch (error) {
      logger.error(
        `[OktoProxyController] Error fetching raw transaction status for order_id: ${order_id}: ${error.message}`,
        error
      );
      res.status(500).json({
        message: 'Failed to fetch raw transaction status',
        error: error.message,
      });
    }
  },

  executeTokenTransfer: async (req, res) => {
    const { token, quantity } = req.body;
    const userId = req.UserID;
    logger.debug('[OktoProxyController] Attempting to execute token transfer');
    try {
      const result = await oktoProxyService.transferTokens(
        userId,
        token,
        quantity
      );
      logger.debug(
        '[OktoProxyController] Token transfer executed successfully'
      );
      res.json(result);
    } catch (error) {
      logger.error(
        `[OktoProxyController] Error executing token transfer: ${error.message}`,
        error
      );
      res.status(500).json({
        message: 'Failed to execute token transfer',
        error: error.message,
      });
    }
  },
};

module.exports = oktoProxyController;
