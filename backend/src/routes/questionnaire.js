import express from 'express'
import { analysePortfolio } from '../services/portfolioService.js'
import { generateSuggestions } from '../services/aiService.js'
import { saveAnalysis } from '../services/databaseService.js'

export const questionnaireRoutes = express.Router()

questionnaireRoutes.post('/', async (req, res) => {
  try {
    console.log('Received questionnaire:')
    console.log(req.body)

    const analysis = analysePortfolio(req.body)

    const { suggestions } = await generateSuggestions(req.body, analysis)

    analysis.aiSuggestions = suggestions
    console.log('Suggestions:', suggestions)

    await saveAnalysis(req.body, analysis)

    res.json({ analysis, suggestions })
  } catch (error) {
    console.error('Error analyzing portfolio:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})
