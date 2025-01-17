let User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
let ExpressError = require('../utils/expressErrors');
const nacl = require('tweetnacl');
const bs58 = require('bs58');
const WalletAddress = require('../models/walletAddress.model');
require('dotenv').config();
const logger = require('../utils/logger');
const { createUserConfig } = require('./userConfig.service');
const UserConfig = require('../models/userConfig.model');

const AddUserDetails = async (userId, email, userName) => {
  logger.debug(
    `[UserService] Attempting to add user details for UserID: ${userId}`
  );
  try {
    const user = await User.findOne({
      where: { UserID: userId },
    });
    if (!user) {
      logger.error('[UserService] User does not exist');
      throw new ExpressError('User doesnt exist', 401);
    }

    let doUserExist = await User.findOne({ where: { Email: email } });
    if (doUserExist) {
      logger.error('[UserService] User email already exist');
      throw new ExpressError('User email already exist', 500);
    }

    doUserExist = await User.findOne({ where: { UserName: userName } });
    if (doUserExist) {
      logger.error('[UserService] User name already exist');
      throw new ExpressError('User name already exist', 500);
    }

    let updates = {
      Email: email,
      UserName: userName,
    };

    await user.update(updates);
    logger.info('[UserService] User details added successfully');
    return user;
  } catch (e) {
    logger.error(`[UserService] Error adding user details: ${e.message}`);
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

const signin = async (data, tokens) => {
  logger.debug(`[UserService] Attempting to sign in or sign up.`);
  try {
    let user = await User.findOne({ where: { Email: data.email } });

    if (!user) {
      // If user does not exist, create a new user entry.
      user = await User.create({
        Email: data.email,
        ProfilePicture: data.picture, // This line needs to be updated after user creation
      });
      user.UserName = `User #${user.UserID}`;
      user.save();
    } else {
      // If user exists, update their ProfilePicture in case it has changed.
      await user.update({ ProfilePicture: data.picture });
    }

    // Ensure UserName is set after user is created or fetched
    if (!user.UserName) {
      await user.update({ UserName: `User #${user.UserID}` });
    }

    // Fetch or create UserConfig and update tokens.
    let userConfig = await UserConfig.findOne({
      where: { UserID: user.UserID },
    });

    if (!userConfig) {
      userConfig = await UserConfig.create({
        UserID: user.UserID,
        GoogleRefreshToken: tokens.refresh_token,
        IdToken: tokens.id_token,
      });
    } else {
      // Update tokens for existing users.
      await userConfig.update({
        GoogleRefreshToken: tokens.refresh_token,
        IdToken: tokens.id_token,
      });
    }

    // Generate JWT Token
    const JwtToken = jwt.sign({ userId: user.UserID }, process.env.JWT_SECRET, {
      expiresIn: '5h',
    });

    logger.info('[UserService] User sign in/up successful.');
    return { JwtToken, user };
  } catch (e) {
    logger.error(`[UserService] Sign in/up failed: ${e.stack}`);
    throw e;
  }
};

const siwsVerification = async (signature, message, publicKey) => {
  logger.debug(
    `[UserService] Attempting SIWS verification for publicKey: ${publicKey}`
  );
  try {
    const decodedPublicKey = bs58.decode(publicKey);
    const publicKeyUint8Array = new Uint8Array(decodedPublicKey);
    const signatureBuffer = Buffer.from(bs58.decode(signature));
    const verified = nacl.sign.detached.verify(
      new TextEncoder().encode(message),
      signatureBuffer,
      publicKeyUint8Array
    );

    if (!verified) {
      logger.error('[UserService] Invalid signature');
      throw new ExpressError('Invalid Signature', 401);
    }
    let user;

    let wallet = await WalletAddress.findOne({
      where: { WalletAddress: publicKey },
    });

    if (!wallet) {
      wallet = await WalletAddress.create({
        WalletAddress: publicKey,
        Signature: signature,
      });

      user =
        (await User.findOne({ where: { WalletID: wallet.WalletID } })) ||
        (await User.create({
          RegistrationDate: new Date(),
          LastLoginDate: null,
          IsEmailVerified: false,
          IsActive: true,
          WalletID: wallet.WalletID,
          Credits: 0.0,
        }));
      await createUserConfig(user.UserID);
    }

    user = await User.findOne({ where: { WalletID: wallet.WalletID } });
    const token = jwt.sign({ userId: user.UserID }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    await user.update({ LastLoginDate: new Date() });
    logger.info('[UserService] SIWS verification successful, token issued');
    return token;
  } catch (e) {
    logger.error(`[UserService] SIWS verification failed: ${e.message}`);
    throw e;
  }
};

const updateCredit = async (userId, wager) => {
  logger.debug(`[UserService] Attempting updating credit for user`);
  try {
    let user = await User.findOne({ where: { UserID: userId } });
    if (user) {
      let curCred = user.Credits;
      if (curCred >= wager) {
        let newCred = curCred - wager;
        let newInvestedCred = user.InvestedCredits + wager;
        await user.update({
          Credits: newCred,
          InvestedCredits: newInvestedCred,
        });
      } else {
        throw new Error('Not enough Credit for the user to join the challenge');
      }
    } else {
      throw new Error('User not found');
    }
    logger.info(
      '[UserService] Credits updated for a user when joined the challenge'
    );
    return;
  } catch (err) {
    logger.error(`[UserService] Update credit failed: ${err.message}`);
    throw err;
  }
};

const getUserIds = async (searchTerm) => {
  logger.debug(`[UserService] Fetching user IDs by searchTerm: ${searchTerm}`);
  try {
    const users = await User.findAll({
      attributes: ['UserID'],
      where: { UserName: { [Op.iLike]: `%${searchTerm}%` } },
    });
    const userIds = users.map((ele) => ele['UserID']);
    logger.info('[UserService] User IDs fetched successfully');
    return userIds;
  } catch (e) {
    logger.error(`[UserService] Error fetching user IDs: ${e.message}`);
    throw e;
  }
};

const createUser = async (userData) => {
  logger.debug('[UserService] Attempting to create a new user');
  try {
    const user = await User.create(userData);
    logger.info('[UserService] User created successfully');
    return user;
  } catch (error) {
    logger.error(`[UserService] Error creating user: ${error.message}`);
    throw new Error('Error creating user');
  }
};

const getAllUsers = async () => {
  logger.debug('[UserService] Fetching all users');
  try {
    const users = await User.findAll();
    logger.info('[UserService] All users fetched successfully');
    return users;
  } catch (error) {
    logger.error(`[UserService] Error retrieving users: ${error.message}`);
    throw new Error('Error retrieving users');
  }
};

const getUserById = async (id) => {
  logger.debug(`[UserService] Fetching user by ID: ${id}`);
  try {
    const user = await User.findByPk(id);
    if (!user) {
      logger.info(`[UserService] User not found, ID: ${id}`);
      return null;
    }
    logger.info(`[UserService] User fetched successfully, ID: ${id}`);
    return user;
  } catch (error) {
    logger.error(
      `[UserService] Error finding user by ID: ${id}, Error: ${error.message}`
    );
    throw new Error('Error finding user');
  }
};

const updateUser = async (id, updateData) => {
  logger.debug(`[UserService] Attempting to update user, ID: ${id}`);
  try {
    const user = await User.findByPk(id);
    if (!user) {
      logger.info(`[UserService] User not found for update, ID: ${id}`);
      return null;
    }
    const updatedUser = await user.update(updateData);
    logger.info(`[UserService] User updated successfully, ID: ${id}`);
    return updatedUser;
  } catch (error) {
    logger.error(
      `[UserService] Error updating user, ID: ${id}, Error: ${error.message}`
    );
    throw new Error('Error updating user');
  }
};

const deleteUser = async (id) => {
  logger.debug(`[UserService] Attempting to delete user, ID: ${id}`);
  try {
    const user = await User.findByPk(id);
    if (!user) {
      logger.info(`[UserService] User not found for deletion, ID: ${id}`);
      return null;
    }
    await user.destroy();
    logger.info(`[UserService] User deleted successfully, ID: ${id}`);
    return true;
  } catch (error) {
    logger.error(
      `[UserService] Error deleting user, ID: ${id}, Error: ${error.message}`
    );
    throw new Error('Error deleting user');
  }
};

module.exports = {
  AddUserDetails,
  // login,
  siwsVerification,
  getUserIds,
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  signin,
  updateCredit,
};
