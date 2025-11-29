/**
 * Behavioral Drivers & Personas Scoring System
 * 
 * Structure:
 * - 6 Behavioral Drivers: Impatient, Skeptical, Analytical, Indecisive, Cognitive-Ease, Value-Seeking
 * - 3 Personas: User, Buyer, Investor
 * - Each driver gets scored for each persona (6 x 3 = 18 scores total)
 */

/**
 * Score all behavioral drivers for all personas
 * @param {Object} signals - Extracted signals from the website
 * @param {Object} aiAnalysis - AI analysis results
 * @returns {Object} Behavioral driver scores for each persona
 */
function scoreBehavioralDrivers(signals, aiAnalysis = null) {
  return {
    impatient: scoreDriver('impatient', signals, aiAnalysis),
    skeptical: scoreDriver('skeptical', signals, aiAnalysis),
    analytical: scoreDriver('analytical', signals, aiAnalysis),
    indecisive: scoreDriver('indecisive', signals, aiAnalysis),
    cognitiveEase: scoreDriver('cognitiveEase', signals, aiAnalysis),
    valueSeeking: scoreDriver('valueSeeking', signals, aiAnalysis),
  };
}

/**
 * Score a single behavioral driver for all 3 personas
 */
function scoreDriver(driverKey, signals, aiAnalysis) {
  const driverNames = {
    impatient: 'Impatient',
    skeptical: 'Skeptical',
    analytical: 'Analytical',
    indecisive: 'Indecisive',
    cognitiveEase: 'Cognitive-Ease',
    valueSeeking: 'Value-Seeking'
  };

  const descriptions = {
    impatient: 'Wants immediate value and quick decisions',
    skeptical: 'Needs proof and credibility before trusting',
    analytical: 'Wants detailed data and thorough information',
    indecisive: 'Needs guidance and low-risk options',
    cognitiveEase: 'Prefers simplicity and clarity',
    valueSeeking: 'Focused on ROI and tangible benefits'
  };

  return {
    name: driverNames[driverKey],
    description: descriptions[driverKey],
    user: scorePersona(driverKey, 'user', signals, aiAnalysis),
    buyer: scorePersona(driverKey, 'buyer', signals, aiAnalysis),
    investor: scorePersona(driverKey, 'investor', signals, aiAnalysis),
  };
}

/**
 * Score one driver for one persona
 */
function scorePersona(driverKey, personaKey, signals, aiAnalysis) {
  // Get AI score if available
  const aiDriver = aiAnalysis?.behavioralDrivers?.[driverKey];
  const aiPersona = aiDriver?.[personaKey];
  const aiScore = aiPersona?.score || 5;
  const strengths = aiPersona?.strengths || [];
  const weaknesses = aiPersona?.weaknesses || [];

  // Calculate technical score based on signals
  const technicalScore = calculateTechnicalScore(driverKey, personaKey, signals);

  // Combine AI and technical scores (50/50)
  const finalScore = Math.round((technicalScore + aiScore) / 2);

  return {
    score: Math.max(0, Math.min(10, finalScore)),
    breakdown: {
      technical: technicalScore,
      ai: aiScore
    },
    strengths,
    weaknesses
  };
}

/**
 * Calculate technical score based on website signals
 */
function calculateTechnicalScore(driverKey, personaKey, signals) {
  const startup = signals.startupSignals || {};
  const trust = signals.trustSignals || {};
  const seo = signals.seo || {};
  
  let score = 5; // Base score

  // Driver-specific scoring logic
  switch (driverKey) {
    case 'impatient':
      // Fast access to key info
      if (startup.hasPricing) score += 1;
      if (startup.pricingVisible) score += 1;
      if (startup.hasFreeTrial) score += 1;
      if (signals.ctas?.count > 5) score += 1;
      if (signals.content?.paragraphCount < 20) score += 1;
      break;

    case 'skeptical':
      // Trust and proof
      if (trust.hasTestimonials) score += 1;
      if (startup.customerLogoCount > 3) score += 1;
      if (startup.hasMediaMentions) score += 1;
      if (trust.hasHttps) score += 1;
      if (trust.hasPrivacyPolicy) score += 1;
      break;

    case 'analytical':
      // Detailed information
      if (startup.hasFeatureList) score += 1;
      if (startup.hasComparisonTable) score += 1;
      if (seo.hasStructuredData) score += 1;
      if (signals.content?.paragraphCount > 15) score += 1;
      if (startup.hasDemo) score += 1;
      break;

    case 'indecisive':
      // Low-risk options
      if (startup.hasFreeTrial) score += 2;
      if (trust.hasMoneyBackGuarantee) score += 2;
      if (startup.hasDemo || startup.hasDemoVideo) score += 1;
      if (startup.customerLogoCount > 0) score += 1;
      break;

    case 'cognitiveEase':
      // Simplicity and clarity
      if (signals.headings?.h1?.length === 1) score += 1;
      if (signals.content?.paragraphCount < 25) score += 1;
      if (signals.headings?.total < 30) score += 1;
      if (signals.ctas?.count > 0 && signals.ctas?.count < 8) score += 1;
      if (!signals.adsAndAnnoyances?.hasPopups) score += 1;
      break;

    case 'valueSeeking':
      // ROI and benefits
      if (startup.hasPricing) score += 1;
      if (startup.hasMetrics) score += 1;
      if (startup.hasUseCases) score += 1;
      if (startup.hasCustomerLogos) score += 1;
      if (startup.hasMediaMentions) score += 1;
      break;
  }

  return Math.max(0, Math.min(10, score));
}

module.exports = { scoreBehavioralDrivers };
