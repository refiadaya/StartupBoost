# StartupBoost - AI-Powered Startup Website Analyzer

![StartupBoost](https://img.shields.io/badge/AI-Powered-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-18%2B-brightgreen)

**StartupBoost** is an intelligent website analyzer specifically designed for startups. It evaluates your website across 6 critical criteria and analyzes how it performs for different behavioral drivers across User, Buyer, and Investor personas.

## Features

### Core Analysis
- **6 Main Startup Criteria**: Value Proposition, CTA Strength, Social Proof, Readability, SEO, and Global Reach
- **AI-Powered Insights**: Each criterion is evaluated using advanced AI (Google Gemini 2.0 Flash) for contextual analysis
- **Behavioral Driver Analysis**: Evaluate how your site performs across 6 behavioral drivers:
  - Impatient - Quick decision makers who need fast, clear information
  - Skeptical - Need proof and credibility before trusting
  - Analytical - Detailed researchers who evaluate all options
  - Indecisive - Struggle to make decisions without guidance
  - Cognitive-Ease - Prefer simplicity and clarity
  - Value-Seeking - Focus on getting maximum value for money

### Multi-Persona Scoring
Each behavioral driver is scored separately for:
- **User Persona**: Evaluates ease of use and functionality
- **Buyer Persona**: Focuses on conversion and trust signals
- **Investor Persona**: Analyzes credibility and growth potential

### Advanced Signal Detection
- **Startup-Specific Signals**: Pricing visibility, free trials, customer logos, media mentions
- **SEO Analysis**: Meta tags, Open Graph, structured data, canonical URLs
- **Trust Signals**: Privacy policy, testimonials, security badges
- **Global Reach**: Multi-language support, currency options, international features
- **Technical Signals** extracted and analyzed

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Gemini API key

### Installation

```bash
# Clone the repository
git clone https://github.com/refiadaya/StartupBoost.git
cd StartupBoost

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your Google Gemini API key to .env
GEMINI_API_KEY=your_api_key_here
PORT=3000
```

### Running the Application

```bash
# Start the server
npm start

# Server will run on http://localhost:3000
```

### Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Enter a startup website URL (e.g., `https://stripe.com`)
3. Click "Analyze Website"
4. Wait for the AI-powered analysis (usually 10-20 seconds)
5. Review your comprehensive results!

## What You Get

### Main Criteria Scores (0-10)
Each criterion includes:
- **Technical Score**: Based on detected signals and best practices
- **AI Analysis**: Contextual evaluation with explanations
- **Strengths & Weaknesses**: Specific areas of excellence and improvement
- **Actionable Suggestions**: What to improve and how

### Behavioral Driver Analysis
For each of the 6 drivers, you get:
- **User Score**: How well it serves end-users
- **Buyer Score**: How well it converts customers
- **Investor Score**: How well it demonstrates potential
- **Weighted Formula**: Combines technical signals + AI insights
- **Persona-Specific Feedback**: Tailored recommendations

## Architecture

```
StartupBoost/
├── src/
│   ├── routes/
│   │   └── analyze.js          # Main API endpoint
│   ├── services/
│   │   ├── aiAnalyzer.js       # Google Gemini integration
│   │   ├── signalExtractor.js  # Web scraping & signal detection
│   │   ├── criteriaScorer.js   # Main criteria scoring logic
│   │   └── behavioralDriverScorer.js # Behavioral driver scoring
│   └── config/
│       └── weights.js          # Scoring weight matrix (108 values)
├── public/
│   └── index.html              # Frontend UI
├── server.js                   # Express server
└── .env                        # Configuration
```

## Scoring Methodology

### Main Criteria (6 metrics)
Each scored 0-10 using:
- **50% Technical Signals**: Detected features, elements, and best practices
- **50% AI Analysis**: Contextual understanding and quality assessment

### Behavioral Drivers (6 × 3 = 18 scores)
Each driver-persona combination scored using:
- **100% Weighted Formula**: Main criteria scores weighted by importance
- Example: For "Cognitive-Ease × User", the formula is:
  ```
  Score = (0.3 × Readability) + (0.25 × ValueProp) + 
          (0.2 × CTAStrength) + (0.15 × SEO) + 
          (0.05 × SocialProof) + (0.05 × GlobalReach)
  ```

### Weight Matrix
- **108 unique weights** (6 drivers × 3 personas × 6 criteria) defined in behavioral driver scorer
- Each behavioral driver has different weights for each persona
- Weights sum to 1.0 for each driver-persona combination
- Based on startup best practices and conversion research

## API Reference

### POST `/api/analyze`

Analyze a website URL.

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
        "explanation": "...",
        "strengths": [...],
        "weaknesses": [...],
        "suggestions": [...]
      }
    }
  },
  "behavioralDrivers": {
    "impatient": {
      "user": { "score": 8.5, "breakdown": {...} },
      "buyer": { "score": 7.8, "breakdown": {...} },
      "investor": { "score": 7.2, "breakdown": {...} }
    }
  }
}
```

### GET `/health`

Health check endpoint.

## Key Technologies

- **Backend**: Node.js, Express.js
- **AI**: Google Gemini 2.0 Flash (Free tier available)
- **Web Scraping**: Cheerio, Axios
- **Frontend**: Vanilla JavaScript, CSS3
- **Deployment**: Compatible with Vercel, Render, Railway, Heroku

## UI Features

- **Clean, Modern Design**: Dark blue gradient background with white cards
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Real-time Analysis**: Loading states and progress indicators
- **Expandable Sections**: Click to expand behavioral driver details
- **Professional Look**: Clean typography, smooth animations

## Environment Variables

```env
# Required
GEMINI_API_KEY=your_key_here    # Your Google Gemini API key

# Optional
PORT=3000                       # Server port (default: 3000)
NODE_ENV=production             # Environment
```

## Troubleshooting

### Common Issues

**"AI analysis failed"**
- Check your Google Gemini API key in `.env`
- Ensure you have API access enabled
- Check your internet connection

**"Failed to fetch website"**
- The target website may block scrapers
- Try a different URL
- Some sites require authentication

**Server won't start**
- Check if port 3000 is already in use: `lsof -ti:3000`
- Kill the process: `killall node` (macOS/Linux)
- Try a different port in `.env`

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm start

# The server will automatically restart on file changes
```

## Contributing

This is a hackathon project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

MIT License - feel free to use this project for your own purposes!

## Authors

- **Refia daya** - [GitHub](https://github.com/refiadaya)

## Acknowledgments

- Google for the Gemini API
- The startup community for inspiration
- Conversion optimization research and best practices
- All open-source libraries used in this project

## Future Enhancements

- [ ] Export results as PDF
- [ ] Historical tracking and comparison
- [ ] Competitor analysis (side-by-side)
- [ ] Multi-page analysis (crawl and analyze entire website structure)
- [ ] Deep-layer navigation (analyze multiple levels: homepage → product pages → pricing → about)
- [ ] Python integration for advanced data processing and ML-based recommendations
- [ ] Page speed and performance metrics
- [ ] Accessibility (A11y) compliance checking
- [ ] User authentication and saved reports
- [ ] Custom weight configurations
- [ ] Industry-specific templates

## Support

For questions or issues:
- Open an issue on GitHub
- Email: refia.daya@tum.de

## Documentation

For technical details, API reference, and deployment guides, see [DOCUMENTATION.md](./DOCUMENTATION.md)

