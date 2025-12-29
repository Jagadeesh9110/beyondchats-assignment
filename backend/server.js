import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/dbConnect.js';

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ status: "API running" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})