import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const bridgeAPI = {
  // Save API key
  saveApiKey: async (apiKey) => {
    const response = await api.post('/config/api-key', { apiKey })
    return response.data
  },

  // Save NPC configuration
  saveNPCConfig: async (config) => {
    const response = await api.post('/config/npc', config)
    return response.data
  },

  // Get current configuration
  getConfig: async () => {
    const response = await api.get('/config')
    return response.data
  },

  // Start build from image
  startBuild: async (imageData, buildConfig) => {
    const response = await api.post('/build', {
      imageData,
      buildConfig
    })
    return response.data
  },

  // Get connection status
  getStatus: async () => {
    const response = await api.get('/status')
    return response.data
  },

  // Setup Windows loopback exemption
  setupLoopback: async () => {
    const response = await api.post('/setup/loopback')
    return response.data
  },

  // Check loopback status
  checkLoopbackStatus: async () => {
    const response = await api.get('/setup/loopback/status')
    return response.data
  },

  // Download .bat file for manual setup
  downloadLoopbackBat: () => {
    window.open(`${API_BASE_URL}/setup/loopback/download`, '_blank')
  }
}
