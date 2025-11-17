import { Search, SlidersHorizontal } from "lucide-react"

interface MarketplaceHeaderProps {
  dealsCount: number
  query: string
  sort: string
  onQueryChange: (query: string) => void
  onSortChange: (sort: string) => void
  onToggleMobileFilters: () => void
}

export default function MarketplaceHeader({
  dealsCount,
  query,
  sort,
  onQueryChange,
  onSortChange,
  onToggleMobileFilters
}: MarketplaceHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-red-600">
              Marketplace
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {dealsCount} deals available near you
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Search dishes or vendors..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <select 
              value={sort} 
              onChange={(e) => onSortChange(e.target.value)} 
              className="px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="distance">Nearest First</option>
              <option value="rating">Highest Rated</option>
            </select>

            <button
              onClick={onToggleMobileFilters}
              className="lg:hidden px-4 py-2.5 bg-red-600 text-white rounded-lg flex items-center justify-center gap-2 shadow-sm hover:bg-red-700"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
