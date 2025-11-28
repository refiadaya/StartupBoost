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
    // Use gemini-2.0-flash (fast and free)
    model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });
    console.log('✅ AI analyzer initialized with Gemini 2.0 Flash');
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
    const prompt = `You are a website quality analyzer. Analyze this website and provide scores based on these criteria:

URL: ${url}

Website Content Summary:
- Title: ${signals.metadata.title || 'No title'}
- Main headings: ${textContent.headingsSummary}
- Value proposition: ${textContent.valueProposition}
- Word count: ${textContent.wordCount}

Full content preview (first 3000 chars):
${textContent.fullText.substring(0, 3000)}

Please analyze and rate the following (use EXACTLY this JSON format):
{
  "readability": {
    "score": <1-10>,
    "explanation": "<brief explanation>"
  },
  "informativeness": {
    "score": <1-10>,
    "explanation": "<does it provide valuable, useful information?>"
  },
  "engagement": {
    "score": <1-10>,
    "explanation": "<is it interesting and compelling?>"
  },
  "uniqueness": {
    "score": <1-10>,
    "explanation": "<is this information unique or commonly available elsewhere?>"
  },
  "seoQuality": {
    "score": <1-10>,
    "explanation": "<are keywords well-targeted and relevant?>"
  },
  "overallQuality": {
    "score": <1-10>,
    "explanation": "<overall assessment>"
  },
  "topSuggestions": [
    "<suggestion 1>",
    "<suggestion 2>",
    "<suggestion 3>"
  ]
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
