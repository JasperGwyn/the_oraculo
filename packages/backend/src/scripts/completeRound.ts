import { 
  createPublicClient, 
  createWalletClient, 
  http,
  PublicClient,
  WalletClient 
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { modeNetwork, RoundStatus, Team } from '@theoraculo/shared'
import { RoundManagerABI } from '@theoraculo/contracts'
import { backendConfig } from '../config'

async function main() {
  // Configurar clientes
  const account = privateKeyToAccount(backendConfig.privateKey as `0x${string}`)
  const contractAddress = process.env.ROUNDMANAGER_ADDRESS as `0x${string}`

  const publicClient = createPublicClient({
    chain: modeNetwork,
    transport: http(backendConfig.rpcUrl)
  })

  const walletClient = createWalletClient({
    chain: modeNetwork,
    transport: http(backendConfig.rpcUrl),
    account
  })

  try {
    // 1. Obtener la ronda activa
    console.log('🔍 Buscando ronda activa...')
    const lastRoundId = await publicClient.readContract({
      address: contractAddress,
      abi: RoundManagerABI,
      functionName: 'lastRoundId'
    })

    const round = await publicClient.readContract({
      address: contractAddress,
      abi: RoundManagerABI,
      functionName: 'rounds',
      args: [lastRoundId]
    })

    console.log(`📊 Ronda #${lastRoundId.toString()}:`)
    console.log(`   Status: ${round[1].toString()}`)
    console.log(`   End Time: ${new Date(Number(round[3]) * 1000).toLocaleString()}`)

    if (BigInt(round[1]) !== 0n) {
      console.log('❌ No hay una ronda activa')
      return
    }

    // 2. Cambiar estado a evaluating
    console.log('\n🔄 Cambiando estado a evaluating...')
    const tx1 = await walletClient.writeContract({
      address: contractAddress,
      abi: RoundManagerABI,
      functionName: 'setRoundStatus',
      args: [lastRoundId, RoundStatus.Evaluating]
    })
    console.log('✅ Estado cambiado. TX:', tx1)

    // Esperar un poco
    console.log('\n⏳ Esperando 5 segundos...')
    await new Promise(resolve => setTimeout(resolve, 5000))

    // 3. Completar la ronda
    const winningTeam = Math.random() < 0.5 ? Team.Yes : Team.No
    console.log(`\n🏆 Completando ronda con equipo ganador: ${winningTeam === Team.Yes ? 'YES' : 'NO'}`)
    const tx2 = await walletClient.writeContract({
      address: contractAddress,
      abi: RoundManagerABI,
      functionName: 'completeRound',
      args: [lastRoundId, winningTeam]
    })
    console.log('✅ Ronda completada. TX:', tx2)

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Ejecutar el script
main().catch(console.error) 