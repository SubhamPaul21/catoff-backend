const { sequelize } = require('../db/db.js');
const { DataTypes } = require('sequelize');

const Game = sequelize.define(
  'Game',
  {
    GameID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    GameName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    GameType: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    GameDescription: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: 'Games',
    timestamps: false,
  }
);

Game.sync().then(() => {
  console.log('Game Model synced');
});
module.exports = Game;
