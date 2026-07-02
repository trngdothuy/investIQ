import express from 'express'
import { analysePortfolio } from '../services/portfolioService.js'

export const questionnaireRoutes = express.Router()

questionnaireRoutes.post('/', (req, res) => {
  try {
    console.log('Received questionnaire:')
    console.log(req.body)

    const analysis = analysePortfolio(req.body)
    // console.log("Analysis result:")
    // console.log(analysis)
    res.json(analysis)
  } catch (error) {
    console.error('Error analyzing portfolio:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})
