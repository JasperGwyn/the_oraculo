import { http, createConfig } from 'wagmi'
import { modeNetwork } from './chains'

export const config = createConfig({
  chains: [modeNetwork],
  transports: {
    [modeNetwork.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}