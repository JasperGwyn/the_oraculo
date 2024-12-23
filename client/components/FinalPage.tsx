import { Clock, Users, Coins } from 'lucide-react'

interface TeamData {
  name: string
  ethAmount: number
  participants: number
  messages: string[]
}

interface FinalPageProps {
  teams: TeamData[]
  currentRound: number
  timeRemaining: string
}

export default function FinalPage({ teams, currentRound, timeRemaining }: FinalPageProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-700">Round Summary</h2>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center text-slate-600">
            <Users className="w-4 h-4 mr-1" />
            <span>Round {currentRound}</span>
          </div>
          <div className="flex items-center text-slate-600">
            <Clock className="w-4 h-4 mr-1" />
            <span>{timeRemaining}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {teams.map((team) => (
          <div key={team.name} className="space-y-2">
            <h3 className="text-lg font-bold text-slate-700">Team {team.name}</h3>
            <div className="bg-white/50 rounded-xl p-3 space-y-1 text-sm">
              <p className="font-semibold text-slate-600">
                <Users className="w-4 h-4 inline-block mr-1" />
                Participants: {team.participants}
              </p>
              <p className="font-semibold text-slate-600">
                <Coins className="w-4 h-4 inline-block mr-1" />
                ETH Bet: {team.ethAmount} ETH
              </p>
            </div>
            <div className="bg-white/50 rounded-xl p-3 max-h-40 overflow-y-auto">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Messages:</h4>
              <ul className="space-y-1 text-xs">
                {team.messages.map((message, index) => (
                  <li key={index} className="text-slate-600 p-1 bg-white/30 rounded-lg">
                    {message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

