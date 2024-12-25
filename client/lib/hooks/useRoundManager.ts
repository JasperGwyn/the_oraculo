import { useAccount, useReadContract, useWriteContract, useSimulateContract } from 'wagmi'
import { RoundManagerABI } from '@/config/abis/RoundManager'
import { Round, Team } from '../types/contracts'
import { parseEther } from 'viem'

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

  const { writeContract: placeBet, isPending: isPlacingBet } = useWriteContract()
  const { writeContract: claimRewards, isPending: isClaimingRewards } = useWriteContract()

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

  const submitBet = async (team: Team, amount: string) => {
    if (!address) throw new Error('Wallet not connected')

    // Simulate the bet with actual parameters
    const { data: simulateBet } = await useSimulateContract.simulate({
      address: contractAddress,
      abi: RoundManagerABI,
      functionName: 'placeBet',
      args: [BigInt(1), team],
      value: parseEther(amount),
    })

    if (!simulateBet?.request) {
      throw new Error('Failed to simulate bet. Please try again.')
    }

    return placeBet(simulateBet.request)
  }

  const claim = async () => {
    if (!address) throw new Error('Wallet not connected')

    // Simulate the claim with actual parameters
    const { data: simulateClaim } = await useSimulateContract.simulate({
      address: contractAddress,
      abi: RoundManagerABI,
      functionName: 'claimRewards',
      args: [BigInt(1)],
    })

    if (!simulateClaim?.request) {
      throw new Error('Failed to simulate claim. Please try again.')
    }

    return claimRewards(simulateClaim.request)
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
    isClaimingRewards,
    reward,
    isLoadingReward,
  }
}