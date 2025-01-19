'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAccount, useReadContract } from 'wagmi'
import { modal } from '@/context'
import QuestionDisplay from './QuestionDisplay'
import TeamSelection from './TeamSelection'
import BetPlacement from './BetPlacement'
import MessageSubmission from './MessageSubmission'
import FinalPage from './FinalPage'
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { RoundManagerABI } from '@/config/abis/RoundManager'
import { roundManagerAddress } from '@/config/contracts'
import { Team } from '@/lib/types/contracts'
import { useRouter } from 'next/navigation'
import RoundHistory from './RoundHistory'

export default function GameInterface() {
  const router = useRouter()
  const [gamePhase, setGamePhase] = useState('selection')
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [assignedTeam, setAssignedTeam] = useState<Team | null>(null)
  const { isConnected } = useAccount()
  const [showHistory, setShowHistory] = useState(false)

  // Restore scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Get active round data
  const { data: activeRound } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'getActiveRound',
  })

  // Get team participants data
  const { data: teamParticipants } = useReadContract({
    address: roundManagerAddress,
    abi: RoundManagerABI,
    functionName: 'getAllTeamParticipants',
    args: activeRound ? [activeRound[0]] : undefined, // Use active round ID
  })

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

    let assignedTeamValue: Team

    // Si no hay ronda activa o la actual terminó
    if (!activeRound || Number(activeRound[0]) === 0) {
      // Asignar aleatoriamente ya que será el primer participante de una nueva ronda
      assignedTeamValue = Math.random() < 0.5 ? Team.Yes : Team.No
      console.log('No active round, random team assignment:', assignedTeamValue)
    } else {
      // Hay una ronda activa, usar la lógica de balance de equipos
      if (!teamParticipants) {
        console.error('Could not get team participants data')
        return
      }

      // Destructure participant counts
      const [noneCount, yesCount, noCount] = teamParticipants
      
      if (yesCount < noCount) {
        // Si hay menos en YES, asignar a YES
        assignedTeamValue = Team.Yes
      } else if (noCount < yesCount) {
        // Si hay menos en NO, asignar a NO
        assignedTeamValue = Team.No
      } else {
        // Si están iguales, asignar aleatoriamente
        assignedTeamValue = Math.random() < 0.5 ? Team.Yes : Team.No
      }

      console.log('Team assignment:', {
        noneCount: Number(noneCount),
        yesCount: Number(yesCount),
        noCount: Number(noCount),
        assigned: assignedTeamValue
      })
    }

    setAssignedTeam(assignedTeamValue);
    setGamePhase('assigned');
  }

  const handleTeamConfirm = () => {
    setSelectedTeam(assignedTeam);
    setGamePhase('message');
  }

  if (gamePhase === 'winner') {
    router.push(`/rounds/${Number(activeRound?.[0]) || 1}`)
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      {/* Round History Quick Access */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="px-4 py-2 bg-white/80 hover:bg-white text-slate-700 rounded-lg shadow transition-colors"
        >
          {showHistory ? 'Hide History' : 'View Round History'}
        </button>
      </div>

      {/* Round History Panel */}
      {showHistory && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <RoundHistory />
        </motion.div>
      )}

      <div className="relative">
        <div className="glass-card rounded-3xl p-6 sm:p-8">
          {gamePhase === 'final' ? (
            <FinalPage
              currentRound={Number(activeRound?.[0]) || 1}
              timeRemaining=""
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
                        onSubmit={() => setGamePhase('submission')}
                        team={selectedTeam === Team.Yes ? 'YES' : 'NO'}
                      />
                    </TabsContent>
                    <TabsContent value="submission">
                      <BetPlacement 
                        onBetPlaced={() => setGamePhase('final')}
                        team={selectedTeam === Team.Yes ? 'YES' : 'NO'}
                      />
                    </TabsContent>
                  </Tabs>
                ) : gamePhase === 'assigned' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center p-6"
                  >
                    <h3 className="text-xl font-bold text-slate-700 mb-4">
                      The Oracle has assigned you to Team {assignedTeam === Team.Yes ? 'YES' : 'NO'}!
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

