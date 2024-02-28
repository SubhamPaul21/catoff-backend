let { AddUserDetails, siwsVerification } = require('../services/user.service');
let { makeResponse } = require('../utils/responseMaker');

module.exports.addUserDetails = async (req, res, next) => {
  try {
    const { email, username } = req.body;
    console.log(req.userId, email, username);
    let newUser = await AddUserDetails(req.userId, email, username);
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
    // console.log(signature, message, publicKey);
    let token = await siwsVerification(signature, message, publicKey);
    return makeResponse(res, 200, true, 'login successful', { token });
  } catch (e) {
    console.log(e);
    return makeResponse(res, e.statusCode, false, 'login failed');
  }
};
