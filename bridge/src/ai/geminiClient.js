import { GoogleGenerativeAI } from '@google/generative-ai'
import { CONFIG } from '../config/constants.js'

export async function generateAIResponse(prompt, systemInstruction, apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey)

  const model = genAI.getGenerativeModel({
    model: CONFIG.AI_MODEL,
    systemInstruction: systemInstruction
  })

  const result = await model.generateContent(prompt)
  const response = await result.response
  return response.text()
}

export async function analyzeImageForBuilding(imageData, apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey)

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: `You are a Minecraft builder assistant. Analyze images and generate building instructions.

Output ONLY a JSON array in this exact format:
[
  {"x": 0, "y": 0, "z": 0, "block": "stone"},
  {"x": 1, "y": 0, "z": 0, "block": "dirt"}
]

Rules:
- Use only valid Minecraft block names (stone, dirt, grass_block, oak_log, etc.)
- Keep coordinates reasonable (max 64x64x64)
- Create simplified, blocky versions of the image
- No explanations, only the JSON array`
  })

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: imageData.mimeType,
        data: imageData.base64
      }
    },
    'Analyze this image and create Minecraft building blocks'
  ])

  const response = await result.response
  const text = response.text()

  // Extract JSON from response
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0])
  }

  throw new Error('Failed to parse building data from AI response')
}
