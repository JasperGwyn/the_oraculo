'use client'

import { WalletStatus } from './components/WalletStatus'
import { RoundInfo } from './components/RoundInfo'
import { PlaceBet } from './components/PlaceBet'
import { ClaimRewards } from './components/ClaimRewards'
import { CreateRound } from './components/CreateRound'
import { CompleteRound } from './components/CompleteRound'
import { WithdrawFees } from './components/WithdrawFees'

export default function Test3() {
  return (
    <div className="container mx-auto p-4 space-y-8 bg-gray-400">
      <h1 className="text-2xl font-bold text-black mb-4">Round Manager Test</h1>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-black mb-4">Wallet Status</h2>
        <WalletStatus />
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-black mb-4">Round Info</h2>
        <RoundInfo />
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-black mb-4">Place Bet</h2>
        <PlaceBet />
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-black mb-4">Claim Rewards</h2>
        <ClaimRewards />
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-black mb-4">Create Round</h2>
        <CreateRound />
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-black mb-4">Complete Round</h2>
        <CompleteRound />
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-black mb-4">Withdraw Fees</h2>
        <WithdrawFees />
      </div>
    </div>
  )
}