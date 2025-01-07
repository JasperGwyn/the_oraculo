import { defineChain } from 'viem'

export const modeNetwork = defineChain({
  id: 34443,
  name: 'Mode',
  network: 'mode',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: [process.env.NEXT_PUBLIC_MODE_NETWORK_URL || 'https://mainnet.mode.network'] },
    public: { http: [process.env.NEXT_PUBLIC_MODE_NETWORK_URL || 'https://mainnet.mode.network'] },
  },
  blockExplorers: {
    default: { name: 'Mode Explorer', url: 'https://explorer.mode.network' },
  },
  contracts: {
    roundManager: {
      address: process.env.NEXT_PUBLIC_ROUNDMANAGER_ADDRESS as `0x${string}`
    }
  }
})