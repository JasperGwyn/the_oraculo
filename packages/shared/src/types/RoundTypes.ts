export enum RoundStatus {
  None = 0,
  Active = 1,
  Evaluating = 2,
  Completed = 3,
  Cancelled = 4
}

export enum Team {
  None = 0,
  Yes = 1,
  No = 2
}

export interface Round {
  id: bigint
  status: RoundStatus
  startTime: bigint
  endTime: bigint
  platformFee: bigint
  winningTeam: Team
}

export interface Bet {
  amount: bigint
  team: Team
  claimed: boolean
}

export interface RoundParticipants {
  noneCount: number
  yesCount: number
  noCount: number
}
