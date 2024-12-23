'use client'

import { motion } from 'framer-motion'

export default function TeamSelection({ onSelect }: { onSelect: (team: 'YES' | 'NO') => void }) {
  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4"
      >
        <h3 className="text-xl font-bold text-slate-700 mb-4">Ready to Join?</h3>
        <div className="flex flex-col items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect('YES')}
            className="px-8 py-2 rounded-full text-lg font-bold
              bg-white border-2 border-white
              text-slate-700 shadow-lg
              hover:shadow-xl hover:bg-slate-50
              transition-all mb-4"
          >
            Participate
          </motion.button>
          <div className="text-sm text-slate-600">
            <p>Current Round: 3</p>
            <p>Time Remaining: 05:30</p>
            <p>Total Bets: 0.0001 ETH</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

