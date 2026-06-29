import express from 'express'

export const questionnaireRoutes = express.Router()

questionnaireRoutes.post('/', (req, res) => {
  console.log("Received questionnaire:")
  console.log(req.body)

  res.json({
    success: true,
    message: "Questionnaire received!"
  })
})