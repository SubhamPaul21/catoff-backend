let User =  require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Connection, PublicKey } = require('@solana/web3.js');
let ExpressError = require('../utils/expressErrors');
const nacl = require('tweetnacl');
const bs58 = require('bs58');
require('dotenv').config();


module.exports.AddUserDetails = async (userId, email, userName) => {
    try {
        const user = await User.findOne({
            where: {UserID: userId}
        });
        if (!user) {
            throw new ExpressError("User doesnt exist",401)
        }
        let updates = { 
            Email: email,
            UserName: userName
        }
        await user.update(updates);
        return user;
    } catch (e) {
        console.log(e)
        return e;
    }
}

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

module.exports.siwsVerification = async (signature, message, publicKey)=>{
    try{
        let user;
        const decodedPublicKey = bs58.decode(publicKey);
        const publicKeyUint8Array = new Uint8Array(decodedPublicKey);
        const signatureBuffer = Buffer.from(bs58.decode(signature));
        const verified = nacl.sign.detached.verify(
            new TextEncoder().encode(message),
            signatureBuffer,
            publicKeyUint8Array
        );
        if(!verified){
            throw new ExpressError("Invalid Signature",401);
        }
        user = await User.findOne({PublicKey: publicKey});
        if(!user){
            // create new user
            user = new User({
                // Email: email,
                // UserName: userName,
                RegistrationDate: new Date(),
                LastLoginDate: null,
                IsEmailVerified: false,
                IsActive: true,
                PublicKey: publicKey,
            });
            user.save()
        }
        const token = jwt.sign({ userId: user.UserID }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        await user.update({ LastLoginDate: new Date() });
        return token;

    }catch(e){
        console.log(e)
        return e
    }
}