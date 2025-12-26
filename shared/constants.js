/**
 * Shared constants across frontend and bridge
 */

export const MINECRAFT_BLOCKS = [
  'stone',
  'dirt',
  'grass_block',
  'cobblestone',
  'oak_planks',
  'oak_log',
  'glass',
  'sand',
  'gravel',
  'gold_block',
  'iron_block',
  'diamond_block',
  'emerald_block',
  'brick',
  'clay',
  'concrete',
  'wool',
  'terracotta'
]

export const BUILD_SIZES = {
  small: { x: 16, y: 16, z: 16 },
  medium: { x: 32, y: 32, z: 32 },
  large: { x: 64, y: 64, z: 64 }
}

export const API_ENDPOINTS = {
  CONFIG_API_KEY: '/api/config/api-key',
  CONFIG_NPC: '/api/config/npc',
  GET_CONFIG: '/api/config',
  BUILD: '/api/build',
  STATUS: '/api/status'
}

export const SOCKET_EVENTS = {
  MINECRAFT_STATUS: 'minecraft:status',
  MINECRAFT_MESSAGE: 'minecraft:message',
  AI_PROCESSING: 'ai:processing',
  AI_RESPONSE: 'ai:response',
  BUILD_PROGRESS: 'build:progress',
  BUILD_COMPLETE: 'build:complete',
  BUILD_ERROR: 'build:error'
}
