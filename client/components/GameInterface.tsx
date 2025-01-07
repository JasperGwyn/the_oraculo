'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { modal } from '@/context'
import Oraculo from './Oraculo'
import QuestionDisplay from './QuestionDisplay'
import TeamSelection from './TeamSelection'
import BetPlacement from './BetPlacement'
import MessageSubmission from './MessageSubmission'
import FinalPage from './FinalPage'
import WinnerPage from './WinnerPage'
import { Tabs, TabsContent } from "@/components/ui/tabs"

export default function GameInterface() {
  const [gamePhase, setGamePhase] = useState('selection')
  const [selectedTeam, setSelectedTeam] = useState<'YES' | 'NO' | null>(null)
  const [assignedTeam, setAssignedTeam] = useState<'YES' | 'NO' | null>(null)
  const [userMessage, setUserMessage] = useState('');
  const [userBet, setUserBet] = useState(0);
  const { isConnected } = useAccount()

  const question = "Should AI assistants only communicate in pirate speak on International Talk Like a Pirate Day?"
  const oraculoPersonality = "Sarcastic"

  const handleParticipate = async () => {
    if (!isConnected) {
      try {
        await modal.open()
        return
      } catch (error) {
        console.error('Failed to connect wallet:', error)
        return
      }
    }

    // Simulate oracle team assignment - this should be replaced with actual oracle call
    const randomTeam = Math.random() < 0.5 ? 'YES' : 'NO';
    setAssignedTeam(randomTeam);
    setGamePhase('assigned');
  }

  const handleTeamConfirm = () => {
    setSelectedTeam(assignedTeam);
    setGamePhase('message');
  }

  // Mock data for the teams
  const mockTeams = [
    {
      name: 'YES' as const,
      ethAmount: 0.5,
      participants: 42,
      messages: [
        "Aye, matey! Let the AI speak like a true buccaneer!",
        "It's the perfect way to celebrate, ye landlubbers!",
        "Shiver me timbers! This be a grand idea!",
        ...(selectedTeam === 'YES' ? [userMessage] : [])
      ]
    },
    {
      name: 'NO' as const,
      ethAmount: 0.6,
      participants: 38,
      messages: [
        "Let's keep AI communication clear and professional.",
        "Pirate speak might be fun, but it could lead to misunderstandings.",
        "Not everyone celebrates Talk Like a Pirate Day, matey!",
        ...(selectedTeam === 'NO' ? [userMessage] : [])
      ]
    }
  ];

  // Simulate winner (for demo purposes)
  const winningTeam = mockTeams[0];
  const losingTeam = mockTeams[1];

  if (gamePhase === 'winner') {
    return (
      <WinnerPage
        winningTeam={winningTeam}
        losingTeam={losingTeam}
        roundNumber={3}
        totalPrizePool={1.1}
        winnerPrizePool={0.9}
        timeElapsed="5:30"
        userTeam={selectedTeam || 'YES'}
        userWinnings={0.1}
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      <div className="relative">
        <div className="glass-card rounded-3xl p-6 sm:p-8">
          {gamePhase === 'final' ? (
            <FinalPage
              teams={mockTeams}
              currentRound={3}
              timeRemaining="2:30"
              onRoundComplete={() => setGamePhase('winner')}
              question={question}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <QuestionDisplay question={question} personality={oraculoPersonality} />
              </div>
              <div>
                {selectedTeam ? (
                  <Tabs value={gamePhase} onValueChange={(value) => setGamePhase(value as any)}>
                    <TabsContent value="message">
                      <MessageSubmission
                        onSubmit={(message) => {
                          setUserMessage(message);
                          setGamePhase('submission');
                        }}
                        team={selectedTeam}
                      />
                    </TabsContent>
                    <TabsContent value="submission">
                      <BetPlacement onBetPlaced={(amount) => {
                        setUserBet(amount);
                        setGamePhase('final');
                      }} />
                    </TabsContent>
                  </Tabs>
                ) : gamePhase === 'assigned' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center p-6"
                  >
                    <h3 className="text-xl font-bold text-slate-700 mb-4">
                      The Oracle has assigned you to Team {assignedTeam}!
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleTeamConfirm}
                      className="px-8 py-2 rounded-full text-lg font-bold
                        bg-white border-2 border-white
                        text-slate-700 shadow-lg
                        hover:shadow-xl hover:bg-slate-50
                        transition-all"
                    >
                      Continue
                    </motion.button>
                  </motion.div>
                ) : (
                  <TeamSelection onParticipate={handleParticipate} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

