# StartupBoost - AI-Powered Startup Website Analyzer 🚀

A comprehensive full-stack tool that analyzes startup websites across 5 key criteria using **Node.js**, **Python**, and **FREE Google Gemini AI**.

## 🎯 Overview

This tool combines technical signal extraction, Python-powered readability analysis, and AI semantic understanding to score startup websites on:

### **5 Main Criteria:**
1. **💎 Value Proposition** - Is it clear what the product does and who it's for?
2. **🎯 CTA Strength** - Are calls-to-action compelling and action-oriented?
3. **⭐ Social Proof** - Does the site establish credibility and trust?
4. **📖 Visual Readability** - Is content scannable and easy to digest?
5. **🔍 SEO & Discoverability** - Is the site optimized for search engines?

## 🛠️ Tech Stack

- **Backend:** Node.js + Express
- **Analysis:** Python (Flask) + Gemini AI (FREE)
- **NLP:** Python textstat for Flesch-Kincaid readability
- **Frontend:** HTML/CSS/JavaScript (Single-page)

## ✨ Features

### **Multi-Layer Analysis:**
- ✅ **Technical Signals** (60+ startup-specific signals)
  - Pricing transparency, free trials, customer logos
  - Media mentions, team visibility, funding info
  - Product screenshots, demo availability
  - Trust signals, contact info, social media
  
- ✅ **Python Analysis** (Microservice on port 5000)
  - Flesch-Kincaid readability scoring
  - Keyword density and SEO analysis
  - Sentence/word complexity metrics
  
- ✅ **AI Analysis** (Gemini 2.0 Flash - FREE)
  - Semantic content understanding
  - Buzzword detection
  - Value proposition clarity
  - CTA persuasiveness evaluation

---

## 🚀 Quick Start

### **Prerequisites:**
- Node.js 16+ 
- Python 3.8+ (optional but recommended)
- **Google Gemini API Key (FREE)** - [Get yours here in 2 minutes](https://aistudio.google.com/app/apikey)

> ⚠️ **IMPORTANT for Teammates/Judges:** See [API_KEY_SETUP.md](./API_KEY_SETUP.md) for detailed setup instructions!

### **Step 1: Get FREE Gemini API Key**

1. Go to https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key" → "Create API key in new project"
4. Copy your key (starts with `AIza...`)

> 📖 **Detailed guide:** [API_KEY_SETUP.md](./API_KEY_SETUP.md)

### **Step 2: Configure API Key**

Create a `.env` file in the project root and add:
```bash
GEMINI_API_KEY=AIzaYourKeyHere
PORT=3000
```

> ⚠️ **Note:** The `.env` file is git-ignored (not in the repo). Each person needs their own!

### **Step 3: Install & Run**

```bash
# Install dependencies
npm install

# Start the server
npm start
```

Server runs at `http://localhost:3000`

✅ **Test it works:** Open the URL and analyze any website!

---

## 📖 API Usage

### **Analyze a Website**

**Endpoint:** `POST /api/analyze`

**Request:**
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

**Response includes:**
```json
{
  "success": true,
  "url": "https://example.com",
  "mainCriteria": {
    "valueProposition": {
      "score": 7,
      "breakdown": { "technical": 3, "ai": 6 },
      "analysis": {
        "strengths": ["Clear H1 heading", "Benefit-focused language"],
        "weaknesses": ["Could be more specific"],
        "aiInsight": "Value proposition is clear but could emphasize unique benefits more",
        "suggestion": "Highlight what makes you different from competitors"
      }
    },
    "ctaStrength": { "score": 8, "breakdown": {...}, "analysis": {...} },
    "socialProof": { "score": 6, "breakdown": {...}, "analysis": {...} },
    "visualReadability": { "score": 7, "breakdown": {...}, "analysis": {...} },
    "seoDiscoverability": { "score": 8, "breakdown": {...}, "analysis": {...} }
  },
  "signals": {
    "headings": { "h1": [...], "h2": [...], "h3": [...] },
    "ctas": [...],
    "contactInfo": { "email": true, "phone": false, "address": false },
    "socialMedia": { "hasLinks": true, "count": 3 },
    "trustSignals": { "hasHttps": true, "hasPrivacyPolicy": true },
    "startupSignals": {
      "hasPricing": true,
      "hasFreeTrial": true,
      "hasCustomerLogos": true,
      "hasMediaMentions": true,
      "hasMetrics": true,
      "hasTeamSection": true
    },
    "textContent": {
      "wordCount": 543,
      "valueProposition": "...",
      "headingsSummary": "..."
    }
  },
  "aiAnalysis": {
    "success": true,
    "valueProposition": { "score": 7, "explanation": "...", "strengths": [...], "weaknesses": [...] },
    "ctaStrength": { "score": 8, "explanation": "..." },
    "socialProof": { "score": 6, "explanation": "..." },
    "readability": { "score": 7, "explanation": "..." },
    "seoQuality": { "score": 8, "explanation": "..." },
    "pythonReadability": {
      "success": false  // true if Python service running
      // When true: includes fleschReadingEase, difficulty, recommendation
    }
  }
}
```

---

## 🎓 How the 5 Criteria Are Analyzed

Each criterion uses a **hybrid scoring approach** combining technical signals, Python analysis (optional), and AI evaluation:

### **1️⃣ Value Proposition Clarity (0-10)**
**Weight:** 40% Technical + 60% AI

**Technical Signals (4 points):**
- ✅ H1 heading present and scannable (5-100 chars)
- ✅ Benefit-focused keywords (save, grow, boost, help, solve, easy, fast)
- ✅ Value prop visible in first section (20+ chars)
- ✅ Meta description exists (50+ chars)
- 🆕 **Startup Bonuses:**
  - Pricing transparency visible (+0.5)
  - Product screenshots/demo video (+0.5)
  - Use cases shown (+0.5)
  - Feature list present (+0.5)

**AI Analysis (6 points):**
- 🤖 Evaluates clarity and uniqueness
- 🤖 Checks benefit articulation
- 🤖 Assesses target audience clarity
- 🤖 Provides strengths, weaknesses, and suggestions

**Formula:** `(technical/6.25 * 4) + (aiScore * 0.6)`

---

### **2️⃣ CTA Strength (0-10)**
**Weight:** 50% Technical + 50% AI

**Technical Signals (5 points):**
- ✅ Primary CTA button exists
- ✅ Multiple CTAs for different conversion stages
- ✅ CTAs visible above the fold
- ✅ Contrasting colors for visibility
- ✅ Urgency language (free, now, today, instant)
- 🆕 **Startup Bonuses:**
  - Free trial offer (+1 point)
  - Demo available (+0.5)
  - Chat widget present (+0.5)

**AI Analysis (5 points):**
- 🤖 CTA clarity and action-oriented language
- 🤖 Urgency and value communication
- 🤖 CTA placement and visual hierarchy
- 🤖 Persuasiveness evaluation

**Formula:** `(technical/7 * 5) + (aiScore * 0.5)`

---

### **3️⃣ Social Proof & Trust (0-10)**
**Weight:** 40% Technical + 60% AI

**Technical Signals (4 points):**
- ✅ HTTPS enabled
- ✅ Privacy policy link
- ✅ Contact information visible
- ✅ Testimonials present
- 🆕 **Startup Bonuses:**
  - Customer logos displayed (+0.75)
  - Brand names mentioned (+0.75)
  - Media mentions (+0.75)
  - Metrics/numbers shown (+0.5)
  - Team/About section (+0.5)
  - Funding information (+0.5)
  - Awards/recognition (+0.5)

**AI Analysis (6 points):**
- 🤖 Credibility of testimonials
- 🤖 Authority and trust signals quality
- 🤖 Social proof authenticity vs quantity
- 🤖 Brand perception

**Formula:** `(technical/8 * 4) + (aiScore * 0.6)`

---

### **4️⃣ Visual Readability (0-10)**
**Weight:** 30% Technical + 70% AI/Python

**Technical Signals (3 points):**
- ✅ Word count (100+ words = sufficient content)
- ✅ Scannable length (50-2000 words optimal)
- ✅ Heading hierarchy (H1, H2, H3 structure)
- ✅ Visual elements (1-10 images for breaks)

**AI Analysis (7 points):**
- 🤖 Sentence complexity evaluation
- 🤖 Paragraph structure assessment
- 🤖 Whitespace and scannability
- 🤖 Readability recommendation

**Python Enhancement (optional):**
- 🐍 Flesch-Kincaid Reading Ease score (0-100)
- 🐍 Average sentence length metrics
- 🐍 Syllables per word count
- 🐍 Difficulty level (Very Easy → Very Hard)
- *Note: Falls back to AI-only if Python unavailable*

**Formula:** `(technical/3 * 3) + (readabilityScore * 0.7)`

---

### **5️⃣ SEO & Discoverability (0-10)**
**Weight:** 40% Technical + 60% AI

**Technical Signals (4 points):**
- ✅ Title tag exists (30-60 chars optimal)
- ✅ Meta description (100-160 chars)
- ✅ H1-H6 heading structure
- ✅ Image alt tags present

**AI Analysis (6 points):**
- 🤖 Keyword strategy evaluation
- 🤖 Content structure for SEO
- 🤖 Semantic relevance
- 🤖 Search intent alignment

**Formula:** `(technical/4 * 4) + (aiScore * 0.6)`

---

## 🔑 Key Features

- **60+ Technical Signals** extracted from HTML/CSS
- **14 Startup-Specific Signals** (pricing, trials, logos, media, metrics)
- **Temperature=0 AI** for consistent, deterministic scoring
- **Graceful Degradation** - works without Python (AI compensates)
- **FREE Gemini API** - no cost for AI analysis

---

## 🏗️ Project Structure

```
.
├── package.json
├── .gitignore
├── README.md
└── src/
    ├── server.js              # Main Express server
    ├── routes/
    │   └── analyze.js         # API route handlers
    └── services/
        ├── pageFetcher.js     # Fetches and parses web pages
        ├── signalExtractor.js # Extracts page signals
        └── personaScorer.js   # Scores pages for each persona
```

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000` by default.

## API Usage

### Analyze a Website

**Endpoint:** `POST /api/analyze`

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Example using curl:**
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

**Example using JavaScript/fetch:**
```javascript
fetch('http://localhost:3000/api/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://example.com'
  })
})
  .then(response => response.json())
  .then(data => console.log(data));
```

### Response Format

```json
{
  "success": true,
  "url": "https://example.com",
  "statusCode": 200,
  "analyzedAt": "2025-11-28T10:30:00.000Z",
  "signals": {
    "headings": {
      "h1": ["Main Heading"],
      "h2": ["Section 1", "Section 2"],
      "h3": ["Subsection"],
      "total": 4
    },
    "ctas": {
      "count": 3,
      "items": [
        {
          "text": "Sign Up",
          "type": "button",
          "href": "/signup"
        }
      ]
    },
    "contactInfo": {
      "hasEmail": true,
      "hasPhone": true,
      "hasAddress": false,
      "hasContactForm": true
    },
    "content": {
      "paragraphCount": 10,
      "imageCount": 5,
      "linkCount": 20,
      "totalTextLength": 2500,
      "hasVideo": false
    },
    "metadata": {
      "title": "Example Website",
      "description": "This is an example",
      "hasOgImage": true,
      "hasFavicon": true
    }
  },
  "personas": {
    "impatientUser": {
      "score": 85,
      "maxScore": 100,
      "percentage": 85,
      "insights": [
        "✓ Has a clear main heading",
        "✓ Multiple clear calls-to-action",
        "✓ Content is concise and scannable"
      ],
      "description": "An impatient user wants quick value, clear CTAs, and easy-to-scan content"
    },
    "skepticalUser": {
      "score": 75,
      "maxScore": 100,
      "percentage": 75,
      "insights": [
        "✓ Email address found",
        "✓ Contact form available",
        "✓ Has page title",
        "✓ Substantial content provided"
      ],
      "description": "A skeptical user looks for trust signals, contact information, and credibility"
    }
  }
}
```

### Health Check

**Endpoint:** `GET /health`

Returns server status:
```json
{
  "status": "ok",
  "message": "Website analyzer is running"
}
```

## Features

### Current Capabilities

- ✅ Fetch and parse any public website
- ✅ Extract page signals (headings, CTAs, contact info, content metrics)
- ✅ Score pages from two persona perspectives
- ✅ Return detailed insights for each persona
- ✅ Error handling for invalid URLs, timeouts, etc.

### Scoring Criteria

**Impatient User (max 100 points):**
- Clear H1 heading (20 pts)
- Multiple CTAs (30 pts)
- Concise paragraphs (20 pts)
- Good heading structure (15 pts)
- Visual elements (15 pts)

**Skeptical User (max 100 points):**
- Contact information (40 pts)
- Professional metadata (30 pts)
- Content depth (30 pts)

## Future Extensions

This is a minimal foundation. You can easily extend it with:

- More personas (e.g., accessibility-focused, mobile-first)
- Niche-specific rules (startups, nonprofits, e-commerce)
- AI-powered analysis
- Performance metrics
- Mobile responsiveness checks
- SEO scoring
- A frontend interface

## Error Handling

The API handles common errors:
- Invalid URLs
- Unreachable websites
- Timeouts (10 second limit)
- HTTP errors

All errors return appropriate HTTP status codes and descriptive messages.

## Dependencies

- **express**: Web server framework
- **axios**: HTTP client for fetching pages
- **cheerio**: jQuery-like HTML parser
- **cors**: Enable CORS for frontend integration

## License

MIT
