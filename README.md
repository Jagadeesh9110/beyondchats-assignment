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

**Step 3: Gemini Rewrite Orchestration (Completed)**

**Objective:**
Leverage Google Gemini Pro to rewrite scrapped articles into high-quality, engaging content while strictly adhering to factual accuracy and Markdown formatting.

**Gemini API Integration:**
- **Model:** `gemini-1.5-pro` (or latest available variant) via Google Generative AI SDK.
- **Orchestration:** Controlled via `articleRewriteService.js`.

**Prompt Design Philosophy:**
We utilize a **Persona + Task + Constraints** prompting strategy to ensure high-fidelity outputs:
1.  **Persona:** "You are a senior technical editor..."
2.  **Task:** "Rewrite this article using the following external references for depth..."
3.  **Constraints:**
    -   **Markdown Only:** Strict adherence to Markdown headers, lists, and formatting.
    -   **No Hallucinations:** Explicit instruction to use *only* provided context or verified general knowledge.
    -   **No Copying:** Rewriting must be original in expression while preserving the core message.
    -   **Citation Injection:** A dedicated "References" section is appended at the bottom, listing the source articles used.

**Output:**
The service returns a fully rewritten Markdown string, ready for storage and display, with no inline artifacts or broken syntax.

**Step 4: Publish AI-Enhanced Articles via API (Completed)**

**Objective:**
Seamlessly update the production database with AI-generated content through a standardized API, ensuring data consistency and auditability.

**End-to-End Orchestration:**
The `enhanceArticles.js` script orchestrates the entire pipeline:
1.  **Fetch:** Call `GET /api/articles` to get the list of original articles.
2.  **Process (Loop):** For each article:
    -   Trigger Google Search (Step 1).
    -   Scrape Editorial Content (Step 2).
    -   Generate Rewrite via Gemini (Step 3).
    -   **Publish:** Call `PUT /api/articles/:id` (or specific endpoint) to update the record.
    
**Database Updates:**
The following fields are updated in the `Article` model:
-   `aiContent`: The complete Markdown rewrite.
-   `references`: Array of objects `{ title, url, source }` used during rewriting.
-   `isUpdatedByAI`: Boolean flag set to `true`.

**Robustness:**
-   **Graceful Skipping:** If an article lacks sufficient external references (minimum 2), the pipeline logs a warning and skips it without crashing.
-   **Idempotency:** The script can be re-run; it will re-process and update articles, allowing for iterative improvements to the prompt or scraper logic.

**Phase 3: Frontend Development (Completed)**

**Architecture:**
- **Framework:** React.js + Vite for fast build and optimal performance.
- **Routing:** `react-router-dom` for client-side navigation.
- **Styling:** CSS Modules / Custom CSS for responsive design.

**Key Features Implemented:**
- **Article List View:** Displays all scraped articles in a responsive grid layout with titles, excerpts, and dates.
- **AI-Enhanced Detail View:**
  - Standard view for original content.
  - **Comparison Toggle:** Allows users to switch between the "Original" and "AI Enhanced" versions.
  - **References Section:** In the AI view, a dedicated section lists the external sources used for the rewrite, linking directly to the original/editorial domains.
  - **Markdown Rendering:** AI content is rendered with proper formatting (headers, lists, bold text) using `react-markdown`.
- **Responsive UI:** Optimized for both desktop and mobile viewing with clean, professional aesthetics.

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
   Create a `.env` file in the `backend` directory with at least:
   ```env
   MONGO_URL=your_mongodb_connection_string
   PORT=3000
   SERP_API_KEY=your_serp_key
   GEMINI_API_KEY=your_gemini_key
   API_BASE_URL=http://localhost:3000
   FRONTEND_URL=http://localhost:5173
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

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Access the application at `http://localhost:5173`.

## Author

**Manyam Jagadeeswar Reddy**
B.Tech - Data Science & AI, IIIT Dharwad (2027)
GitHub: [Jagadeesh9110](https://github.com/Jagadeesh9110)