const mongoose = require('mongoose');

require("dotenv").config();
const dbConnect = () => {

    mongoose.connect(process.env.DB_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log("finnally connected to db"))
        .catch((err) => {
            console.log(err);
            process.exit(1);
        })
}

module.exports = dbConnect;