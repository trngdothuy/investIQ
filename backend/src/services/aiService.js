import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateSuggestions(questionnaire, analysis) {
  const prompt = `
You are an experienced financial portfolio assistant.

Generate short dashboard suggestions.

Rules:
- Return ONLY valid JSON.
- Do not recommend buying or selling specific stocks.
- Be concise (1-2 sentences).
- Suggest improvements when needed.
- Praise good decisions when appropriate.

Questionnaire:
${JSON.stringify(questionnaire, null, 2)}

Analysis:
${JSON.stringify(analysis, null, 2)}

Return:

{
  "suggestions":[
    {
      "title":"",
      "type":"positive|warning|info",
      "message":""
    }
  ]
}
`

  const response = await client.chat.completions.create({
    model: 'gpt-5.4-mini',
    temperature: 0.3,
    response_format: {
      type: 'json_object',
    },
    messages: [
      {
        role: 'system',
        content: 'You are a professional investment portfolio analysis assistant.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  //   console.log('AI response:', response.choices[0].message.content)

  return JSON.parse(response.choices[0].message.content)
}
