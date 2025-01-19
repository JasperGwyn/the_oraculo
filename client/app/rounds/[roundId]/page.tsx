'use client'

import { useParams } from 'next/navigation'
import WinnerPage from '@/components/WinnerPage'
import { useReadContract, useAccount } from 'wagmi'
import { RoundManagerABI } from '@/config/abis/RoundManager'
import { roundManagerAddress } from '@/config/contracts'
import { Team } from '@/lib/types/contracts'
import { useEffect } from 'react'

export default function RoundPage() {
  const params = useParams()
  const roundId = Number(params.roundId)
  const { address } = useAccount()

  console.log('Rendering RoundPage with:', { roundId, address })

  // Get user's team for this round
  const { data: userBet, isLoading: isLoadingUserBet, error: userBetError } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'getUserBet',
    args: [BigInt(roundId), address || '0x0000000000000000000000000000000000000000'],
  })

  // Get round data to verify it exists
  const { data: round, isLoading: isLoadingRound, error: roundError } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'rounds',
    args: [BigInt(roundId)],
  })

  useEffect(() => {
    console.log('Contract states:', {
      isLoadingRound,
      isLoadingUserBet,
      round,
      userBet,
      roundError,
      userBetError
    })
  }, [isLoadingRound, isLoadingUserBet, round, userBet, roundError, userBetError])

  if (isLoadingRound) {
    console.log('Loading round data...')
    return <div className="flex justify-center items-center min-h-screen">Loading round data...</div>
  }

  if (roundError) {
    console.error('Round error:', roundError)
    return <div className="flex justify-center items-center min-h-screen">Error loading round: {roundError.message}</div>
  }

  if (!round) {
    console.log('Round not found')
    return <div className="flex justify-center items-center min-h-screen">Round not found</div>
  }

  console.log('Rendering WinnerPage with:', {
    roundNumber: roundId,
    userTeam: userBet ? userBet[1] : Team.None,
    roundData: round
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <WinnerPage
        roundNumber={roundId}
        userTeam={userBet ? userBet[1] as Team : Team.None}
      />
    </div>
  )
} 