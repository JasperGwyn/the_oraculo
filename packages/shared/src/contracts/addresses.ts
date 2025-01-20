export const roundManagerAddress = process.env.ROUNDMANAGER_ADDRESS as `0x${string}`

export const contractAddresses = {
  roundManager: roundManagerAddress,
  // otros contratos que se agreguen en el futuro
} as const

export type ContractAddresses = typeof contractAddresses 