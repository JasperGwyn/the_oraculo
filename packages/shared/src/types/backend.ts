import { Team } from './contracts'

/**
 * Configuration for creating a new round
 */
export interface RoundConfig {
  duration: number     // Duration in seconds
  question: string    // The question for this round
  platformFee: bigint // Fee taken from the total pool
}

/**
 * Result of a round evaluation
 */
export interface RoundResult {
  winningTeam: Team   // The team that won
  reason: string      // Explanation of why this team won
  confidence: number  // Confidence score (0-1) in the decision
}

/**
 * Configuration for the backend service
 */
export interface BackendConfig {
  roundDuration: number        // Duración de la ronda en segundos
  evaluationDuration: number   // Duración de la evaluación en segundos
  privateKey: string          // Private key para el procesador
  rpcUrl: string             // URL del RPC de Mode
  clientUrl?: string         // URL del cliente frontend
} 