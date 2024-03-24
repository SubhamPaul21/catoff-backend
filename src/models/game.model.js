// const { sequelize } = require('../db/db.js');
// const { DataTypes } = require('sequelize');

// const Game = sequelize.define(
//   'Game',
//   {
//     GameID: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//       allowNull: false,
//     },
//     GameName: {
//       type: DataTypes.STRING(50),
//       allowNull: false,
//     },
//     GameType: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     GameDescription: {
//       type: DataTypes.STRING(255),
//       allowNull: false,
//     },
//   },
//   {
//     tableName: 'Games',
//     timestamps: false,
//   }
// );

// Game.sync().then(() => {
//   console.log('Game Model synced');
// });
// module.exports = Game;

const { sequelize } = require('../db/db.js');
const { DataTypes } = require('sequelize');

const Game = sequelize.define('Game', {
  GameID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  GameName: {
    type: DataTypes.STRING(255),
  },
  ParticipationType: {
    type: DataTypes.ENUM('0v1', '1v1', 'nvn'),
    allowNull: true,
  },
  GameType: {
    type: DataTypes.INTEGER.UNSIGNED,
  },
  GameDescription: {
    type: DataTypes.STRING(255),
  },
},
{
  timestamps: false, // Disable automatic createdAt and updatedAt columns
});

module.exports = Game;
