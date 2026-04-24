import SkeletonCard from "./SkeletonCard"



const SkeletonDashboard = () => (
  <div className="space-y-6">

    {/* Greeting */}
    <div className="space-y-2 animate-pulse">
      <div className="h-6 bg-gray-200 w-64 rounded" />
      <div className="h-3 bg-gray-200 w-40 rounded" />
    </div>

    {/* Top Cards */}
    <div className="grid grid-cols-4 gap-4">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>

    {/* Middle Section */}
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-xl animate-pulse h-32" />
      <div className="bg-white p-4 rounded-xl animate-pulse h-32" />
    </div>

    {/* Bottom Section */}
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-xl animate-pulse h-28" />
      <div className="bg-white p-4 rounded-xl animate-pulse h-28" />
    </div>

  </div>
)

export default SkeletonDashboard