const { sequelize } = require('../db/db.js');
const { DataTypes } = require('sequelize');
var player = require('./player.model.js');

const ChallengeImage = sequelize.define(
  'ChallengeImage',
  {
    ImageID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    PlayerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Add references in associations
      references: {
        model: player,
        key: 'PlayerID',
      },
    },
    ImageURL: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    UploadDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: 'ChallengeImage',
    timestamps: false,
  }
);

ChallengeImage.sync().then(() => {
  console.log('ChallengeImage Model synced');
});
module.exports = ChallengeImage;
