import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

export interface RoundUpdate {
  roundId: string
  status: number
  endTime: number
  yesTeamStakes: string
  noTeamStakes: string
  yesPlayers: number
  noPlayers: number
}

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Crear la conexión Socket.io
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true
    })

    // Eventos de conexión
    socketRef.current.on('connect', () => {
      console.log('Connected to backend')
    })

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from backend')
    })

    // Eventos de ronda
    socketRef.current.on('newRound', (data: { roundId: string }) => {
      console.log('New round created:', data.roundId)
    })

    socketRef.current.on('roundUpdate', (data: RoundUpdate) => {
      console.log('Round updated:', data)
    })

    // Cleanup al desmontar
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  return socketRef.current
} 