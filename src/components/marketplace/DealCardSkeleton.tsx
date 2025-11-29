export default function DealCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="relative h-48 bg-gray-200" />
      
      <div className="p-5">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
        
        <div className="h-3 bg-gray-200 rounded w-32 mb-4" />
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="h-8 bg-gray-200 rounded w-24" />
          <div className="h-10 bg-gray-200 rounded w-28" />
        </div>
      </div>
    </div>
  )
}
