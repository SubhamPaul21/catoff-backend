const User = require('./user.model');
const Player = require('./player.model');
const Challenge = require('./challenge.model');
// Import other models as needed

// Define associations
Player.belongsTo(User, { foreignKey: 'UserID' });
Player.belongsTo(Challenge, { foreignKey: 'ChallengeID' });

User.hasMany(Player, { foreignKey: 'UserID' });
Challenge.hasMany(Player, { foreignKey: 'ChallengeID' });

module.exports = {
  User,
  Player,
  Challenge,
};
