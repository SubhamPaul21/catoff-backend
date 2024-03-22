const { sequelize } = require('../db/db.js');
const { DataTypes } = require('sequelize');

const Challenge = sequelize.define('Challenge', {
  ChallengeID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  ChallengeName: {
    type: DataTypes.STRING(255),
  },
  ChallengeDescription: {
    type: DataTypes.STRING(2048),
  },
  ChallengeCreator: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'UserID',
    },
  },
  ChallengePublicKey: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  StartDate: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  EndDate: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  GameID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'Games',
      key: 'GameID',
    },
  },
  IsActive: {
    type: DataTypes.BOOLEAN,
  },
  IsSettled: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  IsStarted: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  Winner: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: {
      model: 'Players',
      key: 'PlayerID',
    },
  },
  MaxParticipants: {
    type: DataTypes.INTEGER.UNSIGNED,
  },
  // Players: {
  //   type: DataTypes.ARRAY(DataTypes.INTEGER.UNSIGNED),
  //   defaultValue: [],
  // },
  Media: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Wager: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  Target: {
    type: DataTypes.FLOAT.UNSIGNED,
    allowNull: false,
  },
},
{
  timestamps: false, // Disable automatic createdAt and updatedAt columns
});

module.exports = Challenge;
