const User = require('./user.model');
const Player = require('./player.model');
const Challenge = require('./challenge.model');
const Transaction = require('./transaction.model');
const Game = require('./game.model');
const UserConfig = require('./userConfig.model');
const { sequelize } = require('../db/db.js');

// Import other models as needed

User.hasMany(Transaction, {
  foreignKey: 'UserID',
  as: 'transactions',
});

// Transaction belongs to User (To)
Transaction.belongsTo(User, {
  foreignKey: 'To',
  as: 'toUser',
});

// Transaction belongs to User (From)
Transaction.belongsTo(User, {
  foreignKey: 'From',
  as: 'fromUser',
});

User.hasOne(UserConfig, {
  foreignKey: 'UserID',
});
UserConfig.belongsTo(User, {
  foreignKey: 'UserID',
});

Challenge.hasMany(Player, {
  foreignKey: 'ChallengeID',
  as: 'players',
});
Player.belongsTo(Challenge, {
  foreignKey: 'ChallengeID',
  as: 'challenge',
});
User.hasMany(Challenge, {
  foreignKey: 'ChallengeCreator',
  as: 'createdChallenges',
});
Challenge.belongsTo(User, {
  foreignKey: 'ChallengeCreator',
  as: 'challengeCreator',
});
Player.belongsTo(User, {
  foreignKey: 'UserID',
  as: 'user',
});
Game.hasMany(Challenge, {
  foreignKey: 'GameID',
  as: 'challenges',
});
Challenge.belongsTo(Game, {
  foreignKey: 'GameID',
  as: 'game',
});
Challenge.belongsTo(User, {
  foreignKey: 'ChallengeCreator',
  as: 'creator',
});
User.hasMany(Challenge, {
  foreignKey: 'ChallengeCreator',
  as: 'challenges',
});
// Challenge has one Winner (Player)
Challenge.belongsTo(Player, {
  foreignKey: 'Winner',
  as: 'winner',
});
Player.hasMany(Challenge, {
  foreignKey: 'Winner',
  as: 'wonChallenges',
});

sequelize
  .sync()
  .then(() => {
    console.log('All tables have been synchronized');
  })
  .catch((error) => {
    console.error('Error synchronizing tables:', error);
  });
// // Define associations
// Player.belongsTo(User, { foreignKey: 'UserID' });
// Player.belongsTo(Challenge, { foreignKey: 'ChallengeID' });

// User.hasMany(Player, { foreignKey: 'UserID' });
// Challenge.hasMany(Player, { foreignKey: 'ChallengeID' });

// // WalletAddress.belongsTo(User, { foreignKey: 'WalletID' });
// // User.hasOne(WalletAddress, { foreignKey: 'WalletID' });
// // In User model definition
// User.hasOne(WalletAddress, { foreignKey: 'UserID' });

// // In WalletAddress model definition
// WalletAddress.belongsTo(User, { foreignKey: 'UserID' });

// User.hasOne(WalletAddress, { foreignKey: 'WalletID' });
// WalletAddress.belongsTo(User, { foreignKey: 'WalletID' });

// Challenge.belongsTo(Game, { foreignKey: 'GameID' });
// Game.hasMany(Challenge, { foreignKey: 'GameID' });

// User.hasMany(Transaction, { foreignKey: 'UserID' });
// Transaction.belongsTo(User, { foreignKey: 'UserID' });

// User.hasOne(UserConfig, { foreignKey: 'UserID' });
// UserConfig.belongsTo(User, { foreignKey: 'UserID' });

module.exports = {
  User,
  Player,
  Challenge,
  Transaction,
  Game,
  UserConfig,
};
