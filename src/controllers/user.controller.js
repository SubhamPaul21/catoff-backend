let user =  require('../models/user.model');
let {signUp, login} = require('../services/user.service') 
let {makeResponse} = require('../utils/responseMaker')

module.exports.signUp = async (req, res, next) => {
    try {
        const {email, username,  password } = req.body;
        console.log(email, username, password);
        let newUser = await signUp(email, username, password);
        return makeResponse(res, 200, true, "user registration successful", newUser)
    } catch (e) {
        console.log(e)
        return makeResponse(res, 500, false, "user registration failed")
    }
}

module.exports.login = async (req, res, next) => {
    try {
        const {username,  password } = req.body;
        console.log(username, password);
        let token = await login(username, password)
        return makeResponse(res, 200, true, "login successful", {token});
    } catch (e) {
        console.log(e)
        return makeResponse(res, 500, false, "login failed" );
    }
}