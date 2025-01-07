'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { RoundManagerABI } from '@/config/abis/RoundManager'
import { roundManagerAddress } from '@/config/contracts'
import { useAccount, useChainId } from 'wagmi'
import { modeNetwork } from '@/config/chains'
import { formatEther } from 'viem'

export function WithdrawFees() {
  const [roundId, setRoundId] = useState<number>(1)
  const { address } = useAccount()
  const chainId = useChainId()
  const { data: hash, writeContract, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  // Get round information to calculate fees
  const { data: round } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'rounds',
    args: [BigInt(roundId)],
    chainId: modeNetwork.id,
    account: address,
  })

  // Calculate platform fees
  const platformFees = round ? (Number(round[4]) * Number(round[6])) / 1000 : 0

  const handleWithdraw = async () => {
    try {
      console.log('Withdrawing fees for round:', roundId)

      await writeContract({
        address: roundManagerAddress,
        abi: RoundManagerABI,
        functionName: 'withdrawPlatformFees',
        args: [BigInt(roundId)],
        chain: modeNetwork,
        account: address,
      })
    } catch (error) {
      console.error('Error withdrawing fees:', error)
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

      {/* Platform Fees Information */}
      <div className="space-y-2 text-black">
        <div>
          <span className="font-semibold">Platform Fee Rate: </span>
          {round ? `${Number(round[6]) / 10}%` : 'Loading...'}
        </div>
        <div>
          <span className="font-semibold">Total Staked: </span>
          {round ? `${formatEther(round[4])} ETH` : 'Loading...'}
        </div>
        <div>
          <span className="font-semibold">Available Fees: </span>
          {round ? `${formatEther(BigInt(platformFees))} ETH` : 'Loading...'}
        </div>
      </div>

      <button
        onClick={handleWithdraw}
        disabled={isPending || isConfirming || platformFees === 0}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isPending ? 'Confirming in wallet...' :
         isConfirming ? 'Confirming transaction...' :
         isSuccess ? 'Fees withdrawn successfully!' :
         'Withdraw Fees'}
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