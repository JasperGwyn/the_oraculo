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

export class RoundManagerService {
  private publicClient: PublicClient
  private walletClient: WalletClient
  private account: Account

  constructor() {
    // Create the account from private key
    this.account = privateKeyToAccount(backendConfig.privateKey as `0x${string}`)

    // Create the public client for reading
    this.publicClient = createPublicClient({
      chain: modeNetwork,
      transport: http(backendConfig.rpcUrl)
    })

    // Create the wallet client for writing
    this.walletClient = createWalletClient({
      chain: modeNetwork,
      transport: http(backendConfig.rpcUrl),
      account: this.account
    })
  }

  async monitorRounds() {
    while (true) {
      try {
        const activeRound = await this.getActiveRound()
        
        if (!activeRound) {
          console.log('No active round, creating new one...')
          await this.createRound()
          continue
        }

        if (await this.shouldStartEvaluation(activeRound)) {
          console.log(`Round ${activeRound.id} ready for evaluation`)
          await this.startEvaluation(activeRound.id)
          
          // Esperar el tiempo de evaluación
          await new Promise(resolve => setTimeout(resolve, backendConfig.evaluationDuration * 1000))
          
          // TODO: Integrar con Eliza para determinar ganador
          const winningTeam = 1 // Temporal hasta integrar Eliza
          
          await this.setWinner(activeRound.id, winningTeam)
        }

        // Esperar antes de la siguiente verificación
        await new Promise(resolve => setTimeout(resolve, 5000))
      } catch (error) {
        console.error('Error monitoring rounds:', error)
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
    }
  }

  public async getActiveRound(): Promise<Round | null> {
    const data = await this.publicClient.readContract({
      address: roundManagerAddress,
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
   * @param endTime Optional. If not provided, will be set to current time + roundDuration
   */
  public async createRound(endTime?: bigint) {
    const roundEndTime = endTime || BigInt(Math.floor(Date.now() / 1000) + backendConfig.roundDuration)

    return await this.walletClient.writeContract({
      address: roundManagerAddress,
      abi: RoundManagerABI,
      functionName: 'createRound',
      args: [roundEndTime],
      chain: null,
      account: this.account
    })
  }

  public async shouldStartEvaluation(round: Round): Promise<boolean> {
    if (round.status !== RoundStatus.Active) return false

    const now = BigInt(Math.floor(Date.now() / 1000))
    if (now < round.endTime) return false

    const participants = await this.publicClient.readContract({
      address: roundManagerAddress,
      abi: RoundManagerABI,
      functionName: 'getAllTeamParticipants',
      args: [round.id]
    })

    const totalParticipants = Number(participants[1]) + Number(participants[2])
    return totalParticipants >= backendConfig.minParticipants
  }

  public async startEvaluation(roundId: bigint) {
    return await this.walletClient.writeContract({
      address: roundManagerAddress,
      abi: RoundManagerABI,
      functionName: 'setRoundStatus',
      args: [roundId, RoundStatus.Evaluating],
      chain: null,
      account: this.account
    })
  }

  public async setWinner(roundId: bigint, winningTeam: number) {
    return await this.walletClient.writeContract({
      address: roundManagerAddress,
      abi: RoundManagerABI,
      functionName: 'completeRound',
      args: [roundId, winningTeam],
      chain: null,
      account: this.account
    })
  }
} 