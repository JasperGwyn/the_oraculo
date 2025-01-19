import Background from '@/components/Background'
import ConnectButton from '@/components/AuthButton'

export default function RoundLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#a8d5d0] to-[#d5f2ef] overflow-hidden relative">
      <div className="absolute top-4 right-4 z-20">
        <ConnectButton />
      </div>
      <Background />
      <div className="relative z-10">
        {children}
      </div>
    </main>
  )
} 