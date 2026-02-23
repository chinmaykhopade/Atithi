export function HotelCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100">
      {/* Image skeleton with shimmer */}
      <div className="h-56 shimmer" />
      <div className="p-5 space-y-3">
        <div className="h-5 shimmer rounded-lg w-3/4" />
        <div className="h-4 shimmer rounded-lg w-1/2" />
        <div className="flex gap-2 mt-2">
          <div className="h-7 shimmer rounded-lg w-20" />
          <div className="h-7 shimmer rounded-lg w-20" />
          <div className="h-7 shimmer rounded-lg w-16" />
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-2">
          <div>
            <div className="h-7 shimmer rounded-lg w-24 mb-1" />
            <div className="h-3 shimmer rounded w-16" />
          </div>
          <div className="h-9 shimmer rounded-xl w-24" />
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-8 shimmer rounded-lg w-1/3" />
        <div className="h-4 shimmer rounded-lg w-2/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mt-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <HotelCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}