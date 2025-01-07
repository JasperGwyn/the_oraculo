'use client'

import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { modal } from '@/context'
import { useReadContract } from 'wagmi'
import { RoundManagerABI } from '@/config/abis/RoundManager'
import { roundManagerAddress } from '@/config/contracts'
import { formatEther } from 'viem'
import { RoundStatus, Team } from '@/lib/types/contracts'

export default function TeamSelection({ onParticipate }: { onParticipate: () => void }) {
  const [mounted, setMounted] = useState(false)
  const { isConnected } = useAccount()
  const [timeRemaining, setTimeRemaining] = useState<string>('')

  // Get active round data
  const { data: activeRound, isLoading: isLoadingRound } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'getActiveRound',
  })

  // Effect to update time remaining
  useEffect(() => {
    if (!activeRound || Number(activeRound[0]) === 0) return // No active round

    const updateTimeRemaining = () => {
      const now = Math.floor(Date.now() / 1000)
      const endTime = Number(activeRound[3]) // endTime is at index 3
      const remaining = endTime - now

      if (remaining <= 0) {
        setTimeRemaining('Ended')
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

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClick = async () => {
    if (!isConnected) {
      try {
        await modal.open()
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      }
    } else {
      onParticipate()
    }
  }

  // Prevent hydration issues
  if (!mounted) {
    return (
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4"
        >
          <h3 className="text-xl font-bold text-slate-700 mb-4">Ready to Join?</h3>
          <div className="flex flex-col items-center">
            <motion.button
              className="px-8 py-2 rounded-full text-lg font-bold
                bg-gray-200 border-2 border-white
                text-slate-700 shadow-lg
                transition-all mb-4
                cursor-not-allowed opacity-75"
            >
              Connect to Participate
            </motion.button>
            <div className="text-sm text-slate-600">
              <p>Connect your wallet to participate</p>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4"
      >
        <h3 className="text-xl font-bold text-slate-700 mb-4">Ready to Join?</h3>
        <div className="flex flex-col items-center">
          <motion.button
            whileHover={{ scale: isConnected ? 1.05 : 1 }}
            whileTap={{ scale: isConnected ? 0.95 : 1 }}
            onClick={handleClick}
            className={`px-8 py-2 rounded-full text-lg font-bold
              ${isConnected ? 'bg-white hover:bg-slate-50' : 'bg-gray-200'}
              border-2 border-white
              text-slate-700 shadow-lg
              hover:shadow-xl
              transition-all mb-4
              ${!isConnected && 'cursor-not-allowed opacity-75'}`}
          >
            {isConnected ? 'Participate' : 'Connect to Participate'}
          </motion.button>
          <div className="text-sm text-slate-600">
            {isLoadingRound ? (
              <p>Loading round information...</p>
            ) : activeRound && Number(activeRound[0]) > 0 ? (
              <>
                <p>Current Round: {activeRound[0].toString()}</p>
                <p>Time Remaining: {timeRemaining}</p>
                <p>Total Bets: {formatEther(activeRound[4])} ETH</p>
              </>
            ) : (
              <p>No active round found</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

