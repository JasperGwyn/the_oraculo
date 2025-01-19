'use client'

import { useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { RoundManagerABI } from '@/config/abis/RoundManager'
import { roundManagerAddress } from '@/config/contracts'
import { formatEther } from 'viem'
import { Team } from '@/lib/types/contracts'
import Link from 'next/link'

type UserRoundHistoryResult = readonly [
  readonly bigint[], // roundIds
  readonly number[], // teams
  readonly boolean[], // claimed
  readonly bigint[]  // amounts
]

export default function RoundHistory() {
  const { address } = useAccount()

  // Get user's round history
  const { data: roundHistory } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'getUserRoundHistory',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  })

  // Get active round for comparison
  const { data: activeRound } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'getActiveRound',
  })

  if (!address) {
    return (
      <div className="p-4 rounded-lg bg-slate-100/80 backdrop-blur-sm">
        <p className="text-slate-700 text-center">
          Connect your wallet to see your round history
        </p>
      </div>
    )
  }

  if (!roundHistory || roundHistory[0].length === 0) {
    return (
      <div className="p-4 rounded-lg bg-slate-100/80 backdrop-blur-sm">
        <p className="text-slate-700 text-center">
          You haven't participated in any rounds yet
        </p>
      </div>
    )
  }

  const [roundIds, teams, claimed, amounts] = roundHistory

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-700">Your Round History</h2>
      <div className="space-y-3">
        {roundIds.map((roundId, index) => (
          <RoundHistoryItem 
            key={roundId.toString()} 
            roundId={roundId} 
            activeRoundId={activeRound?.[0]}
            team={teams[index] as Team}
            claimed={claimed[index]}
            amount={amounts[index]}
          />
        ))}
      </div>
    </div>
  )
}

interface RoundHistoryItemProps {
  roundId: bigint
  activeRoundId?: bigint
  team: Team
  claimed: boolean
  amount: bigint
}

function RoundHistoryItem({ roundId, activeRoundId, team, claimed, amount }: RoundHistoryItemProps) {
  const { address } = useAccount()

  // Get round data
  const { data: round } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'rounds',
    args: [roundId],
  })

  if (!round) return null

  const roundNumber = Number(roundId)
  const betAmount = Number(formatEther(amount))
  const roundStatus = Number(round[1])
  const winningTeam = Number(round[5])
  const isWinner = roundStatus === 2 && team === winningTeam
  const isActive = activeRoundId === roundId

  return (
    <div className={`p-4 rounded-lg ${
      isActive ? 'bg-blue-50' : 
      roundStatus === 2 
        ? (isWinner ? 'bg-green-50' : 'bg-red-50')
        : 'bg-slate-100/80'
    } backdrop-blur-sm`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-slate-700">Round #{roundNumber}</h3>
          <p className="text-slate-600">
            Bet: {betAmount.toFixed(6)} ETH on {team === Team.Yes ? 'YES' : 'NO'}
          </p>
          <p className={`mt-1 font-medium ${
            isActive ? 'text-blue-600' :
            roundStatus === 2
              ? (isWinner ? 'text-green-600' : 'text-red-600')
              : 'text-slate-600'
          }`}>
            {isActive ? 'In Progress...' :
             roundStatus === 2
               ? (isWinner ? `Won! 🎉` : 'Lost ❌')
               : 'Processing...'}
          </p>
        </div>
        <Link
          href={`/rounds/${roundNumber}`}
          className="px-3 py-1 text-sm bg-white rounded-full text-slate-700 hover:bg-slate-50 transition-colors"
        >
          View Details →
        </Link>
      </div>
    </div>
  )
} 