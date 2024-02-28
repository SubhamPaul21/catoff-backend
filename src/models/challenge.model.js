const { sequelize } = require('../db/db.js');
const { DataTypes } = require('sequelize');
var User = require('./user.model.js');
const Game = require('./game.model.js');

const Challenge = sequelize.define(
  'Challenge',
  {
    ChallengeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    challengeName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    challengeDescription: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    challengeCreator: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'UserID',
      },
      // Add references in associations
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    EndDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    creationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    challengeType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Add references in associations
      references: {
        model: Game,
        key: 'GameId',
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    Winners: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'UserID',
      },
      // Add references in associations
    },
  },
  {
    tableName: 'Challenge',

    timestamps: false,
  }
);

Challenge.sync().then(() => {
  console.log('Challenge Model synced');
});
module.exports = Challenge;
