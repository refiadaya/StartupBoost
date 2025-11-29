const express = require('express');
const { fetchPage } = require('../services/pageFetcher');
const { extractSignals } = require('../services/signalExtractor');
const { scorePersonas } = require('../services/personaScorer');
const { analyzeContentQuality } = require('../services/aiAnalyzer');
const { scoreMainCriteria } = require('../services/mainCriteriaScorer');
const { scoreBehavioralDrivers } = require('../services/behavioralDriverScorer');
const { analyzeReadability, analyzeKeywords } = require('../services/pythonClient');

const router = express.Router();

/**
 * POST /api/analyze
 * Analyzes a website URL and returns persona scores
 */
router.post('/analyze', async (req, res) => {
  try {
    const { url } = req.body;

    // Validate input
    if (!url) {
      return res.status(400).json({
        error: 'URL is required',
        message: 'Please provide a valid URL in the request body',
      });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({
        error: 'Invalid URL',
        message: 'Please provide a valid URL (including http:// or https://)',
      });
    }

    // Fetch the page
    const { $, url: finalUrl, statusCode } = await fetchPage(url);

    // Extract signals
    const signals = extractSignals($);
    
    // Add HTTPS check to trust signals
    signals.trustSignals.hasHttps = finalUrl.startsWith('https://');

    // AI Analysis (FREE with Gemini!)
    console.log('🤖 Running AI analysis...');
    const aiAnalysis = await analyzeContentQuality(
      signals.textContent,
      finalUrl,
      signals
    );

    // Python Analysis (optional - runs in parallel)
    console.log('🐍 Running Python analysis...');
    const [pythonReadability, pythonKeywords] = await Promise.all([
      analyzeReadability(signals.textContent.fullText),
      analyzeKeywords(signals.textContent.fullText)
    ]);

    // Add Python results to AI analysis if available
    if (pythonReadability.success) {
      aiAnalysis.pythonReadability = pythonReadability;
      console.log(`✅ Python readability: ${pythonReadability.fleschReadingEase} (${pythonReadability.difficulty})`);
    }
    
    if (pythonKeywords.success) {
      aiAnalysis.pythonKeywords = pythonKeywords;
      console.log(`✅ Python keywords: ${pythonKeywords.topKeywords?.length || 0} analyzed`);
    }

    // Score main criteria (new 5-criteria system)
    const mainCriteria = scoreMainCriteria(signals, aiAnalysis);

    // Score behavioral drivers (6 drivers × 3 personas)
    const behavioralDrivers = scoreBehavioralDrivers(signals, aiAnalysis);

    // Score personas (optional secondary analysis - DEPRECATED, use behavioralDrivers instead)
    const personas = scorePersonas(signals, aiAnalysis);

    // Return the analysis
    res.json({
      success: true,
      url: finalUrl,
      statusCode,
      analyzedAt: new Date().toISOString(),
      mainCriteria,          // Primary scores (6 criteria)
      behavioralDrivers,     // Behavioral drivers (6 drivers × 3 personas)
      signals,               // Raw data
      aiAnalysis,            // AI insights
      personas,              // Legacy persona analysis (deprecated)
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Analysis failed',
      message: error.message,
    });
  }
});

module.exports = router;
