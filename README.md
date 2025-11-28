# Website Analyzer

A simple backend tool that analyzes any public website from different user personas' perspectives.

## Overview

This tool fetches a URL, extracts key page signals (headings, CTAs, contact info, etc.), and evaluates the page from the perspective of different user personas:

- **Impatient User**: Wants quick value, clear CTAs, and easy-to-scan content
- **Skeptical User**: Looks for trust signals, contact information, and credibility

## Project Structure

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
