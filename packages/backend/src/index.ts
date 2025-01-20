import { RoundManagerService } from './services/RoundManagerService'

const service = new RoundManagerService()

// Start the service
service.start().catch(console.error)

// Handle graceful shutdown
process.on('SIGINT', () => {
  service.stop()
  process.exit(0)
}) 