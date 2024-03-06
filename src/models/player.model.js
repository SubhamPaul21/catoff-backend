const { sequelize } = require('../db/db.js');
const { DataTypes } = require('sequelize');
var User = require('./user.model.js');
var Challenge = require('./challenge.model.js');

const Player = sequelize.define(
  'Player',
  {
    PlayerID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Add references in associations
      references: {
        model: User,
        key: 'UserID',
      },
    },
    ChallengeID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Challenge,
        key: 'ChallengeID',
      },
      // Add references in associations
    },
    Value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
  },
  {
    tableName: 'Players',
    timestamps: false,
  }
);

Player.sync().then(() => {
  console.log('Players Model synced');
});
module.exports = Player;
