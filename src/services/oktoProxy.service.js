const axios = require('axios');
const { getUserConfig } = require('../services/userConfig.service');
const logger = require('../utils/logger');

const OKTO_TECH_API_BASE_URL = 'https://sandbox-api.okto.tech/';
const OKTO_TECH_API_CLIENT_KEY = process.env.OKTO_TECH_API_CLIENT_KEY; // Ensure you have this in your .env file

const oktoProxyService = {
  authenticateUserWithOkto: async (userId) => {
    const userConfig = await getUserConfig(userId);
    logger.debug(
      '[OktoProxyService] Sending authentication request to Okto.tech'
    );
    try {
      const response = await axios.post(
        `${OKTO_TECH_API_BASE_URL}api/v1/authenticate`,
        {
          id_token: userConfig.IdToken,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': OKTO_TECH_API_CLIENT_KEY,
          },
        }
      );
      logger.debug(
        `[OktoProxyService] Authentication successful with Okto.tech with response: `
      );
      return response.data;
    } catch (error) {
      logger.error(
        `[OktoProxyService] Failed to authenticate with Okto.tech: `,
        error
      );
      throw error;
    }
  },

  setPinForOktoUser: async (userId) => {
    const userConfig = await getUserConfig(userId);
    if (!userConfig || !userConfig.OktoAuthToken || !userConfig.IdToken) {
      logger.error(
        `[OktoProxyService] User config missing or tokens not found for userID: ${userId}`
      );
      throw new Error('User config or tokens not found');
    }

    const setPinData = {
      id_token: userConfig.IdToken,
      token: userConfig.OktoAuthToken,
      relogin_pin: '123456', // Fixed relogin_pin as per your requirement
      purpose: 'set_pin',
    };

    logger.debug(
      `[OktoProxyService] Sending set-pin request to Okto.tech for userID: ${userId}`
    );

    try {
      const response = await axios.post(
        `${OKTO_TECH_API_BASE_URL}api/v1/set_pin`,
        setPinData,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': OKTO_TECH_API_CLIENT_KEY,
          },
        }
      );

      logger.debug(
        `[OktoProxyService] Set-pin successful for userID: ${userId} with response: `,
        response.data
      );

      // Check if the response structure matches your expectation
      if (response.data && response.data.status === 'success') {
        // Assuming the updated tokens are nested within `data.data`
        const updatedTokens = response.data.data;

        // Update the UserConfig with the new tokens
        await UserConfig.update(
          {
            OktoAuthToken: updatedTokens.auth_token,
            OktoRefreshToken: updatedTokens.refresh_auth_token,
            OktoDeviceToken: updatedTokens.device_token,
          },
          {
            where: { UserID: userId },
          }
        );

        logger.debug(
          `[OktoProxyService] UserConfig updated successfully for userID: ${userId}`
        );
      } else {
        logger.error(
          `[OktoProxyService] Failed to set pin, response was not successful.`
        );
      }

      return {
        status: response.data.status,
        message: 'Pin set successfully.',
        authToken: response.data.data.auth_token,
      };
    } catch (error) {
      logger.error(
        `[OktoProxyService] Failed to set pin for userID: ${userId}: `,
        error
      );
      throw error;
    }
  },

  createWalletForUser: async (userId) => {
    const userConfig = await getUserConfig(userId);
    if (!userConfig || !userConfig.OktoAuthToken) {
      logger.error(
        `[OktoProxyService] OktoAuthToken not found for userID: ${userId}`
      );
      throw new Error('OktoAuthToken not found');
    }

    const authToken = userConfig.OktoAuthToken;

    try {
      const response = await axios.post(
        `${OKTO_TECH_API_BASE_URL}api/v1/wallet`,
        {}, // No body is required for this request as per your description
        {
          headers: {
            Accept: 'application/json',
            'x-api-key': OKTO_TECH_API_CLIENT_KEY,
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      logger.debug(
        `[OktoProxyService] Wallet creation successful for userID: ${userId}`,
        response.data
      );

      // Extract the wallet address for SOLANA_DEVNET
      const solanaDevnetWallet = response.data.data.wallets.find(
        (wallet) => wallet.network_name === 'SOLANA_DEVNET'
      );
      if (!solanaDevnetWallet) {
        throw new Error(
          'SOLANA_DEVNET wallet address not found in the response'
        );
      }

      // Update the User model with the Solana Devnet wallet address
      await User.update(
        { WalletAddress: solanaDevnetWallet.address },
        { where: { UserID: userId } }
      );

      logger.debug(
        `[OktoProxyService] User model updated with SOLANA_DEVNET wallet address for userID: ${userId}`
      );

      // Return the response or process it as needed
      return {
        status: response.status,
        message: 'Wallet created successfully.',
        data: response.data.wallets,
      };
    } catch (error) {
      logger.error(
        `[OktoProxyService] Failed to create wallet for userID: ${userId}: `,
        error
      );
      throw error;
    }
  },
};
module.exports = oktoProxyService;
