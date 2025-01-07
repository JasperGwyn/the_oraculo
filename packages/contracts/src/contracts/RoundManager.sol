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

    uint256 public activeRoundId;  // ID de la ronda activa actual
    uint256 public lastRoundId;    // Último ID de ronda creado
    uint256 public minDuration = 300;  // Duración mínima de una ronda (5 minutos)

    mapping(uint256 => Round) public rounds;
    mapping(address => bool) public authorizedProcessors;

    event RoundCreated(uint256 roundId, uint256 startTime, DistributionType distributionType);
    event RoundStatusChanged(uint256 roundId, RoundStatus newStatus);
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

    function getActiveRound() public view returns (
        uint256 id,
        RoundStatus status,
        uint256 startTime,
        uint256 endTime,
        uint256 totalStaked,
        Team winningTeam,
        uint256 platformFee,
        DistributionType distributionType
    ) {
        Round storage round = rounds[activeRoundId];

        // Si no hay ronda activa o la actual terminó
        if (activeRoundId == 0 ||
            round.status != RoundStatus.Active ||
            block.timestamp >= round.endTime) {
            return (0, RoundStatus.Completed, 0, 0, 0, Team.None, 0, DistributionType.Manual);
        }

        return (
            round.id,
            round.status,
            round.startTime,
            round.endTime,
            round.totalStaked,
            round.winningTeam,
            round.platformFee,
            round.distributionType
        );
    }

    function _createNewRound(uint256 duration, DistributionType distributionType) internal returns (uint256) {
        // Verificar que no haya una ronda en evaluación
        if (activeRoundId != 0) {
            Round storage currentRound = rounds[activeRoundId];
            require(currentRound.status == RoundStatus.Completed,
                "Previous round must be completed before creating a new one");
        }

        require(duration >= minDuration, "Duration too short");

        lastRoundId++;
        activeRoundId = lastRoundId;

        rounds[activeRoundId].id = activeRoundId;
        rounds[activeRoundId].status = RoundStatus.Active;
        rounds[activeRoundId].startTime = block.timestamp;
        rounds[activeRoundId].endTime = block.timestamp + duration;
        rounds[activeRoundId].platformFee = 30;
        rounds[activeRoundId].distributionType = distributionType;

        emit RoundCreated(activeRoundId, block.timestamp, distributionType);

        return activeRoundId;
    }

    function createRound(
        uint256 duration,
        DistributionType distributionType
    ) external onlyAuthorized {
        _createNewRound(duration, distributionType);
    }

    function placeBet(uint256 roundId, Team team) external payable {
        // Si no hay ronda activa y la última está completada, crear una nueva
        if (activeRoundId == 0) {
            require(lastRoundId == 0 || rounds[lastRoundId].status == RoundStatus.Completed,
                "Cannot create new round while previous is being evaluated");
            roundId = _createNewRound(3600, DistributionType.Automatic); // 1 hora por defecto para rondas automáticas
        }

        Round storage round = rounds[roundId];

        // Si la ronda terminó su tiempo
        if (block.timestamp >= round.endTime) {
            round.status = RoundStatus.Evaluating;
            emit RoundStatusChanged(roundId, RoundStatus.Evaluating);
            activeRoundId = 0; // No hay ronda activa
            revert("Round has ended, please wait for evaluation to complete");
        }

        require(roundId == activeRoundId, "Bet only allowed on active round");
        require(round.status == RoundStatus.Active, "Round not active");
        require(team != Team.None, "Invalid team");
        require(msg.value > 0, "Bet amount must be greater than 0");

        // Si es la primera apuesta del usuario en esta ronda
        if (round.userBets[msg.sender].amount == 0) {
            round.participants.push(msg.sender);
        }

        // Actualizar o crear la apuesta del usuario
        round.userBets[msg.sender] = Bet({
            user: msg.sender,
            amount: msg.value,
            team: team,
            claimed: false
        });

        round.teamStakes[team] += msg.value;
        round.totalStaked += msg.value;

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
        require(round.status == RoundStatus.Evaluating, "Round not in evaluation");
        require(winningTeam != Team.None, "Invalid winning team");

        round.status = RoundStatus.Completed;
        round.winningTeam = winningTeam;

        emit RoundCompleted(roundId, winningTeam);

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

                    (bool success, ) = payable(participant).call{value: reward}("");
                    if (success) {
                        emit RewardsClaimed(roundId, participant, reward);
                    } else {
                        emit AutomaticDistributionFailed(roundId, participant, "Transfer failed");
                        userBet.claimed = false;
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

    // Getter functions for team statistics
    function getTeamStakes(uint256 roundId, Team team) public view returns (uint256) {
        return rounds[roundId].teamStakes[team];
    }

    function getTeamParticipants(uint256 roundId, Team team) public view returns (uint256) {
        uint256 count = 0;
        for (uint i = 0; i < rounds[roundId].participants.length; i++) {
            address participant = rounds[roundId].participants[i];
            if (rounds[roundId].userBets[participant].team == team) {
                count++;
            }
        }
        return count;
    }

    function getParticipants(uint256 roundId) public view returns (address[] memory) {
        return rounds[roundId].participants;
    }

    function getUserBet(uint256 roundId, address user) public view returns (
        uint256 amount,
        Team team,
        bool claimed
    ) {
        Bet storage bet = rounds[roundId].userBets[user];
        return (bet.amount, bet.team, bet.claimed);
    }
}