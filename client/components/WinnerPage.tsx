'use client'

import { motion } from 'framer-motion'
import { useAccount, useReadContract } from 'wagmi'
import { RoundManagerABI } from '@/config/abis/RoundManager'
import { roundManagerAddress } from '@/config/contracts'
import { formatEther } from 'viem'
import { Team } from '@/lib/types/contracts'

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

  // Get round data
  const { data: round } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'rounds',
    args: [BigInt(roundNumber)],
  })

  // Get team stakes
  const { data: yesTeamStakes } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'getTeamStakes',
    args: [BigInt(roundNumber), Team.Yes],
  })

  const { data: noTeamStakes } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'getTeamStakes',
    args: [BigInt(roundNumber), Team.No],
  })

  // Get team participants count
  const { data: teamParticipants } = useReadContract({
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
    args: [BigInt(roundNumber), address || '0x'],
  })

  if (!round || !yesTeamStakes || !noTeamStakes || !teamParticipants) {
    return <div>Loading...</div>
  }

  const winningTeamEnum = Number(round[5]) as Team
  const winningTeamName = winningTeamEnum === Team.Yes ? 'YES' : 'NO'
  const totalPrizePool = Number(formatEther(yesTeamStakes + noTeamStakes))
  const winnerPrizePool = Number(formatEther(winningTeamEnum === Team.Yes ? yesTeamStakes : noTeamStakes))
  const isUserWinner = userTeam === winningTeamEnum
  const userWinnings = userBet ? Number(formatEther(userBet[0])) : undefined

  // Calculate time elapsed
  const startTime = Number(round[2])
  const endTime = Number(round[3])
  const duration = endTime - startTime
  const hours = Math.floor(duration / 3600)
  const minutes = Math.floor((duration % 3600) / 60)
  const timeElapsed = `${hours}h ${minutes}m`

  const teams: { winningTeam: TeamData; losingTeam: TeamData } = {
    winningTeam: {
      name: winningTeamName,
      ethAmount: Number(formatEther(winningTeamEnum === Team.Yes ? yesTeamStakes : noTeamStakes)),
      participants: Number(teamParticipants[winningTeamEnum === Team.Yes ? 1 : 2]),
      messages: [] // TODO: Implement messages
    },
    losingTeam: {
      name: winningTeamName === 'YES' ? 'NO' : 'YES',
      ethAmount: Number(formatEther(winningTeamEnum === Team.Yes ? noTeamStakes : yesTeamStakes)),
      participants: Number(teamParticipants[winningTeamEnum === Team.Yes ? 2 : 1]),
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
          Team {teams.winningTeam.name} Wins!
        </motion.h1>
        <p className="text-xl text-black">Round {roundNumber} has concluded</p>
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
          isUserWinner ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <h2 className="text-xl font-semibold mb-4 text-black">Your Results</h2>
          <div className="space-y-2 text-black">
            <p>Your Team: {userTeam === Team.Yes ? 'YES' : 'NO'}</p>
            <p>Status: {isUserWinner ? 'Winner! 🎉' : 'Better luck next time'}</p>
            {userWinnings && (
              <p className="text-lg font-semibold">
                Your Winnings: {userWinnings.toFixed(6)} ETH
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
          className="px-8 py-3 bg-blue-500 text-white rounded-full font-semibold
            shadow-lg hover:bg-blue-600 transition-colors"
        >
          Join Next Round
        </motion.button>
      </div>
    </motion.div>
  )
}