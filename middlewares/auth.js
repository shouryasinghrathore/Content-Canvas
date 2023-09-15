const jwt = require('jsonwebtoken');
require("dotenv").config();

exports.auth = async (req, res, next) => {
    try {
        const token = req.cookies.token|| req.body.token ;
        console.log("token=>", token);
        if (!token || token === undefined) {
            return res.status(401).json({
                success: false,
                message: "token missing token"
            })

        }

        try {
            const payload = jwt.verify(token, process.env.JWTS);
            console.log(payload);
            req.user = payload;
        }
        catch (err) {
            return res.status(401).json({
                success: false,
                message: "token is invalid",
            })
        }
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }

}


exports.Isblogger = async (req, res, next) => {
    try {
        if (req.user.role !== "blogger") {
            return res.status(401).json({
                success: false,
                message: "this is protected route for blogger only",
            })

        }
        next();

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }

}

