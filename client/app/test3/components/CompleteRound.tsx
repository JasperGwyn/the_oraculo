'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { RoundManagerABI } from '@/config/abis/RoundManager'
import { roundManagerAddress } from '@/config/contracts'
import { useAccount, useChainId } from 'wagmi'
import { modeNetwork } from '@/config/chains'

export function CompleteRound() {
  const [roundId, setRoundId] = useState<number>(1)
  const [winningTeam, setWinningTeam] = useState<number>(1)

  const { address } = useAccount()
  const chainId = useChainId()
  const { data: hash, writeContract, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleComplete = async () => {
    try {
      console.log('Completing round with params:', {
        roundId,
        winningTeam,
      })

      await writeContract({
        address: roundManagerAddress,
        abi: RoundManagerABI,
        functionName: 'completeRound',
        args: [BigInt(roundId), winningTeam],
        chain: modeNetwork,
        account: address,
      })
    } catch (error) {
      console.error('Error completing round:', error)
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
          <label className="block text-sm font-medium text-black">Winning Team</label>
          <select
            value={winningTeam}
            onChange={(e) => setWinningTeam(Number(e.target.value))}
            className="mt-1 block w-full border rounded-md p-2 text-black"
          >
            <option value={1}>Team 1</option>
            <option value={2}>Team 2</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleComplete}
        disabled={isPending || isConfirming}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isPending ? 'Confirming in wallet...' :
         isConfirming ? 'Confirming transaction...' :
         isSuccess ? 'Round completed successfully!' :
         'Complete Round'}
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