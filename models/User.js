const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["blogger", "admin"],
            default: "blogger",
        },
        myCreations:[{
            type: mongoose.Schema.Types.ObjectId,
        }],

    }
);


module.exports = mongoose.model("User", UserSchema)