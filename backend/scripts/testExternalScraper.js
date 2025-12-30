import dotenv from "dotenv";
import { scrapeArticles } from "../src/services/externalArticleScraper.js";

dotenv.config();

const testScrapeArticles = async () => {
    const articles = [
        {
            title: "Beginner's Guide to Chatbots",
            url: "https://chatbotsmagazine.com/the-complete-beginner-s-guide-to-chatbots-8280b7b906ca",
            source: "chatbotsmagazine.com"
        },
        {
            title: "Chatbot Development Guide",
            url: "https://www.gcc-marketing.com/chatbot-development-a-comprehensive-guide-for-beginners/",
            source: "gcc-marketing.com"
        }
    ];

    const results = await scrapeArticles(articles);
    console.log("Scraped Articles:", results);
    process.exit(0);
};

testScrapeArticles();
