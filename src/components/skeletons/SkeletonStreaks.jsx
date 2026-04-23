const SkeletonStreaks = () => (
  <div className="space-y-6">

    {/* Header */}
    <div className="animate-pulse h-6 bg-gray-200 w-40 rounded" />

    {/* Calendar Grid */}
    <div className="bg-white p-4 rounded-xl animate-pulse grid grid-cols-10 gap-2">
      {Array(50).fill(0).map((_, i) => (
        <div key={i} className="h-4 w-4 bg-gray-200 rounded" />
      ))}
    </div>

  </div>
)
export default SkeletonStreaks