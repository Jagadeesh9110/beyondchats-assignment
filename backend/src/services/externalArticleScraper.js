import axios from "axios";
import { load } from "cheerio";


// Remove noisy elements from DOM
const cleanDOM = ($) => {
    $("script, style, nav, footer, header, iframe, form").remove();
    $(".ads, .advertisement, .promo").remove();
}

// Extract the article content from the DOM using progressive enhancement
const extractContent = ($) => {
    let content = "";

    // try article tag first
    const article = $("article");
    if (article.length > 0) {
        content = article.text();
    }

    // common content containers
    if (!content || content.length < 500) {
        const selectors = [
            ".entry-content",
            ".post-content",
            ".blog-content",
            ".content",
            ".article-content"
        ];

        for (const selector of selectors) {
            if ($(selector).length) {
                content = $(selector).text();
                if (content.length > 500) {
                    break;
                }
            }
        }
    }

    // Fallback: aggregate paragraphs
    if (!content || content.length < 500) {
        content = $("p").map((_, el) => $(el).text()).get().join("\n");
    }
    return content.replace(/\s+/g, " ").trim();
};

// Scrape a single external article
const scrapeArticle = async ({ title, url, source }) => {
    try {
        const { data } = await axios.get(url, {
            timeout: 15000,
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; BeyondChatsBot/1.0; +https://beyondchats.com)"
            }
        })
        const $ = load(data)
        cleanDOM($)
        const extractedTitle =
            $("h1").first().text().trim() ||
            $("title").text().trim() ||
            title ||
            "Untitled Article";

        const content = extractContent($);
        const normalized = content.replace(/\s+/g, " ").trim();// Prevents inflated counts due to newlines
        const wordCount = normalized.split(" ").length;

        if (wordCount < 300) {
            console.log(`Article is too short,Skipped thin content: ${url}`);
            return null;
        }

        return {
            title: extractedTitle,
            url,
            source,
            content,
            wordCount,
        }

    } catch (err) {
        console.warn(`Skipped external article due to SSL or network issue: ${url}`, err.message);
        return null;
    }
}

// Scrape multiple external articles safely
export const scrapeArticles = async (articles = []) => {
    const results = [];

    for (const article of articles) {
        const scraped = await scrapeArticle(article);
        if (scraped) {
            results.push(scraped);
        }
    }
    return results;
}