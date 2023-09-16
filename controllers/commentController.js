
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");



exports.createComment = async (req, res) => {
    try {
        const { post, user, body } = req.body;
        const userid = req.user.id;

        const comment = new Comment({
            post, user: userid, body
        });

        const savedComment = await comment.save();
        const updatedPost = await Post.findByIdAndUpdate(post, { $push: { comments: savedComment._id } }, { new: true })

            .populate({
                path: 'comments',
                populate: {
                    path: 'user', // Populate the 'user' field within the 'comments' field
                    select: 'name', 
                },
            })
            .exec();
        res.json({
            post: updatedPost,
        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({

            error: `error while creating comment 
            ${err}`,

        });
    }
}
exports.deleteComment = async (req, res) => {
    try {
        const { post, comment } = req.body;
        const userid = req.user.id;
        const commentDetails = await Comment.findById(comment)
        // console.log("userid =>",userid);
        // console.log("commentDetails =>",commentDetails);
        if (userid != commentDetails.user) {
            return res.status(403).json({
                success: false,
                message: "You are not Authorised to delete this comment"
            })
        }

        const deletecomment = await Comment.findOneAndDelete({ post: post, _id: comment })


        const updatedPost = await Post.findByIdAndUpdate(post, { $pull: { comments: deletecomment._id } }, { new: true })
            .populate("comments")
            .exec();

        res.json({
            post: updatedPost,
        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({

            error: `error while deleting comment 
            ${err}`,

        });
    }
}





