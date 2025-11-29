import { useMemo, useState } from "react"
import { AnimatePresence } from "framer-motion"
import { Search } from "lucide-react"
import type { Deal } from "../types/marketplace"
import { SAMPLE_DEALS } from "../data/sampleDeals"
import MarketplaceHeader from "../components/marketplace/MarketplaceHeader"
import FilterSidebar from "../components/marketplace/FilterSidebar"
import MobileFilterModal from "../components/marketplace/MobileFilterModal"
import DealCard from "../components/marketplace/DealCard"

const CATEGORIES = ["All", "Main Course", "Healthy", "Bakery", "Seafood", "Dessert"]

export default function Marketplace() {
  const [query, setQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedDistances, setSelectedDistances] = useState<string[]>(["10"])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20])
  const [sort, setSort] = useState("popular")
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const toggleCategory = (cat: string) => {
    if (cat === "All") {
      setSelectedCategories([])
    } else {
      setSelectedCategories(prev => 
        prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
      )
    }
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const toggleDistance = (dist: string) => {
    setSelectedDistances(prev => 
      prev.includes(dist) ? prev.filter(d => d !== dist) : [...prev, dist]
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedTags([])
    setSelectedDistances(["10"])
    setPriceRange([0, 20])
  }

  const deals = useMemo(() => {
    let list = SAMPLE_DEALS.filter((d: Deal) => {
      const matchesQuery = d.title.toLowerCase().includes(query.toLowerCase()) || 
                          d.vendor.toLowerCase().includes(query.toLowerCase())
      
      // Category filter
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(d.category || "")
      
      // Diet filter
      const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => d.tags?.includes(tag))
      
      // Price filter
      const price = parseFloat(d.price.replace("$", ""))
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1]
      
      // Distance filter
      const dist = parseFloat(d.distance?.replace(" mi", "") || "0")
      const maxDistance = selectedDistances.length > 0 
        ? Math.max(...selectedDistances.map(d => parseFloat(d)))
        : 10
      const matchesDistance = dist <= maxDistance

      return matchesQuery && matchesCategory && matchesTags && matchesPrice && matchesDistance
    })

    if (sort === "price-low") {
      list = list.slice().sort((a, b) => parseFloat(a.price.replace("$", "")) - parseFloat(b.price.replace("$", "")))
    } else if (sort === "price-high") {
      list = list.slice().sort((a, b) => parseFloat(b.price.replace("$", "")) - parseFloat(a.price.replace("$", "")))
    } else if (sort === "distance") {
      list = list.slice().sort((a, b) => parseFloat(a.distance?.replace(" mi", "") || "0") - parseFloat(b.distance?.replace(" mi", "") || "0"))
    } else if (sort === "rating") {
      list = list.slice().sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }

    return list
  }, [query, selectedCategories, selectedTags, sort, priceRange, selectedDistances])

  return (
    <div className="min-h-screen bg-gray-50">
      <MarketplaceHeader
        dealsCount={deals.length}
        query={query}
        sort={sort}
        onQueryChange={setQuery}
        onSortChange={setSort}
        onToggleMobileFilters={() => setShowMobileFilters(!showMobileFilters)}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-32">
              <FilterSidebar
                categories={CATEGORIES}
                selectedCategories={selectedCategories}
                selectedTags={selectedTags}
                selectedDistances={selectedDistances}
                priceRange={priceRange}
                onToggleCategory={toggleCategory}
                onToggleTag={toggleTag}
                onToggleDistance={toggleDistance}
                onPriceChange={(value) => setPriceRange([0, value])}
                onClearFilters={clearFilters}
              />
            </div>
          </aside>

          <AnimatePresence>
            {showMobileFilters && (
              <MobileFilterModal
                isOpen={showMobileFilters}
                categories={CATEGORIES}
                selectedCategories={selectedCategories}
                selectedTags={selectedTags}
                selectedDistances={selectedDistances}
                priceRange={priceRange}
                onToggleCategory={toggleCategory}
                onToggleTag={toggleTag}
                onToggleDistance={toggleDistance}
                onPriceChange={(value) => setPriceRange([0, value])}
                onClearFilters={clearFilters}
                onClose={() => setShowMobileFilters(false)}
              />
            )}
          </AnimatePresence>

          <main className="flex-1 min-w-0">
            {deals.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No deals found</h3>
                <p className="text-gray-600">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {deals.map((deal, index) => (
                  <DealCard key={deal.id} deal={deal} index={index} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
