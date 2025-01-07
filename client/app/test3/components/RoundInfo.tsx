'use client'

import { useState } from 'react'
import { useReadContract } from 'wagmi'
import { RoundManagerABI } from '@/config/abis/RoundManager'
import { roundManagerAddress } from '@/config/contracts'
import { useAccount, useChainId } from 'wagmi'
import { modeNetwork } from '@/config/chains'
import { RoundStatus, Team, DistributionType } from '@/lib/types/contracts'

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
  })

  const formatTimestamp = (timestamp: bigint) => {
    if (!timestamp) return 'Not set'
    const date = new Date(Number(timestamp) * 1000)
    return date.toLocaleString()
  }

  const getRoundStatus = (status: number) => {
    return RoundStatus[status] || 'Unknown'
  }

  const getTeamName = (team: number) => {
    return Team[team] || 'Not set'
  }

  const getDistributionType = (type: number) => {
    return DistributionType[type] || 'Unknown'
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
            {getRoundStatus(Number(round[1]))}
          </div>
          <div>
            <span className="font-semibold">Start Time: </span>
            {formatTimestamp(round[2])}
          </div>
          <div>
            <span className="font-semibold">End Time: </span>
            {formatTimestamp(round[3])}
          </div>
          <div>
            <span className="font-semibold">Total Staked: </span>
            {Number(round[4]) / 1e18} ETH
          </div>
          <div>
            <span className="font-semibold">Winning Team: </span>
            {getTeamName(Number(round[5]))}
          </div>
          <div>
            <span className="font-semibold">Platform Fee: </span>
            {Number(round[6]) / 10}%
          </div>
          <div>
            <span className="font-semibold">Distribution Type: </span>
            {getDistributionType(Number(round[7]))}
          </div>
        </div>
      ) : (
        <div className="text-gray-500">No round data available</div>
      )}
    </div>
  )
}