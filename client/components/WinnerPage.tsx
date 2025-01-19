'use client'

import { motion } from 'framer-motion'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { RoundManagerABI } from '@/config/abis/RoundManager'
import { roundManagerAddress } from '@/config/contracts'
import { formatEther } from 'viem'
import { Team } from '@/lib/types/contracts'
import { modeNetwork } from '@/config/chains'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface TeamData {
  name: 'YES' | 'NO'
  ethAmount: number
  participants: number
  messages: string[]
}

interface WinnerPageProps {
  roundNumber: number
  userTeam: Team
}

export default function WinnerPage({
  roundNumber,
  userTeam,
}: WinnerPageProps) {
  const { address } = useAccount()
  const router = useRouter()

  // Restore scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleBack = () => {
    console.log('Back clicked, current scroll:', window.scrollY)
    window.scrollTo(0, 0)
    console.log('After scroll reset in WinnerPage:', window.scrollY)
    setTimeout(() => {
      console.log('Before navigation, scroll:', window.scrollY)
      router.back()
    }, 0)
  }

  // Get round data
  const { data: round, isLoading: isLoadingRound, error: roundError } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'rounds',
    args: [BigInt(roundNumber)],
  })

  // Get team stakes
  const { data: yesTeamStakes, isLoading: isLoadingYesStakes } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'getTeamStakes',
    args: [BigInt(roundNumber), Team.Yes],
  })

  const { data: noTeamStakes, isLoading: isLoadingNoStakes } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'getTeamStakes',
    args: [BigInt(roundNumber), Team.No],
  })

  // Get team participants count
  const { data: teamParticipants, isLoading: isLoadingParticipants } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'getAllTeamParticipants',
    args: [BigInt(roundNumber)],
  })

  // Get user bet
  const { data: userBet } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'getUserBet',
    args: [BigInt(roundNumber), address || '0x0000000000000000000000000000000000000000'],
  })

  const { writeContract: claimRewards, isPending: isClaimLoading } = useWriteContract()

  const handleClaimPrize = () => {
    if (!address) return
    
    claimRewards({
      address: roundManagerAddress,
      abi: RoundManagerABI,
      functionName: 'claimRewards',
      args: [BigInt(roundNumber)],
      chain: modeNetwork,
      account: address
    })
  }

  console.log('WinnerPage data:', {
    round,
    yesTeamStakes,
    noTeamStakes,
    teamParticipants,
    userBet,
    isLoading: {
      round: isLoadingRound,
      yesStakes: isLoadingYesStakes,
      noStakes: isLoadingNoStakes,
      participants: isLoadingParticipants
    }
  })

  if (roundError) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Round</h2>
          <p className="text-gray-600">{roundError.message}</p>
        </div>
      </div>
    )
  }

  if (isLoadingRound) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Loading Round Data</h2>
          <p className="text-gray-500">Please wait while we fetch the results...</p>
        </div>
      </div>
    )
  }

  if (!round) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-orange-600 mb-2">Round Not Found</h2>
          <p className="text-gray-600">This round does not exist yet.</p>
          <a href="/" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Go to Current Round
          </a>
        </div>
      </div>
    )
  }

  // Check if round exists (id will be 0 if it doesn't exist)
  if (Number(round[0]) === 0) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-orange-600 mb-2">Round Not Found</h2>
          <p className="text-gray-600">This round does not exist yet.</p>
          <a href="/" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Go to Current Round
          </a>
        </div>
      </div>
    )
  }

  // Check if round is still active or in evaluation
  const roundStatus = Number(round[1])
  if (roundStatus !== 2) { // 2 is Completed status
    const hasUserBet = userBet && Number(userBet[0]) > 0
    const userTeamName = hasUserBet ? (Number(userBet[1]) === Team.Yes ? 'YES' : 'NO') : null
    const userBetAmount = hasUserBet ? Number(formatEther(userBet[0])) : null

    const statusMessage = roundStatus === 0 
      ? "Round In Progress"
      : "Round Pending Results"
    
    const statusDescription = roundStatus === 0 
      ? hasUserBet
        ? `You have bet ${userBetAmount?.toFixed(6)} ETH on team ${userTeamName}. Results will be available once the round is completed.`
        : "This round is currently active. Place your bets before it ends! You'll be able to see the results once the round is completed."
      : hasUserBet
        ? `You have bet ${userBetAmount?.toFixed(6)} ETH on team ${userTeamName}. Results are being processed, check back soon!`
        : "This round has ended and results are being processed. Check back soon to see who won!"

    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-600 mb-2">{statusMessage}</h2>
          <p className="text-gray-600">{statusDescription}</p>
          <a href="/" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Go to Current Round
          </a>
        </div>
      </div>
    )
  }

  const winningTeamEnum = Number(round[5]) as Team
  const winningTeamName = winningTeamEnum === Team.Yes ? 'YES' : 'NO'
  
  // Usamos 0n como valor por defecto si los stakes no están disponibles
  const yesStakes = yesTeamStakes || 0n
  const noStakes = noTeamStakes || 0n
  const totalPrizePool = Number(formatEther(yesStakes + noStakes))
  const winnerPrizePool = Number(formatEther(winningTeamEnum === Team.Yes ? yesStakes : noStakes))
  const isUserWinner = userTeam === winningTeamEnum
  const userWinnings = userBet ? Number(formatEther(userBet[0])) : undefined

  // Calculate time elapsed
  const startTime = Number(round[2])
  const endTime = Number(round[3])
  const duration = endTime - startTime
  const hours = Math.floor(duration / 3600)
  const minutes = Math.floor((duration % 3600) / 60)
  const timeElapsed = `${hours}h ${minutes}m`

  // Usamos valores por defecto si los participantes no están disponibles
  const defaultParticipants = [0n, 0n, 0n]
  const participants = teamParticipants || defaultParticipants

  const teams: { winningTeam: TeamData; losingTeam: TeamData } = {
    winningTeam: {
      name: winningTeamName,
      ethAmount: Number(formatEther(winningTeamEnum === Team.Yes ? yesStakes : noStakes)),
      participants: Number(participants[winningTeamEnum === Team.Yes ? 1 : 2]),
      messages: [] // TODO: Implement messages
    },
    losingTeam: {
      name: winningTeamName === 'YES' ? 'NO' : 'YES',
      ethAmount: Number(formatEther(winningTeamEnum === Team.Yes ? noStakes : yesStakes)),
      participants: Number(participants[winningTeamEnum === Team.Yes ? 2 : 1]),
      messages: [] // TODO: Implement messages
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      {/* Winner Announcement */}
      <div className="text-center mb-8">
        <motion.h1 
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="text-4xl font-bold mb-4 text-black"
          >
            Round {roundNumber}
        </motion.h1>
        <motion.h1
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="text-4xl font-bold mb-4 text-black"
        >
          Team {teams.winningTeam.name} Wins!
        </motion.h1>
       
      </div>

      {/* Round Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-black">Round Statistics</h2>
          <div className="space-y-2 text-black">
            <p>Total Prize Pool: {totalPrizePool.toFixed(6)} ETH</p>
            <p>Winner Prize Pool: {winnerPrizePool.toFixed(6)} ETH</p>
            <p>Round Duration: {timeElapsed}</p>
            <p>Total Participants: {teams.winningTeam.participants + teams.losingTeam.participants}</p>
          </div>
        </div>

        {/* User Results */}
        <div className={`rounded-xl p-6 shadow-lg ${
          userWinnings ? (isUserWinner ? 'bg-green-50' : 'bg-red-50') : 'bg-gray-50'
        }`}>
          <h2 className="text-xl font-semibold mb-4 text-black">Your Results</h2>
          <div className="space-y-2 text-black">
            {userWinnings ? (
              <>
                <p>Your Team: {userTeam === Team.Yes ? 'YES' : 'NO'}</p>
                <p>Status: {isUserWinner ? 'Winner! 🎉' : 'Better luck next time'}</p>
                <p className="text-lg font-semibold">
                  Your Bet: {userWinnings.toFixed(6)} ETH
                </p>
                {isUserWinner ? (
                  <>
                    {userBet?.[2] ? (
                      <p className="mt-4 text-green-600 font-semibold">
                        Rewards already claimed! ✅
                      </p>
                    ) : (
                      <button
                        onClick={handleClaimPrize}
                        disabled={isClaimLoading}
                        className={`mt-4 w-full py-2 px-4 rounded-lg text-white font-semibold
                          ${isClaimLoading 
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600'
                          }`}
                      >
                        {isClaimLoading ? 'Claiming...' : 'Claim Prize'}
                      </button>
                    )}
                  </>
                ) : (
                  <p className="mt-4 text-red-600 font-semibold">
                    No rewards available - Team {winningTeamName} won this round ❌
                  </p>
                )}
              </>
            ) : (
              <p className="text-gray-600 font-semibold">
                You did not participate in this round 🤔
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Team Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Winning Team */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-green-50 rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4 text-black">
            Team {teams.winningTeam.name} 🏆
          </h2>
          <div className="space-y-2 text-black">
            <p>Total Staked: {teams.winningTeam.ethAmount.toFixed(6)} ETH</p>
            <p>Participants: {teams.winningTeam.participants}</p>
            <div className="mt-4">
              <h3 className="font-medium mb-2">Winning Arguments:</h3>
              <ul className="space-y-2">
                {teams.winningTeam.messages.length > 0 ? (
                  teams.winningTeam.messages.map((message, index) => (
                    <li key={index} className="text-sm bg-white p-2 rounded">
                      "{message}"
                    </li>
                  ))
                ) : (
                  <li className="text-sm bg-white p-2 rounded italic">
                    No messages available
                  </li>
                )}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Losing Team */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-gray-50 rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4 text-black">
            Team {teams.losingTeam.name}
          </h2>
          <div className="space-y-2 text-black">
            <p>Total Staked: {teams.losingTeam.ethAmount.toFixed(6)} ETH</p>
            <p>Participants: {teams.losingTeam.participants}</p>
            <div className="mt-4">
              <h3 className="font-medium mb-2">Arguments:</h3>
              <ul className="space-y-2">
                {teams.losingTeam.messages.length > 0 ? (
                  teams.losingTeam.messages.map((message, index) => (
                    <li key={index} className="text-sm bg-white p-2 rounded">
                      "{message}"
                    </li>
                  ))
                ) : (
                  <li className="text-sm bg-white p-2 rounded italic">
                    No messages available
                  </li>
                )}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Next Round Button */}
      <div className="text-center mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          className="px-8 py-3 bg-blue-500 text-white rounded-full font-semibold
            shadow-lg hover:bg-blue-600 transition-colors"
        >
          Back
        </motion.button>
      </div>
    </motion.div>
  )
}