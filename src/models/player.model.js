const { sequelize } = require('../db/db.js');
const { DataTypes } = require('sequelize');
var User = require('./user.model.js');
var Challenge = require('./challenge.model.js');

// const Player = sequelize.define(
//   'Player',
//   {
//     PlayerID: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//       allowNull: false,
//     },
//     UserID: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       // Add references in associations
//       references: {
//         model: User,
//         key: 'UserID',
//       },
//     },
//     ChallengeID: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: Challenge,
//         key: 'ChallengeID',
//       },
//       // Add references in associations
//     },
//     Value: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       defaultValue: 0,
//     },
//     Target: {
//       type: DataTypes.INTEGER,
//       allowNull: true
//     },
//     Device: {
//       type: DataTypes.STRING(255),
//       allowNull: true,
//     },
//     DeviceDataSource: {
//       type: DataTypes.STRING(255),
//       allowNull: true,
//     },
//   },
//   {
//     tableName: 'Players',
//     timestamps: false,
//   }
// );

// Player.sync().then(() => {
//   console.log('Players Model synced');
// });
// module.exports = Player;

const Player = sequelize.define('Player', {
  PlayerID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  UserID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'UserID',
    },
  },
  ChallengeID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'Challenges',
      key: 'ChallengeID',
    },
  },
  Value: {
    type: DataTypes.FLOAT.UNSIGNED,
    allowNull: true,
    defaultValue: 0,
  },
  Device: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  DeviceDataSource: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  PlayerPublicKey: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
},
{
  timestamps: false, // Disable automatic createdAt and updatedAt columns
});

module.exports = Player;
