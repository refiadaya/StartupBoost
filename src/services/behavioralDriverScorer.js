/**
 * Behavioral Drivers & Personas Scoring System
 * 
 * Uses weighted combinations of Main Criteria scores to determine behavioral driver fit
 * 
 * Structure:
 * - 6 Behavioral Drivers: Impatient, Skeptical, Analytical, Indecisive, Cognitive-Ease, Value-Seeking
 * - 3 Personas: User, Buyer, Investor
 * - Each driver gets scored for each persona (6 x 3 = 18 scores total)
 * - Scoring: 50% weighted main criteria + 50% AI analysis
 */

/**
 * Weight matrix: Defines how each main criteria contributes to each behavioral driver/persona
 * Weights must sum to 1.0 for each driver/persona combination
 */
const DRIVER_WEIGHTS = {
  impatient: {
    user: {
      valueProposition: 0.25,
      ctaStrength: 0.50,
      socialProof: 0.05,
      visualReadability: 0.20,
      seoDiscoverability: 0.00,
      globalReach: 0.00
    },
    buyer: {
      valueProposition: 0.30,
      ctaStrength: 0.40,
      socialProof: 0.15,
      visualReadability: 0.15,
      seoDiscoverability: 0.00,
      globalReach: 0.00
    },
    investor: {
      valueProposition: 0.40,
      ctaStrength: 0.20,
      socialProof: 0.25,
      visualReadability: 0.10,
      seoDiscoverability: 0.05,
      globalReach: 0.00
    }
  },
  
  skeptical: {
    user: {
      valueProposition: 0.10,
      ctaStrength: 0.00,
      socialProof: 0.70,
      visualReadability: 0.20,
      seoDiscoverability: 0.00,
      globalReach: 0.00
    },
    buyer: {
      valueProposition: 0.10,
      ctaStrength: 0.00,
      socialProof: 0.80,
      visualReadability: 0.10,
      seoDiscoverability: 0.00,
      globalReach: 0.00
    },
    investor: {
      valueProposition: 0.05,
      ctaStrength: 0.00,
      socialProof: 0.90,
      visualReadability: 0.05,
      seoDiscoverability: 0.00,
      globalReach: 0.00
    }
  },
  
  analytical: {
    user: {
      valueProposition: 0.40,
      ctaStrength: 0.10,
      socialProof: 0.20,
      visualReadability: 0.25,
      seoDiscoverability: 0.05,
      globalReach: 0.00
    },
    buyer: {
      valueProposition: 0.45,
      ctaStrength: 0.10,
      socialProof: 0.25,
      visualReadability: 0.15,
      seoDiscoverability: 0.05,
      globalReach: 0.00
    },
    investor: {
      valueProposition: 0.50,
      ctaStrength: 0.05,
      socialProof: 0.30,
      visualReadability: 0.10,
      seoDiscoverability: 0.05,
      globalReach: 0.00
    }
  },
  
  indecisive: {
    user: {
      valueProposition: 0.20,
      ctaStrength: 0.35,
      socialProof: 0.35,
      visualReadability: 0.10,
      seoDiscoverability: 0.00,
      globalReach: 0.00
    },
    buyer: {
      valueProposition: 0.25,
      ctaStrength: 0.30,
      socialProof: 0.40,
      visualReadability: 0.05,
      seoDiscoverability: 0.00,
      globalReach: 0.00
    },
    investor: {
      valueProposition: 0.30,
      ctaStrength: 0.15,
      socialProof: 0.50,
      visualReadability: 0.05,
      seoDiscoverability: 0.00,
      globalReach: 0.00
    }
  },
  
  cognitiveEase: {
    user: {
      valueProposition: 0.30,
      ctaStrength: 0.20,
      socialProof: 0.05,
      visualReadability: 0.45,
      seoDiscoverability: 0.00,
      globalReach: 0.00
    },
    buyer: {
      valueProposition: 0.25,
      ctaStrength: 0.20,
      socialProof: 0.10,
      visualReadability: 0.45,
      seoDiscoverability: 0.00,
      globalReach: 0.00
    },
    investor: {
      valueProposition: 0.35,
      ctaStrength: 0.10,
      socialProof: 0.10,
      visualReadability: 0.40,
      seoDiscoverability: 0.05,
      globalReach: 0.00
    }
  },
  
  valueSeeking: {
    user: {
      valueProposition: 0.50,
      ctaStrength: 0.20,
      socialProof: 0.20,
      visualReadability: 0.05,
      seoDiscoverability: 0.05,
      globalReach: 0.00
    },
    buyer: {
      valueProposition: 0.55,
      ctaStrength: 0.15,
      socialProof: 0.25,
      visualReadability: 0.00,
      seoDiscoverability: 0.05,
      globalReach: 0.00
    },
    investor: {
      valueProposition: 0.60,
      ctaStrength: 0.05,
      socialProof: 0.30,
      visualReadability: 0.00,
      seoDiscoverability: 0.05,
      globalReach: 0.00
    }
  }
};

/**
 * Score all behavioral drivers for all personas
 * @param {Object} signals - Extracted signals from the website (for fallback)
 * @param {Object} aiAnalysis - AI analysis results
 * @param {Object} mainCriteria - Scored main criteria
 * @returns {Object} Behavioral driver scores for each persona
 */
function scoreBehavioralDrivers(signals, aiAnalysis = null, mainCriteria = null) {
  return {
    impatient: scoreDriver('impatient', signals, aiAnalysis, mainCriteria),
    skeptical: scoreDriver('skeptical', signals, aiAnalysis, mainCriteria),
    analytical: scoreDriver('analytical', signals, aiAnalysis, mainCriteria),
    indecisive: scoreDriver('indecisive', signals, aiAnalysis, mainCriteria),
    cognitiveEase: scoreDriver('cognitiveEase', signals, aiAnalysis, mainCriteria),
    valueSeeking: scoreDriver('valueSeeking', signals, aiAnalysis, mainCriteria),
  };
}

/**
 * Score a single behavioral driver for all 3 personas
 */
function scoreDriver(driverKey, signals, aiAnalysis, mainCriteria) {
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
    user: scorePersona(driverKey, 'user', signals, aiAnalysis, mainCriteria),
    buyer: scorePersona(driverKey, 'buyer', signals, aiAnalysis, mainCriteria),
    investor: scorePersona(driverKey, 'investor', signals, aiAnalysis, mainCriteria),
  };
}

/**
 * Score one driver for one persona using weighted main criteria
 */
function scorePersona(driverKey, personaKey, signals, aiAnalysis, mainCriteria) {
  // Get AI score if available
  const aiDriver = aiAnalysis?.behavioralDrivers?.[driverKey];
  const aiPersona = aiDriver?.[personaKey];
  const aiScore = aiPersona?.score || 5;
  const strengths = aiPersona?.strengths || [];
  const weaknesses = aiPersona?.weaknesses || [];

  // Calculate technical score based on weighted main criteria
  const technicalScore = mainCriteria 
    ? calculateWeightedScore(driverKey, personaKey, mainCriteria)
    : calculateFallbackScore(driverKey, personaKey, signals); // Fallback if main criteria not available

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
 * Calculate score using weighted combination of main criteria
 */
function calculateWeightedScore(driverKey, personaKey, mainCriteria) {
  const weights = DRIVER_WEIGHTS[driverKey][personaKey];
  
  const weightedScore = 
    (mainCriteria.valueProposition.score * weights.valueProposition) +
    (mainCriteria.ctaStrength.score * weights.ctaStrength) +
    (mainCriteria.socialProof.score * weights.socialProof) +
    (mainCriteria.visualReadability.score * weights.visualReadability) +
    (mainCriteria.seoDiscoverability.score * weights.seoDiscoverability) +
    (mainCriteria.globalReach.score * weights.globalReach);
  
  return Math.round(weightedScore);
}

/**
 * Fallback scoring when main criteria are not available
 * Uses simple signal-based scoring (legacy method)
 */
function calculateFallbackScore(driverKey, personaKey, signals) {
  const startup = signals.startupSignals || {};
  const trust = signals.trustSignals || {};
  const seo = signals.seo || {};
  
  let score = 5; // Base score

  // Driver-specific scoring logic (simplified fallback)
  switch (driverKey) {
    case 'impatient':
      if (startup.hasPricing) score += 1;
      if (startup.pricingVisible) score += 1;
      if (startup.hasFreeTrial) score += 1;
      if (signals.ctas?.count > 5) score += 1;
      if (signals.content?.paragraphCount < 20) score += 1;
      break;

    case 'skeptical':
      if (trust.hasTestimonials) score += 1;
      if (startup.customerLogoCount > 3) score += 1;
      if (startup.hasMediaMentions) score += 1;
      if (trust.hasHttps) score += 1;
      if (trust.hasPrivacyPolicy) score += 1;
      break;

    case 'analytical':
      if (startup.hasFeatureList) score += 1;
      if (startup.hasComparisonTable) score += 1;
      if (seo.hasStructuredData) score += 1;
      if (signals.content?.paragraphCount > 15) score += 1;
      if (startup.hasDemo) score += 1;
      break;

    case 'indecisive':
      if (startup.hasFreeTrial) score += 2;
      if (trust.hasMoneyBackGuarantee) score += 2;
      if (startup.hasDemo || startup.hasDemoVideo) score += 1;
      if (startup.customerLogoCount > 0) score += 1;
      break;

    case 'cognitiveEase':
      if (signals.headings?.h1?.length === 1) score += 1;
      if (signals.content?.paragraphCount < 25) score += 1;
      if (signals.headings?.total < 30) score += 1;
      if (signals.ctas?.count > 0 && signals.ctas?.count < 8) score += 1;
      if (!signals.adsAndAnnoyances?.hasPopups) score += 1;
      break;

    case 'valueSeeking':
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
