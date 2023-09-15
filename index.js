const express = require('express');
const app = express();
require("dotenv").config();
const cookieParser = require('cookie-parser');
const blogs = require("./routes/blogs")
const fileUpload = require("express-fileupload")

const dbConnect = require('./config/database');
const {cloudinaryConnect } = require("./config/cloudinary");
app.use(express.json());
app.use(cookieParser());
dbConnect();

app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)

//cloudinary connection
cloudinaryConnect();

app.listen(process.env.PORT, () => {
    console.log("server started")

});

app.use("/api/v1",blogs);

app.get("/", (req, res) => {
    res.json({
        message:"Welcome to Content Canvas "
    })
})
