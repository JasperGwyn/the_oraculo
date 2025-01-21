import { 
  createPublicClient, 
  createWalletClient, 
  http, 
  parseEther,
  PublicClient,
  WalletClient,
  Account
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { modeNetwork, Round, RoundStatus, Team, roundManagerAddress } from '@theoraculo/shared'
import { RoundManagerABI } from '@theoraculo/contracts'
import { backendConfig } from '../config'
import { BaseError } from 'viem'
import { Server } from 'socket.io'

export class RoundManagerService {
  private publicClient: PublicClient
  private walletClient: WalletClient
  private account: Account
  private isRunning: boolean = false
  private contractAddress: `0x${string}`
  private io: Server

  // Definimos los estados como bigint
  private readonly ROUND_STATUS = {
    ACTIVE: 0n,
    EVALUATING: 1n,
    COMPLETED: 2n
  } as const

  constructor(io: Server) {
    this.io = io
    this.account = privateKeyToAccount(backendConfig.privateKey as `0x${string}`)
    this.contractAddress = process.env.ROUNDMANAGER_ADDRESS as `0x${string}`
    
    this.publicClient = createPublicClient({
      chain: modeNetwork,
      transport: http(backendConfig.rpcUrl)
    })

    this.walletClient = createWalletClient({
      chain: modeNetwork,
      transport: http(backendConfig.rpcUrl),
      account: this.account
    })
  }

  async start() {
    if (this.isRunning) return
    this.isRunning = true
    console.log('Starting Round Manager Service...')

    while (this.isRunning) {
      try {
        await this.processRound()
        await new Promise(resolve => setTimeout(resolve, 5000))
      } catch (error) {
        console.error('Error processing round:', error)
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
    }
  }

  stop() {
    this.isRunning = false
    console.log('Stopping Round Manager Service...')
  }

  private async processRound() {
    // 1. Obtener último ID y detalles de la última ronda
    const lastRoundId = await this.publicClient.readContract({
      address: this.contractAddress,
      abi: RoundManagerABI,
      functionName: 'lastRoundId'
    })

    const lastRound = await this.publicClient.readContract({
      address: this.contractAddress,
      abi: RoundManagerABI,
      functionName: 'rounds',
      args: [lastRoundId]
    })

    // Obtener stakes por equipo
    const yesTeamStakes = await this.publicClient.readContract({
      address: this.contractAddress,
      abi: RoundManagerABI,
      functionName: 'getTeamStakes',
      args: [lastRoundId, Team.Yes]
    })

    const noTeamStakes = await this.publicClient.readContract({
      address: this.contractAddress,
      abi: RoundManagerABI,
      functionName: 'getTeamStakes',
      args: [lastRoundId, Team.No]
    })

    // Obtener participantes
    const participants = await this.publicClient.readContract({
      address: this.contractAddress,
      abi: RoundManagerABI,
      functionName: 'getAllTeamParticipants',
      args: [lastRoundId]
    })

    const BOX_WIDTH = 38  // Ancho total interno de la caja

    console.log('\n🕒 ' + new Date().toLocaleString())
    console.log('╔══════════════════════════════════════════╗')
    console.log('║           🎯 ROUND STATUS                ║')
    console.log('╠══════════════════════════════════════════╣')
    console.log(`║ 🆔 Round ID: ${lastRoundId.toString().padEnd(26)} ║`)
    
    const status = BigInt(lastRound[1]) === this.ROUND_STATUS.ACTIVE ? '⚡ Active' : 
                  BigInt(lastRound[1]) === this.ROUND_STATUS.EVALUATING ? '🤔 Evaluating' : 
                  BigInt(lastRound[1]) === this.ROUND_STATUS.COMPLETED ? '✅ Completed' : '❓ Unknown'
    console.log(`║ 📊 Status: ${status.padEnd(28)} ║`)
    
    const timeLeft = Math.max(0, Number(lastRound[3]) - Math.floor(Date.now() / 1000))
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60
    const timeString = `${minutes}m ${seconds}s`.padEnd(25)
    console.log(`║ ⏰ Time Left: ${timeString} ║`)
    
    console.log('╠══════════════════════════════════════════╣')
    console.log('║              👥 TEAMS                    ║')
    console.log('╠══════════════════════════════════════════╣')
    console.log('║ YES Team:                                ║')
    
    const yesStakes = (Number(yesTeamStakes) / 1e18).toFixed(4)
    const yesPlayers = Number(participants[1])
    console.log(`║   💰 Stakes: ${yesStakes} ETH`.padEnd(BOX_WIDTH) + '║')
    console.log(`║   👥 Players: ${yesPlayers}`.padEnd(BOX_WIDTH) + '║')
    console.log('║                                          ║')
    console.log('║ NO Team:                                 ║')
    
    const noStakes = (Number(noTeamStakes) / 1e18).toFixed(4)
    const noPlayers = Number(participants[2])
    console.log(`║   💰 Stakes: ${noStakes} ETH`.padEnd(BOX_WIDTH) + '║')
    console.log(`║   👥 Players: ${noPlayers}`.padEnd(BOX_WIDTH) + '║')
    console.log('╚══════════════════════════════════════════╝\n')

    // 2. Procesar la ronda según su estado
    const currentTime = BigInt(Math.floor(Date.now() / 1000))
    const roundStatus = BigInt(lastRound[1])
    const roundEndTime = lastRound[3]
    
    if (roundStatus === this.ROUND_STATUS.ACTIVE && currentTime > roundEndTime) {
      // Si está activa y pasó el tiempo, pasarla a evaluación
      console.log(`\n🔄 Round ${lastRoundId} ready for evaluation`)
      await this.startEvaluation(lastRoundId)
      return
    }
    
    if (BigInt(lastRound[1]) === this.ROUND_STATUS.EVALUATING) {
      // Si está en evaluación, esperar y completarla
      console.log(`\n🤔 Round ${lastRoundId} is being evaluated...`)
      await new Promise(resolve => setTimeout(resolve, backendConfig.evaluationDuration * 1000))
      
      // TODO: Integrar con Eliza para determinar ganador
      const winningTeam = Math.random() < 0.5 ? Team.Yes : Team.No
      console.log(`\n🏆 Setting winner for round ${lastRoundId}: ${winningTeam === Team.Yes ? 'YES' : 'NO'}`)
      await this.setWinner(lastRoundId, winningTeam)
      return
    }

    // 3. Solo crear nueva ronda si la última está completada
    if (BigInt(lastRound[1]) === this.ROUND_STATUS.COMPLETED) {
      console.log(`\n🆕 Creating new round with duration: ${backendConfig.roundDuration} seconds...`)
      try {
        const tx = await this.createRound()
        // Emitir evento de nueva ronda
        const newRoundId = lastRoundId + 1n
        this.io.emit('newRound', { roundId: newRoundId.toString() })
      } catch (error) {
        if (error instanceof BaseError) {
          console.error('❌ Error creating round:', error.shortMessage)
        } else {
          console.error('❌ Unknown error:', error)
        }
      }
    }

    // Emitir estado actual de la ronda
    this.io.emit('roundUpdate', {
      roundId: lastRoundId.toString(),
      status: Number(lastRound[1]),
      endTime: Number(lastRound[3]),
      yesTeamStakes: yesTeamStakes.toString(),
      noTeamStakes: noTeamStakes.toString(),
      yesPlayers: Number(participants[1]),
      noPlayers: Number(participants[2])
    })
  }

  public async getActiveRound(): Promise<Round | null> {
    const data = await this.publicClient.readContract({
      address: this.contractAddress,
      abi: RoundManagerABI,
      functionName: 'getActiveRound'
    })

    if (!data || data[0] === 0n) return null

    return {
      id: data[0],
      status: Number(data[1]),
      startTime: data[2],
      endTime: data[3],
      platformFee: data[4],
      winningTeam: Number(data[5])
    }
  }

  /**
   * Create a new round
   * @param duration Optional. If not provided, will use default roundDuration
   */
  public async createRound(duration?: number) {
    const roundDuration = duration || backendConfig.roundDuration

    return await this.walletClient.writeContract({
      address: this.contractAddress,
      abi: RoundManagerABI,
      functionName: 'createRound',
      args: [BigInt(roundDuration)],
      chain: null,
      account: this.account
    })
  }

  public async startEvaluation(roundId: bigint) {
    return await this.walletClient.writeContract({
      address: this.contractAddress,
      abi: RoundManagerABI,
      functionName: 'setRoundStatus',
      args: [roundId, RoundStatus.Evaluating],
      chain: null,
      account: this.account
    })
  }

  public async setWinner(roundId: bigint, winningTeam: number) {
    return await this.walletClient.writeContract({
      address: this.contractAddress,
      abi: RoundManagerABI,
      functionName: 'completeRound',
      args: [roundId, winningTeam],
      chain: null,
      account: this.account
    })
  }

  public async emitCurrentState() {
    const lastRoundId = await this.publicClient.readContract({
      address: this.contractAddress,
      abi: RoundManagerABI,
      functionName: 'lastRoundId'
    })

    const round = await this.publicClient.readContract({
      address: this.contractAddress,
      abi: RoundManagerABI,
      functionName: 'rounds',
      args: [lastRoundId]
    })

    const participants = await this.publicClient.readContract({
      address: this.contractAddress,
      abi: RoundManagerABI,
      functionName: 'getAllTeamParticipants',
      args: [lastRoundId]
    })

    const yesTeamStakes = await this.publicClient.readContract({
      address: this.contractAddress,
      abi: RoundManagerABI,
      functionName: 'getTeamStakes',
      args: [lastRoundId, Team.Yes]
    })

    const noTeamStakes = await this.publicClient.readContract({
      address: this.contractAddress,
      abi: RoundManagerABI,
      functionName: 'getTeamStakes',
      args: [lastRoundId, Team.No]
    })

    this.io.emit('roundUpdate', {
      roundId: lastRoundId.toString(),
      status: Number(round[1]),
      endTime: Number(round[3]),
      yesTeamStakes: yesTeamStakes.toString(),
      noTeamStakes: noTeamStakes.toString(),
      yesPlayers: Number(participants[1]),
      noPlayers: Number(participants[2])
    })
  }
} 