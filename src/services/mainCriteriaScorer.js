/**
 * Main Criteria Scorer
 * Scores websites on 6 key startup criteria using technical + AI analysis
 */

/**
 * Score all 6 main criteria
 * @param {Object} signals - Extracted signals from the page
 * @param {Object} aiAnalysis - AI analysis results
 * @returns {Object} Scores for all 6 main criteria
 */
function scoreMainCriteria(signals, aiAnalysis) {
  return {
    valueProposition: scoreValueProposition(signals, aiAnalysis),
    ctaStrength: scoreCTAStrength(signals, aiAnalysis),
    socialProof: scoreSocialProof(signals, aiAnalysis),
    visualReadability: scoreVisualReadability(signals, aiAnalysis),
    seoDiscoverability: scoreSEODiscoverability(signals, aiAnalysis),
    globalReach: scoreGlobalReach(signals, aiAnalysis),
  };
}

/**
 * 1️⃣ Value Proposition Clarity (0-10)
 * Checks if users immediately understand what the product does
 */
function scoreValueProposition(signals, aiAnalysis) {
  let technicalScore = 0;
  const strengths = [];
  const weaknesses = [];

  // Technical Analysis (40% weight = 4 points max)
  
  // Check H1 exists and is reasonable length
  if (signals.headings.h1.length > 0) {
    const h1 = signals.headings.h1[0];
    if (h1.length >= 5 && h1.length <= 100) {
      technicalScore += 1;
      strengths.push('Clear H1 heading present');
    } else if (h1.length > 100) {
      weaknesses.push('H1 is too long and may not be scannable');
    } else {
      weaknesses.push('H1 is too short to convey value');
    }
  } else {
    weaknesses.push('No H1 heading found');
  }

  // Check for benefit-oriented keywords
  const benefitKeywords = ['save', 'grow', 'increase', 'improve', 'boost', 'help', 
                          'solve', 'easy', 'simple', 'fast', 'free', 'better'];
  const valueProps = signals.textContent.valueProposition?.toLowerCase() || '';
  const h1Text = signals.headings.h1.join(' ').toLowerCase();
  
  const hasBenefitWords = benefitKeywords.some(word => 
    valueProps.includes(word) || h1Text.includes(word)
  );
  
  if (hasBenefitWords) {
    technicalScore += 1;
    strengths.push('Uses benefit-focused language');
  } else {
    weaknesses.push('Could emphasize user benefits more clearly');
  }

  // Check if value prop is visible early (in first section)
  if (signals.textContent.valueProposition && 
      signals.textContent.valueProposition.length > 20) {
    technicalScore += 1;
    strengths.push('Value proposition stated early');
  } else {
    weaknesses.push('Value proposition not immediately clear');
  }

  // Check for descriptive subtitle/tagline
  if (signals.metadata.description && 
      signals.metadata.description.length >= 50) {
    technicalScore += 1;
    strengths.push('Descriptive subtitle present');
  }

  // NEW: Startup-specific signals
  const startup = signals.startupSignals || {};
  
  // Bonus: Pricing transparency
  if (startup.hasPricing && startup.pricingVisible) {
    technicalScore += 0.5;
    strengths.push('Pricing is transparent and visible');
  } else if (startup.hasPricing) {
    technicalScore += 0.25;
  }
  
  // Bonus: Product visuals
  if (startup.hasScreenshot || startup.hasDemoVideo) {
    technicalScore += 0.5;
    strengths.push('Shows product visually');
  }
  
  // Bonus: Clear use cases
  if (startup.hasUseCases) {
    technicalScore += 0.5;
    strengths.push('Clarifies target audience');
  }
  
  // Bonus: Feature list
  if (startup.hasFeatureList) {
    technicalScore += 0.5;
    strengths.push('Lists specific features/benefits');
  }

  // AI Analysis (60% weight = 6 points max)
  let aiScore = 5; // Default if AI not available
  let aiInsight = 'AI analysis not available';
  
  if (aiAnalysis.success && aiAnalysis.valueProposition) {
    aiScore = aiAnalysis.valueProposition.score || 5;
    aiInsight = aiAnalysis.valueProposition.explanation || aiInsight;
    
    // Add AI-detected strengths/weaknesses
    if (aiAnalysis.valueProposition.strengths) {
      strengths.push(...aiAnalysis.valueProposition.strengths);
    }
    if (aiAnalysis.valueProposition.weaknesses) {
      weaknesses.push(...aiAnalysis.valueProposition.weaknesses);
    }
  }

  // Combined score: Technical (40%) + AI (60%)
  // Technical now out of 6.25 (4 base + 2.25 bonus), scale to 10
  const maxTechnicalScore = 6.25;
  const finalScore = Math.round(
    (technicalScore * 0.4 / maxTechnicalScore * 10) +  // Technical scaled to 10
    (aiScore * 0.6)                                     // AI already out of 10
  );

  return {
    score: Math.min(10, Math.max(0, finalScore)),
    breakdown: {
      technical: technicalScore,
      ai: aiScore
    },
    analysis: {
      strengths: strengths.slice(0, 3),
      weaknesses: weaknesses.slice(0, 3),
      aiInsight,
      suggestion: aiAnalysis.valueProposition?.suggestion || 
                 'Make your value proposition more specific and benefit-focused'
    }
  };
}

/**
 * 2️⃣ CTA Strength & Placement (0-10)
 * Ensures visitors know the next action and can take it easily
 */
function scoreCTAStrength(signals, aiAnalysis) {
  let technicalScore = 0;
  const strengths = [];
  const weaknesses = [];

  const ctas = signals.callsToAction || [];

  // Technical Analysis (50% = 5 points)
  
  // Has CTAs
  if (ctas.length > 0) {
    technicalScore += 1;
    strengths.push(`${ctas.length} CTA(s) found`);
  } else {
    weaknesses.push('No clear calls-to-action found');
    technicalScore = 0;
  }

  // Check for action verbs
  const actionVerbs = ['start', 'get', 'try', 'book', 'join', 'sign', 'buy', 
                       'download', 'learn', 'discover', 'explore', 'request'];
  const hasActionVerb = ctas.some(cta => 
    actionVerbs.some(verb => cta.toLowerCase().includes(verb))
  );
  
  if (hasActionVerb) {
    technicalScore += 1.5;
    strengths.push('Uses action-oriented language');
  } else if (ctas.length > 0) {
    weaknesses.push('CTAs could use stronger action verbs');
  }

  // Multiple CTAs (good for conversion)
  if (ctas.length >= 2) {
    technicalScore += 1;
    strengths.push('Multiple CTAs for different stages');
  } else if (ctas.length === 1) {
    weaknesses.push('Only one CTA - consider adding more touchpoints');
  }

  // Check CTA variety (not all the same)
  const uniqueCTAs = new Set(ctas.map(c => c.toLowerCase()));
  if (uniqueCTAs.size > 1 && uniqueCTAs.size < ctas.length) {
    technicalScore += 1;
    strengths.push('Good CTA repetition and variety');
  }

  // Bonus for clear button language
  const buttonKeywords = ['free', 'now', 'today', 'instant', 'trial'];
  const hasUrgency = ctas.some(cta => 
    buttonKeywords.some(word => cta.toLowerCase().includes(word))
  );
  if (hasUrgency) {
    technicalScore += 0.5;
    strengths.push('CTAs create urgency');
  }

  // NEW: Startup-specific CTA signals
  const startup = signals.startupSignals || {};
  
  // Free trial is a STRONG CTA
  if (startup.hasFreeTrial) {
    technicalScore += 1;
    strengths.push(`Free trial offer${startup.trialLength ? ` (${startup.trialLength} days)` : ''}`);
  }
  
  // Demo option
  if (startup.hasDemo) {
    technicalScore += 0.5;
    strengths.push('Demo available');
  }
  
  // Chat widget = modern real-time CTA
  if (startup.hasChatWidget) {
    technicalScore += 0.5;
    strengths.push('Live chat support available');
  }

  // AI Analysis (50% = 5 points)
  let aiScore = 5;
  let aiInsight = 'AI analysis not available';
  
  if (aiAnalysis.success && aiAnalysis.ctaStrength) {
    aiScore = aiAnalysis.ctaStrength.score || 5;
    aiInsight = aiAnalysis.ctaStrength.explanation || aiInsight;
    
    if (aiAnalysis.ctaStrength.strengths) {
      strengths.push(...aiAnalysis.ctaStrength.strengths);
    }
    if (aiAnalysis.ctaStrength.weaknesses) {
      weaknesses.push(...aiAnalysis.ctaStrength.weaknesses);
    }
  }

  const finalScore = Math.round(
    (technicalScore / 7 * 5) +  // Technical out of 7 (5 base + 2 bonus), scaled to 5
    (aiScore * 0.5)              // AI out of 10, weighted 50%
  );

  return {
    score: Math.min(10, Math.max(0, finalScore)),
    breakdown: {
      technical: Math.round(technicalScore),
      ai: aiScore
    },
    analysis: {
      strengths: strengths.slice(0, 3),
      weaknesses: weaknesses.slice(0, 3),
      aiInsight,
      suggestion: aiAnalysis.ctaStrength?.suggestion || 
                 'Use action verbs and create urgency in your CTAs'
    }
  };
}

/**
 * 3️⃣ Social Proof & Trust (0-10)
 * Builds confidence that the startup is credible and real
 */
function scoreSocialProof(signals, aiAnalysis) {
  let technicalScore = 0;
  const strengths = [];
  const weaknesses = [];

  // Technical Analysis (40% = 4 points)
  
  // Testimonials
  if (signals.trustSignals.hasTestimonials) {
    technicalScore += 1;
    strengths.push('Customer testimonials present');
  } else {
    weaknesses.push('No testimonials found');
  }

  // Trust badges
  if (signals.trustSignals.hasBadges) {
    technicalScore += 0.75;
    strengths.push('Trust badges/certifications displayed');
  }

  // Privacy/Security
  if (signals.trustSignals.hasPrivacyPolicy) {
    technicalScore += 0.5;
    strengths.push('Privacy policy available');
  }

  // HTTPS
  if (signals.trustSignals.hasHttps) {
    technicalScore += 0.5;
    strengths.push('Secure HTTPS connection');
  } else {
    weaknesses.push('⚠️ Not using HTTPS - major trust issue');
  }

  // Contact information
  const contactScore = 
    (signals.contactInfo.hasEmail ? 0.25 : 0) +
    (signals.contactInfo.hasPhone ? 0.25 : 0) +
    (signals.contactInfo.hasAddress ? 0.25 : 0) +
    (signals.contactInfo.hasForms ? 0.25 : 0);
  
  technicalScore += contactScore;
  
  if (contactScore >= 0.5) {
    strengths.push('Contact information available');
  } else {
    weaknesses.push('Limited contact information');
  }

  // Social media presence
  const socialCount = Object.values(signals.socialMedia).filter(Boolean).length;
  if (socialCount >= 2) {
    technicalScore += 0.5;
    strengths.push(`Connected to ${socialCount} social platforms`);
  }

  // Check for metrics/numbers in text
  const textContent = signals.textContent.fullText || '';
  const hasMetrics = /\d+[,.]?\d*\s*(users|customers|companies|downloads|reviews|stars?)/i.test(textContent);
  if (hasMetrics) {
    technicalScore += 0.5;
    strengths.push('Shows quantifiable success metrics');
  } else {
    weaknesses.push('Could add specific numbers/metrics');
  }

  // NEW: Startup-specific social proof signals
  const startup = signals.startupSignals || {};
  
  // Customer logos (HUGE for credibility)
  if (startup.hasCustomerLogos) {
    technicalScore += 1;
    strengths.push(`${startup.customerLogoCount} customer logos displayed`);
  }
  
  // Brand names mentioned
  if (startup.hasBrandNames) {
    technicalScore += 0.75;
    strengths.push('Recognized brands mentioned');
  }
  
  // Media mentions
  if (startup.hasMediaMentions) {
    technicalScore += 0.75;
    strengths.push(`Featured in ${startup.mediaCount} media outlet(s)`);
  }
  
  // Metrics from startup signals
  if (startup.hasMetrics && startup.metrics.length > 0) {
    technicalScore += 0.5;
    strengths.push(`Metrics: ${startup.metrics[0]}`);
  }
  
  // Team section
  if (startup.hasTeamSection) {
    technicalScore += 0.5;
    strengths.push('Team/About page builds trust');
  }
  
  // Funding info
  if (startup.hasFundingInfo) {
    technicalScore += 0.5;
    strengths.push('Investor backing mentioned');
  }
  
  // Awards
  if (startup.hasAwards) {
    technicalScore += 0.5;
    strengths.push('Awards/recognition displayed');
  }

  // AI Analysis (60% = 6 points)
  let aiScore = 5;
  let aiInsight = 'AI analysis not available';
  
  if (aiAnalysis.success && aiAnalysis.socialProof) {
    aiScore = aiAnalysis.socialProof.score || 5;
    aiInsight = aiAnalysis.socialProof.explanation || aiInsight;
    
    if (aiAnalysis.socialProof.strengths) {
      strengths.push(...aiAnalysis.socialProof.strengths);
    }
    if (aiAnalysis.socialProof.weaknesses) {
      weaknesses.push(...aiAnalysis.socialProof.weaknesses);
    }
  }

  const finalScore = Math.round(
    (technicalScore / 9 * 4) +  // Technical out of 9 (4 base + 5 bonus), scaled to 4
    (aiScore * 0.6)              // AI weighted 60%
  );

  return {
    score: Math.min(10, Math.max(0, finalScore)),
    breakdown: {
      technical: Math.round(technicalScore * 2.5), // Scale to 10 for display
      ai: aiScore
    },
    analysis: {
      strengths: strengths.slice(0, 3),
      weaknesses: weaknesses.slice(0, 3),
      aiInsight,
      suggestion: aiAnalysis.socialProof?.suggestion || 
                 'Add customer testimonials and success metrics'
    }
  };
}

/**
 * 4️⃣ Visual Legibility & Readability (0-10)
 * Reduces cognitive load for fast scanning and comprehension
 */
function scoreVisualReadability(signals, aiAnalysis) {
  let technicalScore = 0;
  const strengths = [];
  const weaknesses = [];

  // Technical Analysis (30% = 3 points)
  
  // Heading hierarchy
  const hasH1 = signals.headings.h1.length > 0;
  const hasH2 = signals.headings.h2.length > 0;
  const hasH3 = signals.headings.h3.length > 0;
  
  if (hasH1 && hasH2) {
    technicalScore += 1;
    strengths.push('Good heading hierarchy');
  } else if (hasH1) {
    technicalScore += 0.5;
    weaknesses.push('Could use more H2/H3 subheadings');
  } else {
    weaknesses.push('Missing proper heading structure');
  }

  // Content organization - lists
  const wordCount = signals.textContent.wordCount || 0;
  if (wordCount > 100) {
    technicalScore += 1;
    strengths.push('Sufficient content present');
  }

  // Check for reasonable content length (not walls of text)
  if (wordCount > 50 && wordCount < 2000) {
    technicalScore += 0.5;
    strengths.push('Content length is scannable');
  } else if (wordCount >= 2000) {
    weaknesses.push('Long content - consider breaking into sections');
  }

  // Visual elements (images)
  const imageCount = signals.textContent.fullText?.match(/<img/gi)?.length || 0;
  if (imageCount > 0 && imageCount <= 10) {
    technicalScore += 0.5;
    strengths.push('Good use of visual elements');
  } else if (imageCount > 10) {
    weaknesses.push('Many images - ensure they enhance understanding');
  }

  // Python/AI Readability Score (70% = 7 points)
  let readabilityScore = 5;
  let aiInsight = 'AI readability analysis';
  
  // Start with AI analysis
  if (aiAnalysis.success && aiAnalysis.readability) {
    readabilityScore = aiAnalysis.readability.score || 5;
    aiInsight = aiAnalysis.readability.explanation || aiInsight;
  }

  // Enhance with Python analysis if available
  if (aiAnalysis.pythonReadability && aiAnalysis.pythonReadability.success) {
    const python = aiAnalysis.pythonReadability;
    const fleschScore = python.fleschReadingEase || 50;
    
    // Use Python's readability score (already 0-10)
    readabilityScore = python.readabilityScore || readabilityScore;
    
    // Add Python-specific insights
    strengths.push(`Flesch Reading Ease: ${fleschScore} (${python.difficulty})`);
    
    if (python.isOptimal) {
      strengths.push('Optimal readability for startup content');
    } else {
      weaknesses.push(python.recommendation);
    }
    
    aiInsight = `${aiInsight} | Python: ${python.recommendation}`;
  }

  const finalScore = Math.round(
    (technicalScore / 3 * 3) +  // Technical 30%
    (readabilityScore * 0.7)     // AI/Python 70%
  );

  return {
    score: Math.min(10, Math.max(0, finalScore)),
    breakdown: {
      technical: Math.round(technicalScore * 3.33), // Scale to 10
      ai: readabilityScore
    },
    analysis: {
      strengths: strengths.slice(0, 3),
      weaknesses: weaknesses.slice(0, 3),
      aiInsight,
      suggestion: aiAnalysis.readability?.suggestion || 
                 'Use shorter sentences and more subheadings'
    }
  };
}

/**
 * 5️⃣ SEO & Discoverability (0-10)
 * Ensures the site can be found and understood by search engines
 */
function scoreSEODiscoverability(signals, aiAnalysis) {
  let technicalScore = 0;
  const strengths = [];
  const weaknesses = [];

  // Technical Analysis (40% = 4 points)
  
  // Title tag
  if (signals.metadata.title) {
    const titleLength = signals.metadata.title.length;
    if (titleLength >= 30 && titleLength <= 60) {
      technicalScore += 1;
      strengths.push('Optimized title length');
    } else if (titleLength > 60) {
      technicalScore += 0.5;
      weaknesses.push('Title too long (may be truncated)');
    } else if (titleLength > 0) {
      technicalScore += 0.5;
      weaknesses.push('Title too short');
    }
  } else {
    weaknesses.push('Missing title tag');
  }

  // Meta description
  if (signals.metadata.description) {
    const descLength = signals.metadata.description.length;
    if (descLength >= 120 && descLength <= 160) {
      technicalScore += 1;
      strengths.push('Well-optimized meta description');
    } else if (descLength > 0) {
      technicalScore += 0.5;
      weaknesses.push('Meta description could be optimized');
    }
  } else {
    weaknesses.push('Missing meta description');
  }

  // H1 tag (should have exactly one)
  if (signals.headings.h1.length === 1) {
    technicalScore += 0.5;
    strengths.push('Single H1 tag (SEO best practice)');
  } else if (signals.headings.h1.length > 1) {
    technicalScore += 0.25;
    weaknesses.push('Multiple H1 tags (should be one)');
  }

  // Open Graph tags
  if (signals.seo.hasOpenGraph) {
    technicalScore += 0.5;
    strengths.push('Open Graph tags for social sharing');
  }

  // Structured data
  if (signals.seo.hasStructuredData) {
    technicalScore += 0.5;
    strengths.push('Structured data present');
  } else {
    weaknesses.push('Could add structured data (Schema.org)');
  }

  // Keywords in meta
  if (signals.seo.keywords && signals.seo.keywords.length > 0) {
    technicalScore += 0.5;
    strengths.push('Meta keywords defined');
  }

  // AI Analysis (60% = 6 points)
  let aiScore = 5;
  let aiInsight = 'AI SEO analysis';
  
  if (aiAnalysis.success && aiAnalysis.seoQuality) {
    aiScore = aiAnalysis.seoQuality.score || 5;
    aiInsight = aiAnalysis.seoQuality.explanation || aiInsight;
    
    if (aiAnalysis.seoQuality.strengths) {
      strengths.push(...aiAnalysis.seoQuality.strengths);
    }
    if (aiAnalysis.seoQuality.weaknesses) {
      weaknesses.push(...aiAnalysis.seoQuality.weaknesses);
    }
  }

  const finalScore = Math.round(
    (technicalScore / 4 * 4) +  // Technical 40%
    (aiScore * 0.6)              // AI 60%
  );

  return {
    score: Math.min(10, Math.max(0, finalScore)),
    breakdown: {
      technical: Math.round(technicalScore * 2.5), // Scale to 10
      ai: aiScore
    },
    analysis: {
      strengths: strengths.slice(0, 3),
      weaknesses: weaknesses.slice(0, 3),
      aiInsight,
      suggestion: aiAnalysis.seoQuality?.suggestion || 
                 'Optimize title, description, and add structured data'
    }
  };
}

/**
 * 6️⃣ Global Reach & Accessibility (0-10)
 * Checks if the site is designed for international markets
 * 40% Technical + 60% AI
 */
function scoreGlobalReach(signals, aiAnalysis) {
  let technicalScore = 0;
  const strengths = [];
  const weaknesses = [];

  const globalReach = signals.globalReach || {};

  // Technical Analysis (40% weight = 4 points max)
  
  // Language selector (1 point)
  if (globalReach.hasLanguageSelector) {
    technicalScore += 1;
    strengths.push('Language selector available');
  } else {
    weaknesses.push('No language selector found');
  }

  // Hreflang tags (1.5 points)
  if (globalReach.hasHreflangTags) {
    technicalScore += 1.5;
    strengths.push(`Hreflang tags present (${globalReach.hreflangCount} languages)`);
  } else {
    weaknesses.push('No hreflang tags for international SEO');
  }

  // Currency switcher (1 point)
  if (globalReach.hasCurrencySwitcher) {
    technicalScore += 1;
    strengths.push('Currency switcher available');
  } else if (globalReach.currencies.length > 1) {
    technicalScore += 0.5;
    strengths.push(`Multiple currencies mentioned (${globalReach.currencies.join(', ')})`);
  } else {
    weaknesses.push('No currency options for international users');
  }

  // International shipping (0.5 points)
  if (globalReach.hasInternationalShipping) {
    technicalScore += 0.5;
    strengths.push('International shipping mentioned');
  }

  // Time zones (0.5 points)
  if (globalReach.mentionsTimeZones) {
    technicalScore += 0.5;
    strengths.push('Time zone awareness');
  }

  // Global payment methods (0.5 points)
  if (globalReach.hasGlobalPaymentMethods) {
    technicalScore += 0.5;
    strengths.push('Global payment methods supported');
  }

  // AI Analysis (60% weight = 6 points max)
  const aiScore = aiAnalysis.globalReach?.score || 5;
  const aiInsight = aiAnalysis.globalReach?.explanation || 
                   'Analyze international focus and market mentions';

  // Add AI-detected strengths/weaknesses
  if (aiAnalysis.globalReach?.strengths) {
    strengths.push(...aiAnalysis.globalReach.strengths);
  }
  if (aiAnalysis.globalReach?.weaknesses) {
    weaknesses.push(...aiAnalysis.globalReach.weaknesses);
  }

  // Combined Score: 40% technical (scaled to 4) + 60% AI (scaled to 6)
  const finalScore = Math.round(
    (technicalScore * 2.5) * 0.4 + // Technical max is 4, scale to 10 then apply 40%
    aiScore * 0.6                   // AI already 0-10, apply 60%
  );

  return {
    score: Math.min(10, Math.max(0, finalScore)),
    breakdown: {
      technical: Math.round(technicalScore * 2.5), // Scale to 10
      ai: aiScore
    },
    analysis: {
      strengths: strengths.slice(0, 3),
      weaknesses: weaknesses.slice(0, 3),
      aiInsight,
      suggestion: aiAnalysis.globalReach?.suggestion || 
                 'Add language selector, hreflang tags, and currency options'
    }
  };
}

module.exports = {
  scoreMainCriteria
};
