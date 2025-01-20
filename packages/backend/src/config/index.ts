import { config } from 'dotenv'
import { BackendConfig } from '@theoraculo/shared'
import * as path from 'path'

// Load environment variables from root .env
config({ path: path.join(__dirname, '../../../../.env') })

// Validate required environment variables
const requiredEnvVars = [
  'MODE_PRIVATE_KEY',
  'MODE_NETWORK_URL',
  'ROUNDMANAGER_ADDRESS'
]

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
}

// Create and export the configuration
export const backendConfig: BackendConfig = {
  roundDuration: 300,     // 5 minutos
  evaluationDuration: 60, // 1 minuto
  privateKey: process.env.MODE_PRIVATE_KEY!,
  rpcUrl: process.env.MODE_NETWORK_URL!
} 