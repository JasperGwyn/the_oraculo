export const abi = [
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
] as const