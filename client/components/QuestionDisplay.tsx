export default function QuestionDisplay({ question, personality }: { question: string, personality: string }) {
  return (
    <div className="mb-4">
      <div className="glass-card rounded-xl p-4">
        <h3 className="text-lg font-bold mb-2 text-slate-700">Today's Question:</h3>
        <p className="text-xl font-bold mb-2 text-slate-800">"{question}"</p>
        <p className="italic text-sm text-slate-600">
          The Oráculo appreciates witty, ironic answers.
        </p>
      </div>
    </div>
  )
}

