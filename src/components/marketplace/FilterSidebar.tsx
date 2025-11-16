import { SlidersHorizontal, MapPin, UtensilsCrossed, Clock, Leaf, Flame, Star } from "lucide-react"

interface FilterSidebarProps {
  categories: string[]
  selectedCategories: string[]
  selectedTags: string[]
  selectedDistances: string[]
  priceRange: [number, number]
  onToggleCategory: (cat: string) => void
  onToggleTag: (tag: string) => void
  onToggleDistance: (dist: string) => void
  onPriceChange: (value: number) => void
  onClearFilters: () => void
}

const filterTags = [
  { label: "Pickup Ready", value: "pickup", icon: Clock },
  { label: "Vegan", value: "vegan", icon: Leaf },
  { label: "Hot Meals", value: "hot", icon: Flame },
  { label: "Fresh", value: "fresh", icon: Star },
]

const distanceOptions = [
  { label: "Within 0.5 mi", value: "0.5" },
  { label: "Within 1 mi", value: "1" },
  { label: "Within 2 mi", value: "2" },
  { label: "Within 5 mi", value: "5" },
  { label: "Within 10 mi", value: "10" },
]

export default function FilterSidebar({
  categories,
  selectedCategories,
  selectedTags,
  selectedDistances,
  priceRange,
  onToggleCategory,
  onToggleTag,
  onToggleDistance,
  onPriceChange,
  onClearFilters
}: FilterSidebarProps) {
  const hasActiveFilters = selectedCategories.length > 0 || selectedTags.length > 0 || selectedDistances.length > 0

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <UtensilsCrossed className="w-5 h-5 text-red-600" />
          Categories
        </h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onToggleCategory(cat)}
              className={`w-full text-left cursor-pointer px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                (cat === "All" && selectedCategories.length === 0) || selectedCategories.includes(cat)
                  ? "bg-red-600 text-white shadow-md"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-red-600" />
          Quick Filters
        </h3>
        <div className="space-y-3">
          {filterTags.map(({ label, value, icon: Icon }) => (
            <label key={value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedTags.includes(value)}
                onChange={() => onToggleTag(value)}
                className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <Icon className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition" />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-lg mb-4">Price Range</h3>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={priceRange[1]}
              onChange={(e) => onPriceChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600 slider"
              style={{
                background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${(priceRange[1] / 20) * 100}%, #e5e7eb ${(priceRange[1] / 20) * 100}%, #e5e7eb 100%)`
              }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">${priceRange[0]}</span>
            <span className="font-semibold text-red-600">Up to ${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-600" />
          Distance
        </h3>
        <div className="space-y-3">
          {distanceOptions.map(({ label, value }) => (
            <label key={value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedDistances.includes(value)}
                onChange={() => onToggleDistance(value)}
                className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
        >
          Clear All Filters
        </button>
      )}
    </div>
  )
}
