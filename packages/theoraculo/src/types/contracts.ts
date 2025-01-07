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
  id: bigint;
  status: RoundStatus;
  startTime: bigint;
  endTime: bigint;
  totalStaked: bigint;
  winningTeam: Team;
  platformFee: bigint;
  distributionType: DistributionType;
}

export interface UserBet {
  amount: bigint;
  team: Team;
  claimed: boolean;
}

export interface RoundManager {
  rounds(roundId: bigint): Promise<Round>;
  authorizedProcessors(address: string): Promise<boolean>;
  calculateReward(roundId: bigint, user: string): Promise<bigint>;
  getTeamStakes(roundId: bigint, team: Team): Promise<bigint>;
  getTeamParticipants(roundId: bigint, team: Team): Promise<bigint>;
  getParticipants(roundId: bigint): Promise<string[]>;
  getUserBet(roundId: bigint, user: string): Promise<UserBet>;
  placeBet(roundId: bigint, team: Team): Promise<void>;
  claimRewards(roundId: bigint): Promise<void>;
  createRound(roundId: bigint, duration: bigint, distributionType: DistributionType): Promise<void>;
  completeRound(roundId: bigint, winningTeam: Team): Promise<void>;
  withdrawPlatformFees(roundId: bigint): Promise<void>;
}