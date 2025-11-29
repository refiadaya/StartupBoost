/**
 * Extracts signals from a parsed webpage
 * @param {object} $ - Cheerio object
 * @returns {object} Extracted signals
 */
function extractSignals($) {
  const signals = {
    headings: extractHeadings($),
    ctas: extractCTAs($),
    callsToAction: extractCTAs($).items.map(cta => cta.text), // For backward compatibility
    contactInfo: extractContactInfo($),
    content: extractContent($),
    metadata: extractMetadata($),
    socialMedia: extractSocialMedia($),
    trustSignals: extractTrustSignals($),
    startupSignals: extractStartupSignals($), // NEW: Startup-specific signals
    adsAndAnnoyances: extractAdsAndAnnoyances($),
    seo: extractSEO($),
    blogFeatures: extractBlogFeatures($),
    textContent: extractTextContent($),
    globalReach: extractGlobalReach($), // NEW: Global reach & accessibility signals
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

/**
 * Extract startup-specific signals (NEW)
 * These signals are critical for analyzing startup websites
 */
function extractStartupSignals($) {
  const pageText = $('body').text().toLowerCase();
  const pageHTML = $('body').html().toLowerCase();
  
  // 1. PRICING SIGNALS (Value Proposition)
  const hasPricing = 
    $('a[href*="pricing"], a[href*="plans"]').length > 0 ||
    /pricing|plans|subscribe/i.test(pageText);
  
  const pricingPageLink = $('a[href*="pricing"], a[href*="plans"]').first().attr('href') || null;
  
  // Check if pricing is visible on homepage
  const pricingVisible = /\$\d+|€\d+|£\d+|free|month|year|annual/i.test(
    $('main, .pricing, [class*="price"]').text()
  );
  
  // 2. FREE TRIAL / DEMO SIGNALS (CTA Strength)
  const hasFreeTrial = 
    /free\s+trial|try\s+free|14[\s-]day|30[\s-]day|no\s+credit\s+card/i.test(pageText);
  
  const hasDemo = 
    $('a[href*="demo"], button:contains("demo")').length > 0 ||
    /book\s+demo|schedule\s+demo|request\s+demo|watch\s+demo/i.test(pageText);
  
  const trialLength = pageText.match(/(\d+)[\s-]day[\s-]trial/i)?.[1] || null;
  
  // 3. CUSTOMER LOGOS / SOCIAL PROOF (Social Proof)
  const logoSelectors = [
    '[class*="customer-logo"]',
    '[class*="client-logo"]', 
    '[class*="trusted-by"]',
    '[class*="used-by"]',
    '[alt*="logo"]'
  ];
  
  const customerLogoCount = logoSelectors.reduce((count, selector) => 
    count + $(selector).length, 0
  );
  
  const hasCustomerLogos = customerLogoCount > 2; // At least 3 logos = legit
  
  // Check for text like "Trusted by Google, Amazon"
  const hasBrandNames = 
    /trusted\s+by|used\s+by|powering|customers\s+include/i.test(pageText) &&
    /google|amazon|microsoft|apple|facebook|netflix|spotify|uber|airbnb/i.test(pageText);
  
  // 4. MEDIA MENTIONS / PRESS (Social Proof)
  const mediaKeywords = [
    'techcrunch', 'forbes', 'wired', 'venturebeat', 'mashable', 
    'the verge', 'business insider', 'wall street journal', 'nytimes',
    'featured in', 'as seen in', 'press', 'coverage'
  ];
  
  const hasMediaMentions = mediaKeywords.some(keyword => 
    pageText.includes(keyword) || pageHTML.includes(keyword)
  );
  
  const mediaCount = mediaKeywords.filter(keyword => 
    pageText.includes(keyword)
  ).length;
  
  // 5. PRODUCT VISUALS (Value Proposition)
  const productImageSelectors = [
    '[alt*="screenshot"]',
    '[alt*="dashboard"]',
    '[alt*="interface"]',
    '[class*="product-image"]',
    '[class*="app-screenshot"]'
  ];
  
  const hasScreenshot = productImageSelectors.some(selector => 
    $(selector).length > 0
  );
  
  // Also check for demo videos
  const hasDemoVideo = 
    $('video, iframe[src*="youtube"], iframe[src*="vimeo"], iframe[src*="loom"]').length > 0;
  
  // 6. USE CASES / TARGET AUDIENCE (Value Proposition)
  const useCaseKeywords = [
    'for developers', 'for marketers', 'for designers', 'for teams',
    'for startups', 'for enterprise', 'for agencies', 'for freelancers',
    'use case', 'perfect for', 'ideal for', 'built for'
  ];
  
  const hasUseCases = useCaseKeywords.some(keyword => 
    pageText.includes(keyword)
  );
  
  const useCaseMatches = useCaseKeywords.filter(keyword => 
    pageText.includes(keyword)
  );
  
  // 7. FEATURE LIST (Value Proposition + Readability)
  const hasFeatureList = 
    $('ul li, ol li').length > 5 && // Has lists
    /feature|benefit|included|what you get/i.test(pageText);
  
  const featureListCount = $('ul li, ol li').length;
  
  // 8. TEAM / ABOUT (Social Proof)
  const hasTeamSection = 
    $('a[href*="team"], a[href*="about"]').length > 0 ||
    /our\s+team|meet\s+the\s+team|about\s+us|founded\s+by/i.test(pageText);
  
  const hasFounderInfo = 
    /founder|ceo|co-founder/i.test(pageText);
  
  // 9. FUNDING / INVESTORS (Social Proof)
  const hasFundingInfo = 
    /backed\s+by|funded\s+by|investors?|series\s+[a-z]|venture|y\s+combinator|ycombinator|500\s+startups|andreessen|sequoia/i.test(pageText);
  
  // 10. AWARDS / RECOGNITION (Social Proof)
  const hasAwards = 
    /winner|award|recognition|product\s+hunt|#1\s+on|top\s+\d+/i.test(pageText);
  
  // 11. CHAT WIDGET (CTA Strength)
  const chatWidgetSelectors = [
    '[class*="intercom"]',
    '[id*="intercom"]',
    '[class*="drift"]',
    '[class*="crisp"]',
    '[class*="tawk"]',
    'iframe[src*="intercom"]',
    'iframe[src*="drift"]'
  ];
  
  const hasChatWidget = chatWidgetSelectors.some(selector => 
    $(selector).length > 0
  );
  
  // 12. JOBS / CAREERS (SEO - shows growth)
  const hasJobsPage = 
    $('a[href*="career"], a[href*="jobs"], a[href*="hiring"]').length > 0 ||
    /we're\s+hiring|join\s+our\s+team|open\s+positions/i.test(pageText);
  
  // 13. METRICS / NUMBERS (Social Proof)
  const metricsPatterns = [
    /(\d+[,.]?\d*[kmb]?\+?)\s*(users|customers|companies|downloads)/i,
    /(\d+[,.]?\d*)\s*%\s*(faster|more|increase|growth)/i,
    /(\d+[,.]?\d*[kmb]?)\s*\+?\s*(reviews|ratings|stars)/i
  ];
  
  const metrics = [];
  metricsPatterns.forEach(pattern => {
    const matches = pageText.match(pattern);
    if (matches) metrics.push(matches[0]);
  });
  
  const hasMetrics = metrics.length > 0;
  
  // 14. COMPARISON TABLE (Value Proposition)
  const hasComparisonTable = 
    /vs\s+\w+|compare|alternative\s+to|better\s+than/i.test(pageText) ||
    $('table').length > 0 && /competitor|alternative|comparison/i.test(pageText);
  
  return {
    // Pricing
    hasPricing,
    pricingPageLink,
    pricingVisible,
    
    // Trial & Demo
    hasFreeTrial,
    trialLength,
    hasDemo,
    hasDemoVideo,
    
    // Social Proof
    hasCustomerLogos,
    customerLogoCount,
    hasBrandNames,
    hasMediaMentions,
    mediaCount,
    hasAwards,
    hasMetrics,
    metrics: metrics.slice(0, 3),
    
    // Product
    hasScreenshot,
    hasFeatureList,
    featureListCount,
    hasUseCases,
    useCaseMatches: useCaseMatches.slice(0, 3),
    hasComparisonTable,
    
    // Team & Company
    hasTeamSection,
    hasFounderInfo,
    hasFundingInfo,
    
    // Modern Features
    hasChatWidget,
    hasJobsPage,
  };
}

/**
 * Extract global reach and accessibility signals
 */
function extractGlobalReach($) {
  const globalReach = {
    hasLanguageSelector: false,
    languageSelectorCount: 0,
    hasHreflangTags: false,
    hreflangCount: 0,
    hasCurrencySwitcher: false,
    hasInternationalShipping: false,
    mentionsTimeZones: false,
    hasGlobalPaymentMethods: false,
    languages: [],
    currencies: [],
  };

  // Check for language selector
  const languageSelectors = $('[class*="lang"], [id*="lang"], [class*="language"], [id*="language"], select[name*="lang"]');
  globalReach.hasLanguageSelector = languageSelectors.length > 0;
  globalReach.languageSelectorCount = languageSelectors.length;

  // Check for hreflang tags (indicates multi-language support)
  const hreflangTags = $('link[hreflang]');
  globalReach.hasHreflangTags = hreflangTags.length > 0;
  globalReach.hreflangCount = hreflangTags.length;
  
  // Extract languages from hreflang
  hreflangTags.each((i, el) => {
    const lang = $(el).attr('hreflang');
    if (lang && lang !== 'x-default') {
      globalReach.languages.push(lang);
    }
  });

  // Check for currency switcher
  const currencySelectors = $('[class*="currency"], [id*="currency"], select[name*="currency"]');
  globalReach.hasCurrencySwitcher = currencySelectors.length > 0;

  // Look for currency symbols/codes in text
  const pageText = $('body').text();
  const currencyPatterns = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', '€', '£', '¥'];
  const foundCurrencies = currencyPatterns.filter(currency => pageText.includes(currency));
  globalReach.currencies = foundCurrencies;

  // Check for international shipping mentions
  const shippingKeywords = ['international shipping', 'worldwide shipping', 'global shipping', 'ships worldwide', 'available globally'];
  globalReach.hasInternationalShipping = shippingKeywords.some(keyword => 
    pageText.toLowerCase().includes(keyword)
  );

  // Check for time zone mentions
  const timezoneKeywords = ['GMT', 'UTC', 'EST', 'PST', 'CET', 'time zone', 'timezone'];
  globalReach.mentionsTimeZones = timezoneKeywords.some(keyword => 
    pageText.includes(keyword)
  );

  // Check for global payment methods
  const paymentMethods = ['PayPal', 'Stripe', 'Apple Pay', 'Google Pay', 'Alipay', 'WeChat Pay'];
  const foundPayments = paymentMethods.filter(method => pageText.includes(method));
  globalReach.hasGlobalPaymentMethods = foundPayments.length > 0;

  return globalReach;
}

module.exports = { extractSignals };
