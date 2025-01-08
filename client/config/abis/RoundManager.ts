export const RoundManagerABI = [
    // Read functions
    {
      name: 'getActiveRound',
      type: 'function',
      stateMutability: 'view',
      inputs: [],
      outputs: [
        { internalType: 'uint256', name: 'id', type: 'uint256' },
        { internalType: 'uint8', name: 'status', type: 'uint8' },
        { internalType: 'uint256', name: 'startTime', type: 'uint256' },
        { internalType: 'uint256', name: 'endTime', type: 'uint256' },
        { internalType: 'uint256', name: 'totalStaked', type: 'uint256' },
        { internalType: 'uint8', name: 'winningTeam', type: 'uint8' },
        { internalType: 'uint256', name: 'platformFee', type: 'uint256' }
      ],
    },
    {
      name: 'rounds',
      type: 'function',
      stateMutability: 'view',
      inputs: [
        { internalType: 'uint256', name: '', type: 'uint256' }
      ],
      outputs: [
        { internalType: 'uint256', name: 'id', type: 'uint256' },
        { internalType: 'uint8', name: 'status', type: 'uint8' },
        { internalType: 'uint256', name: 'startTime', type: 'uint256' },
        { internalType: 'uint256', name: 'endTime', type: 'uint256' },
        { internalType: 'uint256', name: 'totalStaked', type: 'uint256' },
        { internalType: 'uint8', name: 'winningTeam', type: 'uint8' },
        { internalType: 'uint256', name: 'platformFee', type: 'uint256' }
      ],
    },
    {
      name: 'authorizedProcessors',
      type: 'function',
      stateMutability: 'view',
      inputs: [
        { internalType: 'address', name: '', type: 'address' }
      ],
      outputs: [
        { internalType: 'bool', name: '', type: 'bool' }
      ],
    },
    {
      name: 'calculateReward',
      type: 'function',
      stateMutability: 'view',
      inputs: [
        { internalType: 'uint256', name: 'roundId', type: 'uint256' },
        { internalType: 'address', name: 'user', type: 'address' }
      ],
      outputs: [
        { internalType: 'uint256', name: '', type: 'uint256' }
      ],
    },
    {
      name: 'getTeamStakes',
      type: 'function',
      stateMutability: 'view',
      inputs: [
        { internalType: 'uint256', name: 'roundId', type: 'uint256' },
        { internalType: 'uint8', name: 'team', type: 'uint8' }
      ],
      outputs: [
        { internalType: 'uint256', name: '', type: 'uint256' }
      ],
    },
    {
      name: 'getParticipants',
      type: 'function',
      stateMutability: 'view',
      inputs: [
        { internalType: 'uint256', name: 'roundId', type: 'uint256' }
      ],
      outputs: [
        { internalType: 'address[]', name: '', type: 'address[]' }
      ],
    },
    {
      name: 'getUserBet',
      type: 'function',
      stateMutability: 'view',
      inputs: [
        { internalType: 'uint256', name: 'roundId', type: 'uint256' },
        { internalType: 'address', name: 'user', type: 'address' }
      ],
      outputs: [
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
        { internalType: 'uint8', name: 'team', type: 'uint8' },
        { internalType: 'bool', name: 'claimed', type: 'bool' }
      ],
    },
    {
      name: 'getAllTeamParticipants',
      type: 'function',
      stateMutability: 'view',
      inputs: [
        { internalType: 'uint256', name: 'roundId', type: 'uint256' }
      ],
      outputs: [
        { internalType: 'uint256', name: 'noneCount', type: 'uint256' },
        { internalType: 'uint256', name: 'yesCount', type: 'uint256' },
        { internalType: 'uint256', name: 'noCount', type: 'uint256' }
      ],
    },

    // Write functions
    {
      name: 'placeBet',
      type: 'function',
      stateMutability: 'payable',
      inputs: [
        { internalType: 'uint256', name: 'roundId', type: 'uint256' },
        { internalType: 'uint8', name: 'team', type: 'uint8' }
      ],
      outputs: [],
    },
    {
      name: 'claimRewards',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { internalType: 'uint256', name: 'roundId', type: 'uint256' }
      ],
      outputs: [],
    },
    {
      name: 'createRound',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { internalType: 'uint256', name: 'duration', type: 'uint256' }
      ],
      outputs: [],
    },
    {
      name: 'completeRound',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { internalType: 'uint256', name: 'roundId', type: 'uint256' },
        { internalType: 'uint8', name: 'winningTeam', type: 'uint8' }
      ],
      outputs: [],
    },
    {
      name: 'setRoundStatus',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { internalType: 'uint256', name: 'roundId', type: 'uint256' },
        { internalType: 'uint8', name: 'newStatus', type: 'uint8' }
      ],
      outputs: [],
    },
    {
      name: 'withdrawPlatformFees',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { internalType: 'uint256', name: 'roundId', type: 'uint256' }
      ],
      outputs: [],
    },

    // Events
    {
      type: 'event',
      name: 'RoundCreated',
      inputs: [
        { indexed: false, internalType: 'uint256', name: 'roundId', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'startTime', type: 'uint256' }
      ],
    },
    {
      type: 'event',
      name: 'RoundStatusChanged',
      inputs: [
        { indexed: false, internalType: 'uint256', name: 'roundId', type: 'uint256' },
        { indexed: false, internalType: 'uint8', name: 'newStatus', type: 'uint8' }
      ],
    },
    {
      type: 'event',
      name: 'BetPlaced',
      inputs: [
        { indexed: false, internalType: 'uint256', name: 'roundId', type: 'uint256' },
        { indexed: false, internalType: 'address', name: 'user', type: 'address' },
        { indexed: false, internalType: 'uint8', name: 'team', type: 'uint8' },
        { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
      ],
    },
    {
      type: 'event',
      name: 'RoundCompleted',
      inputs: [
        { indexed: false, internalType: 'uint256', name: 'roundId', type: 'uint256' },
        { indexed: false, internalType: 'uint8', name: 'winningTeam', type: 'uint8' }
      ],
    },
    {
      type: 'event',
      name: 'RewardsClaimed',
      inputs: [
        { indexed: false, internalType: 'uint256', name: 'roundId', type: 'uint256' },
        { indexed: false, internalType: 'address', name: 'user', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
      ],
    },
    {
      type: 'event',
      name: 'AutomaticDistributionFailed',
      inputs: [
        { indexed: false, internalType: 'uint256', name: 'roundId', type: 'uint256' },
        { indexed: false, internalType: 'address', name: 'user', type: 'address' },
        { indexed: false, internalType: 'string', name: 'reason', type: 'string' }
      ],
    }
  ] as const