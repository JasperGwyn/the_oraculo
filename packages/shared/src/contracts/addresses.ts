export const roundManagerAddress = '0x593CA3267261F13ba429a18cc0caF09A1c261690' as const

export const contractAddresses = {
  roundManager: roundManagerAddress,
  // otros contratos que se agreguen en el futuro
} as const

export type ContractAddresses = typeof contractAddresses 