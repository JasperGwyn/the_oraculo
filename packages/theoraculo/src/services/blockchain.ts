import { createPublicClient, http } from 'viem';
import { mode } from 'viem/chains';
import { Round, RoundManager } from '../types/contracts';
import { RoundManagerABI } from '../config/abis/RoundManager';

export interface RoundStats {
  yesParticipants: number;
  noParticipants: number;
  yesStaked: bigint;
  noStaked: bigint;
}

export async function getRoundStats(roundId: number): Promise<RoundStats> {
  try {
    console.log('Fetching stats for round:', roundId);

    const networkUrl = process.env.MODE_NETWORK_URL || 'https://mainnet.mode.network';
    const contractAddress = process.env.NEXT_PUBLIC_ROUNDMANAGER_ADDRESS;

    console.log('Contract address:', contractAddress);
    console.log('Network URL:', networkUrl);

    if (!contractAddress) {
      throw new Error('NEXT_PUBLIC_ROUNDMANAGER_ADDRESS not set');
    }

    console.log('Creating Viem client...');
    const client = createPublicClient({
      chain: mode,
      transport: http(networkUrl),
    });

    console.log('Setting up contract config...');
    const contract = {
      address: contractAddress as `0x${string}`,
      abi: RoundManagerABI,
    } as const;

    console.log('Fetching round data...');
    const [
      id,
      status,
      startTime,
      endTime,
      totalStaked,
      winningTeam,
      platformFee,
      distributionType
    ] = await client.readContract({
      ...contract,
      functionName: 'rounds',
      args: [BigInt(roundId)],
    });

    const roundData: Round = {
      id,
      status,
      startTime,
      endTime,
      totalStaked,
      winningTeam,
      platformFee,
      distributionType
    };

    console.log('Round data received:', roundData);

    // TODO: Implement proper mapping once we have the real contract structure
    // For now we'll return mock data to test the connection
    return {
      yesParticipants: 10,
      noParticipants: 8,
      yesStaked: BigInt(1000),
      noStaked: BigInt(800),
    };

  } catch (error) {
    console.log('Detailed error in getRoundStats:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw new Error('Failed to get round statistics');
  }
}