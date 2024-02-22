const { sequelize } = require("../db/db.js");
const { DataTypes } = require("sequelize");

const User = sequelize.define('User', {
    UserID: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    Email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    UserName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    RegistrationDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    LastLoginDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    IsEmailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    Password: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
    // Password: Handle encryption in your application logic
  }, {
    tableName: 'Users',
    timestamps: false
  });
  
  User.sync().then(() => {
    console.log("User Model synced");
  });
  module.exports = User;
