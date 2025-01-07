'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function MessageSubmission({ onSubmit, team }: { onSubmit: (message: string) => void, team: 'YES' | 'NO' }) {
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    console.log(`Submitting message for Team ${team}: ${message}`)
    onSubmit(message)
  }

  return (
    <div className="text-center">
      <h3 className="text-xl font-bold mb-4 text-slate-700">Submit Your Message:</h3>
      <div className="max-w-sm mx-auto">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your witty, sarcastic message here..."
          className="mb-4 h-24 text-base rounded-xl border-blue-300 bg-white/90 text-slate-800 placeholder-slate-500"
        />
        <Button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-orange-400 to-blue-500 hover:from-orange-500 hover:to-blue-600 text-white py-2 px-4 text-base rounded-xl transform transition-transform hover:scale-105"
        >
          Submit Message
        </Button>
      </div>
    </div>
  )
}

