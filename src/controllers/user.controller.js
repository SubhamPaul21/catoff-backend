const user = require('../services/user.service');
const { makeResponse } = require('../utils/responseMaker');

module.exports.addUserDetails = async (req, res, next) => {
  try {
    const { Email, UserName } = req.body;
    let newUser = await user.AddUserDetails(req.UserID, Email, UserName);
    return makeResponse(
      res,
      200,
      true,
      'user registration successful',
      newUser
    );
  } catch (e) {
    console.log(e);
    return makeResponse(res, 500, false, 'user registration failed');
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { signature, message, publicKey } = req.body;
    let token = await user.siwsVerification(signature, message, publicKey);
    return makeResponse(res, 200, true, 'login successful', { token });
  } catch (e) {
    console.log(e);
    return makeResponse(res, e.statusCode, false, 'login failed');
  }
};


exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
