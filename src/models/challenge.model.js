const { sequelize } = require('../db/db.js');
const { DataTypes } = require('sequelize');
var User = require('./user.model.js');
const Game = require('./game.model.js');

const Challenge = sequelize.define(
  'Challenge',
  {
    ChallengeID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    ChallengeName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ChallengeDescription: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ChallengeCreator: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'UserID',
      },
      // Add references in associations
    },
    StartDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    EndDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    CreationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    ChallengeType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Add references in associations
      references: {
        model: Game,
        key: 'GameID',
      },
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    Winners: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'UserID',
      },
      // Add references in associations
    },
    Media: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    Wager: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0
    }
  },
  {
    sequelize,
    tableName: 'Challenges',
    timestamps: false,
  }
);

Challenge.sync().then(() => {
  console.log('Challenge Model synced');
});
module.exports = Challenge;
