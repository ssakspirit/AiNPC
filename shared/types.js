/**
 * Shared types and interfaces for the project
 */

// NPC Configuration
export const NPCConfig = {
  name: '',
  personality: '',
  knowledgeBase: ''
}

// Build Configuration
export const BuildConfig = {
  size: 'medium', // small, medium, large
  height: 'medium', // low, medium, high
  style: 'auto', // auto, realistic, pixel, abstract
  startPosition: { x: 0, y: 4, z: 0 }
}

// Minecraft Block
export const MinecraftBlock = {
  x: 0,
  y: 0,
  z: 0,
  block: 'stone'
}

// Connection Status
export const ConnectionStatus = {
  minecraft: false,
  bridge: false,
  timestamp: ''
}

// Message Log
export const MessageLog = {
  id: '',
  sender: '',
  message: '',
  timestamp: '',
  type: 'player' // player, ai, system
}
