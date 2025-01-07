import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { RoundManagerABI } from '@/config/abis/RoundManager'
import { Round, Team, UserBet } from '../types/contracts'
import { parseEther } from 'viem'
import { modeNetwork } from '@/config/chains'
import { roundManagerAddress } from '@/config/contracts'

export function useRoundManager() {
  const { address } = useAccount()

  console.log('Using contract address:', roundManagerAddress)

  // Read current round
  const { data: currentRound, isPending: isLoadingRound } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'rounds',
    args: [BigInt(1)],
  })

  // Calculate rewards
  const { data: reward, isPending: isLoadingReward } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'calculateReward',
    args: address ? [BigInt(1), address] : undefined,
    query: {
      enabled: !!address,
    }
  })

  // Get user bet
  const { data: userBet, isPending: isLoadingUserBet } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'getUserBet',
    args: address ? [BigInt(1), address] : undefined,
    query: {
      enabled: !!address,
    }
  })

  // Get team stakes
  const { data: yesTeamStakes, isPending: isLoadingYesTeamStakes } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'getTeamStakes',
    args: [BigInt(1), Team.Yes as number],
  })

  const { data: noTeamStakes, isPending: isLoadingNoTeamStakes } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'getTeamStakes',
    args: [BigInt(1), Team.No as number],
  })

  // Get team participants
  const { data: yesTeamParticipants, isPending: isLoadingYesTeamParticipants } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'getTeamParticipants',
    args: [BigInt(1), Team.Yes as number],
  })

  const { data: noTeamParticipants, isPending: isLoadingNoTeamParticipants } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'getTeamParticipants',
    args: [BigInt(1), Team.No as number],
  })

  // Get all participants
  const { data: participants, isPending: isLoadingParticipants } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'getParticipants',
    args: [BigInt(1)],
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
      address: roundManagerAddress,
      team,
      amount,
      roundId: 1,
      chain: modeNetwork.name,
      userAddress: address
    })

    try {
      await writeContract({
        abi: RoundManagerABI,
        address: roundManagerAddress,
        functionName: 'placeBet',
        args: [BigInt(1), team as number],
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
          address: roundManagerAddress,
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
      address: roundManagerAddress,
      roundId: 1,
      userAddress: address,
      chain: modeNetwork.name
    })

    try {
      await writeContract({
        abi: RoundManagerABI,
        address: roundManagerAddress,
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

  const formatUserBet = (data: typeof userBet): UserBet | undefined => {
    if (!data) return undefined

    return {
      amount: data[0],
      team: data[1],
      claimed: data[2],
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
    isConfirmed,
    // New data
    userBet: formatUserBet(userBet),
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
  }
}