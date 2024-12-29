'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { RoundManagerABI } from '@/config/abis/RoundManager'
import { roundManagerAddress } from '@/config/contracts'
import { useAccount, useChainId } from 'wagmi'
import { modeNetwork } from '@/config/chains'

export function CreateRound() {
  const [roundId, setRoundId] = useState<number>(1)
  const [duration, setDuration] = useState<number>(3600) // 1 hour in seconds
  const [distributionType, setDistributionType] = useState<number>(0) // 0 = Manual, 1 = Automatic

  const { address } = useAccount()
  const chainId = useChainId()
  const { data: hash, writeContract, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleCreate = async () => {
    try {
      console.log('Creating round with params:', {
        roundId,
        duration,
        distributionType,
      })

      await writeContract({
        address: roundManagerAddress,
        abi: RoundManagerABI,
        functionName: 'createRound',
        args: [BigInt(roundId), BigInt(duration), distributionType],
        chain: modeNetwork,
        account: address,
      })
    } catch (error) {
      console.error('Error creating round:', error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
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

        <div>
          <label className="block text-sm font-medium text-black">Duration (seconds)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            min={300}
            className="mt-1 block w-full border rounded-md p-2 text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black">Distribution Type</label>
          <select
            value={distributionType}
            onChange={(e) => setDistributionType(Number(e.target.value))}
            className="mt-1 block w-full border rounded-md p-2 text-black"
          >
            <option value={0}>Manual</option>
            <option value={1}>Automatic</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleCreate}
        disabled={isPending || isConfirming}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isPending ? 'Confirming in wallet...' :
         isConfirming ? 'Confirming transaction...' :
         isSuccess ? 'Round created successfully!' :
         'Create Round'}
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