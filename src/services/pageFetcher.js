const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Fetches a webpage and returns a parsed DOM
 * @param {string} url - The URL to fetch
 * @returns {Promise<object>} Cheerio object for DOM manipulation
 */
async function fetchPage(url) {
  try {
    // Validate URL
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('Invalid URL protocol. Only http and https are supported.');
    }

    // Fetch the page with a timeout
    const response = await axios.get(url, {
      timeout: 10000, // 10 seconds
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WebsiteAnalyzer/1.0)',
      },
      maxRedirects: 5,
    });

    // Parse HTML with cheerio
    const $ = cheerio.load(response.data);

    return {
      $,
      url: response.request.res.responseUrl || url, // Final URL after redirects
      statusCode: response.status,
    };
  } catch (error) {
    if (error.code === 'ENOTFOUND') {
      throw new Error('Website not found. Please check the URL.');
    } else if (error.code === 'ETIMEDOUT') {
      throw new Error('Request timed out. The website took too long to respond.');
    } else if (error.response) {
      throw new Error(`Failed to fetch page. Status: ${error.response.status}`);
    } else {
      throw new Error(`Failed to fetch page: ${error.message}`);
    }
  }
}

module.exports = { fetchPage };
