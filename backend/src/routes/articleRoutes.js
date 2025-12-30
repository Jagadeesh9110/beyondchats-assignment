import express from "express";
import {
    createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    deleteArticle,
    publishAIArticle
} from "../controllers/articleController.js";

const router = express.Router();

router.post("/", createArticle);
router.get("/", getAllArticles);
router.get("/:id", getArticleById);
router.put("/:id", updateArticle);
router.put("/:id/ai", publishAIArticle);
router.delete("/:id", deleteArticle);

export default router;
