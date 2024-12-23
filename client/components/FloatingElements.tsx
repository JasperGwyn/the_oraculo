'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

const bowlImages = [
  '/bowl-red.svg',
  '/bowl-blue.svg',
  '/bowl-orange.svg',
]

interface FloatingBowl {
  id: number
  x: number
  y: number
  rotation: number
  scale: number
  image: string
}

export default function FloatingElements() {
  const [bowls, setBowls] = useState<FloatingBowl[]>([])

  useEffect(() => {
    const newBowls = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.5,
      image: bowlImages[i % bowlImages.length]
    }))
    setBowls(newBowls)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none">
      {bowls.map((bowl) => (
        <div
          key={bowl.id}
          className="absolute w-32 h-32 animate-float"
          style={{
            left: `${bowl.x}%`,
            top: `${bowl.y}%`,
            transform: `rotate(${bowl.rotation}deg) scale(${bowl.scale})`,
            animation: `float ${8 + bowl.id}s infinite ease-in-out`,
          }}
        >
          <Image
            src={bowl.image}
            alt="Floating bowl"
            width={128}
            height={128}
            className="w-full h-full object-contain"
          />
        </div>
      ))}
    </div>
  )
}

