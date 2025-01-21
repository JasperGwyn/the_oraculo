'use client'

import { useSocket, RoundUpdate } from '@/lib/hooks/useSocket'
import { ReactNode, createContext, useContext, useState, useEffect } from 'react'
import { Socket } from 'socket.io-client'

interface SocketContextValue {
  socket: Socket | null
  currentRound: RoundUpdate | null
}

const SocketContext = createContext<SocketContextValue | null>(null)

export const useSocketContext = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider')
  }
  return context
}

export function SocketProvider({ children }: { children: ReactNode }) {
  const socket = useSocket()
  const [currentRound, setCurrentRound] = useState<RoundUpdate | null>(null)

  useEffect(() => {
    if (!socket) return

    // Cuando nos conectamos, solicitamos el estado actual
    socket.on('connect', () => {
      socket.emit('requestCurrentRound')
    })

    // Escuchar actualizaciones de ronda
    socket.on('roundUpdate', (data: RoundUpdate) => {
      console.log('Round update received:', data)
      setCurrentRound(data)
    })

    // Escuchar nueva ronda
    socket.on('newRound', (data: { roundId: string }) => {
      console.log('New round received:', data)
      // Solicitar el estado actual de la nueva ronda
      socket.emit('requestCurrentRound')
    })

    return () => {
      socket.off('connect')
      socket.off('roundUpdate')
      socket.off('newRound')
    }
  }, [socket])

  return (
    <SocketContext.Provider value={{ socket, currentRound }}>
      {children}
    </SocketContext.Provider>
  )
} 