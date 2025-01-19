export const contractAddresses = {
  ROUNDMANAGER_ADDRESS: '0x593CA3267261F13ba429a18cc0caF09A1c261690' as const,
  // otros contratos que se agreguen en el futuro
} as const

export type ContractAddresses = typeof contractAddresses 