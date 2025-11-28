/**
 * Scores a webpage from different persona perspectives
 * @param {object} signals - Extracted signals from the page
 * @returns {object} Persona scores and insights
 */
function scorePersonas(signals) {
  const personas = {
    impatientUser: scoreImpatientUser(signals),
    skepticalUser: scoreSkepticalUser(signals),
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

module.exports = { scorePersonas };
