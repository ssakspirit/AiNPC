import { generateAIResponse } from './geminiClient.js'

export async function handleAIMessage(userMessage, npcConfig, apiKey) {
  const systemInstruction = buildNPCSystemInstruction(npcConfig)

  try {
    const response = await generateAIResponse(userMessage, systemInstruction, apiKey)
    return response
  } catch (error) {
    console.error('Error generating NPC response:', error)
    throw error
  }
}

function buildNPCSystemInstruction(npcConfig) {
  const {
    name = 'Steve',
    personality = '친절하고 도움을 주는 가이드',
    knowledgeBase = ''
  } = npcConfig

  return `You are ${name}, a helpful NPC character in Minecraft.

Your personality: ${personality}

World Knowledge:
${knowledgeBase || '이 세계는 평화로운 마인크래프트 세계입니다. 플레이어들에게 친절하게 도움을 주세요.'}

Instructions:
- Respond in Korean naturally and friendly
- Stay in character as an NPC
- Keep responses under 200 characters for Minecraft chat
- If longer response needed, focus on the most important information
- Use the world knowledge provided to answer questions
- If you don't know something from the knowledge base, honestly say so
- Be helpful and encouraging to players
- Use simple, clear language

Remember: You are a Minecraft NPC, not an AI assistant. Act naturally within the game world.`
}
