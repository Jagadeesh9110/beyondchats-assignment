import axios from "axios";
import { load } from "cheerio";
import slugify from "slugify";
import dotenv from "dotenv";
import connectDB from "../src/config/dbConnect.js";
import Article from "../src/models/Article.js";
import { fetchFiveOldestArticles } from "../src/services/articleScraper.js";

dotenv.config();
await connectDB();

const scrapeAndSaveArticles = async () => {
    const articles = await fetchFiveOldestArticles();
    console.log("Fetched articles:", articles.length);
    console.log(articles);

    for (const item of articles) {
        const { link } = item;

        try {
            const { data } = await axios.get(link);
            const $ = load(data);

            // Extract title
            const title = $("h1").first().text().trim();
            if (!title) {
                console.log(`No title found for ${link}`);
                continue;
            }

            const slug = slugify(title, { lower: true, strict: true });

            const exists = await Article.findOne({ slug });
            if (exists) {
                console.log(`Skipping existing article: ${title}`);
                continue;
            }

            // Extract published date
            const publishedText =
                $("time").attr("datetime") ||
                $(".published-date").text().trim();
            const publishedAt = publishedText ? new Date(publishedText) : null;

            // Extract main article content   
            const originalContent = $("article")
                .find("p")
                .map((_, el) => $(el).text().trim())
                .get()
                .join("\n\n");

            if (!originalContent) {
                console.log(`No content found for ${title}`);
                continue;
            }

            await Article.create({
                title,
                slug,
                author: "Unknown",
                publishedAt,
                originalContent,
                sourceUrl: link
            });

            console.log(`Saved article: ${title}`);
        } catch (error) {
            console.error(`Error scraping ${link}:`, error.message);
        }
    }

    console.log("Phase-1 scraping completed");
    process.exit(0);
};

scrapeAndSaveArticles();
