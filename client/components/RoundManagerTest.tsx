'use client'

import { useRoundManager } from '@/lib/hooks/useRoundManager'
import { useAccount } from 'wagmi'
import { Team } from '@/lib/types/contracts'
import { useState } from 'react'
import { formatEther } from 'viem'

export function RoundManagerTest() {
  const { address } = useAccount()
  const {
    currentRound,
    isLoadingRound,
    submitBet,
    isPlacingBet,
    reward,
    isLoadingReward
  } = useRoundManager()

  const [betAmount, setBetAmount] = useState('0.01')
  const [error, setError] = useState<string>()

  if (isLoadingRound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 to-red-600 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    )
  }

  const handleBet = async (team: Team) => {
    try {
      setError(undefined)
      await submitBet(team, betAmount)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place bet')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-red-600 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold mb-8 text-white">Round Manager</h2>

          <div className="space-y-8">
            {/* Wallet Status */}
            <div className="bg-white/5 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-white">Wallet Status</h3>
              {address ? (
                <div className="bg-green-500/20 text-green-100 px-4 py-3 rounded-xl">
                  <p className="font-mono text-sm break-all">Connected: {address}</p>
                </div>
              ) : (
                <div className="bg-red-500/20 text-red-100 px-4 py-3 rounded-xl">
                  <p>Not connected</p>
                </div>
              )}
            </div>

            {/* Current Round */}
            <div className="bg-white/5 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-white">Current Round</h3>
              {currentRound ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-white/60 text-sm">Round ID</p>
                    <p className="text-white text-lg font-semibold">{currentRound.id.toString()}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-white/60 text-sm">Status</p>
                    <p className="text-white text-lg font-semibold">{currentRound.status}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-white/60 text-sm">Total Staked</p>
                    <p className="text-white text-lg font-semibold">
                      {formatEther(currentRound.totalStaked)} ETH
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-white/60 text-sm">End Time</p>
                    <p className="text-white text-lg font-semibold">
                      {new Date(Number(currentRound.endTime) * 1000).toLocaleString()}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-white/60">No round data available</p>
              )}
            </div>

            {/* Rewards */}
            <div className="bg-white/5 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-white">Your Rewards</h3>
              {isLoadingReward ? (
                <div className="animate-pulse bg-white/10 h-10 rounded-xl"></div>
              ) : (
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-white text-lg">
                    {reward ? `${formatEther(reward)} ETH` : 'No rewards'}
                  </p>
                </div>
              )}
            </div>

            {/* Place Bet */}
            <div className="bg-white/5 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-white">Place Bet</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="betAmount" className="block text-sm font-medium text-white/80 mb-2">
                    Amount (ETH)
                  </label>
                  <input
                    type="number"
                    id="betAmount"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    step="0.001"
                    min="0.001"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleBet(Team.Yes)}
                    disabled={isPlacingBet || !address}
                    className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:hover:bg-green-500 text-white font-semibold px-6 py-4 rounded-xl transition-colors"
                  >
                    {isPlacingBet ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                        Placing Bet...
                      </span>
                    ) : (
                      `Bet ${betAmount} ETH on YES`
                    )}
                  </button>

                  <button
                    onClick={() => handleBet(Team.No)}
                    disabled={isPlacingBet || !address}
                    className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:hover:bg-red-500 text-white font-semibold px-6 py-4 rounded-xl transition-colors"
                  >
                    {isPlacingBet ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                        Placing Bet...
                      </span>
                    ) : (
                      `Bet ${betAmount} ETH on NO`
                    )}
                  </button>
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500/40 text-red-100 px-4 py-3 rounded-xl mt-4">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}