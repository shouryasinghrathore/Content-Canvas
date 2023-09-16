const express = require("express");
const router = express.Router();


// importing controller
const { likepost, unlikepost } = require("../controllers/likeController");
const { createComment,deleteComment } = require("../controllers/commentController");
const { createPost, getAllPost, deletePost } = require("../controllers/postController");
const { auth,Isblogger } = require("../middlewares/auth");
const { login, signup } = require("../controllers/Auth");


// mapping of routes

//get all post 
router.get('/getAllPost', getAllPost)

//login and  signup
router.post('/login', login);
router.post('/signup', signup);

//create posts
router.post('/createPost', auth, Isblogger, createPost)

//delete post
router.delete('/deletePost', auth, Isblogger, deletePost)

//comments
router.post('/Comments/create', auth, Isblogger, createComment)
router.delete('/Comments/delete', auth, Isblogger, deleteComment)

//like unlike post
router.post('/likes/like', auth, Isblogger, likepost)
router.post('/likes/unlike', auth, Isblogger, unlikepost)



module.exports = router;













