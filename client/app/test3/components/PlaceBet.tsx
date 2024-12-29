'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { RoundManagerABI } from '@/config/abis/RoundManager'
import { roundManagerAddress } from '@/config/contracts'
import { useAccount, useChainId } from 'wagmi'
import { modeNetwork } from '@/config/chains'

export function PlaceBet() {
  const [roundId, setRoundId] = useState<number>(1)
  const [amount, setAmount] = useState<string>('0.001')
  const [team, setTeam] = useState<number>(1) // 1 = Yes, 2 = No

  const { address } = useAccount()
  const chainId = useChainId()
  const { data: hash, writeContract, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleSubmit = async () => {
    try {
      console.log('Placing bet with params:', {
        roundId,
        team,
        amount,
      })

      await writeContract({
        address: roundManagerAddress,
        abi: RoundManagerABI,
        functionName: 'placeBet',
        args: [BigInt(roundId), team],
        value: parseEther(amount),
        chain: modeNetwork,
        account: address,
      })
    } catch (error) {
      console.error('Error placing bet:', error)
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
          <label className="block text-sm font-medium text-black">Amount (ETH)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.000001"
            step="0.000001"
            className="mt-1 block w-full border rounded-md p-2 text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black">Team</label>
          <select
            value={team}
            onChange={(e) => setTeam(Number(e.target.value))}
            className="mt-1 block w-full border rounded-md p-2 text-black"
          >
            <option value={1}>Yes</option>
            <option value={2}>No</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isPending || isConfirming}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isPending ? 'Confirming in wallet...' :
         isConfirming ? 'Confirming transaction...' :
         isSuccess ? 'Bet placed successfully!' :
         'Place Bet'}
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