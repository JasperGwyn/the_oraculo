// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract RoundManager {
    enum RoundStatus { Active, Evaluating, Completed }
    enum Team { None, Yes, No }

    bool public isDevelopment = true; // Por defecto en modo desarrollo
    
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
        mapping(Team => uint256) teamParticipants; // Nuevo: contador de participantes por equipo
    }

    uint256 public lastRoundId;
    uint256 private _activeRoundId;  // renombrado de activeRoundId
    uint256 public constant minDuration = 300; // 5 minutos

    mapping(uint256 => Round) public rounds;
    mapping(address => bool) public authorizedProcessors;

    event RoundCreated(uint256 roundId, uint256 startTime);
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

    function getActiveRoundId() public view returns (uint256) {
        uint256 roundId = _activeRoundId;
        Round storage round = rounds[roundId];
        
        if (roundId == 0 ||
            round.status != RoundStatus.Active ||
            block.timestamp >= round.endTime) {
            return 0;
        }
        
        return roundId;
    }

    function getActiveRound() public view returns (
        uint256 id,
        RoundStatus status,
        uint256 startTime,
        uint256 endTime,
        uint256 totalStaked,
        Team winningTeam,
        uint256 platformFee
    ) {
        uint256 activeId = getActiveRoundId();
        if (activeId == 0) {
            return (0, RoundStatus.Completed, 0, 0, 0, Team.None, 0);
        }
        
        Round storage round = rounds[activeId];
        return (
            round.id,
            round.status,
            round.startTime,
            round.endTime,
            round.totalStaked,
            round.winningTeam,
            round.platformFee
        );
    }

    function _createNewRound(uint256 duration) internal returns (uint256) {
        // Verificar que no haya una ronda en evaluación
        if (_activeRoundId != 0) {
            Round storage currentRound = rounds[_activeRoundId];
            require(currentRound.status == RoundStatus.Completed,
                "Previous round must be completed before creating a new one");
        }

        require(duration >= minDuration, "Duration too short");

        lastRoundId++;
        _activeRoundId = lastRoundId;

        rounds[_activeRoundId].id = _activeRoundId;
        rounds[_activeRoundId].status = RoundStatus.Active;
        rounds[_activeRoundId].startTime = block.timestamp;
        rounds[_activeRoundId].endTime = block.timestamp + duration;
        rounds[_activeRoundId].platformFee = 30;

        emit RoundCreated(_activeRoundId, block.timestamp);

        return _activeRoundId;
    }

    function createRound(uint256 duration) external onlyAuthorized {
        _createNewRound(duration);
    }

    function placeBet(uint256 roundId, Team team) external payable {
        // Verificar que haya una ronda activa
        require(getActiveRoundId() != 0, "No active round found");
        require(roundId == getActiveRoundId(), "Bet only allowed on active round");

        Round storage round = rounds[roundId];

        // Si la ronda terminó su tiempo
        if (block.timestamp >= round.endTime) {
            round.status = RoundStatus.Evaluating;
            emit RoundStatusChanged(roundId, RoundStatus.Evaluating);
            _activeRoundId = 0; // No hay ronda activa
            revert("Round has ended, please wait for evaluation to complete");
        }

        require(round.status == RoundStatus.Active, "Round not active");
        require(team != Team.None, "Invalid team");
        require(msg.value > 0, "Bet amount must be greater than 0");

        // En producción, solo permitir una apuesta por usuario
        if (!isDevelopment) {
            require(round.userBets[msg.sender].amount == 0, "Already placed a bet in this round");
        }

        // Si es la primera apuesta del usuario en esta ronda
        if (round.userBets[msg.sender].amount == 0) {
            round.participants.push(msg.sender);
            round.userBets[msg.sender] = Bet({
                user: msg.sender,
                amount: msg.value,
                team: team,
                claimed: false
            });
        } else {
            // En desarrollo, permitir múltiples apuestas y cambios de equipo
            round.userBets[msg.sender].amount += msg.value;
            round.userBets[msg.sender].team = team;
        }

        // Incrementar contador de participantes del equipo
        round.teamParticipants[team]++;

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
        distributeRewards(roundId);
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

    function setRoundStatus(uint256 roundId, RoundStatus newStatus) external onlyAuthorized {
        Round storage round = rounds[roundId];
        
        // Validaciones según el estado al que queremos cambiar
        if (newStatus == RoundStatus.Active) {
            require(round.status == RoundStatus.Completed, "Can only activate from completed state");
            require(block.timestamp < round.endTime, "Cannot activate an expired round");
            _activeRoundId = roundId;
        } 
        else if (newStatus == RoundStatus.Evaluating) {
            require(round.status == RoundStatus.Active, "Can only evaluate from active state");
            // Solo validar el tiempo en producción
            if (!isDevelopment) {
                require(block.timestamp >= round.endTime, "Round has not ended yet");
            }
            _activeRoundId = 0;
        }
        else if (newStatus == RoundStatus.Completed) {
            require(round.status == RoundStatus.Evaluating, "Can only complete from evaluating state");
            require(round.winningTeam != Team.None, "Must set winning team before completing");
        }

        round.status = newStatus;
        emit RoundStatusChanged(roundId, newStatus);
    }

    // Getter functions for team statistics
    function getTeamStakes(uint256 roundId, Team team) public view returns (uint256) {
        return rounds[roundId].teamStakes[team];
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

    function getAllTeamParticipants(uint256 roundId) public view returns (
        uint256 noneCount,
        uint256 yesCount,
        uint256 noCount
    ) {
        Round storage round = rounds[roundId];
        return (
            round.teamParticipants[Team.None],
            round.teamParticipants[Team.Yes],
            round.teamParticipants[Team.No]
        );
    }

    function setDevelopmentMode(bool _isDevelopment) external onlyAuthorized {
        isDevelopment = _isDevelopment;
    }

    function getUserRoundHistory(address user) public view returns (
        uint256[] memory roundIds,
        Team[] memory teams,
        bool[] memory claimed,
        uint256[] memory amounts
    ) {
        uint256 count = 0;
        
        // Primero contamos cuántas rondas tiene el usuario
        for (uint256 i = 1; i <= lastRoundId; i++) {
            if (rounds[i].userBets[user].amount > 0) {
                count++;
            }
        }

        // Inicializamos los arrays con el tamaño correcto
        roundIds = new uint256[](count);
        teams = new Team[](count);
        claimed = new bool[](count);
        amounts = new uint256[](count);

        // Llenamos los arrays
        uint256 index = 0;
        for (uint256 i = 1; i <= lastRoundId; i++) {
            Bet storage bet = rounds[i].userBets[user];
            if (bet.amount > 0) {
                roundIds[index] = i;
                teams[index] = bet.team;
                claimed[index] = bet.claimed;
                amounts[index] = bet.amount;
                index++;
            }
        }

        return (roundIds, teams, claimed, amounts);
    }
}