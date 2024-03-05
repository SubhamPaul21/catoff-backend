let User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Connection, PublicKey } = require('@solana/web3.js');
const { Op } = require('sequelize');
let ExpressError = require('../utils/expressErrors');
const nacl = require('tweetnacl');
const bs58 = require('bs58');
const WalletAddress = require('../models/walletAddress.model');
require('dotenv').config();

module.exports.AddUserDetails = async (userId, email, userName) => {
  try {
    const user = await User.findOne({
      where: { UserID: userId },
    });
    if (!user) {
      throw new ExpressError('User doesnt exist', 401);
    }
    let updates = {
      Email: email,
      UserName: userName,
    };
    await user.update(updates);
    return user;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

// module.exports.login = async (userName, password)=>{
//     try{
//         const user = await User.findOne({ UserName: userName });
//         if (!user) {
//             throw new Error('Authentication failed');
//         }
//         const passwordMatch = await bcrypt.compare(password, user.Password);
//         if (!passwordMatch) {
//             throw new Error('Authentication failed');
//         }
//         const token = jwt.sign({ userId: user.UserId }, process.env.JWT_SECRET, {
//             expiresIn: '1h',
//         });
//         await user.update({ LastLoginDate: new Date() });
//         return token;
//     }
//     catch(e){
//         return e
//     }
// }

module.exports.siwsVerification = async (signature, message, publicKey) => {
  try {
    let user;
    const decodedPublicKey = bs58.decode(publicKey);
    const publicKeyUint8Array = new Uint8Array(decodedPublicKey);
    const signatureBuffer = Buffer.from(bs58.decode(signature));
    const verified = nacl.sign.detached.verify(
      new TextEncoder().encode(message),
      signatureBuffer,
      publicKeyUint8Array
    );
    if (!verified) {
      throw new ExpressError('Invalid Signature', 401);
    }
    let wallet = await WalletAddress.findOne({ WalletAddress: publicKey });
    if (!wallet) {
       wallet = new WalletAddress({
        WalletAddress: publicKey,
        Signature: signature,
      });
      
      wallet = await wallet.save();
      // create new user
      user = new User({
        // Email: email,
        // UserName: userName,
        RegistrationDate: new Date(),
        LastLoginDate: null,
        IsEmailVerified: false,
        IsActive: true,
        WalletID: wallet.WalletID
      });
      await user.save();
    }
    user = await User.findOne({WalletID:wallet.WalletID})
    // console.log(user)
    const token = jwt.sign({ userId: user.UserID }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    await user.update({ LastLoginDate: new Date() });
    return token;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports.getUserIds = async (searchTerm) => {
  try {
    const users = await User.findAll({
      attributes: ['UserID'],
      where: {
        UserName: { [Op.like]: `%${searchTerm}%` },
      },
    });
    let arr = users.map((ele) => ele['UserID']);
    return arr;
  } catch (e) {
    throw e;
  }
};

exports.createUser = async (userData) => {
  try {
    const user = await User.create(userData);
    return user;
  } catch (error) {
    throw new Error('Error creating user');
  }
};

exports.getAllUsers = async () => {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    throw new Error('Error retrieving users');
  }
};

exports.getUserById = async (id) => {
  try {
    const user = await User.findByPk(id);
    return user;
  } catch (error) {
    throw new Error('Error finding user');
  }
};

exports.updateUser = async (id, updateData) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return null;
    }
    const updatedUser = await user.update(updateData);
    return updatedUser;
  } catch (error) {
    throw new Error('Error updating user');
  }
};

exports.deleteUser = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return null;
    }
    await user.destroy();
    return true;
  } catch (error) {
    throw new Error('Error deleting user');
  }
};