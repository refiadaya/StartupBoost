# StartupBoost Technical Documentation

## Overview

StartupBoost analyzes startup websites across 6 main criteria and evaluates behavioral drivers for 3 different personas (User, Buyer, Investor).

## Architecture

### Tech Stack
```
Frontend:  HTML5, CSS3, Vanilla JavaScript
Backend:   Node.js 18+, Express.js 4.18
AI:        Google Gemini 2.0 Flash (Free tier)
Scraping:  Cheerio 1.0, Axios 1.6
```

### Data Flow
```
URL Input → Signal Extraction → Criteria Scoring → AI Analysis → Behavioral Driver Scoring → Results
```

## Core Components

### 1. Signal Extractor (`src/services/signalExtractor.js`)

Extracts various signals from websites:

**Startup Signals:**
- Pricing information (visibility, free trial, freemium model)
- Customer logos and testimonials
- Media mentions and press coverage
- Founder information
- Product screenshots and demos
- Comparison tables

**SEO Signals:**
- Meta tags (title, description)
- Open Graph tags
- Schema.org structured data
- Canonical URLs

**Trust Signals:**
- Privacy policy, terms of service
- Security badges (SSL, certifications)
- Contact information
- Social proof elements

**Global Reach:**
- Language options
- Currency support
- International payment methods
- Timezone awareness

### 2. Main Criteria Scorer (`src/services/mainCriteriaScorer.js`)

Scores 6 main criteria (0-10 scale):

1. **Value Proposition** - How clear is the product's value?
2. **CTA Strength** - Are calls-to-action compelling?
3. **Social Proof** - Trust signals and credibility
4. **Readability** - Content clarity and structure
5. **SEO** - Search engine optimization
6. **Global Reach** - International readiness

**Scoring Method:**
- 50% Technical signals (detected elements)
- 50% AI analysis (contextual understanding)

### 3. AI Analyzer (`src/services/aiAnalyzer.js`)

Uses Google Gemini 2.0 Flash to provide contextual insights:

**For each criterion, AI evaluates:**
- Overall quality (0-10)
- Specific strengths
- Weaknesses and gaps
- Actionable suggestions

**Key Features:**
- Deterministic mode (temperature=0) for consistent scoring
- Structured JSON output
- Fallback analysis if API fails
- Free tier available

### 4. Behavioral Driver Scorer (`src/services/behavioralDriverScorer.js`)

Calculates 18 scores (6 drivers × 3 personas):

**Drivers:**
1. Impatient - Quick decision makers who need fast, clear information
2. Skeptical - Need proof and credibility before trusting
3. Analytical - Detailed researchers who evaluate all options
4. Indecisive - Struggle to make decisions without guidance
5. Cognitive-Ease - Prefer simplicity and clarity
6. Value-Seeking - Focus on getting maximum value for money

**Method:** Weighted formula combining main criteria scores

Example for Cognitive-Ease (User):
```javascript
score = (0.30 × readability) + 
        (0.25 × valueProposition) + 
        (0.20 × ctaStrength) + 
        (0.15 × seo) + 
        (0.05 × socialProof) + 
        (0.05 × globalReach)
```

Each persona has unique weights (108 total weights in `src/config/weights.js`)

## API Endpoints

### POST `/api/analyze`

Analyzes a website URL.

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "success": true,
  "url": "https://example.com",
  "timestamp": "2025-11-29T12:00:00Z",
  "mainCriteria": {
    "valueProposition": {
      "score": 8.5,
      "technical": 8.0,
      "ai": 9.0,
      "analysis": {
        "explanation": "Clear value proposition...",
        "strengths": ["Compelling headline", "Clear benefits"],
        "weaknesses": ["Missing pricing info"],
        "suggestions": ["Add pricing table", "Highlight ROI"]
      }
    },
    "ctaStrength": { ... },
    "socialProof": { ... },
    "readability": { ... },
    "seo": { ... },
    "globalReach": { ... }
  },
  "behavioralDrivers": {
    "impatient": {
      "user": { "score": 8.5, "breakdown": { ... } },
      "buyer": { "score": 7.8, "breakdown": { ... } },
      "investor": { "score": 7.2, "breakdown": { ... } }
    },
    "skeptical": { ... },
    "analytical": { ... },
    "indecisive": { ... },
    "cognitiveEase": { ... },
    "valueSeeking": { ... }
  }
}
```

### GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-29T12:00:00Z"
}
```

## Configuration

### Environment Variables

```bash
# Required
GEMINI_API_KEY=your_key_here    # Google Gemini API key

# Optional
PORT=3000                        # Server port (default: 3000)
NODE_ENV=development             # Environment mode
```

### Getting Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API key"
4. Copy and add to `.env` file

## Weight Matrix

Located in `src/config/weights.js`, the weight matrix defines how main criteria combine to calculate behavioral driver scores for each persona.

**Structure:**
```javascript
{
  simplicity: {
    user: {
      valueProposition: 0.25,
      ctaStrength: 0.20,
      socialProof: 0.05,
      readability: 0.30,
      seo: 0.15,
      globalReach: 0.05
    },
    buyer: { ... },
    investor: { ... }
  },
  // ... 5 more drivers
}
```

**Total:** 6 drivers × 3 personas × 6 criteria = **108 unique weights**

## Deployment

### Local Development

```bash
npm install
npm start
# Visit http://localhost:3000
```

### Production Deployment

**Vercel:**
```bash
npm i -g vercel
vercel
# Set GEMINI_API_KEY in dashboard
```

**Render:**
1. Connect GitHub repo
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variable: `GEMINI_API_KEY`

**Railway:**
```bash
npm i -g @railway/cli
railway init
railway up
railway variables --set GEMINI_API_KEY=your_key
```

## Troubleshooting

### Common Issues

**AI analysis fails:**
- Check `GEMINI_API_KEY` in `.env`
- Verify API key is active
- Check internet connection

**Website scraping fails:**
- Some sites block scrapers
- Check if URL is accessible
- Verify URL format (include https://)

**Port already in use:**
```bash
# Find process
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)
```

## Performance

- **Average analysis time:** 10-20 seconds
- **Signals extracted:** 100+ per website
- **AI API calls:** 6 per analysis (one per criterion)
- **Memory usage:** ~50-100MB
- **Concurrent requests:** Stateless, supports multiple simultaneous analyses

## Future Improvements

- [ ] Caching results (Redis)
- [ ] Rate limiting
- [ ] PDF export
- [ ] Historical tracking
- [ ] Competitor comparison
- [ ] Custom weight configurations
- [ ] API authentication

---

**Last Updated:** November 29, 2025
