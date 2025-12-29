import Article from "../models/Article.js";
import slugify from "slugify";

// Create Article
export const createArticle = async (req, res) => {
    try {
        const { title, author, publishedAt, tags, originalContent, sourceUrl } = req.body;

        const slug = slugify(title, { lower: true, strict: true });

        const article = await Article.create({
            title,
            slug,
            author,
            publishedAt,
            tags,
            originalContent,
            sourceUrl
        });

        res.status(201).json(article);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get All Articles
export const getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find();
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Single Article
export const getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Article
export const updateArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Article
export const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);
        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};