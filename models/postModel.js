const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        thumbnail:{
            type: String,
        },
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        Creater:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
       
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Like",
        }],
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        }]
    }
);


module.exports = mongoose.model("Post", postSchema)