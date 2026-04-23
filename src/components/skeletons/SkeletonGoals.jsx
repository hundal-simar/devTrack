const SkeletonGoals = () => (
  <div className="space-y-6">

    {/* Header */}
    <div className="animate-pulse space-y-2">
      <div className="h-6 bg-gray-200 w-40 rounded" />
      <div className="h-3 bg-gray-200 w-64 rounded" />
    </div>

    {/* Progress */}
    <div className="bg-white p-4 rounded-xl animate-pulse space-y-3">
      <div className="h-3 bg-gray-200 w-32 rounded" />
      <div className="h-2 bg-gray-200 rounded" />
    </div>

    {/* Input */}
    <div className="flex gap-2 animate-pulse">
      <div className="h-10 bg-gray-200 flex-1 rounded" />
      <div className="h-10 w-24 bg-gray-200 rounded" />
    </div>

    {/* Goals List */}
    <div className="bg-white p-4 rounded-xl animate-pulse space-y-3">
      {Array(3).fill(0).map((_, i) => (
        <div key={i} className="h-3 bg-gray-200 rounded" />
      ))}
    </div>

  </div>
)

export default SkeletonGoals