import { RoundManagerService } from './services/RoundManagerService'
import { backendConfig } from './config'
import { RoundStatus } from '@theoraculo/shared'

class OracleService {
  private roundManager: RoundManagerService
  private isRunning: boolean = false

  constructor() {
    this.roundManager = new RoundManagerService()
  }

  /**
   * Start the oracle service
   */
  async start() {
    if (this.isRunning) return
    this.isRunning = true
    console.log('Starting Oracle Service...')

    while (this.isRunning) {
      try {
        await this.checkRounds()
      } catch (error) {
        console.error('Error in round check:', error)
      }

      // Wait before next check
      await new Promise(resolve => setTimeout(resolve, 5000))
    }
  }

  /**
   * Stop the oracle service
   */
  stop() {
    this.isRunning = false
    console.log('Stopping Oracle Service...')
  }

  /**
   * Check and manage rounds
   */
  private async checkRounds() {
    // Get current active round
    const activeRound = await this.roundManager.getActiveRound()

    // If no active round, create one
    if (!activeRound) {
      console.log('No active round found, creating new round...')
      await this.roundManager.createRound()
      return
    }

    console.log('Active round:', {
      id: activeRound.id.toString(),
      status: RoundStatus[activeRound.status],
      endTime: new Date(Number(activeRound.endTime) * 1000).toISOString()
    })

    // Check if round needs evaluation
    if (await this.roundManager.checkRoundForEvaluation(activeRound)) {
      console.log('Round needs evaluation:', activeRound.id.toString())
      await this.roundManager.startEvaluation(activeRound.id)
      
      // TODO: After evaluation duration, determine winner and call setWinner
      setTimeout(async () => {
        // This is temporary - we'll integrate with Eliza here
        const winningTeam = Math.random() < 0.5 ? 1 : 2
        await this.roundManager.setWinner(activeRound.id, winningTeam)
      }, backendConfig.evaluationDuration * 1000)
    }
  }
}

// Start the service
const service = new OracleService()
service.start().catch(console.error)

// Handle graceful shutdown
process.on('SIGINT', () => {
  service.stop()
  process.exit(0)
}) 