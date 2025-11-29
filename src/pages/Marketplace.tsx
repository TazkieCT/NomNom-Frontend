import { useMemo, useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { Search } from "lucide-react"
import type { Deal } from "../types/marketplace"
import MarketplaceHeader from "../components/marketplace/MarketplaceHeader"
import FilterSidebar from "../components/marketplace/FilterSidebar"
import MobileFilterModal from "../components/marketplace/MobileFilterModal"
import DealCard from "../components/marketplace/DealCard"
import DealCardSkeleton from "../components/marketplace/DealCardSkeleton"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

interface Food {
  _id: string
  name: string
  description: string
  price: number
  isAvailable: boolean
  images: string[]
  categoryId: { _id: string; name: string }
  storeId: { _id: string; name: string; address: string }
  filters: { _id: string; name: string }[]
}

interface Category {
  _id: string
  name: string
}

interface DietFilter {
  _id: string
  name: string
}

export default function Marketplace() {
  const [query, setQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000])
  const [sort, setSort] = useState("popular")
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [foods, setFoods] = useState<Food[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [dietFilters, setDietFilters] = useState<DietFilter[]>([])
  const [loading, setLoading] = useState(true)
  const [filtering, setFiltering] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const [foodsRes, categoriesRes, filtersRes] = await Promise.all([
          fetch(`${API_URL}/foods`),
          fetch(`${API_URL}/categories`),
          fetch(`${API_URL}/filters`)
        ])

        if (foodsRes.ok && categoriesRes.ok && filtersRes.ok) {
          const foodsData = await foodsRes.json()
          const categoriesData = await categoriesRes.json()
          const filtersData = await filtersRes.json()
          
          setFoods(foodsData.filter((f: Food) => f.isAvailable))
          setCategories(categoriesData)
          setDietFilters(filtersData)
        }
      } catch (error) {
        console.error('Error fetching marketplace data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!loading) {
      setFiltering(true)
      const timer = setTimeout(() => setFiltering(false), 300)
      return () => clearTimeout(timer)
    }
  }, [query, selectedCategories, selectedTags, sort, priceRange, loading])

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

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedTags([])
    setPriceRange([0, 200000])
  }

  const allDeals: Deal[] = useMemo(() => {
    return foods.map(food => ({
      id: food._id,
      title: food.name,
      price: `Rp ${food.price.toLocaleString('id-ID')}`,
      vendor: food.storeId.name,
      eta: "30-45 min",
      image: food.images[0] || undefined,
      tags: food.filters.map(f => f.name),
      category: food.categoryId.name,
      distance: "2.5 mi",
      rating: 4.5
    }))
  }, [foods])

  const deals = useMemo(() => {
    let list = allDeals.filter((d: Deal) => {
      const matchesQuery = d.title.toLowerCase().includes(query.toLowerCase()) || 
                          d.vendor.toLowerCase().includes(query.toLowerCase())
      
      // Category filter
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(d.category || "")
      // Diet filter
      const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => d.tags?.includes(tag))
      // Price filter
      const price = parseFloat(d.price.replace("Rp ", "").replace(/\./g, ""))
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1]

      return matchesQuery && matchesCategory && matchesTags && matchesPrice
    })

    if (sort === "price-low") {
      list = list.slice().sort((a, b) => {
        const priceA = parseFloat(a.price.replace("Rp ", "").replace(/\./g, ""))
        const priceB = parseFloat(b.price.replace("Rp ", "").replace(/\./g, ""))
        return priceA - priceB
      })
    } else if (sort === "price-high") {
      list = list.slice().sort((a, b) => {
        const priceA = parseFloat(a.price.replace("Rp ", "").replace(/\./g, ""))
        const priceB = parseFloat(b.price.replace("Rp ", "").replace(/\./g, ""))
        return priceB - priceA
      })
    } else if (sort === "distance") {
      list = list.slice().sort((a, b) => parseFloat(a.distance?.replace(" mi", "") || "0") - parseFloat(b.distance?.replace(" mi", "") || "0"))
    } else if (sort === "rating") {
      list = list.slice().sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }

    return list
  }, [allDeals, query, selectedCategories, selectedTags, sort, priceRange])

  const categoryNames = useMemo(() => {
    return ["All", ...categories.map(c => c.name)]
  }, [categories])

  const dietFilterNames = useMemo(() => {
    return dietFilters.map(f => f.name)
  }, [dietFilters])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading marketplace...</p>
        </div>
      </div>
    )
  }

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
                categories={categoryNames}
                selectedCategories={selectedCategories}
                selectedTags={selectedTags}
                priceRange={priceRange}
                onToggleCategory={toggleCategory}
                onToggleTag={toggleTag}
                onPriceChange={(value) => setPriceRange([0, value])}
                onClearFilters={clearFilters}
                dietFilters={dietFilterNames}
              />
            </div>
          </aside>

          <AnimatePresence>
            {showMobileFilters && (
              <MobileFilterModal
                isOpen={showMobileFilters}
                categories={categoryNames}
                selectedCategories={selectedCategories}
                selectedTags={selectedTags}
                priceRange={priceRange}
                onToggleCategory={toggleCategory}
                onToggleTag={toggleTag}
                onPriceChange={(value) => setPriceRange([0, value])}
                onClearFilters={clearFilters}
                onClose={() => setShowMobileFilters(false)}
                dietFilters={dietFilterNames}
              />
            )}
          </AnimatePresence>

          <main className="flex-1 min-w-0">
            {deals.length === 0 && !filtering ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No deals found</h3>
                <p className="text-gray-600">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtering ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <DealCardSkeleton key={index} />
                  ))
                ) : (
                  deals.map((deal) => (
                    <DealCard key={deal.id} deal={deal} />
                  ))
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
