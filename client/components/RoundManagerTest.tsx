'use client'

import { useRoundManager } from '@/lib/hooks/useRoundManager'
import { useAccount } from 'wagmi'
import { Team } from '@/lib/types/contracts'
import { useState } from 'react'
import { formatEther } from 'viem'

// Helper function to convert BigInts to strings in an object
const convertBigIntsToString = (obj: any): any => {
  if (obj === null) return null
  if (typeof obj !== 'object') {
    return typeof obj === 'bigint' ? obj.toString() : obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertBigIntsToString(item))
  }

  const converted: any = {}
  for (const key in obj) {
    if (typeof obj[key] === 'bigint') {
      converted[key] = obj[key].toString()
    } else if (typeof obj[key] === 'object') {
      converted[key] = convertBigIntsToString(obj[key])
    } else {
      converted[key] = obj[key]
    }
  }
  return converted
}

export function RoundManagerTest() {
  const { address } = useAccount()
  const {
    currentRound,
    isLoadingRound,
    submitBet,
    isPlacingBet,
    reward,
    isLoadingReward,
    hash,
    isConfirming,
    isConfirmed,
    userBet,
    isLoadingUserBet,
    yesTeamStakes,
    noTeamStakes,
    isLoadingYesTeamStakes,
    isLoadingNoTeamStakes,
    yesTeamParticipants,
    noTeamParticipants,
    isLoadingYesTeamParticipants,
    isLoadingNoTeamParticipants,
    participants,
    isLoadingParticipants,
  } = useRoundManager()

  const [betAmount, setBetAmount] = useState('0.01')
  const [error, setError] = useState<string>()
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    console.log(`[${timestamp}] ${message}`)
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
  }

  if (isLoadingRound) {
    return <div className="p-4 text-black">Loading round data...</div>
  }

  const handleBet = async (team: Team) => {
    try {
      setError(undefined)
      addLog(`Attempting to place bet: ${betAmount} ETH on team ${team}`)
      addLog(`Contract params: roundId=${currentRound?.id || 'unknown'}, team=${team}, amount=${betAmount} ETH`)

      const tx = await submitBet(team, betAmount)
      addLog(`Transaction submitted with hash: ${tx}`)
      addLog('Waiting for confirmation...')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to place bet'
      const errorDetails = err instanceof Error ? err.stack : JSON.stringify(err)
      setError(`${errorMessage}\n\nDetails:\n${errorDetails}`)
      addLog(`Error: ${errorMessage}`)
      console.error('Detailed error:', err)
    }
  }

  // Effect to track transaction status
  if (hash && isConfirming) {
    addLog(`Transaction ${hash} is being confirmed...`)
  }
  if (hash && isConfirmed) {
    addLog(`Transaction ${hash} has been confirmed!`)
  }

  const roundData = currentRound ? {
    id: currentRound.id.toString(),
    status: currentRound.status,
    totalStaked: `${formatEther(currentRound.totalStaked)} ETH`,
    endTime: new Date(Number(currentRound.endTime) * 1000).toLocaleString(),
    rawData: convertBigIntsToString(currentRound)
  } : null

  return (
    <div className="p-4 max-w-4xl mx-auto text-black">
      <h2 className="text-2xl font-bold mb-4">Contract Test Interface</h2>

      {/* Wallet Status */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">Wallet Status</h3>
        {address ? (
          <div className="font-mono text-sm">Connected: {address}</div>
        ) : (
          <div className="text-red-600">Not connected</div>
        )}
      </div>

      {/* Current Round */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">Current Round Data</h3>
        {roundData ? (
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {JSON.stringify(roundData, null, 2)}
          </pre>
        ) : (
          <div>No round data available</div>
        )}
      </div>

      {/* Team Stats */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">Team Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Team YES</h4>
            {isLoadingYesTeamStakes || isLoadingYesTeamParticipants ? (
              <div>Loading...</div>
            ) : (
              <div>
                <div>Stakes: {yesTeamStakes ? formatEther(yesTeamStakes) : '0'} ETH</div>
                <div>Participants: {yesTeamParticipants?.toString() || '0'}</div>
              </div>
            )}
          </div>
          <div>
            <h4 className="font-semibold mb-2">Team NO</h4>
            {isLoadingNoTeamStakes || isLoadingNoTeamParticipants ? (
              <div>Loading...</div>
            ) : (
              <div>
                <div>Stakes: {noTeamStakes ? formatEther(noTeamStakes) : '0'} ETH</div>
                <div>Participants: {noTeamParticipants?.toString() || '0'}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Your Bet */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">Your Current Bet</h3>
        {isLoadingUserBet ? (
          <div>Loading your bet...</div>
        ) : userBet ? (
          <div>
            <div>Amount: {formatEther(userBet.amount)} ETH</div>
            <div>Team: {Team[userBet.team]}</div>
            <div>Claimed: {userBet.claimed ? 'Yes' : 'No'}</div>
          </div>
        ) : (
          <div>No active bet</div>
        )}
      </div>

      {/* Rewards */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">Your Rewards</h3>
        {isLoadingReward ? (
          <div>Loading rewards...</div>
        ) : (
          <div className="font-mono">
            {reward ? `${formatEther(reward)} ETH` : 'No rewards'}
          </div>
        )}
      </div>

      {/* Place Bet */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">Place Bet</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="betAmount" className="block mb-1">Amount (ETH)</label>
            <input
              type="number"
              id="betAmount"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              step="0.001"
              min="0.001"
              className="border p-2 rounded w-48 text-black"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => handleBet(Team.Yes)}
              disabled={isPlacingBet || !address}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {isPlacingBet ? 'Placing Bet...' : `Bet on YES`}
            </button>

            <button
              onClick={() => handleBet(Team.No)}
              disabled={isPlacingBet || !address}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {isPlacingBet ? 'Placing Bet...' : `Bet on NO`}
            </button>
          </div>
        </div>
      </div>

      {/* Participants */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">All Participants</h3>
        {isLoadingParticipants ? (
          <div>Loading participants...</div>
        ) : participants && participants.length > 0 ? (
          <div className="font-mono text-sm max-h-40 overflow-y-auto">
            {participants.map((participant, index) => (
              <div key={index}>{participant}</div>
            ))}
          </div>
        ) : (
          <div>No participants yet</div>
        )}
      </div>

      {/* Transaction Status */}
      {hash && (
        <div className="mb-6 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">Transaction Status</h3>
          <div className="font-mono text-sm">
            <div>Transaction Hash: {hash}</div>
            <div>Status: {isConfirming ? 'Confirming...' : isConfirmed ? 'Confirmed!' : 'Pending'}</div>
          </div>
        </div>
      )}

      {/* Transaction Logs */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">Transaction Logs</h3>
        <div className="font-mono text-sm bg-black text-green-400 p-4 rounded max-h-60 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-gray-500">No transactions yet</div>
          ) : (
            logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-bold mb-2">Error</h3>
          <pre className="whitespace-pre-wrap font-mono text-sm overflow-x-auto">{error}</pre>
        </div>
      )}
    </div>
  )
}