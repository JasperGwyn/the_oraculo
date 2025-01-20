import { 
  createPublicClient, 
  createWalletClient, 
  http,
  Account,
  BaseError
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { modeNetwork } from '@theoraculo/shared'
import { RoundManagerABI } from '@theoraculo/contracts'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from root .env
dotenv.config({ path: path.join(__dirname, '../../../.env') })

async function main() {
  const account = privateKeyToAccount(process.env.MODE_PRIVATE_KEY as `0x${string}`)
  const contractAddress = process.env.ROUNDMANAGER_ADDRESS as `0x${string}`
  
  const publicClient = createPublicClient({
    chain: modeNetwork,
    transport: http(process.env.MODE_NETWORK_URL)
  })

  const walletClient = createWalletClient({
    chain: modeNetwork,
    transport: http(process.env.MODE_NETWORK_URL),
    account
  })

  // 1. Leer ronda activa
  console.log('\nGetting active round...')
  const activeRound = await publicClient.readContract({
    address: contractAddress,
    abi: RoundManagerABI,
    functionName: 'getActiveRound'
  })
  console.log('Active round:', activeRound)

  // 2. Obtener último ID de ronda
  console.log('\nGetting last round ID...')
  const lastRoundId = await publicClient.readContract({
    address: contractAddress,
    abi: RoundManagerABI,
    functionName: 'lastRoundId'
  })
  console.log('Last round ID:', lastRoundId)

  // 3. Obtener detalles de la última ronda
  console.log('\nGetting last round details...')
  const lastRound = await publicClient.readContract({
    address: contractAddress,
    abi: RoundManagerABI,
    functionName: 'rounds',
    args: [lastRoundId]
  })
  console.log('Last round details:', {
    id: lastRoundId,
    status: lastRound[1], // 0=None, 1=Active, 2=Evaluating, 3=Completed, 4=Cancelled
    startTime: new Date(Number(lastRound[2]) * 1000),
    endTime: new Date(Number(lastRound[3]) * 1000),
    totalStaked: lastRound[4],
    winningTeam: lastRound[5]
  })

  // 4. Si la ronda está activa y pasó el endTime, pasarla a evaluación
  const currentTime = BigInt(Math.floor(Date.now() / 1000))  // Aseguramos número entero
  if (lastRound[1] === 0 && currentTime > lastRound[3]) {  // 0 = Active
    console.log('\nSetting round to evaluation...')
    try {
      const hash = await walletClient.writeContract({
        address: contractAddress,
        abi: RoundManagerABI,
        functionName: 'setRoundStatus',
        args: [lastRoundId, 1] // 1 = Evaluating
      })
      console.log('Set to evaluation tx:', hash)
      
      // Esperar un poco antes de completar la ronda
      console.log('Waiting 5 seconds...')
      await new Promise(resolve => setTimeout(resolve, 5000))
      
      // 5. Completar la ronda
      console.log('\nCompleting round...')
      const completeHash = await walletClient.writeContract({
        address: contractAddress,
        abi: RoundManagerABI,
        functionName: 'completeRound',
        args: [lastRoundId, 1] // Team YES wins
      })
      console.log('Complete round tx:', completeHash)
    } catch (error) {
      if (error instanceof BaseError) {
        console.error('Error managing round:', error.shortMessage)
      } else {
        console.error('Unknown error:', error)
      }
    }
  }

  // 6. Intentar crear nueva ronda...
  console.log('\nCreating new round...')
  const endTime = BigInt(Math.floor(Date.now() / 1000) + 3600) // 1 hora desde ahora
  try {
    const hash = await walletClient.writeContract({
      address: contractAddress,
      abi: RoundManagerABI,
      functionName: 'createRound',
      args: [endTime]
    })
    console.log('Transaction hash:', hash)
  } catch (error) {
    if (error instanceof BaseError) {
      console.error('Error creating round:', error.shortMessage)
    } else {
      console.error('Unknown error:', error)
    }
  }
}

main().catch(console.error) 