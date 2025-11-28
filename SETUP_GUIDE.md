# 🚀 Complete Setup & Testing Guide

## Step-by-Step Setup

### 1. Get Your FREE Gemini API Key

**Go to:** https://ai.google.dev/

1. Click "Get API Key in Google AI Studio"
2. Sign in with your Google account
3. Click "Create API Key"
4. Select "Create API key in new project" (or use existing)
5. Copy the key (starts with `AIza...`)

**Important:** This is 100% FREE with generous limits (60 requests/minute)!

---

### 2. Add API Key to .env File

Open the `.env` file in the project root and replace the placeholder:

```bash
GEMINI_API_KEY=AIzaSyB2j8Vl0TFZKb2AY0-Olk3m8FK1_E0awJ4
PORT=3000
```

**Save the file!**

---

### 3. Verify Installation

Dependencies should already be installed, but verify:

```bash
npm install
```

You should see:
- ✅ @google/generative-ai
- ✅ dotenv
- ✅ express, axios, cheerio, cors

---

### 4. Start the Server

```bash
npm run dev
```

You should see:
```
✅ AI analyzer initialized with Gemini
Server is running on port 3000
Health check: http://localhost:3000/health
Analyze endpoint: http://localhost:3000/api/analyze
```

If you see "⚠️ Gemini API key not configured", go back to step 2!

---

## Testing the System

### Test 1: Basic Health Check

```bash
curl http://localhost:3000/health
```

**Expected output:**
```json
{"status":"ok","message":"Website analyzer is running"}
```

---

### Test 2: Analyze a Simple Site

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

**What to look for:**
- ✅ `"success": true`
- ✅ `signals` object with all categories
- ✅ `aiAnalysis` with scores 1-10
- ✅ `personas` with 5 different users
- ✅ AI-generated suggestions

---

### Test 3: Analyze a Real Website

Try a high-quality site:

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://stripe.com"}'
```

**Expected results:**
- Content Quality Seeker: 80-95/100
- Ad-Hater: 90-100/100
- SEO Optimizer: 85-95/100

---

### Test 4: Analyze a Blog

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://medium.com"}'
```

**What to check:**
- `blogFeatures.hasBlog`: should be true
- `textContent.wordCount`: should be high
- AI readability score: should be 7-9/10

---

## Interpreting Results

### AI Analysis Section

```json
"aiAnalysis": {
  "readability": {
    "score": 8,  // 1-10 scale
    "explanation": "Clear and concise writing..."
  },
  "informativeness": {
    "score": 7,
    "explanation": "Provides useful information..."
  },
  // ... more scores
  "topSuggestions": [
    "Add more specific examples",
    "Include customer testimonials",
    "Improve mobile responsiveness"
  ]
}
```

**Score Guide:**
- 8-10 = Excellent
- 6-7 = Good
- 4-5 = Average
- 1-3 = Poor

---

### Persona Scores

Each persona has:
- `score`: Raw points (0-100)
- `percentage`: Same as score
- `insights`: Specific feedback
- `aiPowered`: true/false (does it use AI?)

**Example:**
```json
"contentQualitySeeker": {
  "score": 82,
  "percentage": 82,
  "insights": [
    "✓ Excellent readability (9/10): Clear and engaging prose",
    "⚠ Moderately informative (6/10): Could provide more depth",
    "✓ Highly engaging (8/10): Uses storytelling effectively"
  ],
  "aiPowered": true,
  "aiScores": {
    "readability": 9,
    "informativeness": 6,
    "engagement": 8,
    "uniqueness": 7
  }
}
```

---

## Common Issues & Solutions

### Issue: "AI analysis not available"

**Cause:** API key not configured

**Solution:**
1. Check `.env` file exists
2. Make sure `GEMINI_API_KEY` is set
3. Restart server with `npm run dev`

---

### Issue: "Failed to fetch page"

**Causes:**
- Invalid URL
- Website is down
- Website blocks bots

**Solution:**
- Verify URL is correct (must include `http://` or `https://`)
- Try a different website
- Some sites block automated requests (normal)

---

### Issue: Analysis takes 10+ seconds

**Normal!** AI analysis takes 2-5 seconds. Total with page fetch:
- Fast sites: 3-6 seconds
- Slow sites: 8-12 seconds

**To speed up:**
- Add caching for repeated URLs
- Skip AI for quick preview (modify code)

---

### Issue: AI returns low scores for good sites

**Cause:** AI might be conservative or site has issues you didn't notice

**Check:**
1. Look at `aiAnalysis` explanations
2. Read `topSuggestions`
3. The AI may be catching real issues!

---

## What Each Signal Means

### Trust Signals
- `hasHttps`: Site uses HTTPS (secure)
- `hasPrivacyPolicy`: Has privacy policy link
- `hasTestimonials`: Customer testimonials found
- `hasCustomerCount`: Mentions "10,000+ customers" etc.

### Social Media
- `platforms`: Which platforms are linked
- `totalPlatforms`: Count of social links
- `hasSocialShareButtons`: Can users share content?

### Ads & Annoyances
- `likelyAdIframes`: Ad frames detected
- `hasPopups`: Popup modals found
- `hasAutoplayVideo`: Videos play automatically
- `annoyanceScore`: Combined annoyance metric

### SEO
- `hasMetaKeywords`: Old-school meta keywords
- `openGraphTags`: Facebook/social sharing tags
- `hasStructuredData`: Schema.org markup
- `hasViewport`: Mobile-friendly tag

### Blog Features
- `hasBlog`: Blog section exists
- `hasSearch`: Blog has search
- `hasCategories`: Posts organized by category
- `recentPostTitles`: Latest blog post titles

---

## Performance Tips

### For Hackathon Demo:

1. **Pre-analyze popular sites** before demo
   - Save responses as examples
   - Faster than live analysis

2. **Start with example.com** to show contrast
   - Low scores highlight what matters

3. **Then show Stripe/Airbnb** for high scores
   - Demonstrates the tool works correctly

4. **Highlight AI suggestions**
   - These are unique and impressive
   - Show the value-add of AI

---

## Next Steps After Setup

Once everything works:

1. ✅ Test with 5-10 different websites
2. ✅ Note which personas score highest/lowest for each
3. ✅ Review AI suggestions for accuracy
4. ✅ Consider adding more personas (Team 2)
5. ✅ Consider detecting more signals (Team 1)
6. ✅ Build a simple frontend (optional)

---

## API Response Size

Typical response: 3-8 KB (pretty-printed)

Compressed: ~1-2 KB

**Contains:**
- 50+ signal detections
- 5 persona scores
- AI analysis with explanations
- Improvement suggestions

---

## Rate Limits (Gemini Free Tier)

- **60 requests per minute**
- **1,500 requests per day**
- **1 million tokens per month**

For hackathon: **More than enough!**

---

## Need Help?

**Check logs:**
```bash
# In terminal where server is running
# Look for error messages
```

**Common success indicators:**
- `✅ AI analyzer initialized with Gemini`
- `🤖 Running AI analysis...`
- `200` status codes

**If stuck:**
1. Check `.env` file
2. Restart server
3. Try different URL
4. Check internet connection

---

**You're ready to go! Happy analyzing!** 🎉
