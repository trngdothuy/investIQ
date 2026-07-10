import express from 'express'
import { analysePortfolio } from '../services/portfolioService.js'
import { generateSuggestions } from '../services/aiService.js'
import { saveAnalysis, getAllAnalyses, getAnalysisById } from '../services/databaseService.js'

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

    res.json(analysis)
  } catch (error) {
    console.error('Error analyzing portfolio:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

questionnaireRoutes.get('/', async (req, res) => {
  try {
    const analyses = await getAllAnalyses()
    res.json(analyses)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to load analyses' })
  }
})

questionnaireRoutes.get('/:id', async (req, res) => {
  try {
    const analysis = await getAnalysisById(req.params.id)

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' })
    }

    res.json(analysis)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to load analysis' })
  }
})
