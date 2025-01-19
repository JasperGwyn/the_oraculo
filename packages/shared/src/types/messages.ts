import { Team } from './contracts'

/**
 * Interface representing a message submitted by a user
 */
export interface Message {
  roundId: number      // The round this message belongs to
  team: Team          // The team the user belongs to
  address: string     // The user's address
  content: string     // The actual message content
  timestamp: number   // When the message was submitted
}

/**
 * Interface representing statistics for a team in a round
 */
export interface TeamStats {
  totalStaked: bigint     // Total amount staked by this team
  participants: number    // Number of participants in this team
  messages: Message[]     // All messages from this team
}

/**
 * Interface representing statistics for both teams in a round
 */
export interface RoundStats {
  yesTeam: TeamStats
  noTeam: TeamStats
} 