'use client'

import { useAccount, useChainId } from 'wagmi'
import { roundManagerAddress } from '@/config/contracts'
import { modeNetwork } from '@/config/chains'

export function WalletStatus() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()

  return (
    <div className="space-y-2 text-black">
      <div>
        <span className="font-semibold">Connection Status: </span>
        {isConnected ? (
          <span className="text-green-600">Connected</span>
        ) : (
          <span className="text-red-600">Not Connected</span>
        )}
      </div>

      {isConnected && (
        <>
          <div>
            <span className="font-semibold">Wallet Address: </span>
            <span className="font-mono">{address}</span>
          </div>

          <div>
            <span className="font-semibold">Current Chain ID: </span>
            <span className={chainId === modeNetwork.id ? 'text-green-600' : 'text-red-600'}>
              {chainId}
            </span>
          </div>

          <div>
            <span className="font-semibold">Expected Chain ID: </span>
            <span>{modeNetwork.id}</span>
          </div>

          <div>
            <span className="font-semibold">Contract Address: </span>
            <span className="font-mono">{roundManagerAddress}</span>
          </div>
        </>
      )}
    </div>
  )
}