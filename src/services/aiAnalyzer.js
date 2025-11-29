const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
let genAI = null;
let model = null;

function initializeAI() {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
    console.warn('⚠️  Gemini API key not configured. AI analysis will be skipped.');
    return false;
  }
  
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use gemini-2.0-flash (fast and free) with temperature=0 for consistent scoring
    model = genAI.getGenerativeModel({ 
      model: "models/gemini-2.0-flash",
      generationConfig: {
        temperature: 0,  // Makes responses deterministic (same input → same output)
        topP: 1,
        topK: 1
      }
    });
    console.log('✅ AI analyzer initialized with Gemini 2.0 Flash (deterministic mode)');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize AI:', error.message);
    return false;
  }
}

/**
 * Analyze content quality using AI (completely FREE with Gemini)
 * Evaluates based on jury criteria: readability, informativeness, engagement, uniqueness
 */
async function analyzeContentQuality(textContent, url, signals) {
  // Initialize AI if not already done
  if (!model && !initializeAI()) {
    return getFallbackAnalysis();
  }

  try {
    const ctas = signals.callsToAction || [];
    const startup = signals.startupSignals || {};
    
    const prompt = `You are a professional website analyzer for startups. Analyze this website across 5 key criteria.

URL: ${url}

BASIC WEBSITE DATA:
- Title: ${signals.metadata.title || 'No title'}
- H1: ${signals.headings.h1.join(', ') || 'No H1'}
- Main headings: ${textContent.headingsSummary}
- Value proposition: ${textContent.valueProposition || 'Not clear'}
- Word count: ${textContent.wordCount}

CALL-TO-ACTION DATA:
- CTAs found: ${ctas.join(', ') || 'None'}
- Has free trial: ${startup.hasFreeTrial ? 'Yes' + (startup.trialLength ? ` (${startup.trialLength} days)` : '') : 'No'}
- Has demo: ${startup.hasDemo ? 'Yes' : 'No'}
- Has chat widget: ${startup.hasChatWidget ? 'Yes' : 'No'}

SOCIAL PROOF DATA:
- Has testimonials: ${signals.trustSignals.hasTestimonials ? 'Yes' : 'No'}
- Has customer logos: ${startup.hasCustomerLogos ? `Yes (${startup.customerLogoCount} logos)` : 'No'}
- Brand names mentioned: ${startup.hasBrandNames ? 'Yes' : 'No'}
- Media mentions: ${startup.hasMediaMentions ? `Yes (${startup.mediaCount} outlets)` : 'No'}
- Has metrics: ${startup.hasMetrics ? `Yes (${startup.metrics.join(', ')})` : 'No'}
- Team section: ${startup.hasTeamSection ? 'Yes' : 'No'}
- Funding info: ${startup.hasFundingInfo ? 'Yes' : 'No'}
- Awards: ${startup.hasAwards ? 'Yes' : 'No'}

PRODUCT & VALUE PROP DATA:
- Has pricing page: ${startup.hasPricing ? 'Yes' : 'No'}
- Pricing visible on homepage: ${startup.pricingVisible ? 'Yes' : 'No'}
- Product screenshot: ${startup.hasScreenshot ? 'Yes' : 'No'}
- Demo video: ${startup.hasDemoVideo ? 'Yes' : 'No'}
- Feature list: ${startup.hasFeatureList ? 'Yes' : 'No'}
- Use cases defined: ${startup.hasUseCases ? 'Yes' : 'No'}
- Comparison table: ${startup.hasComparisonTable ? 'Yes' : 'No'}

SEO & TRUST DATA:
- Has HTTPS: ${signals.trustSignals.hasHttps ? 'Yes' : 'No'}
- Meta description: ${signals.metadata.description ? 'Yes' : 'No'}
- Open Graph tags: ${signals.seo.openGraphTags?.ogTitle ? 'Yes' : 'No'}
- Jobs/Careers page: ${startup.hasJobsPage ? 'Yes' : 'No'}

Content preview (first 2500 chars):
${textContent.fullText.substring(0, 2500)}

Analyze and provide scores for these 5 STARTUP-SPECIFIC criteria AND 6 behavioral drivers × 3 personas (use EXACTLY this JSON format):

{
  "valueProposition": {
    "score": <1-10>,
    "explanation": "<Is it immediately clear what this product does, who it's for, and why it matters? Consider: product clarity, target audience, differentiation, pricing transparency>",
    "strengths": ["<what works well>", "<another strength>"],
    "weaknesses": ["<what's missing>", "<another weakness>"],
    "suggestion": "<one specific improvement>"
  },
  "ctaStrength": {
    "score": <1-10>,
    "explanation": "<Are CTAs clear, action-oriented, and compelling? Consider: action verbs, urgency, value communication, free trial/demo offers, multiple touchpoints>",
    "strengths": ["<strength 1>", "<strength 2>"],
    "weaknesses": ["<weakness 1>", "<weakness 2>"],
    "suggestion": "<specific CTA improvement>"
  },
  "socialProof": {
    "score": <1-10>,
    "explanation": "<Is credibility established? Consider: authentic testimonials, customer logos, brand names, media mentions, metrics/numbers, team visibility, funding/awards>",
    "strengths": ["<trust element 1>", "<trust element 2>"],
    "weaknesses": ["<missing trust signal>", "<another missing>"],
    "suggestion": "<how to build more credibility>"
  },
  "readability": {
    "score": <1-10>,
    "explanation": "<Is content scannable and easy to digest? Consider: heading hierarchy, sentence length, visual structure, white space, feature lists>",
    "suggestion": "<layout improvement>"
  },
  "seoQuality": {
    "score": <1-10>,
    "explanation": "<Is the site optimized for discovery? Consider: meta tags, keyword integration, search intent alignment, unique ranking opportunities, content freshness>",
    "strengths": ["<SEO strength>"],
    "weaknesses": ["<SEO weakness>"],
    "suggestion": "<SEO improvement>"
  },
  "globalReach": {
    "score": <1-10>,
    "explanation": "<Is the site designed for international markets? Consider: multi-language support, international focus in messaging, global market mentions, accessibility for different regions, cultural adaptation>",
    "strengths": ["<global strength>"],
    "weaknesses": ["<international limitation>"],
    "suggestion": "<how to expand global reach>"
  },
  "topSuggestions": [
    "<highest priority improvement>",
    "<second priority>",
    "<third priority>"
  ],
  "behavioralDrivers": {
    "impatient": {
      "user": {"score": <1-10>, "strengths": ["<what works>"], "weaknesses": ["<what doesn't>"]},
      "buyer": {"score": <1-10>, "strengths": ["<what works>"], "weaknesses": ["<what doesn't>"]},
      "investor": {"score": <1-10>, "strengths": ["<what works>"], "weaknesses": ["<what doesn't>"]}
    },
    "skeptical": {
      "user": {"score": <1-10>, "strengths": ["<trust signals>"], "weaknesses": ["<missing trust>"]},
      "buyer": {"score": <1-10>, "strengths": ["<credibility>"], "weaknesses": ["<doubts>"]},
      "investor": {"score": <1-10>, "strengths": ["<proof>"], "weaknesses": ["<concerns>"]}
    },
    "analytical": {
      "user": {"score": <1-10>, "strengths": ["<data available>"], "weaknesses": ["<missing info>"]},
      "buyer": {"score": <1-10>, "strengths": ["<specs/ROI>"], "weaknesses": ["<unclear details>"]},
      "investor": {"score": <1-10>, "strengths": ["<metrics>"], "weaknesses": ["<missing data>"]}
    },
    "indecisive": {
      "user": {"score": <1-10>, "strengths": ["<low-risk options>"], "weaknesses": ["<barriers>"]},
      "buyer": {"score": <1-10>, "strengths": ["<trial/demo>"], "weaknesses": ["<friction>"]},
      "investor": {"score": <1-10>, "strengths": ["<guidance>"], "weaknesses": ["<uncertainty>"]}
    },
    "cognitiveEase": {
      "user": {"score": <1-10>, "strengths": ["<simple/clear>"], "weaknesses": ["<complex>"]},
      "buyer": {"score": <1-10>, "strengths": ["<easy to understand>"], "weaknesses": ["<confusing>"]},
      "investor": {"score": <1-10>, "strengths": ["<clarity>"], "weaknesses": ["<jargon>"]}
    },
    "valueSeeking": {
      "user": {"score": <1-10>, "strengths": ["<clear benefits>"], "weaknesses": ["<vague value>"]},
      "buyer": {"score": <1-10>, "strengths": ["<ROI shown>"], "weaknesses": ["<missing value>"]},
      "investor": {"score": <1-10>, "strengths": ["<growth potential>"], "weaknesses": ["<unclear returns>"]}
    }
  }
}

Return ONLY valid JSON, no other text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      return {
        success: true,
        ...analysis,
        analyzedAt: new Date().toISOString(),
      };
    }
    
    throw new Error('Could not parse AI response');
    
  } catch (error) {
    console.error('AI analysis error:', error.message);
    return getFallbackAnalysis();
  }
}

/**
 * Fallback analysis when AI is not available
 * Uses simple heuristics
 */
function getFallbackAnalysis() {
  return {
    success: false,
    aiEnabled: false,
    message: 'AI analysis not available. Using basic heuristics.',
    readability: {
      score: 5,
      explanation: 'AI not configured - add GEMINI_API_KEY to enable detailed analysis'
    },
    informativeness: {
      score: 5,
      explanation: 'AI not configured'
    },
    engagement: {
      score: 5,
      explanation: 'AI not configured'
    },
    uniqueness: {
      score: 5,
      explanation: 'AI not configured'
    },
    seoQuality: {
      score: 5,
      explanation: 'AI not configured'
    },
    overallQuality: {
      score: 5,
      explanation: 'Get free API key at https://ai.google.dev/ to enable AI analysis'
    },
    topSuggestions: [
      'Configure Gemini API key to get AI-powered insights',
      'Visit https://ai.google.dev/ to get your free API key',
      'Add GEMINI_API_KEY to your .env file'
    ]
  };
}

/**
 * Calculate basic readability score (Flesch Reading Ease approximation)
 * This is a fallback when AI is not available
 */
function calculateReadabilityScore(text) {
  const sentences = text.split(/[.!?]+/).length;
  const words = text.split(/\s+/).length;
  const syllables = words * 1.5; // Rough approximation
  
  if (sentences === 0 || words === 0) return 5;
  
  const avgWordsPerSentence = words / sentences;
  const avgSyllablesPerWord = syllables / words;
  
  // Flesch Reading Ease formula
  const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
  
  // Convert to 1-10 scale
  return Math.max(1, Math.min(10, Math.round(score / 10)));
}

module.exports = { 
  analyzeContentQuality,
  initializeAI
};
