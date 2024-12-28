'use client'

import * as React from 'react'
import {
  type BaseError,
  useWaitForTransactionReceipt,
  useWriteContract,
  useAccount,
  useChainId,
  useConnect,
  useConfig
} from 'wagmi'
import { parseEther } from 'viem'
import { abi } from './abi'
import { modeNetwork } from '@/config/chains'

export function PlaceBet() {
  const config = useConfig()
  const { writeContract, isPending, data: hash, error } = useWriteContract()
  const { address, isConnected, connector: activeConnector } = useAccount()
  const chainId = useChainId()
  const { connect, connectors, status: connectStatus } = useConnect()

  // Log initial state
  React.useEffect(() => {
    console.log('Initial connection state:', {
      isConnected,
      connectStatus,
      chainId,
      activeConnector: activeConnector ? {
        name: activeConnector.name,
        id: activeConnector.id,
        type: activeConnector.type,
        methods: Object.keys(activeConnector),
      } : null,
      availableConnectors: connectors.map(c => ({
        name: c.name,
        id: c.id,
        type: c.type,
        methods: Object.keys(c)
      }))
    })
  }, [isConnected, connectStatus, chainId, activeConnector, connectors])

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    console.log('Submit called with connection status:', {
      isConnected,
      connectStatus,
      chainId,
      activeConnector: activeConnector ? {
        name: activeConnector.name,
        id: activeConnector.id,
        type: activeConnector.type,
        methods: Object.keys(activeConnector)
      } : null
    })

    if (!isConnected) {
      console.log('Connecting wallet through AppKit...')
      try {
        const selectedConnector = connectors[0]
        console.log('Selected connector:', {
          name: selectedConnector.name,
          id: selectedConnector.id,
          type: selectedConnector.type,
          methods: Object.keys(selectedConnector)
        })
        await connect({ connector: selectedConnector })
      } catch (err) {
        console.error('Error connecting through AppKit:', err)
        return
      }
      return
    }

    const formData = new FormData(e.target as HTMLFormElement)
    const team = formData.get('team') as string
    const amount = formData.get('amount') as string

    try {
      console.log('Attempting to place bet with params:', {
        address: process.env.NEXT_PUBLIC_ROUNDMANAGER_ADDRESS,
        team: Number(team),
        amount,
        roundId: 1,
        chain: modeNetwork.name,
        userAddress: address,
        chainId,
        connectStatus,
        activeConnector: activeConnector ? {
          name: activeConnector.name,
          id: activeConnector.id,
          type: activeConnector.type
        } : null,
        config: {
          chains: config.chains.map(c => c.id)
        }
      })

      const result = await writeContract({
        abi,
        address: process.env.NEXT_PUBLIC_ROUNDMANAGER_ADDRESS as `0x${string}`,
        functionName: 'placeBet',
        args: [BigInt(3), Number(team)],
        value: parseEther(amount),
        chain: modeNetwork,
        account: address as `0x${string}`
      })

      console.log('Transaction result:', result)

      if (!hash) {
        console.log('Waiting for transaction hash...')
      }
    } catch (err) {
      console.error('Error in submit:', err instanceof Error ? err.message : 'Unknown error', {
        error: err,
        errorType: err instanceof Error ? 'Error' : typeof err,
        errorKeys: err instanceof Error ? Object.keys(err) : null
      })
      throw err
    }
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-100 rounded space-y-2 text-sm text-black">
        <div>Address: {address || 'Not connected'}</div>
        <div>ChainId: {chainId || 'Unknown'}</div>
        <div>Expected ChainId: {modeNetwork.id}</div>
        <div>Contract: {process.env.NEXT_PUBLIC_ROUNDMANAGER_ADDRESS}</div>
        <div>Connection Status: {connectStatus}</div>
        <div>Active Connector: {activeConnector?.name || 'None'}</div>
        <div>Available Connectors: {connectors.map(c => c.name).join(', ')}</div>
        <div>Config Chains: {config.chains.map(c => c.id).join(', ')}</div>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-black">
            Team (1 or 2)
            <input
              name="team"
              type="number"
              defaultValue={1}
              min="1"
              max="2"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"
            />
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-black">
            Amount (ETH)
            <input
              name="amount"
              type="number"
              defaultValue={0.000001}
              step="0.000001"
              min="0.000001"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"
            />
          </label>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {!isConnected
            ? 'Connect Wallet'
            : isPending
              ? 'Confirming...'
              : 'Place Bet'}
        </button>

        {hash && (
          <div className="p-2 bg-green-100 rounded text-black">
            Transaction Hash: <span className="font-mono">{hash}</span>
          </div>
        )}
        {isConfirming && (
          <div className="p-2 bg-yellow-100 rounded text-black">
            Waiting for confirmation...
          </div>
        )}
        {isConfirmed && (
          <div className="p-2 bg-green-100 rounded text-black">
            Transaction confirmed.
          </div>
        )}
        {error && (
          <div className="p-2 bg-red-100 text-red-700 rounded">
            <div className="font-bold">Error:</div>
            <div className="font-mono text-sm">
              {(error as BaseError).shortMessage || error.message}
            </div>
          </div>
        )}
      </form>
    </div>
  )
}