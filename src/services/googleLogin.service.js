const oauth2Client = require('../middleware/googleLogin.middleware');
const { google } = require('googleapis');
const logger = require('../utils/logger');

const GoogleAuthService = {
  getGoogleAuthURL: () => {
    logger.debug('[GoogleAuthService] Generating Google Auth URL.');
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['email', 'profile', 'activity.read'],
    });
    return url;
  },

  getGoogleUser: async (code) => {
    if (!code) {
      logger.error(
        '[GoogleAuthService] Code not found in Google OAuth callback request.'
      );
      throw new Error('Code not found');
    }

    logger.debug('[GoogleAuthService] Exchanging code for Google tokens.');
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    logger.debug('[GoogleAuthService] Fetching user information from Google.');
    const userInfoResponse = await oauth2.userinfo.get();

    if (userInfoResponse?.data) {
      logger.debug(
        '[GoogleAuthService] Google user info retrieved successfully.',
        { email: userInfoResponse.data.email }
      );
    } else {
      logger.warn('[GoogleAuthService] No user info returned from Google.');
    }
    return userInfoResponse.data;
  },

  revokeGoogleCredentials: async () => {
    logger.debug('[GoogleAuthService] Revoking Google OAuth Credentials.');
    await oauth2Client.revokeCredentials();
    logger.debug(
      '[GoogleAuthService] Google OAuth credentials revoked successfully.'
    );
  },
};

module.exports = GoogleAuthService;
