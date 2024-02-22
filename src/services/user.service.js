let User =  require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


module.exports.signUp = async (email, userName, password) => {
    try {
        const userExists = await User.findOne({
            where: {email}
        });
        if (userExists) {
            return res.status(400).send('Email is already associated with an account');
        }
        const newUser = new User({
            email: email,
            userName: userName,
            RegistrationDate: new Date(),
            LastLoginDate: null,
            IsEmailVerified: false,
            IsActive: true,
            password: await bcrypt.hash(password, 15),
        });
        return newUser;
    } catch (e) {
        return e;
    }
}

module.exports.login = async (email, password)=>{
    try{
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error('Authentication failed');
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new Error('Authentication failed');
        }
        const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        return token;
    }
    catch(e){
        return e
    }
}