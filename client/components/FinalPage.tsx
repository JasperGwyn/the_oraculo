'use client'

import { motion } from 'framer-motion'

interface Team {
  name: string
  ethAmount: number
  participants: number
  messages: string[]
}

interface FinalPageProps {
  teams: Team[]
  currentRound: number
  timeRemaining: string
  onRoundComplete: () => void
  question: string
}

export default function FinalPage({
  teams,
  currentRound,
  timeRemaining,
  onRoundComplete,
  question
}: FinalPageProps) {
  return (
    <div className="text-center max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Timer */}
        <p className="text-2xl font-bold text-black">
          Time Remaining: {timeRemaining}
        </p>

        {/* Header */}
        <h2 className="text-3xl font-bold text-black">Round {currentRound} Summary</h2>

        {/* Question */}
        <div className="w-full bg-white rounded-xl p-6 shadow-lg mb-4">
          <p className="text-lg text-black">"{question}"</p>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {teams.map((team) => (
            <motion.div
              key={team.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-black mb-4">
                Team {team.name}
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-black">
                    <div>
                      <p className="font-medium">Total Staked</p>
                      <p className="text-lg">{team.ethAmount} ETH</p>
                    </div>
                    <div>
                      <p className="font-medium">Participants</p>
                      <p className="text-lg">{team.participants}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-black mb-2">Arguments:</h4>
                  <ul className="space-y-2">
                    {team.messages.map((message, index) => (
                      <li
                        key={index}
                        className="text-sm bg-gray-50 p-3 rounded text-black text-left"
                      >
                        "{message}"
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Show Winner Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRoundComplete}
          className="px-8 py-3 bg-blue-500 text-white rounded-full font-semibold
            shadow-lg hover:bg-blue-600 transition-colors"
        >
          Show Winner
        </motion.button>
      </motion.div>
    </div>
  )
}

