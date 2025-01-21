'use client'

import { motion } from 'framer-motion'
import { useAccount, useReadContract } from 'wagmi'
import { useEffect, useState } from 'react'
import { modal } from '@/context'
import { RoundManagerABI } from '@/config/abis/RoundManager'
import { roundManagerAddress } from '@/config/contracts'
import { formatEther } from 'viem'
import { RoundStatus, Team } from '@/lib/types/contracts'
import { useSocketContext } from '@/components/SocketProvider'

export default function TeamSelection({ onParticipate }: { onParticipate: () => void }) {
  const { isConnected, address } = useAccount()
  const [timeRemaining, setTimeRemaining] = useState<string>('Calculating...')
  const { currentRound } = useSocketContext()

  const { data: activeRound, refetch: refetchActiveRound } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'getActiveRound',
  })

  // Get user bet for active round
  const { data: userBet, refetch: refetchUserBet } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'getUserBet',
    args: activeRound && address ? [activeRound[0], address] : undefined,
    query: {
      enabled: !!activeRound && !!address,
    }
  })

  // Get team stakes
  const { data: yesTeamStakes, refetch: refetchYesStakes } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'getTeamStakes',
    args: activeRound ? [activeRound[0], Team.Yes] : undefined,
  })

  const { data: noTeamStakes, refetch: refetchNoStakes } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'getTeamStakes',
    args: activeRound ? [activeRound[0], Team.No] : undefined,
  })

  // Get team participants count
  const { data: teamParticipants, refetch: refetchParticipants } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'getAllTeamParticipants',
    args: activeRound ? [activeRound[0]] : undefined,
  })

  // Effect to update time remaining
  useEffect(() => {
    if (!activeRound) return;

    const updateTimeRemaining = () => {
      const now = Math.floor(Date.now() / 1000)
      const endTime = Number(activeRound[3]) // endTime is at index 3
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
  }, [activeRound])

  // Effect to refetch data when a new round is created
  useEffect(() => {
    if (currentRound) {
      console.log('Refetching contract data due to round update')
      refetchActiveRound()
      refetchUserBet()
      refetchYesStakes()
      refetchNoStakes()
      refetchParticipants()
    }
  }, [currentRound?.roundId]) // Solo re-ejecutar cuando cambia el ID de la ronda

  const isRoundActive = activeRound && Number(activeRound[0]) !== 0
  const hasUserBet = userBet && Number(userBet[0]) > 0

  const handleClick = async () => {
    if (!isConnected) {
      try {
        await modal.open()
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      }
      return
    }

    onParticipate()
  }

  return (
    <div className="text-center">
      <h3 className="text-xl font-bold text-slate-700 mb-4">Ready to Join?</h3>
      <div className="flex flex-col items-center">
        {!isRoundActive ? (
          <div className="p-4 rounded-lg bg-slate-100/80 backdrop-blur-sm">
            <p className="text-slate-700 italic">
              🌌 The cosmic forces are realigning... Please wait! The next round of prophecies shall begin when the stars align.
            </p>
          </div>
        ) : (
          <>
            <motion.button
              whileHover={{ scale: isConnected && !hasUserBet ? 1.05 : 1 }}
              whileTap={{ scale: isConnected && !hasUserBet ? 0.95 : 1 }}
              onClick={handleClick}
              disabled={hasUserBet}
              className={`px-8 py-2 rounded-full text-lg font-bold
                ${isConnected 
                  ? hasUserBet 
                    ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                    : 'bg-white hover:bg-slate-50' 
                  : 'bg-gray-200'}
                border-2 border-white
                text-slate-700 shadow-lg
                hover:shadow-xl
                transition-all mb-4
                ${!isConnected && 'opacity-75'}`}
            >
              {!isConnected 
                ? 'Connect to Participate'
                : hasUserBet
                  ? 'Waiting for Results...'
                  : 'Participate'
              }
            </motion.button>

            {/* Round Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 w-full max-w-sm p-4 bg-white/90 rounded-xl shadow-lg backdrop-blur-sm"
            >
              <h4 className="font-semibold text-slate-700 mb-3">Round #{Number(activeRound[0])} Status</h4>
              <div className="space-y-2 text-slate-600">
                <p className="font-medium text-blue-600">Time Remaining: {timeRemaining}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Team YES</p>
                    <p className="text-sm">
                      {yesTeamStakes ? Number(formatEther(yesTeamStakes)).toFixed(6) : '0.000000'} ETH
                    </p>
                    <p className="text-sm">
                      {teamParticipants ? Number(teamParticipants[1]) : 0} participants
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Team NO</p>
                    <p className="text-sm">
                      {noTeamStakes ? Number(formatEther(noTeamStakes)).toFixed(6) : '0.000000'} ETH
                    </p>
                    <p className="text-sm">
                      {teamParticipants ? Number(teamParticipants[2]) : 0} participants
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}

