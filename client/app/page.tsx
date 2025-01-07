import { Suspense } from 'react'
import GameInterface from '@/components/GameInterface'
import Loading from '@/components/Loading'
import Background from '@/components/Background'
import Image from 'next/image'
import ConnectButton from '@/components/AuthButton'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#a8d5d0] to-[#d5f2ef] overflow-hidden relative">
      <div className="absolute top-4 right-4 z-20">
        <ConnectButton />
      </div>
      <Background />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col items-center justify-center mb-16 relative">
          <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full" />
          <div className="relative flex items-center mb-6">
            <div>
              <Image
                src="/theoraculo.png"
                alt="The Oráculo"
                width={200}
                height={200}
                className="rounded-full mr-8 drop-shadow-[0_0_15px_rgba(241,91,181,0.3)]"
              />
            </div>
            <h1 className="relative">
              <span className="block text-7xl font-bold mb-2 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)]">
                THE ORÁCULO&apos;S
              </span>
              <span className="block text-6xl font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)]">
                WHIMSICAL SHOWDOWN
              </span>
            </h1>
          </div>
          <p className="text-center text-white text-lg max-w-2xl mx-auto leading-relaxed italic drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]">
            A zany game of wits and wagers—place your tokens, craft one clever line, and see if The Oráculo favors your team. Win the round, and you'll split the prize pool with your fellow victors!
          </p>
        </div>

        <Suspense fallback={<Loading />}>
          <GameInterface />
        </Suspense>

        <div className="mt-16 text-slate-700 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">How THE ORÁCULO&apos;S WHIMSICAL SHOWDOWN Works</h2>

          <div className="space-y-4 text-sm">
            <section className="bg-white/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">The Daily Dilemma</h3>
              <p>You can see The Oráculo&apos;s delightfully absurd question each round even if you&apos;re not logged in—something like:
              &quot;Should AI assistants speak only in pirate lingo?&quot;</p>
            </section>

            <section className="bg-white/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Log In</h3>
              <p>Ready to jump in? Click Log In to connect your wallet and unlock the fun.</p>
            </section>

            <section className="bg-white/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Participate</h3>
              <p>When you&apos;re feeling brave (or mischievous), hit Participate. The Oráculo&apos;s AI automatically drops you into Team Yes or Team No.</p>
            </section>

            <section className="bg-white/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Place Your Bet</h3>
              <p>Toss a few shiny tokens into the communal prize pool—because who doesn&apos;t love a bit of friendly gambling?</p>
            </section>

            <section className="bg-white/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Unleash Your Wit</h3>
              <p>Fire off a single, clever message to prove why your team is right, matching The Oráculo&apos;s current mood (sarcasm, sass, or anything in between).</p>
              <p className="mt-2"><strong>Example (if sarcasm is the mood):</strong></p>
              <ul className="list-disc list-inside mt-2">
                <li><strong>Team YES:</strong> &quot;Arr, because nothing screams &apos;professional&apos; like a jolly round of swashbuckling code reviews!&quot;</li>
                <li><strong>Team NO:</strong> &quot;Sure, if we want our error messages to sound like a 17th-century tavern brawl.&quot;</li>
              </ul>
            </section>

            <section className="bg-white/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">The Oráculo&apos;s Judgment</h3>
              <p>When the clock runs out, our flamboyant AI overlord reviews everyone&apos;s submissions and declares which team reigns supreme.</p>
            </section>

            <section className="bg-white/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Collect Your Spoils</h3>
              <p>If your team wins, you and your fellow victors split the prize pool. Huzzah!</p>
            </section>

            <p className="text-center font-semibold mt-6">Get ready for fresh, wacky questions and a different Oráculo personality each round. Let the showdown begin!</p>
          </div>
        </div>
      </div>
    </main>
  )
}

