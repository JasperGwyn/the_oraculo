import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { RoundManagerABI } from '@/config/abis/RoundManager'
import { Round, Team } from '../types/contracts'
import { parseEther } from 'viem'
import { modeNetwork } from '@/config/chains'

export function useRoundManager() {
  const { address } = useAccount()
  const contractAddress = process.env.NEXT_PUBLIC_ROUNDMANAGER_ADDRESS as `0x${string}`

  // Read current round
  const { data: currentRound, isPending: isLoadingRound } = useReadContract({
    address: contractAddress,
    abi: RoundManagerABI,
    functionName: 'rounds',
    args: [BigInt(1)],
  })

  // Calculate rewards
  const { data: reward, isPending: isLoadingReward } = useReadContract({
    address: contractAddress,
    abi: RoundManagerABI,
    functionName: 'calculateReward',
    args: address ? [BigInt(1), address] : undefined,
    query: {
      enabled: !!address,
    }
  })

  // Setup contract write hooks
  const { writeContract, isPending: isPlacingBet, data: hash } = useWriteContract()

  // Watch for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const submitBet = async (team: Team, amount: string) => {
    if (!address) throw new Error('Wallet not connected')

    console.log('Attempting to place bet with params:', {
      address: contractAddress,
      team,
      amount,
      roundId: 1,
      chain: modeNetwork.name,
      userAddress: address
    })

    try {
      await writeContract({
        abi: RoundManagerABI,
        address: contractAddress,
        functionName: 'placeBet',
        args: [BigInt(1), team],
        value: parseEther(amount),
        chain: modeNetwork,
        account: address,
      })

      // Return the hash from the hook's data
      if (!hash) {
        console.log('No transaction hash available yet')
      }
      return hash

    } catch (error) {
      console.error('Error in submitBet:', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        params: {
          address: contractAddress,
          team,
          amount,
          roundId: 1,
          chain: modeNetwork.name
        }
      })
      throw error
    }
  }

  const claim = async () => {
    if (!address) throw new Error('Wallet not connected')

    console.log('Attempting to claim rewards:', {
      address: contractAddress,
      roundId: 1,
      userAddress: address,
      chain: modeNetwork.name
    })

    try {
      await writeContract({
        abi: RoundManagerABI,
        address: contractAddress,
        functionName: 'claimRewards',
        args: [BigInt(1)],
        chain: modeNetwork,
        account: address,
      })

      // Return the hash from the hook's data
      if (!hash) {
        console.log('No transaction hash available yet')
      }
      return hash

    } catch (error) {
      console.error('Error in claim:', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    }
  }

  const formatRound = (data: typeof currentRound): Round | undefined => {
    if (!data) return undefined

    return {
      id: data[0],
      status: data[1],
      startTime: data[2],
      endTime: data[3],
      totalStaked: data[4],
      winningTeam: data[5],
      platformFee: data[6],
      distributionType: data[7],
    }
  }

  return {
    currentRound: formatRound(currentRound),
    isLoadingRound,
    submitBet,
    isPlacingBet,
    claim,
    isClaimingRewards: false,
    reward,
    isLoadingReward,
    hash,
    isConfirming,
    isConfirmed
  }
}