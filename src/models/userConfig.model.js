const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/db.js');
const User = require('./user.model');

const UserConfig = sequelize.define('UserConfig', {
  ID: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  UserID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: User,
      key: 'UserID',
    },
  },
  GoogleRefreshToken: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  OktoRefreshToken: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  OktoDeviceToken: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  IdToken: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Devices: {
    type: DataTypes.ARRAY(DataTypes.STRING(255)),
    defaultValue: [],
  },
  DataStreams: {
    type: DataTypes.ARRAY(DataTypes.STRING(255)),
    defaultValue: [],
  },
  DefaultDevice: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
});

module.exports = UserConfig;
