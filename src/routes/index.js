const challengeRoutes = require('./challenge.routes');
const gameRoutes = require('./game.routes');
const onGoingChallengeRoutes = require('./onGoingChallenge.routes');
const playerRoutes = require('./player.routes');
const transactionRoutes = require('./transaction.routes');
const userRoutes = require('./user.routes');
const userBoardRoutes = require('./userBoard.routes');
const googleAuthRoutes = require('./googleLogin.routes');
const oktoProxyRoutes = require('./oktoProxy.routes');

module.exports = {
  challengeRoutes,
  gameRoutes,
  onGoingChallengeRoutes,
  playerRoutes,
  transactionRoutes,
  userRoutes,
  userBoardRoutes,
  googleAuthRoutes,
  oktoProxyRoutes,
};
