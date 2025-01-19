import { config } from 'dotenv'
import { BackendConfig } from '@theoraculo/shared'

// Load environment variables
config()

// Validate required environment variables
const requiredEnvVars = [
  'PRIVATE_KEY',
  'RPC_URL',
  'ROUND_DURATION',
  'EVALUATION_DURATION',
  'MIN_PARTICIPANTS',
  'PLATFORM_FEE'
]

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
}

// Create and export the configuration
export const backendConfig: BackendConfig = {
  roundDuration: Number(process.env.ROUND_DURATION),
  evaluationDuration: Number(process.env.EVALUATION_DURATION),
  defaultPlatformFee: BigInt(process.env.PLATFORM_FEE!),
  minParticipants: Number(process.env.MIN_PARTICIPANTS),
  privateKey: process.env.PRIVATE_KEY!,
  rpcUrl: process.env.RPC_URL!
}

// Export contract addresses
export const contractAddresses = {
  roundManager: '0x...' // TODO: Add your contract address here
} 