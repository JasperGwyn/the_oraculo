export enum RoundStatus {
  Active = 0,
  Evaluating = 1,
  Completed = 2
}

export enum Team {
  None = 0,
  Yes = 1,
  No = 2
}

export enum DistributionType {
  Manual = 0,
  Automatic = 1
}

export interface Round {
  id: bigint
  status: RoundStatus
  startTime: bigint
  endTime: bigint
  totalStaked: bigint
  winningTeam: Team
  platformFee: bigint
  distributionType: DistributionType
}

export interface Bet {
  user: string
  amount: bigint
  team: Team
  claimed: boolean
}

export interface UserBet {
  amount: bigint
  team: Team
  claimed: boolean
}

export interface RoundWithBets extends Round {
  userBet?: UserBet
  teamStakes: {
    [Team.Yes]: bigint
    [Team.No]: bigint
  }
  teamParticipants: {
    [Team.Yes]: bigint
    [Team.No]: bigint
  }
  participants: string[]
}