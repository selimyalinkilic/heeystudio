export default function ModalLoading() {
  return (
    <div className="flex items-center justify-center min-h-[300px] w-full">
      <div className="flex flex-col items-center space-y-4">
        {/* Modern spinner */}
        <div className="relative">
          <div className="w-12 h-12 border-2 border-gray-300 rounded-full"></div>
          <div className="w-12 h-12 border-2 border-gray-600 border-t-transparent border-r-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>

        {/* Loading text */}
        <div className="text-gray-600 text-sm font-light tracking-wider">
          Görsel yükleniyor...
        </div>
      </div>
    </div>
  );
}
