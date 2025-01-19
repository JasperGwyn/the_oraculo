'use client'

import { motion } from 'framer-motion'
import { useAccount, useReadContract } from 'wagmi'
import { useEffect, useState } from 'react'
import { modal } from '@/context'
import { RoundManagerABI } from '@/config/abis/RoundManager'
import { roundManagerAddress } from '@/config/contracts'
import { formatEther } from 'viem'
import { RoundStatus, Team } from '@/lib/types/contracts'

export default function TeamSelection({ onParticipate }: { onParticipate: () => void }) {
  const { isConnected, address } = useAccount()

  const { data: activeRound } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'getActiveRound',
  })

  // Get user bet for active round
  const { data: userBet } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'getUserBet',
    args: activeRound && address ? [activeRound[0], address] : undefined,
    query: {
      enabled: !!activeRound && !!address,
    }
  })

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
        )}
      </div>
    </div>
  )
}

