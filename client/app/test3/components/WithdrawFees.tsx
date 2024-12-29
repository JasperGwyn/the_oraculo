'use client'

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { RoundManagerABI } from '@/config/abis/RoundManager'
import { roundManagerAddress } from '@/config/contracts'
import { useAccount, useChainId } from 'wagmi'
import { modeNetwork } from '@/config/chains'

export function WithdrawFees() {
  const { address } = useAccount()
  const chainId = useChainId()
  const { data: hash, writeContract, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleWithdraw = async () => {
    try {
      console.log('Withdrawing fees')

      await writeContract({
        address: roundManagerAddress,
        abi: RoundManagerABI,
        functionName: 'withdrawPlatformFees',
        chain: modeNetwork,
        account: address,
      })
    } catch (error) {
      console.error('Error withdrawing fees:', error)
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleWithdraw}
        disabled={isPending || isConfirming}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isPending ? 'Confirming in wallet...' :
         isConfirming ? 'Confirming transaction...' :
         isSuccess ? 'Fees withdrawn successfully!' :
         'Withdraw Fees'}
      </button>

      {hash && (
        <div className="text-sm text-black">
          <span className="font-semibold">Transaction Hash: </span>
          <span className="font-mono">{hash}</span>
        </div>
      )}
    </div>
  )
}