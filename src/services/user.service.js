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
            throw new Error('User already exist');
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
        await user.update({ LastLoginDate: new Date() });
        return token;
    }
    catch(e){
        return e
    }
}