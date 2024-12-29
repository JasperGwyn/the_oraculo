'use client'

import { useState } from 'react'
import { useReadContract } from 'wagmi'
import { RoundManagerABI } from '@/config/abis/RoundManager'
import { roundManagerAddress } from '@/config/contracts'
import { useAccount, useChainId } from 'wagmi'
import { modeNetwork } from '@/config/chains'

interface Round {
  id: bigint
  status: number
  startTime: bigint
  endTime: bigint
  totalBetTeam1: bigint
  totalBetTeam2: bigint
  winningTeam: number
}

export function RoundInfo() {
  const [roundId, setRoundId] = useState<number>(1)
  const { address } = useAccount()
  const chainId = useChainId()

  const { data: round } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'rounds',
    args: [BigInt(roundId)],
    chainId: modeNetwork.id,
    account: address,
  }) as { data: Round | undefined }

  const formatTimestamp = (timestamp: bigint) => {
    if (!timestamp) return 'Not set'
    const date = new Date(Number(timestamp) * 1000)
    return date.toLocaleString()
  }

  const getRoundStatus = (status: number) => {
    switch (status) {
      case 0:
        return 'Not Started'
      case 1:
        return 'Active'
      case 2:
        return 'Completed'
      default:
        return 'Unknown'
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

      {round ? (
        <div className="space-y-2 text-black">
          <div>
            <span className="font-semibold">Status: </span>
            {getRoundStatus(round.status)}
          </div>
          <div>
            <span className="font-semibold">Start Time: </span>
            {formatTimestamp(round.startTime)}
          </div>
          <div>
            <span className="font-semibold">End Time: </span>
            {formatTimestamp(round.endTime)}
          </div>
          <div>
            <span className="font-semibold">Total Bet Team 1: </span>
            {Number(round.totalBetTeam1) / 1e18} ETH
          </div>
          <div>
            <span className="font-semibold">Total Bet Team 2: </span>
            {Number(round.totalBetTeam2) / 1e18} ETH
          </div>
          <div>
            <span className="font-semibold">Winning Team: </span>
            {round.winningTeam === 0 ? 'Not set' : round.winningTeam}
          </div>
        </div>
      ) : (
        <div className="text-gray-500">No round data available</div>
      )}
    </div>
  )
}