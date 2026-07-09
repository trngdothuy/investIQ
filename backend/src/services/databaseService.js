import { pool } from '../db/pool.js'

export async function saveAnalysis(questionnaire, analysis) {
  const query = `
    INSERT INTO portfolio_analyses (
      name,
      age,
      situation,
      reason,
      horizon,
      contribution_frequency,
      risk_score,
      risk_profile,
      exclusions,
      highlights,

      total_investment,
      total_portfolio_value,
      portfolio_change,
      total_shares,
      number_of_holdings,

      portfolio_risk_score,
      portfolio_risk_profile,

      risk_difference,
      risk_status,
      risk_direction,

      diversification_score,
      diversification_interpretation,

      environmental_status,
      environmental_message,

      social_status,
      social_message,

      holdings,
      sector_exposure,
      top_holdings,
      asset_allocation,
      ai_suggestions
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
      $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
      $21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31
    )
  `

  await pool.query(query, [
    questionnaire.name,
    questionnaire.age,
    questionnaire.situation,

    questionnaire.reason,
    questionnaire.horizon,
    questionnaire.contributionFrequency,
    questionnaire.riskScore,
    questionnaire.riskProfile,

    questionnaire.exclusions,
    questionnaire.highlights,

    analysis.portfolioSummary.totalInvestment,
    analysis.totalPortfolioValue,
    analysis.portfolioChange,

    analysis.portfolioSummary.totalShares,
    analysis.portfolioSummary.numberOfHoldings,

    analysis.portfolioRisk.score,
    analysis.portfolioRisk.profile,

    analysis.riskComparison.difference,
    analysis.riskComparison.status,
    analysis.riskComparison.direction,

    analysis.diversification.finalScore,
    analysis.diversification.interpretation,

    analysis.environmentalImpact.status,
    analysis.environmentalImpact.message,

    analysis.socialImpact.status,
    analysis.socialImpact.message,

    JSON.stringify(analysis.portfolioSummary.holdings),
    JSON.stringify(analysis.sectorExposure),
    JSON.stringify(analysis.topHoldings),
    JSON.stringify(analysis.assetAllocation),
    JSON.stringify(analysis.aiSuggestions),
  ])
}
