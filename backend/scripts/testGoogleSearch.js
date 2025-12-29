import dotenv from "dotenv";
import { searchRelatedArticles } from "../src/services/googleSearchService.js";

dotenv.config();

const testSearch = async () => {
    try {
        const query = "Chatbots Magic: Beginner’s Guidebook";
        const result = await searchRelatedArticles(query);

        console.log("Google search results: ");
        console.log(result);

        process.exit(0);
    } catch (err) {
        console.error("Error in testSearch:", err.message);
        process.exit(1);
    }
}

testSearch();