// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract RoundManager {
    enum RoundStatus { Active, Evaluating, Completed }
    enum Team { None, Yes, No }
    enum DistributionType { Manual, Automatic }

    struct Bet {
        address user;
        uint256 amount;
        Team team;
        bool claimed;
    }

    struct Round {
        uint256 id;
        RoundStatus status;
        uint256 startTime;
        uint256 endTime;
        uint256 totalStaked;
        mapping(Team => uint256) teamStakes;
        mapping(address => Bet) userBets;
        address[] participants;
        Team winningTeam;
        uint256 platformFee;  // en base 1000 (ej: 30 = 3%)
        DistributionType distributionType;
    }

    mapping(uint256 => Round) public rounds;
    mapping(address => bool) public authorizedProcessors;

    event RoundCreated(uint256 roundId, uint256 startTime, DistributionType distributionType);
    event BetPlaced(uint256 roundId, address user, Team team, uint256 amount);
    event RoundCompleted(uint256 roundId, Team winningTeam);
    event RewardsClaimed(uint256 roundId, address user, uint256 amount);
    event AutomaticDistributionFailed(uint256 roundId, address user, string reason);

    modifier onlyAuthorized() {
        require(authorizedProcessors[msg.sender], "Unauthorized");
        _;
    }

    constructor() {
        authorizedProcessors[msg.sender] = true;
    }

    function createRound(
        uint256 roundId, 
        uint256 duration,
        DistributionType distributionType
    ) external onlyAuthorized {
        rounds[roundId].id = roundId;
        rounds[roundId].status = RoundStatus.Active;
        rounds[roundId].startTime = block.timestamp;
        rounds[roundId].endTime = block.timestamp + duration;
        rounds[roundId].platformFee = 30; // 3% por defecto
        rounds[roundId].distributionType = distributionType;
        
        emit RoundCreated(roundId, block.timestamp, distributionType);
    }

    function placeBet(uint256 roundId, Team team) external payable {
        require(rounds[roundId].status == RoundStatus.Active, "Round not active");
        require(block.timestamp < rounds[roundId].endTime, "Round ended");
        require(team != Team.None, "Invalid team");
        require(msg.value > 0, "Bet amount must be greater than 0");

        // Si es la primera apuesta del usuario en esta ronda
        if (rounds[roundId].userBets[msg.sender].amount == 0) {
            rounds[roundId].participants.push(msg.sender);
        }

        // Actualizar o crear la apuesta del usuario
        rounds[roundId].userBets[msg.sender] = Bet({
            user: msg.sender,
            amount: msg.value,
            team: team,
            claimed: false
        });

        rounds[roundId].teamStakes[team] += msg.value;
        rounds[roundId].totalStaked += msg.value;

        emit BetPlaced(roundId, msg.sender, team, msg.value);
    }

    function calculateReward(
        uint256 roundId, 
        address user
    ) public view returns (uint256) {
        Round storage round = rounds[roundId];
        Bet storage userBet = round.userBets[user];
        
        if (userBet.team != round.winningTeam) return 0;
        
        uint256 totalWinningStake = round.teamStakes[round.winningTeam];
        uint256 userShare = (userBet.amount * 1e18) / totalWinningStake;
        
        uint256 platformFeeAmount = (round.totalStaked * round.platformFee) / 1000;
        uint256 distributablePool = round.totalStaked - platformFeeAmount;
        
        return (distributablePool * userShare) / 1e18;
    }

    function completeRound(uint256 roundId, Team winningTeam) external onlyAuthorized {
        Round storage round = rounds[roundId];
        require(round.status == RoundStatus.Active, "Round not active");
        require(winningTeam != Team.None, "Invalid winning team");
        
        round.status = RoundStatus.Completed;
        round.winningTeam = winningTeam;

        emit RoundCompleted(roundId, winningTeam);

        // Si es distribución automática, intentar distribuir premios
        if (round.distributionType == DistributionType.Automatic) {
            distributeRewards(roundId);
        }
    }

    function distributeRewards(uint256 roundId) internal {
        Round storage round = rounds[roundId];
        
        for (uint i = 0; i < round.participants.length; i++) {
            address participant = round.participants[i];
            Bet storage userBet = round.userBets[participant];
            
            if (userBet.team == round.winningTeam && !userBet.claimed) {
                uint256 reward = calculateReward(roundId, participant);
                if (reward > 0) {
                    userBet.claimed = true;
                    
                    // Intentar transferir, pero continuar si falla
                    (bool success, ) = payable(participant).call{value: reward}("");
                    if (success) {
                        emit RewardsClaimed(roundId, participant, reward);
                    } else {
                        emit AutomaticDistributionFailed(roundId, participant, "Transfer failed");
                        userBet.claimed = false; // Permitir claim manual si falla
                    }
                }
            }
        }
    }

    function claimRewards(uint256 roundId) external {
        Round storage round = rounds[roundId];
        require(round.status == RoundStatus.Completed, "Round not completed");
        
        Bet storage userBet = round.userBets[msg.sender];
        require(userBet.amount > 0, "No bet placed");
        require(!userBet.claimed, "Rewards already claimed");
        require(userBet.team == round.winningTeam, "Did not bet on winning team");

        uint256 reward = calculateReward(roundId, msg.sender);
        require(reward > 0, "No rewards to claim");
        
        userBet.claimed = true;
        
        // Transferir recompensa
        (bool success, ) = payable(msg.sender).call{value: reward}("");
        require(success, "Transfer failed");

        emit RewardsClaimed(roundId, msg.sender, reward);
    }

    function withdrawPlatformFees(uint256 roundId) external onlyAuthorized {
        Round storage round = rounds[roundId];
        require(round.status == RoundStatus.Completed, "Round not completed");
        
        uint256 platformFeeAmount = (round.totalStaked * round.platformFee) / 1000;
        
        (bool success, ) = payable(msg.sender).call{value: platformFeeAmount}("");
        require(success, "Transfer failed");
    }
} 