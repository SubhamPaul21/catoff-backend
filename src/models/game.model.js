const { sequelize } = require("../db/db.js");
const { DataTypes } = require("sequelize");


const Game = sequelize.define('Game', {
    GameId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    GameType: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Game',
    timestamps: false
  });


  User.sync().then(() => {
    console.log("User Model synced");
  });
  module.exports = User;

  