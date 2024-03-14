const { google } = require('googleapis');
const logger = require('../utils/logger');
require('dotenv').config();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

logger.info('[GoogleLoginMiddleware] OAuth2 client configured.');

module.exports = oauth2Client;
