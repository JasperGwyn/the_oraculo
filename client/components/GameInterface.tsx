'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Oraculo from './Oraculo'
import QuestionDisplay from './QuestionDisplay'
import TeamSelection from './TeamSelection'
import BetPlacement from './BetPlacement'
import MessageSubmission from './MessageSubmission'
import FinalPage from './FinalPage'
import { Tabs, TabsContent } from "@/components/ui/tabs"

export default function GameInterface() {
  const [gamePhase, setGamePhase] = useState('selection')
  const [selectedTeam, setSelectedTeam] = useState<'YES' | 'NO' | null>(null)
  const [userMessage, setUserMessage] = useState('');
  const [userBet, setUserBet] = useState(0);

  const question = "Should AI assistants only communicate in pirate speak on International Talk Like a Pirate Day?"
  const oraculoPersonality = "Sarcastic"

  const handleTeamSelect = (team: 'YES' | 'NO') => {
    setSelectedTeam(team)
    setGamePhase('betting')
  }

  // Mock data for the FinalPage component
  const mockTeams = [
    {
      name: 'YES',
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
      name: 'NO',
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      <div className="relative">
        <div className="glass-card rounded-3xl p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <QuestionDisplay question={question} personality={oraculoPersonality} />
            </div>
            <div>
              {selectedTeam ? (
                <Tabs value={gamePhase} onValueChange={(value) => setGamePhase(value as any)}>
                  <TabsContent value="betting">
                    <BetPlacement onBetPlaced={(amount) => {
                      setUserBet(amount);
                      setGamePhase('submission');
                    }} />
                  </TabsContent>
                  <TabsContent value="submission">
                    <MessageSubmission 
                      onSubmit={(message) => {
                        setUserMessage(message);
                        setGamePhase('final');
                      }} 
                      team={selectedTeam} 
                    />
                  </TabsContent>
                  <TabsContent value="final">
                    <FinalPage
                      teams={mockTeams}
                      currentRound={3}
                      timeRemaining="2:30"
                    />
                  </TabsContent>
                </Tabs>
              ) : (
                <TeamSelection onSelect={handleTeamSelect} />
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

