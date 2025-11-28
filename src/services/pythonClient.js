const axios = require('axios');

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:5000';

/**
 * Check if Python service is available
 */
async function checkPythonService() {
  try {
    const response = await axios.get(`${PYTHON_SERVICE_URL}/health`, { timeout: 2000 });
    return response.data.status === 'healthy';
  } catch (error) {
    console.warn('⚠️  Python service not available (optional)');
    return false;
  }
}

/**
 * Analyze text readability using Python service
 * @param {string} text - Text content to analyze
 * @returns {Object} Readability metrics
 */
async function analyzeReadability(text) {
  try {
    const response = await axios.post(
      `${PYTHON_SERVICE_URL}/analyze/readability`,
      { text },
      { timeout: 5000 }
    );
    
    if (response.data.success) {
      return {
        success: true,
        ...response.data.metrics,
        source: 'python'
      };
    }
    
    return { success: false };
  } catch (error) {
    console.warn('Python readability analysis failed:', error.message);
    return { success: false };
  }
}

/**
 * Analyze keyword density using Python service
 * @param {string} text - Text content to analyze
 * @param {Array} targetKeywords - Optional keywords to check
 * @returns {Object} Keyword analysis
 */
async function analyzeKeywords(text, targetKeywords = []) {
  try {
    const response = await axios.post(
      `${PYTHON_SERVICE_URL}/analyze/keywords`,
      { text, targetKeywords },
      { timeout: 5000 }
    );
    
    if (response.data.success) {
      return {
        success: true,
        topKeywords: response.data.topKeywords,
        targetKeywords: response.data.targetKeywords,
        statistics: response.data.statistics,
        source: 'python'
      };
    }
    
    return { success: false };
  } catch (error) {
    console.warn('Python keyword analysis failed:', error.message);
    return { success: false };
  }
}

module.exports = {
  checkPythonService,
  analyzeReadability,
  analyzeKeywords
};
