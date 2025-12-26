import { handleBuildRequest, executeBuild } from '../ai/builderMode.js'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export function setupAPIRoutes(app, io) {
  // Save API key
  app.post('/api/config/api-key', (req, res) => {
    const { apiKey } = req.body

    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' })
    }

    global.geminiApiKey = apiKey

    res.json({
      success: true,
      message: 'API key saved'
    })
  })

  // Save NPC configuration
  app.post('/api/config/npc', (req, res) => {
    const { name, personality, knowledgeBase } = req.body

    global.npcConfig = {
      name: name || 'Steve',
      personality: personality || '친절하고 도움을 주는 가이드',
      knowledgeBase: knowledgeBase || ''
    }

    res.json({
      success: true,
      message: 'NPC configuration saved',
      config: global.npcConfig
    })
  })

  // Get current configuration
  app.get('/api/config', (req, res) => {
    res.json({
      hasApiKey: !!global.geminiApiKey,
      npcConfig: global.npcConfig || {},
      minecraftConnected: global.minecraftConnected || false
    })
  })

  // Build from image
  app.post('/api/build', async (req, res) => {
    const { imageData, buildConfig } = req.body

    if (!imageData) {
      return res.status(400).json({ error: 'Image data is required' })
    }

    if (!global.geminiApiKey) {
      return res.status(400).json({ error: 'API key not configured' })
    }

    try {
      // Analyze image and get building blocks
      const result = await handleBuildRequest(imageData, buildConfig, global.geminiApiKey)

      // Start building in background
      executeBuild(result.blocks, buildConfig?.startPosition, (progress) => {
        io.emit('build:progress', progress)
      }).then(() => {
        io.emit('build:complete', { success: true })
      }).catch((error) => {
        io.emit('build:error', { error: error.message })
      })

      res.json({
        success: true,
        message: 'Building started',
        totalBlocks: result.totalBlocks
      })
    } catch (error) {
      console.error('Build error:', error)
      res.status(500).json({
        error: 'Failed to process build request',
        details: error.message
      })
    }
  })

  // Get connection status
  app.get('/api/status', (req, res) => {
    res.json({
      minecraft: global.minecraftConnected || false,
      hasApiKey: !!global.geminiApiKey,
      hasNPCConfig: !!global.npcConfig,
      timestamp: new Date().toISOString()
    })
  })

  // Setup Windows loopback exemption
  app.post('/api/setup/loopback', async (req, res) => {
    try {
      // Try both package names
      const packageNames = [
        'Microsoft.MinecraftUWP_8wekyb3d8bbwe',
        'Microsoft.MinecraftEducationEdition_8wekyb3d8bbwe'
      ]

      const results = []

      for (const packageName of packageNames) {
        const command = `CheckNetIsolation LoopbackExempt -a -n="${packageName}"`

        try {
          const { stdout, stderr } = await execAsync(command)
          results.push({
            packageName,
            success: true,
            output: stdout || stderr
          })
        } catch (error) {
          results.push({
            packageName,
            success: false,
            error: error.message
          })
        }
      }

      // Check if at least one succeeded
      const hasSuccess = results.some(r => r.success)

      if (hasSuccess) {
        res.json({
          success: true,
          message: '루프백 허용이 설정되었습니다',
          results
        })
      } else {
        res.status(500).json({
          success: false,
          error: '관리자 권한이 필요합니다',
          message: '브릿지 서버를 관리자 권한으로 실행하거나, .bat 파일을 다운로드하여 관리자 권한으로 실행하세요',
          results
        })
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  })

  // Check loopback exemption status
  app.get('/api/setup/loopback/status', async (req, res) => {
    try {
      const { stdout } = await execAsync('CheckNetIsolation LoopbackExempt -s')

      const hasMinecraft = stdout.includes('Minecraft')

      res.json({
        enabled: hasMinecraft,
        output: stdout
      })
    } catch (error) {
      res.status(500).json({
        error: error.message
      })
    }
  })

  // Download .bat file for manual setup
  app.get('/api/setup/loopback/download', (req, res) => {
    const batContent = `@echo off
echo ================================================
echo   Minecraft Education Edition Loopback Setup
echo ================================================
echo.
echo This script will allow Minecraft to connect to localhost.
echo Administrator privileges are required.
echo.
pause

echo.
echo Running CheckNetIsolation...
echo.

CheckNetIsolation LoopbackExempt -a -n="Microsoft.MinecraftUWP_8wekyb3d8bbwe"
if %errorlevel% equ 0 (
    echo Success: Loopback exemption added for Minecraft UWP
) else (
    echo Failed for Minecraft UWP, trying Education Edition...
    CheckNetIsolation LoopbackExempt -a -n="Microsoft.MinecraftEducationEdition_8wekyb3d8bbwe"
)

echo.
echo ================================================
echo Verifying setup...
echo ================================================
CheckNetIsolation LoopbackExempt -s | findstr Minecraft

echo.
echo Done! You can now connect Minecraft to localhost:19131
echo.
pause
`

    res.setHeader('Content-Type', 'text/plain')
    res.setHeader('Content-Disposition', 'attachment; filename="setup-minecraft-loopback.bat"')
    res.send(batContent)
  })
}
