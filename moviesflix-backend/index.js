const express = require('express');
const app = express();
require('dotenv').config();
const { dbConnect } = require('./config/db');
const port = process.env.PORT || 4001;
const cors = require('cors');
const userRoutes = require("./routes/userRoutes");
const newsRoutes = require("./routes/newsRoutes"); 

dbConnect();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors({
    origin: ["http://localhost:3000", "https://moviesflix-ui.vercel.app"],
    methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));


app.use('/api/user', userRoutes);
app.use('/api/news', newsRoutes);

app.get('/', (req, res) => {
    return res.json({
        success: true,
        message: "Server is up and running",
    })
})

app.listen(port, '0.0.0.0', () => {
    console.log(`App is running on port ${port}`);
})
