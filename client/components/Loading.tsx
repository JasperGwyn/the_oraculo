export default function Loading() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75" />
        <div className="absolute inset-0 bg-white rounded-full animate-pulse" />
      </div>
    </div>
  )
}

