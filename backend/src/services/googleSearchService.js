import axios from "axios";

const SERP_API_URL = "https://serpapi.com/search.json"

// search google for a given article 
// and returns tops 2 external blog/article links (other than beyondchats)

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
        const externalLinks = results.filter(result => result.link.startsWith("http") && !result.link.includes("beyondchats.com")).slice(0, 2);
        const filteredLinks = externalLinks.map(item => {
            return {
                title: item.title,
                url: item.link,
                source: new URL(item.link).hostname
            }
        });

        return filteredLinks;
    } catch (error) {
        console.log("Error fetching related articles(Google search failed):", error.message);
        return [];
    }
}