'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'framer-motion'

export default function BetPlacement({ onBetPlaced }: { onBetPlaced: (amount: number) => void }) {
  const [betAmount, setBetAmount] = useState('')
  const [error, setError] = useState('')

  const handleBet = () => {
    const amount = parseFloat(betAmount);
    if (!isNaN(amount) && amount > 0) {
      console.log(`Placing bet of ${amount} ETH`)
      onBetPlaced(amount)
      setError('')
    } else {
      setError('Please enter a valid bet amount')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetAmount(e.target.value)
    setError('')
  }

  return (
    <div className="text-center">
      <h3 className="text-xl font-bold mb-4 text-slate-700">Place Your Bet:</h3>
      <div className="max-w-sm mx-auto">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Input
              type="number"
              value={betAmount}
              onChange={handleInputChange}
              placeholder="Enter amount in ETH"
              min="0.000001"
              step="0.000001"
              className="text-base py-2 pr-12 rounded-xl border-blue-300 bg-white/90 text-slate-800 placeholder-slate-500"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
              ETH
            </span>
          </div>
          <Button
            onClick={handleBet}
            className="bg-gradient-to-r from-orange-400 to-blue-500 hover:from-orange-500 hover:to-blue-600 text-white py-2 text-base rounded-xl transform transition-transform hover:scale-105"
          >
            Place Bet
          </Button>
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500 bg-red-100 border border-red-300 rounded-lg p-2 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

