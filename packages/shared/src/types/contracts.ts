/**
 * Enum representing the possible teams in a round
 */
export enum Team {
  None = 0,
  Yes = 1,
  No = 2
}

/**
 * Enum representing the possible states of a round
 */
export enum RoundStatus {
  Active = 0,      // Round is ongoing and accepting bets
  Evaluating = 1,  // Round has ended and oracle is evaluating
  Completed = 2    // Round is completed and rewards can be claimed
}

/**
 * Interface representing a round as returned by the smart contract
 */
export interface Round {
  id: bigint            // Round identifier
  status: RoundStatus   // Current status of the round
  startTime: bigint     // Unix timestamp when round started
  endTime: bigint       // Unix timestamp when round ends/ended
  platformFee: bigint   // Fee taken from the round's total pool
  winningTeam: Team     // Team that won (only valid if status is Completed)
}

/**
 * Interface representing a user's bet as returned by the smart contract
 */
export interface Bet {
  amount: bigint    // Amount bet in wei
  team: Team        // Team chosen
  claimed: boolean  // Whether rewards have been claimed
} 