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
            Email: email,
            UserName: userName,
            RegistrationDate: new Date(),
            LastLoginDate: null,
            IsEmailVerified: false,
            IsActive: true,
            Password: await bcrypt.hash(password, 15),
        });
        newUser.save()
        return newUser;
    } catch (e) {
        console.log(e)
        return e;
    }
}

module.exports.login = async (email, password)=>{
    try{
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Authentication failed');
        }
        const passwordMatch = await bcrypt.compare(password, user.Password);
        if (!passwordMatch) {
            throw new Error('Authentication failed');
        }
        const token = jwt.sign({ userId: user.UserId }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        await user.update({ LastLoginDate: new Date() });
        return token;
    }
    catch(e){
        return e
    }
}