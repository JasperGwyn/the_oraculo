'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { RoundManagerABI } from '@/config/abis/RoundManager'
import { roundManagerAddress } from '@/config/contracts'
import { useAccount, useChainId } from 'wagmi'
import { modeNetwork } from '@/config/chains'

export function ClaimRewards() {
  const [roundId, setRoundId] = useState<number>(1)
  const { address } = useAccount()
  const chainId = useChainId()

  const { data: hash, writeContract, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const { data: reward } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'calculateReward',
    args: [BigInt(roundId), address as `0x${string}`],
    chainId: modeNetwork.id,
    account: address,
  })

  const handleClaim = async () => {
    try {
      console.log('Claiming rewards for round:', roundId)

      await writeContract({
        address: roundManagerAddress,
        abi: RoundManagerABI,
        functionName: 'claimRewards',
        args: [BigInt(roundId)],
        chain: modeNetwork,
        account: address,
      })
    } catch (error) {
      console.error('Error claiming rewards:', error)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-black">Round ID</label>
        <input
          type="number"
          value={roundId}
          onChange={(e) => setRoundId(Number(e.target.value))}
          min={1}
          className="mt-1 block w-full border rounded-md p-2 text-black"
        />
      </div>

      {reward && (
        <div className="text-black">
          <span className="font-semibold">Available Reward: </span>
          {Number(reward) / 1e18} ETH
        </div>
      )}

      <button
        onClick={handleClaim}
        disabled={isPending || isConfirming}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isPending ? 'Confirming in wallet...' :
         isConfirming ? 'Confirming transaction...' :
         isSuccess ? 'Rewards claimed successfully!' :
         'Claim Rewards'}
      </button>

      {hash && (
        <div className="text-sm text-black">
          <span className="font-semibold">Transaction Hash: </span>
          <span className="font-mono">{hash}</span>
        </div>
      )}
    </div>
  )
}