# BeyondChats - Full Stack + AI Assignment

This repository contains the submission for the **Full Stack Web Developer Intern** assignment at **BeyondChats**.

The project aims to demonstrate a complete workflow involving web scraping, RESTful API development, database management, and future integration with LLMs for content enhancement.

## Tech Stack

**Backend**
- Node.js
- Express.js
- MongoDB (Mongoose)
- Axios & Cheerio (Web Scraping)
- dotenv (Environment Management)

**Frontend (Planned)**
- React.js
- Vite

---

## implementation Status

### Phase 1: Scraping & Backend APIs [Completed]

**1. Data Collection Strategy**
The requirement was to scrape the five oldest articles from the BeyondChats blog. 
- **Challenge:** The blog listing pages use Client-Side Rendering (CSR), meaning the article list is populated dynamically via JavaScript. Standard HTML parsers like Cheerio cannot see this content on the listing pages immediately.
- **Solution:** To ensure reliability and accuracy, the scraper is configured to directly target the URLs of the five oldest articles. These were identified from the last pagination indices (Page 15 containing the oldest entry, and Page 14 containing the next four).

**2. Scraper Implementation**
- The script iterates through the targeted article URLs.
- It fetches the HTML for each individual article page.
- **Extraction:**
  - **Title:** Extracted from the `h1` tag.
  - **Content:** Aggregated from `<article>` paragraph tags to ensure full text retrieval.
  - **Publication Date:** Parsed from `<time>` or metadata tags.
  - **Slug:** Generated using `slugify` for clean URL handling.
- **Duplicate Prevention:** The system checks the database for existing slugs before insertion to prevent duplicate entries.

**3. REST APIs**
A comprehensive set of RESTful endpoints has been implemented to manage the scraped data:
- `GET /api/articles` - Retrieve all articles.
- `GET /api/articles/:id` - Retrieve a specific article by ID.
- `POST /api/articles` - Create a new article manually.
- `PUT /api/articles/:id` - Update an existing article.
- `DELETE /api/articles/:id` - Remove an article.

### Phase 2: Automation & LLM Enhancement (In Progress)

**Step 1: Google Search Integration (Completed)**
- **Objective:** Enhance articles with external context.
- **Service Implemented:** `googleSearchService.js`
- **Functionality:**
  - Accepts an article title as input.
  - Integration with **SerpAPI** to fetch organic Google search results.
  - **Filtering Logic:** Automatically filters out "BeyondChats.com" domains to ensure external sources are prioritized.
  - **Output:** Returns the top 2 most relevant external article links/titles.
- **Verification:** Logic is independently tested and verified via `scripts/testGoogleSearch.js`.

**Upcoming Steps:**
- Integration with LLMs (e.g., Google Gemini) to rewrite and enhance article content.
- Storage of AI-generated content and references alongside the original data.

### Phase 3: Frontend Development [Upcoming]
Planned development of a responsive user interface:
- **Article List Support:** Displaying the collection of articles.
- **Comparison View:** A detailed view allowing users to toggle between the original scraped content and the AI-enhanced version.

---

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the `backend` directory with your MongoDB connection string:
   ```env
   MONGO_URL=your_mongodb_connection_string
   PORT=3000
   ```

4. Run the scraper (one-time setup to populate data):
   ```bash
   npm run scrape
   # or
   node scripts/scrapeOldestArticles.js
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

---

## Author

**Manyam Jagadeeswar Reddy**
B.Tech - Data Science & AI, IIIT Dharwad (2027)
GitHub: [Jagadeesh9110](https://github.com/Jagadeesh9110)