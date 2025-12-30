import axios from "axios";

const SERP_API_URL = "https://serpapi.com/search.json"

// search google for a given article 
// and returns tops 2 external blog/article links (other than beyondchats)

// Domains that do NOT qualify as editorial articles
const BLOCKED_DOMAINS = [
    "amazon.",
    "flipkart.",
    "pinterest.",
    "facebook.",
    "twitter.",
    "x.com",
    "youtube.",
    "youtu.be"
];

const isBlockedDomain = (url) => {
    return BLOCKED_DOMAINS.some(domain => url.includes(domain));
};

const getHostname = (link) => { // get hostname and return null if invalid
    try {
        return new URL(link).hostname;
    } catch {
        return null;
    }
};

export const searchRelatedArticles = async (article) => {
    try {
        const response = await axios.get(SERP_API_URL, {
            params: {
                engine: "google",
                q: article,
                api_key: process.env.SERP_API_KEY,
                gl: "us",
                hl: "en",
                num: 10
            }
        })

        const results = response.data.organic_results || [];
        // Filter only external links
        // Filter results based on editorial rules
        const validArticles = results.filter(result => {
            if (!result.link) {
                return false;
            }
            if (!result.link.startsWith("http")) {
                return false;
            }
            if (result.link.includes("beyondchats")) {
                return false;
            }
            if (isBlockedDomain(result.link)) { // blocked domains 
                return false;
            }
            return true;
        })
        const topTwoArticles = validArticles.slice(0, 2);

        const editorialTwoArticles = topTwoArticles.map(item => {
            return {
                title: item.title,
                url: item.link,
                source: getHostname(item.link)
            }
        })

        return editorialTwoArticles;
    } catch (error) {
        console.log("Error fetching related articles(Google search failed):", error.message);
        return [];
    }
}