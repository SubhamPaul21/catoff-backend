// const { sequelize } = require('../db/db.js');
// const { DataTypes } = require('sequelize');
// const WalletAddress = require('./walletAddress.model');

// const User = sequelize.define(
//   'User',
//   {
//     UserID: {
//       type: DataTypes.INTEGER.UNSIGNED,
//       autoIncrement: true,
//       primaryKey: true,
//       allowNull: false,
//     },
//     Email: {
//       type: DataTypes.STRING(255),
//       allowNull: true,
//       unique: true,
//     },
//     UserName: {
//       type: DataTypes.STRING(50),
//       allowNull: true,
//       unique: true,
//     },
//     RegistrationDate: {
//       type: DataTypes.DATE,
//       allowNull: true,
//     },
//     LastLoginDate: {
//       type: DataTypes.DATE,
//       allowNull: true,
//     },
//     IsEmailVerified: {
//       type: DataTypes.BOOLEAN,
//       allowNull: true,
//       defaultValue: false,
//     },
//     IsActive: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//       defaultValue: true,
//     },
//     WalletID: {
//       type: DataTypes.INTEGER,
//       allowNull: false, // or false depending on your requirements
//       references: {
//         model: WalletAddress,
//         key: 'WalletID',
//       },
//     },
//     Credits: {
//       type: DataTypes.FLOAT,
//       allowNull: false, // or false depending on your requirements
//     },
//     Password: {
//       type: DataTypes.STRING(255),
//       allowNull: true,
//     },
//     // Password: Handle encryption in your application logic
//   },
//   {
//     tableName: 'Users',
//     timestamps: false,
//   }
// );

// User.sync().then(() => {
//   console.log('User Model synced');
// });
// module.exports = User;

const { sequelize } = require('../db/db.js');
const { DataTypes } = require('sequelize');

const User = sequelize.define(
  'User',
  {
    UserID: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    Email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: true,
    },
    UserName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
    },
    WalletAddress: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: true,
    },
    Credits: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
    },
    ProfilePicture: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    InvestedCredits: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    timestamps: false, // Disable automatic createdAt and updatedAt columns
  }
);

module.exports = User;
