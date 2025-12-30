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

## Implementation Status

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

The goal of this step is to find high-quality educational context for each scraped article. However, relying on raw Google Search results presents a significant challenge: standard queries often return results that are unusable for an LLM-based rewrite pipeline, such as e-commerce pages (Amazon), social media posts, or video links.

#### Editorial Source Filtering Strategy

To ensure the LLM receives only clean, high-value textual context, we implemented a strict domain filtering strategy. This is not an arbitrary rule but a deliberate design decision to maintain pipeline stability.

- **ACCEPTED Sources:**
  - Independent Blogs
  - Long-form articles and tutorials
  - Verified informational websites

- **REJECTED Sources:**
  - **Product Listings (e.g., Amazon, Flipkart):** These pages contain unrelated metadata and no narrative content.
  - **Social Media (e.g., Pinterest, Facebook, X/Twitter):** These are often behind login walls or contain unstructured, user-generated snippets.
  - **Video Platforms (e.g., YouTube):** The pipeline is designed for text scraping, not video transcription.

#### Implementation Details

- **Service:** `googleSearchService.js`
- **Engine:** Uses **SerpAPI** to fetch organic Google results.
- **Logic:**
  1. Accepts an article title as a query.
  2. Fetches top 10 results.
  3. Filters out the `beyondchats.com` domain (self-reference).
  4. Applys a **Blocked Domain List** to aggressively remove known non-editorial domains (Amazon, Pinterest, etc.).
  5. Returns the top 2 remaining valid editorial links.
- **Verification:** The logic is independently tested via `scripts/testGoogleSearch.js`.

**Step 2: External Article Content Scraper (Completed)**

**Objective:**
Transform raw Google Search results into clean, high-quality textual inputs suitable for LLM-based rewriting, while remaining domain-agnostic and resilient to real-world web inconsistencies.

**Key Challenges Addressed:**
- **Variability:** External websites vary widely in structure (WordPress, custom CMS, marketing sites).
- **Noise:** Pages often contain significant noise (ads, navigation, scripts, footers).
- **Reliability:** Some domains fail due to SSL or network restrictions.
- **Quality:** Thin or low-quality pages can degrade downstream LLM output.

**Design & Implementation Strategy:**
- Implemented a domain-agnostic scraper (`externalArticleScraper.js`) using Axios and Cheerio.
- **Progressive Content Extraction:** Attempts multiple selectors in order:
  1. `<article>` tag (preferred semantic source).
  2. Common content containers (`.entry-content`, `.post-content`, etc.).
  3. Paragraph aggregation fallback (`<p>` tags).
- **Sanitization:** Introduced DOM sanitization to remove non-content elements (`script`, `nav`, `ads`, `iframes`, etc.).
- **validation:** Enforced a minimum word threshold (300+ words) to eliminate thin or non-editorial pages.
- **Resilience:** Implemented graceful failure handling for SSL/network errors, ensuring the pipeline continues without crashing.

**Output Structure:**
Each successfully scraped article produces:
- Title
- Source URL & domain
- Cleaned textual content
- Word count (for quality validation)

This structured output is intentionally designed to support accurate citation, controlled LLM prompt construction, and safe storage alongside AI-generated content in later phases.

**Verification:**
- Tested independently via `scripts/testExternalScraper.js`.
- Verified successful extraction on real editorial sites and safe skipping of invalid sources.

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