import { test, expect, vi, beforeEach } from 'vitest'

const { mockCreate } = vi.hoisted(() => ({ mockCreate: vi.fn() }))

vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(function () {
    return { chat: { completions: { create: mockCreate } } }
  }),
}))

import { generateSuggestions } from '../services/aiService.js'

beforeEach(() => {
  vi.clearAllMocks()
})

const questionnaire = { name: 'Jane Doe', riskProfile: 'Balanced' }
const analysis = { totalPortfolioValue: 240, portfolioChange: 20 }

const validAiResponse = {
  suggestions: [
    {
      title: 'Diversify',
      type: 'warning',
      message: 'Consider spreading holdings across more sectors.',
    },
  ],
}
function mockOpenAiReply(content) {
  mockCreate.mockResolvedValue({
    choices: [{ message: { content } }],
  })
}

// generateSuggestions tests
test('generate suggestions that calls calls the OpenAI client with the expected model and settings', async () => {
  mockOpenAiReply(JSON.stringify(validAiResponse))

  await generateSuggestions(questionnaire, analysis)

  expect(mockCreate).toHaveBeenCalledTimes(1)
  const call = mockCreate.mock.calls[0][0]
  expect(call.model).toBe('gpt-5.4-mini')
  expect(call.temperature).toBe(0.3)
  expect(call.response_format).toEqual({ type: 'json_object' })
})

test('generate suggestions that sends a system message and a user message containing the questionnaire and analysis', async () => {
  mockOpenAiReply(JSON.stringify(validAiResponse))

  await generateSuggestions(questionnaire, analysis)

  const call = mockCreate.mock.calls[0][0]
  expect(call.messages).toHaveLength(2)
  expect(call.messages[0].role).toBe('system')
  expect(call.messages[1].role).toBe('user')
  expect(call.messages[1].content).toContain(JSON.stringify(questionnaire, null, 2))
  expect(call.messages[1].content).toContain(JSON.stringify(analysis, null, 2))
})

test('generate suggestions that returns the parsed JSON content from the model response', async () => {
  mockOpenAiReply(JSON.stringify(validAiResponse))

  const result = await generateSuggestions(questionnaire, analysis)

  expect(result).toEqual(validAiResponse)
})

test('generate suggestions that throws if the model response is not valid JSON', async () => {
  mockOpenAiReply('not valid json')

  await expect(generateSuggestions(questionnaire, analysis)).rejects.toThrow('not valid JSON')
})

test('generate suggestions that propagates errors from the OpenAI client', async () => {
  mockCreate.mockRejectedValue(new Error('rate limit exceeded'))

  await expect(generateSuggestions(questionnaire, analysis)).rejects.toThrow('rate limit exceeded')
})
