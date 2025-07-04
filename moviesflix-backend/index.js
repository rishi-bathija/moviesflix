const express = require('express');
const app = express();
require('dotenv').config();
const { dbConnect } = require('./config/db');
const port = process.env.PORT || 4001;
const cors = require('cors');
const userRoutes = require("./routes/userRoutes");

dbConnect();

app.use(express.json());

app.use(cors({
    origin: ["http://localhost:3000", "https://moviesflix-ui.vercel.app"],
    methods: ["POST", "GET", "PUT", "OPTIONS"],
    credentials: true
}));


app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
    return res.json({
        success: true,
        message: "Server is up and running",
    })
})

app.listen(port, '0.0.0.0', () => {
    console.log(`App is running on port ${port}`);
})
