const SkeletonDSA = () => (
  <div className="space-y-6">

    {/* Header */}
    <div className="animate-pulse space-y-2">
      <div className="h-6 bg-gray-200 w-48 rounded" />
      <div className="h-3 bg-gray-200 w-64 rounded" />
    </div>

    {/* Top Section */}
    <div className="grid grid-cols-2 gap-4">

      {/* Form */}
      <div className="bg-white p-4 rounded-xl animate-pulse space-y-3">
        <div className="h-4 bg-gray-200 w-32 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="flex gap-2">
          <div className="h-10 bg-gray-200 w-1/2 rounded" />
          <div className="h-10 bg-gray-200 w-1/2 rounded" />
        </div>
        <div className="h-10 bg-gray-200 rounded" />
      </div>

      {/* Progress */}
      <div className="bg-white p-4 rounded-xl animate-pulse space-y-3">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 bg-gray-200 w-24 rounded" />
            <div className="h-2 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

    </div>

    {/* Recent Problems */}
    <div className="bg-white p-4 rounded-xl animate-pulse space-y-4">
      {Array(3).fill(0).map((_, i) => (
        <div key={i} className="flex justify-between">
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 w-40 rounded" />
            <div className="h-2 bg-gray-200 w-24 rounded" />
          </div>
          <div className="h-5 w-12 bg-gray-200 rounded-full" />
        </div>
      ))}
    </div>

  </div>
)

export default SkeletonDSA