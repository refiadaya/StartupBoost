const express = require('express');
const { fetchPage } = require('../services/pageFetcher');
const { extractSignals } = require('../services/signalExtractor');
const { scorePersonas } = require('../services/personaScorer');

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

    // Score personas
    const personas = scorePersonas(signals);

    // Return the analysis
    res.json({
      success: true,
      url: finalUrl,
      statusCode,
      analyzedAt: new Date().toISOString(),
      signals,
      personas,
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
