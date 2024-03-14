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
};
module.exports = oktoProxyService;
