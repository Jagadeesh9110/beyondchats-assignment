/**
 * Now we will Create a Node.js orchestration script that coordinates already-built services without implementing new logic.
 * Fetch original articles from your own API
 * For each article:
 * Call Google Search Service (Step-1)
 * Call External Article Scraper (Step-2)
 * Call Gemini Rewrite Service (Step-3)
 */

import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

import { searchRelatedArticles } from "../src/services/googleSearchService.js";
import { scrapeArticles } from "../src/services/externalArticleScraper.js";
import { articleRewriteService } from "../src/services/articleRewriteService.js";


const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

// Fetch original articles from backend API
const fetchOriginalArticles = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/articles`);
        return response.data;
    } catch (error) {
        console.error("Error fetching original articles:", error);
        return [];
    }
};

const enhanceArticle = async () => {
    try {
        const articles = await fetchOriginalArticles();
        for (const article of articles) {
            console.log(`\nProcessing: ${article.title}`);

            // google search
            const relatedArticles = await searchRelatedArticles(article.title);
            if (relatedArticles.length < 2) {
                console.warn("Insufficient external articles found. Skipping.");
                continue;
            }

            // external article scraper
            const scrapedReferences = await scrapeArticles(relatedArticles);
            if (scrapedReferences.length < 2) {
                console.warn("Insufficient external articles found. Skipping.");
                continue;
            }

            // article rewrite
            const rewrittenArticle = await articleRewriteService({
                originalContent: article.originalContent,
                references: scrapedReferences
            });
            console.log(rewrittenArticle);

            console.log("Rewrite completed successfully");
            console.log({
                title: article.title,
                referencesUsed: rewrittenArticle.references.length
            });
            await axios.put(
                `${API_BASE_URL}/api/articles/${article._id}/ai`,
                {
                    aiContent: rewrittenArticle.aiContent,
                    references: rewrittenArticle.references
                }
            );

            console.log("AI article published successfully");

        }

    } catch (error) {
        console.error("Error enhancing article:", error);
        return null;
    }
};

enhanceArticle();
