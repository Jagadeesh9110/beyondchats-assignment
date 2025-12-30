import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";

import connectDB from './src/config/dbConnect.js';
import articleRoutes from './src/routes/articleRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.get("/", (req, res) => {
    res.json({ status: "API running" });
});

app.use("/api/articles", articleRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})