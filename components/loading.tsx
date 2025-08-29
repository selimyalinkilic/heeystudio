export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-8">
        {/* Modern spinner */}
        <div className="relative">
          <div className="w-20 h-20 border-2 border-gray-800 rounded-full"></div>
          <div className="w-20 h-20 border-2 border-white border-t-transparent border-r-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    </div>
  );
}
