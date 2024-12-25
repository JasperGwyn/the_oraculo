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

export interface RoundWithBets extends Round {
  userBet?: Bet
  teamStakes: {
    [Team.Yes]: bigint
    [Team.No]: bigint
  }
}