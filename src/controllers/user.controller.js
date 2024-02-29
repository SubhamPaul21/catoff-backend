let { AddUserDetails, siwsVerification } = require('../services/user.service');
let { makeResponse } = require('../utils/responseMaker');

module.exports.addUserDetails = async (req, res, next) => {
  try {
    const { Email, UserName } = req.body;
    let newUser = await AddUserDetails(req.UserID, Email, UserName);
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
    const { Signature, Message, PublicKey } = req.body;
    let token = await siwsVerification(Signature, Message, PublicKey);
    return makeResponse(res, 200, true, 'login successful', { token });
  } catch (e) {
    console.log(e);
    return makeResponse(res, e.statusCode, false, 'login failed');
  }
};
