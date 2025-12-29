# BeyondChats – Full Stack + AI Assignment

This repository contains my submission for the **Full Stack Web Developer Intern** assignment at **BeyondChats**.

The project demonstrates a complete end-to-end workflow involving:
- Web scraping
- REST APIs
- Database integration
- LLM-based content enhancement
- A React-based frontend

---

## 🚀 Tech Stack

**Backend**
- Node.js
- Express.js
- MongoDB (Mongoose)
- Axios + Cheerio (scraping)
- SerpAPI (Google Search)
- Google Gemini API (LLM)

**Frontend**
- React.js
- Vercel (deployment)

---

## 🧠 Assignment Breakdown

### Phase 1 – Scraping & Backend APIs
- Scraped the **5 oldest articles** from BeyondChats blogs.
- Stored articles in MongoDB.
- Implemented full CRUD APIs for articles.

### Phase 2 – Automation & LLM Enhancement
- Built a Node.js script to:
  - Fetch articles from backend APIs.
  - Search article titles on Google using SerpAPI.
  - Scrape top 2 ranking external articles.
  - Use Gemini API to enhance formatting and content quality.
  - Store updated articles along with references.

### Phase 3 – Frontend
- React app to display:
  - Original articles
  - AI-enhanced articles
  - Reference sources
- Responsive and clean UI.

---

## 🏗 Architecture Overview

Scraper → MongoDB → REST APIs → Automation Script → LLM → APIs → React Frontend

yaml
Copy code

(See `/diagrams` for visual architecture.)

---

## ⚙️ Local Setup Instructions

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
Frontend
bash
Copy code
cd frontend
npm install
npm run dev
🔑 Environment Variables
Backend .env:

makefile
Copy code
MONGODB_URI=
SERP_API_KEY=
GEMINI_API_KEY=
🌐 Live Links
Frontend: (Vercel link here)

Backend APIs: (if deployed)

📌 Notes
Code is modular and well-documented.

Commits are made frequently to reflect development progress.

This project is built specifically for the BeyondChats assignment and will not be reused elsewhere.

Author:
Manyam Jagadeeswar Reddy
B.Tech – Data Science & AI, IIIT Dharwad (2027)
GitHub: https://github.com/Jagadeesh9110