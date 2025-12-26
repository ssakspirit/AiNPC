import { analyzeImageForBuilding } from './geminiClient.js'
import { sendMinecraftCommand } from '../minecraft/commandBuilder.js'
import { getMinecraftClient } from '../minecraft/wsHandler.js'

export async function handleBuildRequest(imageData, buildConfig, apiKey) {
  try {
    // Get building blocks from AI
    const buildingBlocks = await analyzeImageForBuilding(imageData, apiKey)

    return {
      success: true,
      blocks: buildingBlocks,
      totalBlocks: buildingBlocks.length
    }
  } catch (error) {
    console.error('Error in build request:', error)
    throw error
  }
}

export async function executeBuild(blocks, startPosition = { x: 0, y: 4, z: 0 }, onProgress) {
  const ws = getMinecraftClient()

  if (!ws || ws.readyState !== 1) {
    throw new Error('Minecraft is not connected')
  }

  const totalBlocks = blocks.length
  let placedBlocks = 0

  for (const block of blocks) {
    const worldX = startPosition.x + block.x
    const worldY = startPosition.y + block.y
    const worldZ = startPosition.z + block.z

    await sendMinecraftCommand(ws, 'setblock', `${worldX} ${worldY} ${worldZ} ${block.block}`)

    placedBlocks++

    if (onProgress && placedBlocks % 10 === 0) {
      onProgress({
        placed: placedBlocks,
        total: totalBlocks,
        percentage: Math.floor((placedBlocks / totalBlocks) * 100)
      })
    }

    // Small delay to avoid overwhelming Minecraft
    await new Promise(resolve => setTimeout(resolve, 50))
  }

  return {
    success: true,
    placedBlocks: placedBlocks
  }
}
