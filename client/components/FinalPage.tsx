'use client'

import { motion } from 'framer-motion'
import { useReadContract } from 'wagmi'
import { RoundManagerABI } from '@/config/abis/RoundManager'
import { roundManagerAddress } from '@/config/contracts'
import { formatEther } from 'viem'
import { Team, RoundStatus } from '@/lib/types/contracts'
import { useState, useEffect } from 'react'

interface FinalPageProps {
  currentRound: number
  timeRemaining: string
  onRoundComplete: () => void
  question: string
}

export default function FinalPage({
  currentRound,
  timeRemaining: _timeRemaining, // Renombramos porque no lo usaremos
  onRoundComplete,
  question
}: FinalPageProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>('Calculating...')

  // Get round data
  const { data: round } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'rounds',
    args: [BigInt(currentRound)],
  })

  // Get round status
  const roundStatus = round ? Number(round[1]) : undefined // status is at index 1

  // Effect to update time remaining
  useEffect(() => {
    if (!round) return;

    const updateTimeRemaining = () => {
      const now = Math.floor(Date.now() / 1000)
      const endTime = Number(round[3]) // endTime is at index 3
      const remaining = endTime - now

      if (remaining <= 0) {
        setTimeRemaining('Round Ended')
        return
      }

      const minutes = Math.floor(remaining / 60)
      const seconds = remaining % 60
      setTimeRemaining(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
    }

    const timer = setInterval(updateTimeRemaining, 1000)
    updateTimeRemaining()

    return () => clearInterval(timer)
  }, [round])

  // Get team stakes
  const { data: yesTeamStakes } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'getTeamStakes',
    args: [BigInt(currentRound), Team.Yes],
  })

  const { data: noTeamStakes } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'getTeamStakes',
    args: [BigInt(currentRound), Team.No],
  })

  // Get team participants count
  const { data: teamParticipants } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'getAllTeamParticipants',
    args: [BigInt(currentRound)],
  })

  // Get all participants to get their messages
  const { data: participants } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'getParticipants',
    args: [BigInt(currentRound)],
  })

  // Construir los equipos con datos reales
  const teams = [
    {
      name: 'YES',
      ethAmount: yesTeamStakes ? Number(formatEther(yesTeamStakes)) : 0,
      participants: teamParticipants ? Number(teamParticipants[1]) : 0, // yesCount
      messages: [] // TODO: Necesitamos implementar una forma de guardar los mensajes
    },
    {
      name: 'NO',
      ethAmount: noTeamStakes ? Number(formatEther(noTeamStakes)) : 0,
      participants: teamParticipants ? Number(teamParticipants[2]) : 0, // noCount
      messages: [] // TODO: Necesitamos implementar una forma de guardar los mensajes
    }
  ]

  const getStatusMessage = () => {
    if (!round) return ''
    
    switch(roundStatus) {
      case RoundStatus.Active:
        return `Time Remaining: ${timeRemaining}`
      case RoundStatus.Evaluating:
        return 'The Oracle is evaluating the round...'
      case RoundStatus.Completed:
        return 'Round Completed'
      default:
        return ''
    }
  }

  return (
    <div className="text-center max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Timer/Status */}
        <p className={`text-2xl font-bold ${roundStatus === RoundStatus.Evaluating ? 'text-orange-600' : 'text-black'}`}>
          {getStatusMessage()}
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
                      <p className="text-lg">{team.ethAmount.toFixed(6)} ETH</p>
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
                    {team.messages.length > 0 ? (
                      team.messages.map((message, index) => (
                        <li
                          key={index}
                          className="text-sm bg-gray-50 p-3 rounded text-black text-left"
                        >
                          "{message}"
                        </li>
                      ))
                    ) : (
                      <li className="text-sm bg-gray-50 p-3 rounded text-black text-left italic">
                        No messages yet
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Show Winner Button */}
        {roundStatus === RoundStatus.Completed ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRoundComplete}
            className="px-8 py-3 bg-blue-500 text-white rounded-full font-semibold
              shadow-lg hover:bg-blue-600 transition-colors"
          >
            Show Winner
          </motion.button>
        ) : roundStatus === RoundStatus.Evaluating ? (
          <div className="px-8 py-3 bg-orange-100 text-orange-600 rounded-full font-semibold animate-pulse">
            Waiting for Oracle's Decision...
          </div>
        ) : null}
      </motion.div>
    </div>
  )
}

