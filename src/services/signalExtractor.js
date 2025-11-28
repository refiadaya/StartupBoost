/**
 * Extracts signals from a parsed webpage
 * @param {object} $ - Cheerio object
 * @returns {object} Extracted signals
 */
function extractSignals($) {
  const signals = {
    headings: extractHeadings($),
    ctas: extractCTAs($),
    contactInfo: extractContactInfo($),
    content: extractContent($),
    metadata: extractMetadata($),
  };

  return signals;
}

/**
 * Extract headings from the page
 */
function extractHeadings($) {
  const headings = {
    h1: [],
    h2: [],
    h3: [],
    total: 0,
  };

  $('h1').each((i, el) => {
    const text = $(el).text().trim();
    if (text) headings.h1.push(text);
  });

  $('h2').each((i, el) => {
    const text = $(el).text().trim();
    if (text) headings.h2.push(text);
  });

  $('h3').each((i, el) => {
    const text = $(el).text().trim();
    if (text) headings.h3.push(text);
  });

  headings.total = headings.h1.length + headings.h2.length + headings.h3.length;

  return headings;
}

/**
 * Extract CTA (Call-to-Action) elements
 */
function extractCTAs($) {
  const ctas = [];
  const ctaKeywords = [
    'sign up', 'signup', 'register', 'get started', 'try', 
    'buy', 'purchase', 'subscribe', 'join', 'download',
    'learn more', 'contact', 'demo', 'free trial'
  ];

  // Look for buttons and links that might be CTAs
  $('button, a.button, a.btn, input[type="submit"]').each((i, el) => {
    const text = $(el).text().trim().toLowerCase();
    const href = $(el).attr('href') || '';
    
    if (text || href) {
      // Check if it matches CTA keywords
      const isCTA = ctaKeywords.some(keyword => 
        text.includes(keyword) || href.toLowerCase().includes(keyword)
      );
      
      if (isCTA || text.length > 0) {
        ctas.push({
          text: $(el).text().trim(),
          type: el.tagName,
          href: href || null,
        });
      }
    }
  });

  return {
    count: ctas.length,
    items: ctas.slice(0, 10), // Limit to first 10
  };
}

/**
 * Extract contact information
 */
function extractContactInfo($) {
  const contactInfo = {
    hasEmail: false,
    hasPhone: false,
    hasAddress: false,
    hasContactForm: false,
  };

  const pageText = $('body').text();

  // Email pattern
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  contactInfo.hasEmail = emailPattern.test(pageText);

  // Phone pattern (basic)
  const phonePattern = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  contactInfo.hasPhone = phonePattern.test(pageText);

  // Address indicators
  const addressKeywords = ['address', 'location', 'street', 'avenue', 'road'];
  contactInfo.hasAddress = addressKeywords.some(keyword => 
    pageText.toLowerCase().includes(keyword)
  );

  // Contact form
  contactInfo.hasContactForm = $('form').length > 0 && 
    ($('input[type="email"]').length > 0 || $('textarea').length > 0);

  return contactInfo;
}

/**
 * Extract general content information
 */
function extractContent($) {
  const paragraphs = $('p');
  const images = $('img');
  const links = $('a');
  
  // Calculate total text length
  let totalTextLength = 0;
  paragraphs.each((i, el) => {
    totalTextLength += $(el).text().trim().length;
  });

  return {
    paragraphCount: paragraphs.length,
    imageCount: images.length,
    linkCount: links.length,
    totalTextLength,
    hasVideo: $('video, iframe[src*="youtube"], iframe[src*="vimeo"]').length > 0,
  };
}

/**
 * Extract metadata
 */
function extractMetadata($) {
  return {
    title: $('title').text().trim() || null,
    description: $('meta[name="description"]').attr('content') || null,
    hasOgImage: $('meta[property="og:image"]').length > 0,
    hasFavicon: $('link[rel="icon"], link[rel="shortcut icon"]').length > 0,
  };
}

module.exports = { extractSignals };
