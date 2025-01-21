import { RoundManagerService } from './services/RoundManagerService'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { backendConfig } from './config'

// Create HTTP server
const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: backendConfig.clientUrl || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

const service = new RoundManagerService(io)

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected')
  
  // Start service if it's the first connection
  if (io.engine.clientsCount === 1) {
    service.start().catch(console.error)
  }

  // Manejar solicitud de estado actual
  socket.on('requestCurrentRound', async () => {
    try {
      await service.emitCurrentState()
    } catch (error) {
      console.error('Error sending current state:', error)
    }
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected')
    // Stop service if no clients are connected
    if (io.engine.clientsCount === 0) {
      service.stop()
    }
  })
})

// Start HTTP server
const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// Handle graceful shutdown
process.on('SIGINT', () => {
  service.stop()
  io.close()
  process.exit(0)
}) 