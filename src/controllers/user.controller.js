const userService = require('../services/user.service');
const { makeResponse } = require('../utils/responseMaker');
const logger = require('../utils/logger');

exports.addUserDetails = async (req, res, next) => {
  const { Email, UserName } = req.body;
  logger.debug(
    `[UserController] Attempting to add user details for Email: ${Email}`
  );
  try {
    const newUser = await userService.AddUserDetails(
      req.UserID,
      Email,
      UserName
    );
    logger.debug('[UserController] User registration successful');
    return makeResponse(
      res,
      200,
      true,
      'user registration successful',
      newUser
    );
  } catch (e) {
    logger.error(
      `[UserController] User registration failed, Error: ${e.message}`
    );
    return makeResponse(res, 500, false, e.message, null);
  }
};

exports.login = async (req, res, next) => {
  const { signature, message, publicKey } = req.body;
  logger.debug('[UserController] Attempting login');
  try {
    const token = await userService.siwsVerification(
      signature,
      message,
      publicKey
    );
    logger.debug('[UserController] Login successful');
    return makeResponse(res, 200, true, 'login successful', { token });
  } catch (e) {
    logger.error(`[UserController] Login failed, Error: ${e.message}`);
    return makeResponse(res, 500, false, 'login failed');
  }
};

exports.createUser = async (req, res) => {
  logger.debug('[UserController] Creating a new user');
  try {
    const user = await userService.createUser(req.body);
    logger.debug('[UserController] User creation successful');
    res.status(201).json(user);
  } catch (error) {
    logger.error(
      `[UserController] Error in user creation, Error: ${error.message}`
    );
    res.status(400).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  logger.debug('[UserController] Fetching all users');
  try {
    const users = await userService.getAllUsers();
    logger.debug('[UserController] Successfully retrieved all users');
    res.status(200).json(users);
  } catch (error) {
    logger.error(
      `[UserController] Error fetching all users, Error: ${error.message}`
    );
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  const userId = req.params.id;
  logger.debug(`[UserController] Fetching user by ID: ${userId}`);
  try {
    const user = await userService.getUserById(userId);
    if (!user) {
      logger.error(`[UserController] User not found, ID: ${userId}`);
      return res.status(404).json({ message: 'User not found' });
    }
    logger.debug(`[UserController] Successfully fetched user by ID: ${userId}`);
    res.status(200).json(user);
  } catch (error) {
    logger.error(
      `[UserController] Error fetching user by ID: ${userId}, Error: ${error.message}`
    );
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  logger.debug(`[UserController] Updating user, ID: ${userId}`);
  try {
    const updatedUser = await userService.updateUser(userId, req.body);
    if (!updatedUser) {
      logger.error(`[UserController] User not found for update, ID: ${userId}`);
      return res.status(404).json({ message: 'User not found' });
    }
    logger.debug(`[UserController] User updated successfully, ID: ${userId}`);
    res.status(200).json(updatedUser);
  } catch (error) {
    logger.error(
      `[UserController] Error updating user, ID: ${userId}, Error: ${error.message}`
    );
    res.status(400).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  logger.debug(`[UserController] Deleting user, ID: ${userId}`);
  try {
    await userService.deleteUser(userId);
    logger.debug(`[UserController] User deleted successfully, ID: ${userId}`);
    res.status(204).send();
  } catch (error) {
    logger.error(
      `[UserController] Error deleting user, ID: ${userId}, Error: ${error.message}`
    );
    res.status(500).json({ message: error.message });
  }
};
