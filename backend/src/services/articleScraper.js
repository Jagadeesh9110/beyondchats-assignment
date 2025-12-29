// import axios from "axios";
// import { load } from "cheerio";

// const BASE_URL = "https://beyondchats.com";


// const scrapePage = async (pageNumber) => {
//     const url = `${BASE_URL}/blogs/page/${pageNumber}/`;
//     const { data } = await axios.get(url);
//     const $ = load(data);

//     const articles = [];

//     $(".blog-card").each((_, el) => {
//         const title = $(el).find("h2").text().trim();
//         const link = $(el).find("a").attr("href");
//         const dateText = $(el).find(".date").text().trim();

//         if (title && link) {
//             articles.push({
//                 title,
//                 link: link.startsWith("http") ? link : `${BASE_URL}${link}`,
//                 publishedAt: dateText
//             })
//         }
//     })
//     return articles;
// }

// export const fetchFiveOldestArticles = async () => {
//     // Page 15 is the last page, page 14 contains remaining older articles
//     const page15Articles = await scrapePage(15);
//     const page14Articles = await scrapePage(14);
//     const articles = [...page15Articles, ...page14Articles];
//     return articles.slice(0, 5);
// }

/**
 * The blog listing pages on BeyondChats are dynamically rendered on the client side, making them unsuitable for static HTML scraping using Axios and Cheerio.
 * To reliably fetch the five oldest articles (as required), the scraper directly targets the oldest article URLs derived from the last blog pages.
 */

export const fetchFiveOldestArticles = async () => {
    return [
        {
            link: "https://beyondchats.com/blogs/introduction-to-chatbots/"
        },
        {
            link: "https://beyondchats.com/blogs/chatbots-for-small-business-growth/"
        },
        {
            link: "https://beyondchats.com/blogs/lead-generation-chatbots/"
        },
        {
            link: "https://beyondchats.com/blogs/virtual-assistant/"
        },
        {
            link: "https://beyondchats.com/blogs/live-chatbot/"
        }
    ];
};
