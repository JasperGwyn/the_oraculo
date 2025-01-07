'use client'

import { motion } from 'framer-motion'

interface Team {
  name: 'YES' | 'NO'
  ethAmount: number
  participants: number
  messages: string[]
}

interface WinnerPageProps {
  winningTeam: Team
  losingTeam: Team
  roundNumber: number
  totalPrizePool: number
  winnerPrizePool: number
  timeElapsed: string
  userTeam: 'YES' | 'NO'
  userWinnings?: number
}

export default function WinnerPage({
  winningTeam,
  losingTeam,
  roundNumber,
  totalPrizePool,
  winnerPrizePool,
  timeElapsed,
  userTeam,
  userWinnings
}: WinnerPageProps) {
  const isUserWinner = userTeam === winningTeam.name

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
          Team {winningTeam.name} Wins!
        </motion.h1>
        <p className="text-xl text-black">Round {roundNumber} has concluded</p>
      </div>

      {/* Round Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-black">Round Statistics</h2>
          <div className="space-y-2 text-black">
            <p>Total Prize Pool: {totalPrizePool} ETH</p>
            <p>Winner Prize Pool: {winnerPrizePool} ETH</p>
            <p>Round Duration: {timeElapsed}</p>
            <p>Total Participants: {winningTeam.participants + losingTeam.participants}</p>
          </div>
        </div>

        {/* User Results */}
        <div className={`rounded-xl p-6 shadow-lg ${
          isUserWinner ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <h2 className="text-xl font-semibold mb-4 text-black">Your Results</h2>
          <div className="space-y-2 text-black">
            <p>Your Team: {userTeam}</p>
            <p>Status: {isUserWinner ? 'Winner! 🎉' : 'Better luck next time'}</p>
            {userWinnings && (
              <p className="text-lg font-semibold">
                Your Winnings: {userWinnings} ETH
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
            Team {winningTeam.name} 🏆
          </h2>
          <div className="space-y-2 text-black">
            <p>Total Staked: {winningTeam.ethAmount} ETH</p>
            <p>Participants: {winningTeam.participants}</p>
            <div className="mt-4">
              <h3 className="font-medium mb-2">Winning Arguments:</h3>
              <ul className="space-y-2">
                {winningTeam.messages.map((message, index) => (
                  <li key={index} className="text-sm bg-white p-2 rounded">
                    "{message}"
                  </li>
                ))}
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
            Team {losingTeam.name}
          </h2>
          <div className="space-y-2 text-black">
            <p>Total Staked: {losingTeam.ethAmount} ETH</p>
            <p>Participants: {losingTeam.participants}</p>
            <div className="mt-4">
              <h3 className="font-medium mb-2">Arguments:</h3>
              <ul className="space-y-2">
                {losingTeam.messages.map((message, index) => (
                  <li key={index} className="text-sm bg-white p-2 rounded">
                    "{message}"
                  </li>
                ))}
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