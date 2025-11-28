# Website Analyzer - AI-Powered Edition 🤖

A comprehensive backend tool that analyzes any public website from multiple user personas' perspectives, powered by **FREE Google Gemini AI**.

## 🎯 Overview

This tool fetches a URL, extracts 50+ page signals, and uses AI to evaluate content quality based on:
- **Readability** - How easy is the text to read?
- **Informativeness** - Does it provide valuable information?
- **Engagement** - Is the content interesting and compelling?
- **Uniqueness** - Is this information special or commonly available?
- **SEO Quality** - Are keywords well-targeted?

## ✨ Features

### **Technical Signal Detection (50+ signals)**
- ✅ Trust & Security (HTTPS, privacy policy, security badges)
- ✅ Social Media Links (Facebook, Twitter, LinkedIn, Instagram, YouTube, TikTok)
- ✅ Contact Information (email, phone, address, contact forms)
- ✅ Ads & Annoyances (popups, auto-play videos, ad iframes)
- ✅ SEO Elements (meta tags, Open Graph, structured data)
- ✅ Blog Features (search, categories, tags, comments)
- ✅ Content Metrics (paragraphs, images, links, videos)

### **AI-Powered Content Analysis** (FREE with Gemini)
- 🤖 Readability scoring and insights
- 🤖 Informativeness evaluation
- 🤖 Engagement level analysis
- 🤖 Uniqueness detection
- 🤖 SEO quality assessment
- 🤖 Improvement suggestions

### **5 User Personas**
1. **Impatient User** - Wants quick value, clear CTAs
2. **Skeptical User** - Looks for trust signals
3. **Content Quality Seeker** (AI-Powered) - Values readability, informativeness, engagement
4. **Ad-Hater** - Wants clean, distraction-free experience
5. **SEO Optimizer** (AI-Enhanced) - Cares about search visibility

---

## 🚀 Quick Start

### **Step 1: Get FREE Gemini API Key**

1. Go to https://ai.google.dev/
2. Click "Get API Key in Google AI Studio"
3. Sign in with your Google account
4. Click "Create API Key"
5. Copy your key (starts with `AIza...`)

### **Step 2: Configure API Key**

Open `.env` file and add your key:
```bash
GEMINI_API_KEY=your_actual_api_key_here
PORT=3000
```

### **Step 3: Install & Run**

```bash
# Install dependencies (already done)
npm install

# Start the server
npm run dev
```

Server runs at `http://localhost:3000`

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
  "signals": {
    "headings": { ... },
    "ctas": { ... },
    "contactInfo": { ... },
    "socialMedia": { ... },
    "trustSignals": { ... },
    "adsAndAnnoyances": { ... },
    "seo": { ... },
    "blogFeatures": { ... }
  },
  "aiAnalysis": {
    "readability": { "score": 8, "explanation": "..." },
    "informativeness": { "score": 7, "explanation": "..." },
    "engagement": { "score": 9, "explanation": "..." },
    "uniqueness": { "score": 6, "explanation": "..." },
    "seoQuality": { "score": 8, "explanation": "..." },
    "overallQuality": { "score": 8, "explanation": "..." },
    "topSuggestions": ["...", "...", "..."]
  },
  "personas": {
    "impatientUser": { "score": 85, "insights": [...] },
    "skepticalUser": { "score": 70, "insights": [...] },
    "contentQualitySeeker": { "score": 82, "insights": [...] },
    "adHater": { "score": 95, "insights": [...] },
    "seoOptimizer": { "score": 78, "insights": [...] }
  }
}
```

---

## 🎓 Understanding the Scores

### **Content Quality Seeker** (AI-Powered)
- **25 pts**: Readability (8+ = excellent)
- **30 pts**: Informativeness (8+ = highly informative)
- **25 pts**: Engagement (8+ = very engaging)
- **20 pts**: Uniqueness (8+ = unique content)

### **Ad-Hater**
- Starts at 100 pts, deducts for:
  - Ad iframes: -10 pts each
  - Auto-play videos: -20 pts
  - Popups: -15 pts
  - Cookie banners: -5 pts

### **SEO Optimizer** (AI-Enhanced)
- **30 pts**: Meta tags (title, description, keywords, viewport)
- **20 pts**: Open Graph tags
- **10 pts**: Structured data
- **15 pts**: Heading structure
- **20 pts**: AI keyword quality analysis

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
