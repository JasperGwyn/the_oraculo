'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'framer-motion'
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from 'wagmi'
import { RoundManagerABI } from '@/config/abis/RoundManager'
import { roundManagerAddress } from '@/config/contracts'
import { parseEther } from 'viem'
import { Team } from '@/lib/types/contracts'
import { modeNetwork } from '@/config/chains'

interface BetPlacementProps {
  onBetPlaced: (amount: number) => void;
  team: 'YES' | 'NO';
}

export default function BetPlacement({ onBetPlaced, team }: BetPlacementProps) {
  const [betAmount, setBetAmount] = useState('')
  const [error, setError] = useState('')
  const { address } = useAccount()

  // Get active round data
  const { data: activeRound } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'getActiveRound',
  })

  const { writeContract, data: hash, isPending: isPlacingBet, error: writeError } = useWriteContract()
  const { 
    isLoading: isConfirming, 
    isSuccess,
    isError: isTransactionError,
    error: transactionError,
    data: receipt
  } = useWaitForTransactionReceipt({ hash })

  // Efecto para manejar el éxito de la transacción
  useEffect(() => {
    if (isSuccess && receipt) {
      console.log('Transaction successful:', {
        hash: receipt.transactionHash,
        status: receipt.status,
        blockNumber: receipt.blockNumber
      })
      const amount = parseFloat(betAmount);
      onBetPlaced(amount);
    }
  }, [isSuccess, receipt, betAmount, onBetPlaced]);

  // Efecto para manejar errores de transacción
  useEffect(() => {
    if (transactionError) {
      console.error('Transaction failed:', transactionError)
      // Extract revert reason if available
      const revertReason = transactionError?.message?.match(/reason="([^"]+)"/)?.[1]
      if (revertReason) {
        setError(`Transaction reverted: ${revertReason}`)
      } else {
        setError('Transaction failed. Check console for details.')
      }
    }
  }, [transactionError]);

  // Efecto para manejar errores de escritura
  useEffect(() => {
    if (writeError) {
      console.error('Write error:', writeError)
      const errorMessage = writeError?.message || 'Unknown error occurred'
      setError(errorMessage)
    }
  }, [writeError])

  const handleBet = async () => {
    setError('') // Clear previous errors
    
    if (!address) {
      setError('🔮 The Oraculo cannot sense your presence. Connect your wallet to channel your energy into the prophecy.')
      return
    }

    if (!activeRound || Number(activeRound[0]) === 0) {
      setError('🌌 The cosmic forces are realigning... The next round of prophecies shall begin when the stars align. Your destiny awaits in the next round.')
      return
    }

    const amount = parseFloat(betAmount);
    if (!isNaN(amount) && amount > 0) {
      try {
        // Convertir el equipo a enum Team
        const teamEnum = team === 'YES' ? Team.Yes : Team.No

        // Llamar a placeBet en el contrato
        await writeContract({
          address: roundManagerAddress,
          abi: RoundManagerABI,
          functionName: 'placeBet',
          args: [activeRound[0], teamEnum],
          value: parseEther(betAmount),
          chain: modeNetwork,
          account: address,
        })

        console.log(`Placing bet of ${amount} ETH on team ${team} in round ${activeRound[0].toString()}`)
      } catch (err: any) {
        console.error('Error placing bet:', err)
        const errorMessage = err?.message || 'Failed to place bet. Please try again.'
        setError(errorMessage)
      }
    } else {
      setError('Please enter a valid bet amount')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetAmount(e.target.value)
    setError('')
  }

  const getButtonText = () => {
    if (isPlacingBet) return 'Confirm in Wallet...'
    if (isConfirming) return 'Confirming Transaction...'
    if (isSuccess) return 'Bet Placed Successfully!'
    if (isTransactionError) return 'Transaction Failed'
    return 'Place Bet'
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
              disabled={isPlacingBet || isConfirming}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
              ETH
            </span>
          </div>
          <Button
            onClick={handleBet}
            disabled={isPlacingBet || isConfirming}
            className={`bg-gradient-to-r from-orange-400 to-blue-500 hover:from-orange-500 hover:to-blue-600 
              text-white py-2 text-base rounded-xl transform transition-transform hover:scale-105
              ${isTransactionError ? 'from-red-400 to-red-500' : ''}`}
          >
            {getButtonText()}
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
          {hash && (
            <div className="text-sm text-slate-600">
              Transaction Hash: <span className="font-mono">{hash}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

