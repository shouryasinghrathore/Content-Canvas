const mongoose = require("mongoose");
const User = require("../models/User");
const Comment = require("../models/commentModel");
const Like = require("../models/likeModel");
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
        const posts = await Post.find({}).populate(("likes"))  .populate({
            path: 'comments',
            populate: {
                path: 'user', // Populate the 'user' field within the 'comments' field
                select: 'name', 
            },
        }).exec();

        res.json({
            posts
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
        const postId = req.body.post;
        const postdetails = await Post.findById(postId);
        const id = req.user.id;
        console.log("id", id);
        console.log("postdetails.Creater", postdetails.Creater);

        if (id != postdetails.Creater) {
            return res.status(403).json({
                success: false,
                message: "You are not Authorised to delete this post"
            })
        }

        // First, delete all likes for the post
        await Like.deleteMany({ postId });

        // Then, delete all comments for the post
        await Comment.deleteMany({ postId });

        // Delete the post by its _id
        await Post.findByIdAndDelete(postId);

        // console.log("Post successfully deleted with ID:", postId);
        res.json({
            success: true,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: `Error while deleting post: ${err.message}`,
        });
    }
}
