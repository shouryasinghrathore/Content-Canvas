const express = require("express");
const router = express.Router();


// importing controller
const { likepost, unlikepost } = require("../controllers/likeController");
const { createComment } = require("../controllers/commentController");
const { createPost, getAllPost, deletePost } = require("../controllers/postController");
const { auth,Isblogger } = require("../middlewares/auth");
const { login, signup } = require("../controllers/Auth");


// mapping of routes

//login and  signup
router.post('/login', login);
router.post('/signup', signup);

//create posts
router.post('/createPost', auth, Isblogger, createPost)

//get all post 
router.get('/getAllPost', getAllPost)
router.post('/Comments/create', auth, Isblogger, createComment)

//like unlike post
router.post('/likes/like', auth, Isblogger, likepost)
router.post('/likes/unlike', auth, Isblogger, unlikepost)

//delete post
router.delete('/deletePost', auth, Isblogger, deletePost)


module.exports = router;













