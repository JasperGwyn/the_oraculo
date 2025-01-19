import { Chain } from 'viem'

export const modeNetwork: Chain = {
  id: 34443,
  name: 'Mode',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['https://mainnet.mode.network'] },
    public: { http: ['https://mainnet.mode.network'] },
  },
  blockExplorers: {
    default: {
      name: 'Mode Explorer',
      url: 'https://explorer.mode.network',
    },
  },
  testnet: false
} 