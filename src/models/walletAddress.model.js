
const { sequelize } = require("../db/db.js");
const { DataTypes } = require("sequelize");
var User = require("./user.model.js")

const WalletAddress = sequelize.define('WalletAddress', {
    WalletID: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    UserID: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: 'UserID'
      }
    },
    WalletAddress: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    IsVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Signature: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    AddedDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
  }, {
    tableName: 'WalletAddresses',
    timestamps: false
  });
  

  WalletAddress.sync().then(() => {
    console.log("WalletAddress Model synced");
  });
  
  
  module.exports = WalletAddress;