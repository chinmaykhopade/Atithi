export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-flex gap-1 mb-4">
          <div className="w-3 h-3 bg-saffron-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-3 h-3 bg-white border-2 border-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-3 h-3 bg-india-green rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
        <p className="text-gray-500 font-medium">Loading...</p>
      </div>
    </div>
  );
}