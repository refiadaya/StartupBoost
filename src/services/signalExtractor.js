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
    socialMedia: extractSocialMedia($),
    trustSignals: extractTrustSignals($),
    adsAndAnnoyances: extractAdsAndAnnoyances($),
    seo: extractSEO($),
    blogFeatures: extractBlogFeatures($),
    textContent: extractTextContent($),
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

/**
 * Extract social media links
 */
function extractSocialMedia($) {
  const socialPlatforms = {
    facebook: $('a[href*="facebook.com"]').length > 0,
    twitter: $('a[href*="twitter.com"], a[href*="x.com"]').length > 0,
    linkedin: $('a[href*="linkedin.com"]').length > 0,
    instagram: $('a[href*="instagram.com"]').length > 0,
    youtube: $('a[href*="youtube.com"]').length > 0,
    tiktok: $('a[href*="tiktok.com"]').length > 0,
  };

  const totalLinks = Object.values(socialPlatforms).filter(Boolean).length;
  const hasSocialShare = $('[class*="share"], [class*="social-share"]').length > 0;

  return {
    platforms: socialPlatforms,
    totalPlatforms: totalLinks,
    hasSocialShareButtons: hasSocialShare,
  };
}

/**
 * Extract trust signals
 */
function extractTrustSignals($) {
  const pageText = $('body').text().toLowerCase();
  
  return {
    hasHttps: true, // Will be set from URL in analyze route
    hasPrivacyPolicy: $('a[href*="privacy"]').length > 0,
    hasTermsOfService: $('a[href*="terms"]').length > 0,
    hasCookieConsent: pageText.includes('cookie') && pageText.includes('consent'),
    hasSecurityBadges: $('[alt*="secure"], [alt*="ssl"], [alt*="verified"]').length > 0,
    hasMoneyBackGuarantee: /money.{0,10}back|guarantee/i.test(pageText),
    hasTestimonials: /testimonial|review|customer\s+says/i.test(pageText),
    hasCustomerCount: /\d+[,\d]*\+?\s*(customers|users|companies|clients)/i.test(pageText),
    hasTrustBadges: $('[alt*="bbb"], [alt*="norton"], [alt*="mcafee"]').length > 0,
  };
}

/**
 * Extract ads and annoyance indicators
 */
function extractAdsAndAnnoyances($) {
  const iframes = $('iframe').length;
  const adKeywordIframes = $('iframe[src*="ads"], iframe[src*="doubleclick"]').length;
  
  return {
    iframeCount: iframes,
    likelyAdIframes: adKeywordIframes,
    hasPopups: $('[class*="popup"], [class*="modal"][class*="promo"]').length > 0,
    hasAutoplayVideo: $('video[autoplay]').length > 0,
    hasCookieBanner: $('[class*="cookie"], [id*="cookie"]').length > 0,
    annoyanceScore: adKeywordIframes + ($('video[autoplay]').length * 2),
  };
}

/**
 * Extract SEO elements
 */
function extractSEO($) {
  const metaKeywords = $('meta[name="keywords"]').attr('content');
  const ogTags = {
    ogTitle: $('meta[property="og:title"]').attr('content') || null,
    ogDescription: $('meta[property="og:description"]').attr('content') || null,
    ogImage: $('meta[property="og:image"]').attr('content') || null,
    ogUrl: $('meta[property="og:url"]').attr('content') || null,
  };
  
  return {
    hasMetaKeywords: !!metaKeywords,
    metaKeywords: metaKeywords || null,
    hasCanonicalUrl: $('link[rel="canonical"]').length > 0,
    canonicalUrl: $('link[rel="canonical"]').attr('href') || null,
    hasStructuredData: $('script[type="application/ld+json"]').length > 0,
    openGraphTags: ogTags,
    hasTwitterCard: $('meta[name="twitter:card"]').length > 0,
    hasViewport: $('meta[name="viewport"]').length > 0,
  };
}

/**
 * Extract blog-specific features
 */
function extractBlogFeatures($) {
  const hasBlogLink = $('a[href*="blog"]').length > 0;
  const hasSearch = $('input[type="search"], input[name*="search"]').length > 0;
  const hasCategories = $('[class*="categor"], a[href*="category"]').length > 0;
  const hasTags = $('[class*="tag"]').length > 0;
  const hasComments = $('[class*="comment"]').length > 0;
  
  // Try to find blog posts
  const blogPosts = $('article, [class*="post"]');
  const postTitles = [];
  blogPosts.slice(0, 5).each((i, el) => {
    const title = $(el).find('h1, h2, h3').first().text().trim();
    if (title) postTitles.push(title);
  });
  
  return {
    hasBlog: hasBlogLink,
    hasSearch,
    hasCategories,
    hasTags,
    hasComments,
    postCount: blogPosts.length,
    recentPostTitles: postTitles,
  };
}

/**
 * Extract text content for AI analysis
 */
function extractTextContent($) {
  // Get main content text
  const mainText = $('body').text().replace(/\s+/g, ' ').trim();
  
  // Get first meaningful paragraph
  let valueProposition = '';
  $('p').each((i, el) => {
    const text = $(el).text().trim();
    if (text.length > 50 && !valueProposition) {
      valueProposition = text;
    }
  });
  
  // Get all headings as a summary
  const headingsSummary = [];
  $('h1, h2, h3').each((i, el) => {
    const text = $(el).text().trim();
    if (text && headingsSummary.length < 10) {
      headingsSummary.push(text);
    }
  });
  
  return {
    fullText: mainText.substring(0, 5000), // Limit to 5000 chars for AI
    valueProposition: valueProposition.substring(0, 500),
    headingsSummary: headingsSummary.join(' | '),
    wordCount: mainText.split(/\s+/).length,
  };
}

module.exports = { extractSignals };
