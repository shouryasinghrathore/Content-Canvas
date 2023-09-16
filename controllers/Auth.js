const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { options } = require("../routes/blogs.js");
require("dotenv").config();

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        // check user exist or not
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "user already exists"
            });
        }
        
        let hashedpass;
        try {
            hashedpass = await bcrypt.hash(password, 10);

        }
        catch (err) {
            return res.status(500).json({
                sucess: false,
                message: "error while hashing password",

            })
        }

        const user = await User.create({ name, email, password: hashedpass, role });

        return res.status(200).json({
            sucess: true,
            message: "created user successfully",
        })

    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            sucess: false,
            message: `failed to create user ${err}`,

        })

    }

}


// login 
exports.login = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "please enter your email and password correctly",
            })
        }

        
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "user not found",

            })

        }

        const payload = {
            id: user._id,
            role: user.role,
        }

        if (await bcrypt.compare(password, user.password)) {
            // password match//
            let token = jwt.sign(payload, process.env.JWTS, {
                expiresIn: "2h"
            })
     
            user = user.toObject();
            user.token = token;
            user.password = undefined;
            user.email = undefined;
            // user.name = undefined;
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "user token logged in successfully"
            });


        


        }
        else {
                //passwsord do not match
            return res.status(403).json({
                success: false,
                message: "password is incorrect",
            });
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Login failure",
            menubar: err.message
        })
    }

}
















