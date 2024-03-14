const authService = require('../services/googleLogin.service');
const logger = require('../utils/logger');
require('dotenv').config();

const authController = {
  redirectToGoogle: (req, res) => {
    try {
      const url = authService.getGoogleAuthURL();
      logger.debug(
        '[GoogleLoginController] Redirecting user to Google for authentication.'
      );
      res.redirect(url);
    } catch (error) {
      logger.error('[GoogleLoginController] Error in redirecting to Google.', {
        error: error.message,
      });
      res.status(500).send('Internal Server Error');
    }
  },

  handleGoogleCallback: async (req, res) => {
    try {
      const { code } = req.query;
      const user = await authService.getGoogleUser(code);
      logger.debug(
        '[GoogleLoginController] Google user info retrieved successfully.',
        { email: user.email }
      );

      // Implement your logic for registering/logging in the user with the retrieved information

      console.log(process.env.SUCCESS_REDIRECT_URL);
      res.redirect(`${process.env.SUCCESS_REDIRECT_URL}?success=true`);
    } catch (error) {
      logger.error(
        '[GoogleLoginController] Error handling Google OAuth callback.',
        { error: error.message }
      );
      res.status(500).send('Internal Server Error');
    }
  },

  signOut: async (req, res) => {
    try {
      await authService.revokeGoogleCredentials();
      logger.debug(
        '[GoogleLoginController] Google user credentials revoked successfully.'
      );
      res.send('Logged out successfully');
    } catch (error) {
      logger.error('[GoogleLoginController] Error signing out.', {
        error: error.message,
      });
      res.status(500).send('Internal Server Error');
    }
  },
};

module.exports = authController;
