const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/db.js');
const User = require('./user.model');

const UserConfig = sequelize.define('UserConfig', {
  ID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  UserID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: User,
      key: 'UserID'
    }
  },
  RefreshToken: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  Devices: {
    type: DataTypes.ARRAY(DataTypes.STRING(255)),
    defaultValue: []
  },
  DataStreams: {
    type: DataTypes.ARRAY(DataTypes.STRING(255)),
    defaultValue: []
  },
  DefaultDevice: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
},
{
  tableName: 'UserConfig',
  timestamps: false,
});

module.exports = UserConfig;