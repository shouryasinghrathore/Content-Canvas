const User = require("../models/User");
const Post = require("../models/postModel");
const { uploadImageToCloudinary } = require('../utils/imageUploader');
require("dotenv").config();
exports.createPost = async (req, res) => {
    try {
      
        const id = req.user.id;
        const thumbnail = req.files.thumbnailImage
     
        const { title, body } = req.body;
        // Upload the Thumbnail to Cloudinary
        const thumbnailImage = await uploadImageToCloudinary(
            thumbnail,
            process.env.FOLDER_NAME
        );
        const post = new Post({
            thumbnail: thumbnailImage.secure_url, title, body, Creater: id
        });
        const savedPost = await post.save();
        res.json({
            post: savedPost,
        });

        await User.findByIdAndUpdate(id, {
            $push: {
                myCreations: savedPost._id
            },
        }, { new: true }).populate("myCreations").exec();


    }
    catch (err) {
        console.log(err);
        return res.status(400).json({

            error: `error while creating post 
            ${err}`,

        });
    }
}


exports.getAllPost = async (req, res) => {
    try {
        const posts = await Post.find({}).populate(("likes")).populate("comments").exec();


        res.json({
            posts,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({

            error: `error while fetching  posts
            ${err}`,

        });
    }
}


exports.deletePost = async (req, res) => {
    try {
        const dltid = req.body.dltid;

        await Post.findByIdAndDelete(dltid);
        res.json({
            success: true
        })

    }
    catch (err) {
        console.log(err);
        return res.status(400).json({

            error: `error while deleting post 
            ${err}`,

        });
    }
}














