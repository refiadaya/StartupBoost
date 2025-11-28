/**
 * Scores a webpage from different persona perspectives
 * @param {object} signals - Extracted signals from the page
 * @param {object} aiAnalysis - AI analysis results (optional)
 * @returns {object} Persona scores and insights
 */
function scorePersonas(signals, aiAnalysis = null) {
  const personas = {
    impatientUser: scoreImpatientUser(signals),
    skepticalUser: scoreSkepticalUser(signals),
    contentQualitySeeker: scoreContentQualitySeeker(signals, aiAnalysis),
    adHater: scoreAdHater(signals),
    seoOptimizer: scoreSEOOptimizer(signals, aiAnalysis),
  };

  return personas;
}

/**
 * Score from an impatient user's perspective
 * An impatient user wants quick value, clear CTAs, and concise information
 */
function scoreImpatientUser(signals) {
  let score = 0;
  const maxScore = 100;
  const insights = [];

  // Clear H1 heading (up to 20 points)
  if (signals.headings.h1.length === 1) {
    score += 20;
    insights.push('✓ Has a clear main heading');
  } else if (signals.headings.h1.length === 0) {
    insights.push('✗ Missing main heading (H1)');
  } else {
    score += 10;
    insights.push('⚠ Multiple H1 headings may be confusing');
  }

  // CTAs present (up to 30 points)
  if (signals.ctas.count >= 3) {
    score += 30;
    insights.push('✓ Multiple clear calls-to-action');
  } else if (signals.ctas.count >= 1) {
    score += 20;
    insights.push('⚠ Has CTAs but could use more prominent ones');
  } else {
    insights.push('✗ No clear calls-to-action found');
  }

  // Content conciseness (up to 20 points)
  const avgParagraphLength = signals.content.paragraphCount > 0
    ? signals.content.totalTextLength / signals.content.paragraphCount
    : 0;

  if (avgParagraphLength > 0 && avgParagraphLength < 200) {
    score += 20;
    insights.push('✓ Content is concise and scannable');
  } else if (avgParagraphLength >= 200 && avgParagraphLength < 400) {
    score += 10;
    insights.push('⚠ Paragraphs are a bit long');
  } else if (avgParagraphLength >= 400) {
    insights.push('✗ Very long paragraphs may lose impatient readers');
  }

  // Good heading structure (up to 15 points)
  if (signals.headings.total >= 3) {
    score += 15;
    insights.push('✓ Good use of headings for scanning');
  } else {
    insights.push('⚠ Could use more headings to break up content');
  }

  // Visual elements (up to 15 points)
  if (signals.content.imageCount > 0 || signals.content.hasVideo) {
    score += 15;
    insights.push('✓ Has visual elements to engage quickly');
  } else {
    insights.push('⚠ No images or videos found');
  }

  return {
    score: Math.min(score, maxScore),
    maxScore,
    percentage: Math.round((Math.min(score, maxScore) / maxScore) * 100),
    insights,
    description: 'An impatient user wants quick value, clear CTAs, and easy-to-scan content',
  };
}

/**
 * Score from a skeptical user's perspective
 * A skeptical user looks for trust signals, contact info, and credibility markers
 */
function scoreSkepticalUser(signals) {
  let score = 0;
  const maxScore = 100;
  const insights = [];

  // Contact information (up to 40 points)
  let contactPoints = 0;
  if (signals.contactInfo.hasEmail) {
    contactPoints += 10;
    insights.push('✓ Email address found');
  }
  if (signals.contactInfo.hasPhone) {
    contactPoints += 10;
    insights.push('✓ Phone number found');
  }
  if (signals.contactInfo.hasAddress) {
    contactPoints += 10;
    insights.push('✓ Address information found');
  }
  if (signals.contactInfo.hasContactForm) {
    contactPoints += 10;
    insights.push('✓ Contact form available');
  }

  score += contactPoints;

  if (contactPoints === 0) {
    insights.push('✗ No contact information found - major trust issue');
  } else if (contactPoints < 20) {
    insights.push('⚠ Limited contact information');
  }

  // Metadata and professional appearance (up to 30 points)
  if (signals.metadata.title) {
    score += 10;
    insights.push('✓ Has page title');
  } else {
    insights.push('✗ Missing page title');
  }

  if (signals.metadata.description) {
    score += 10;
    insights.push('✓ Has meta description');
  } else {
    insights.push('⚠ Missing meta description');
  }

  if (signals.metadata.hasFavicon) {
    score += 5;
    insights.push('✓ Has favicon');
  }

  if (signals.metadata.hasOgImage) {
    score += 5;
    insights.push('✓ Has social media image');
  }

  // Content depth (up to 30 points)
  if (signals.content.paragraphCount >= 5) {
    score += 15;
    insights.push('✓ Substantial content provided');
  } else if (signals.content.paragraphCount >= 2) {
    score += 8;
    insights.push('⚠ Limited content');
  } else {
    insights.push('✗ Very little content - may seem incomplete');
  }

  if (signals.content.totalTextLength > 500) {
    score += 15;
    insights.push('✓ Adequate text content for credibility');
  } else {
    insights.push('⚠ Sparse text content');
  }

  return {
    score: Math.min(score, maxScore),
    maxScore,
    percentage: Math.round((Math.min(score, maxScore) / maxScore) * 100),
    insights,
    description: 'A skeptical user looks for trust signals, contact information, and credibility',
  };
}

/**
 * Score from a Content Quality Seeker's perspective (AI-POWERED)
 * Cares about readability, informativeness, engagement, uniqueness
 * This persona heavily uses AI analysis results
 */
function scoreContentQualitySeeker(signals, aiAnalysis) {
  let score = 0;
  const maxScore = 100;
  const insights = [];

  if (!aiAnalysis || !aiAnalysis.success) {
    // Fallback scoring without AI
    if (signals.textContent.wordCount > 300) {
      score += 25;
      insights.push('✓ Has substantial content');
    }
    if (signals.headings.total >= 3) {
      score += 25;
      insights.push('✓ Well-structured with headings');
    }
    if (signals.blogFeatures.hasBlog) {
      score += 25;
      insights.push('✓ Has blog for ongoing content');
    }
    insights.push('⚠ AI analysis not available - limited evaluation');
    
    return {
      score: Math.min(score, maxScore),
      maxScore,
      percentage: Math.round((Math.min(score, maxScore) / maxScore) * 100),
      insights,
      description: 'A content seeker who values readability, informativeness, and engaging writing',
      aiPowered: false,
    };
  }

  // AI-POWERED SCORING
  
  // Readability (25 points)
  const readabilityScore = aiAnalysis?.readability?.score || 5;
  if (readabilityScore >= 8) {
    score += 25;
    insights.push(`✓ Excellent readability (${readabilityScore}/10): ${aiAnalysis?.readability?.explanation || 'Clear and engaging'}`);
  } else if (readabilityScore >= 6) {
    score += 18;
    insights.push(`⚠ Good readability (${readabilityScore}/10): ${aiAnalysis?.readability?.explanation || 'Acceptable clarity'}`);
  } else {
    score += 10;
    insights.push(`✗ Poor readability (${readabilityScore}/10): ${aiAnalysis?.readability?.explanation || 'Could be clearer'}`);
  }

  // Informativeness (30 points)
  const informativenessScore = aiAnalysis?.informativeness?.score || 5;
  if (informativenessScore >= 8) {
    score += 30;
    insights.push(`✓ Highly informative (${informativenessScore}/10): ${aiAnalysis?.informativeness?.explanation || 'Rich content'}`);
  } else if (informativenessScore >= 6) {
    score += 20;
    insights.push(`⚠ Moderately informative (${informativenessScore}/10): ${aiAnalysis?.informativeness?.explanation || 'Adequate information'}`);
  } else {
    score += 10;
    insights.push(`✗ Low informativeness (${informativenessScore}/10): ${aiAnalysis?.informativeness?.explanation || 'Limited depth'}`);
  }

  // Engagement (25 points)
  const engagementScore = aiAnalysis?.engagement?.score || 5;
  if (engagementScore >= 8) {
    score += 25;
    insights.push(`✓ Highly engaging (${engagementScore}/10): ${aiAnalysis?.engagement?.explanation || 'Captivating content'}`);
  } else if (engagementScore >= 6) {
    score += 18;
    insights.push(`⚠ Moderately engaging (${engagementScore}/10): ${aiAnalysis?.engagement?.explanation || 'Holds attention'}`);
  } else {
    score += 10;
    insights.push(`✗ Not very engaging (${engagementScore}/10): ${aiAnalysis?.engagement?.explanation || 'Could be more compelling'}`);
  }

  // Uniqueness (20 points)
  const uniquenessScore = aiAnalysis?.uniqueness?.score || 5;
  if (uniquenessScore >= 8) {
    score += 20;
    insights.push(`✓ Unique content (${uniquenessScore}/10): ${aiAnalysis?.uniqueness?.explanation || 'Distinctive value'}`);
  } else if (uniquenessScore >= 6) {
    score += 12;
    insights.push(`⚠ Somewhat unique (${uniquenessScore}/10): ${aiAnalysis?.uniqueness?.explanation || 'Some differentiation'}`);
  } else {
    score += 5;
    insights.push(`✗ Common content (${uniquenessScore}/10): ${aiAnalysis?.uniqueness?.explanation || 'Similar to others'}`);
  }

  return {
    score: Math.min(score, maxScore),
    maxScore,
    percentage: Math.round((Math.min(score, maxScore) / maxScore) * 100),
    insights,
    description: 'A content seeker who values readability, informativeness, engaging writing, and unique information',
    aiPowered: true,
    aiScores: {
      readability: readabilityScore,
      informativeness: informativenessScore,
      engagement: engagementScore,
      uniqueness: uniquenessScore,
    }
  };
}

/**
 * Score from an Ad-Hater's perspective
 * Wants clean, distraction-free browsing experience
 */
function scoreAdHater(signals) {
  let score = 100; // Start at 100 and deduct points
  const maxScore = 100;
  const insights = [];

  // Penalize ads and annoyances
  const annoyances = signals.adsAndAnnoyances;

  if (annoyances.likelyAdIframes > 0) {
    const penalty = Math.min(40, annoyances.likelyAdIframes * 10);
    score -= penalty;
    insights.push(`✗ ${annoyances.likelyAdIframes} ad iframe(s) detected (-${penalty} pts)`);
  } else {
    insights.push('✓ No obvious ad iframes detected');
  }

  if (annoyances.hasAutoplayVideo) {
    score -= 20;
    insights.push('✗ Auto-play video detected (-20 pts)');
  } else {
    insights.push('✓ No auto-play videos');
  }

  if (annoyances.hasPopups) {
    score -= 15;
    insights.push('✗ Popup/modal detected (-15 pts)');
  } else {
    insights.push('✓ No popups detected');
  }

  if (annoyances.hasCookieBanner) {
    score -= 5;
    insights.push('⚠ Cookie banner present (-5 pts)');
  }

  // Bonus for clean experience
  if (annoyances.annoyanceScore === 0) {
    insights.push('✓ Clean, distraction-free experience!');
  }

  return {
    score: Math.max(0, Math.min(score, maxScore)),
    maxScore,
    percentage: Math.round((Math.max(0, Math.min(score, maxScore)) / maxScore) * 100),
    insights,
    description: 'An ad-hater who wants a clean, distraction-free browsing experience',
  };
}

/**
 * Score from an SEO Optimizer's perspective (AI-ENHANCED)
 * Cares about SEO best practices and search visibility
 */
function scoreSEOOptimizer(signals, aiAnalysis) {
  let score = 0;
  const maxScore = 100;
  const insights = [];

  // Meta tags (30 points)
  if (signals.metadata.title) {
    score += 10;
    insights.push('✓ Has page title');
  } else {
    insights.push('✗ Missing page title');
  }

  if (signals.metadata.description) {
    score += 10;
    insights.push('✓ Has meta description');
  } else {
    insights.push('✗ Missing meta description');
  }

  if (signals.seo.hasMetaKeywords) {
    score += 5;
    insights.push('✓ Has meta keywords');
  }

  if (signals.seo.hasViewport) {
    score += 5;
    insights.push('✓ Mobile-friendly viewport tag');
  } else {
    insights.push('✗ Missing viewport tag');
  }

  // Open Graph (20 points)
  const ogTags = signals.seo.openGraphTags;
  let ogScore = 0;
  if (ogTags.ogTitle) ogScore += 5;
  if (ogTags.ogDescription) ogScore += 5;
  if (ogTags.ogImage) ogScore += 5;
  if (ogTags.ogUrl) ogScore += 5;
  
  score += ogScore;
  if (ogScore >= 15) {
    insights.push('✓ Good Open Graph tags for social sharing');
  } else if (ogScore > 0) {
    insights.push('⚠ Partial Open Graph tags');
  } else {
    insights.push('✗ Missing Open Graph tags');
  }

  // Structured data (10 points)
  if (signals.seo.hasStructuredData) {
    score += 10;
    insights.push('✓ Has structured data (schema.org)');
  } else {
    insights.push('⚠ No structured data detected');
  }

  // Canonical URL (5 points)
  if (signals.seo.hasCanonicalUrl) {
    score += 5;
    insights.push('✓ Has canonical URL');
  }

  // Heading structure (15 points)
  if (signals.headings.h1.length === 1) {
    score += 10;
    insights.push('✓ Exactly one H1 tag (SEO best practice)');
  } else if (signals.headings.h1.length === 0) {
    insights.push('✗ No H1 tag found');
  } else {
    score += 5;
    insights.push('⚠ Multiple H1 tags (not ideal for SEO)');
  }

  if (signals.headings.total >= 5) {
    score += 5;
    insights.push('✓ Good heading hierarchy');
  }

  // AI-powered keyword quality (20 points)
  if (aiAnalysis && aiAnalysis.success) {
    const seoScore = aiAnalysis.seoQuality.score;
    if (seoScore >= 8) {
      score += 20;
      insights.push(`✓ Excellent SEO quality (${seoScore}/10): ${aiAnalysis.seoQuality.explanation}`);
    } else if (seoScore >= 6) {
      score += 12;
      insights.push(`⚠ Good SEO quality (${seoScore}/10): ${aiAnalysis.seoQuality.explanation}`);
    } else {
      score += 5;
      insights.push(`✗ Poor SEO quality (${seoScore}/10): ${aiAnalysis.seoQuality.explanation}`);
    }
  } else {
    insights.push('⚠ AI keyword analysis not available');
  }

  return {
    score: Math.min(score, maxScore),
    maxScore,
    percentage: Math.round((Math.min(score, maxScore) / maxScore) * 100),
    insights,
    description: 'An SEO optimizer who cares about search visibility and technical SEO best practices',
    aiPowered: aiAnalysis && aiAnalysis.success,
  };
}

module.exports = { scorePersonas };
