import { motion } from "framer-motion"
import { X } from "lucide-react"
import FilterSidebar from "./FilterSidebar"

interface MobileFilterModalProps {
  isOpen: boolean
  categories: string[]
  selectedCategories: string[]
  selectedTags: string[]
  priceRange: [number, number]
  onToggleCategory: (cat: string) => void
  onToggleTag: (tag: string) => void
  onPriceChange: (value: number) => void
  onClearFilters: () => void
  onClose: () => void
  dietFilters?: string[]
}

export default function MobileFilterModal({
  isOpen,
  categories,
  selectedCategories,
  selectedTags,
  priceRange,
  onToggleCategory,
  onToggleTag,
  onPriceChange,
  onClearFilters,
  onClose,
  dietFilters = []
}: MobileFilterModalProps) {
  if (!isOpen) return null

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="lg:hidden fixed inset-0 bg-black/50 z-50"
      />
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-gray-50 z-50 overflow-y-auto p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <FilterSidebar
          categories={categories}
          selectedCategories={selectedCategories}
          selectedTags={selectedTags}
          priceRange={priceRange}
          onToggleCategory={onToggleCategory}
          onToggleTag={onToggleTag}
          onPriceChange={onPriceChange}
          onClearFilters={onClearFilters}
          dietFilters={dietFilters}
        />
      </motion.div>
    </>
  )
}
