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
  roundDuration: number           // Default duration for rounds in seconds
  evaluationDuration: number      // How long to spend evaluating in seconds
  defaultPlatformFee: bigint      // Default fee to take from pools
  minParticipants: number        // Minimum participants needed for a valid round
  privateKey: string             // Private key for the backend wallet
  rpcUrl: string                // RPC URL for the blockchain connection
} 