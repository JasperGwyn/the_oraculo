'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Oraculo({ personality }: { personality: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", duration: 0.8 }}
      className="flex-shrink-0"
    >
      <div className="relative w-20 h-20 sm:w-24 sm:h-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00f5d4] via-[#f15bb5] to-[#9b5de5] rounded-full animate-pulse opacity-50 blur-xl" />
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative z-10"
        >
          <Image
            src="/theoraculo.png"
            alt="The Oráculo"
            width={96}
            height={96}
            className="rounded-full drop-shadow-[0_0_15px_rgba(241,91,181,0.5)]"
          />
        </motion.div>
      </div>
      <p className="text-[#00f5d4] font-medium text-xs sm:text-sm mt-1 text-center">
        Mood: <span className="font-bold">{personality}</span>
      </p>
    </motion.div>
  )
}

