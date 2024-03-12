const User = require('./user.model');
const Player = require('./player.model');
const Challenge = require('./challenge.model');
const Transaction = require('./transaction.model');
const Game = require('./game.model');
const WalletAddress = require('./walletAddress.model');
// Import other models as needed

// Define associations
Player.belongsTo(User, { foreignKey: 'UserID' });
Player.belongsTo(Challenge, { foreignKey: 'ChallengeID' });

User.hasMany(Player, { foreignKey: 'UserID' });
Challenge.hasMany(Player, { foreignKey: 'ChallengeID' });

// WalletAddress.belongsTo(User, { foreignKey: 'WalletID' });
// User.hasOne(WalletAddress, { foreignKey: 'WalletID' });
// In User model definition
User.hasOne(WalletAddress, { foreignKey: 'UserID' });

// In WalletAddress model definition
WalletAddress.belongsTo(User, { foreignKey: 'UserID' });

User.hasOne(WalletAddress, { foreignKey: 'WalletID' });
WalletAddress.belongsTo(User, { foreignKey: 'WalletID' });

Challenge.belongsTo(Game, { foreignKey: 'GameID' });
Game.hasMany(Challenge, { foreignKey: 'GameID' });

Transaction.belongsTo(User, { foreignKey: 'UserID' });
User.hasMany(Transaction, { foreignKey: 'UserID' });

module.exports = {
  User,
  Player,
  Challenge,
  Transaction,
  Game,
  WalletAddress,
};
