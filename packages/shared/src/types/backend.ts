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
  privateKey: string
  rpcUrl: string
  roundDuration: number
  evaluationDuration: number
  minParticipants: number
} 