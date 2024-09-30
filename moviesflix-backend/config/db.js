const mongoose = require('mongoose');
require("dotenv").config();
exports.dbConnect = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("DB connected successfully");
    } catch (error) {
        console.log("DB connection failed");
        console.log(error);
        process.exit(1);
    }
}