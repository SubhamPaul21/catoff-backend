const { sequelize } = require("../db/db.js");
const { DataTypes } = require("sequelize");
var User = require("./user.model.js")
var challenge = require("./challenge.model.js")



const Players = sequelize.define('Players', {
    playerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Add references in associations
      references: {
        model: User,
        key: 'UserID'
      }
    },
    challengeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: challenge,
        key: 'ChallengeId'
      }
      // Add references in associations
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Players',
    timestamps: false
  });


  Players.sync().then(() => {
    console.log("Players Model synced");
  });
  module.exports = Players;