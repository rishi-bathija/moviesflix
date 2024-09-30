const mongoose = require('mongoose');
require("dotenv").config();
exports.dbConnect = async (req, res) => {
    try {
        console.log('MONGODB_URL:', process.env.MONGODB_URL);
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB connected successfully");
    } catch (error) {
        console.log("DB connection failed");
        console.log(error);
        process.exit(1);
    }
}