export const CONFIG = {
  // Server ports
  HTTP_PORT: process.env.HTTP_PORT || 8080,
  MINECRAFT_PORT: process.env.MINECRAFT_PORT || 19131,

  // Minecraft WebSocket
  MINECRAFT_WS_PATH: '/ws',

  // AI Settings
  AI_MODEL: 'gemini-2.0-flash-exp', // 2025년 최신 모델
  MAX_RESPONSE_LENGTH: 200, // 마인크래프트 채팅창 길이 제한

  // Commands
  AI_COMMAND_PREFIX: '!AI',

  // Reconnection
  RECONNECT_ATTEMPTS: 5,
  RECONNECT_DELAY: 3000, // ms
}

export const MINECRAFT_EVENTS = {
  PLAYER_MESSAGE: 'PlayerMessage',
  BLOCK_PLACED: 'BlockPlaced',
  PLAYER_TRANSFORM: 'PlayerTransform',
}

export const MINECRAFT_COMMANDS = {
  SAY: 'say',
  TELLRAW: 'tellraw',
  SETBLOCK: 'setblock',
  FILL: 'fill',
  SUBSCRIBE: 'subscribe',
}
